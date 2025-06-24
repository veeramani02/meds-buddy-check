import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/SupabaseClient";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";
type FormValues = {
  name: string;
  dosage: string;
  frequency: string;
};

const AddMedicationForm = () => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const user_id = userData?.user?.id;

    if (!user_id) {
      toast.error("User not logged in.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("medications").insert([
      {
        ...data,
        user_id,
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error)
      toast.error("Failed to add medication.");
    } else {
      toast.success("Medication added successfully!");
      reset();
       // clear the form
          queryClient.invalidateQueries({ queryKey: ["medications", user_id] })
    }

    setLoading(false);
  };

  return (
    
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <h1 className="text-xl font-semibold mb-2">Add Medication</h1>
      
      <div>
        <Label htmlFor="name">Medication Name</Label>
        <Input id="name" {...register("name", { required: true })} />
      </div>

      <div>
        <Label htmlFor="dosage">Dosage</Label>
        <Input id="dosage" {...register("dosage", { required: true })} />
      </div>

      <div>
        <Label htmlFor="frequency">Frequency</Label>
        <Input id="frequency" {...register("frequency", { required: true })} />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Medication"}
      </Button>
    </form>
  );
};

export default AddMedicationForm;
