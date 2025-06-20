import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Image, Camera, Clock } from "lucide-react";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/SupabaseClient";
import { useUser } from "@supabase/auth-helpers-react";
import { toast } from "sonner";

interface MedicationTrackerProps {
  date: string;
  isTaken: boolean;
  onMarkTaken: (date: string, imageFile?: File, medicationId?: string) => void;
  isToday: boolean;
  medications: {
    id: string;
    name: string;
    dosage?: string;
    frequency?: string;
  }[];
}

const MedicationTracker = ({
  date,
  isTaken,
  onMarkTaken,
  isToday,
  medications,
}: MedicationTrackerProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedMedicationId, setSelectedMedicationId] = useState<string | undefined>();

  const user = useUser();
  const queryClient = useQueryClient();

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const { mutate: markAsTaken, isPending } = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");
      if (!selectedMedicationId) throw new Error("No medication selected");

      const now = new Date();
      const todayDate = now.toISOString().split("T")[0];
      const currentTime = now.toTimeString().split(" ")[0];
let photo_url = null;

if (selectedImage) {
  const ext = selectedImage.name.split(".").pop();
  const filePath = `${user.id}/${selectedMedicationId}_${Date.now()}.${ext}`;

  console.log("📤 Uploading image...");
  console.log("Selected Image:", selectedImage);
  console.log("File Path:", filePath);

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("medication-proofs")
    .upload(filePath, selectedImage, {
      contentType: selectedImage.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("❌ Upload Error:", uploadError);
    throw new Error("Image upload failed");
  }

  const { data: urlData } = supabase.storage
    .from("medication-proofs")
    .getPublicUrl(filePath);

  photo_url = urlData?.publicUrl ?? null;
}


      
      //  Insert log into medication_logs with photo_url
      const { error } = await supabase.from("medication_logs").insert([
        {
          user_id: user.id,
          medication_id: selectedMedicationId,
          date_taken: todayDate,
          time_taken: currentTime,
          taken: true,
          photo_url,
        },
      ]);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medication_logs"] });
      toast.success("Marked as taken!");
      setSelectedImage(null);
      setImagePreview(null);
    },
    onError: (error) => {
      toast.error("Error: " + error.message);
    },
  });

  if (isTaken) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center p-8 bg-green-50 rounded-xl border-2 border-green-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              Medication Completed!
            </h3>
            <p className="text-green-600">
              Great job! You've taken your medication for{" "}
              {format(new Date(date), "MMMM d, yyyy")}.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Medication Dropdown */}
      <div>
        <label htmlFor="medSelect" className="block text-sm font-medium mb-1">
          Select Medication
        </label>
        <select
          id="medSelect"
          className="w-full border rounded px-3 py-2"
          value={selectedMedicationId || ""}
          onChange={(e) => setSelectedMedicationId(e.target.value)}
        >
          <option value="">-- Choose Medication --</option>
          {medications.map((med) => (
            <option key={med.id} value={med.id}>
              {med.name}
            </option>
          ))}
        </select>
      </div>

      {/* Daily Med Card */}
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium">1</span>
            </div>
            <div>
              <h4 className="font-medium">Daily Medication</h4>
              <p className="text-sm text-muted-foreground">
                Complete set of daily tablets
              </p>
            </div>
          </div>
          <Badge variant="outline">
            <Clock className="w-3 h-3 mr-1" />
            8:00 AM
          </Badge>
        </CardContent>
      </Card>

      {/* Optional Proof Upload */}
      <Card className="border-dashed border-2 border-border/50">
        <CardContent className="p-6">
          <div className="text-center">
            <Image className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium mb-2">Add Proof Photo (Optional)</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Take a photo of your medication or pill organizer as confirmation
            </p>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              ref={fileInputRef}
              className="hidden"
            />

            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="mb-4"
            >
              <Camera className="w-4 h-4 mr-2" />
              {selectedImage ? "Change Photo" : "Take Photo"}
            </Button>

            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Medication proof"
                  className="max-w-full h-32 object-cover rounded-lg mx-auto border-2 border-border"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Photo selected: {selectedImage?.name}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mark as Taken Button */}
      <Button
        onClick={() => markAsTaken()}
        className="w-full py-4 text-lg bg-green-600 hover:bg-green-700 text-white"
        disabled={!isToday || isPending || !selectedMedicationId}
      >
        <Check className="w-5 h-5 mr-2" />
        {isToday ? "Mark as Taken" : "Cannot mark future dates"}
      </Button>
    </div>
  );
};

export default MedicationTracker;
