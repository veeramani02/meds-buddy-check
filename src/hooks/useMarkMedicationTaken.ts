import { supabase } from "@/SupabaseClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useMarkMedicationTaken = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      user_id,
      medication_id,
      date_taken,
      imageFile,
    }: {
      user_id: string;
      medication_id: string;
      date_taken: string;
      imageFile?: File;
    }) => {
      let photoUrl = null;

      // 1. Upload photo if provided
      if (imageFile) {
        const filePath = `${user_id}/${Date.now()}_${imageFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from("proof_photos")
          .upload(filePath, imageFile);

        if (uploadError) throw new Error(uploadError.message);

        const { data } = supabase.storage.from("proof_photos").getPublicUrl(filePath);
        photoUrl = data?.publicUrl;
      }

      // 2. Insert medication log
      const { error } = await supabase.from("medication_logs").insert({
        user_id,
        medication_id,
        date_taken,
        time_taken: new Date().toISOString(), // ✅ Fix is here!
        taken: true,
        proof_photo: photoUrl,
      });

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logs"] });
    },
  });
};
