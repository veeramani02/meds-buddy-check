// MedicationList.tsx
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/SupabaseClient";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Medication = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  created_at: string;
  user_id: string;
};

const MedicationList = () => {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({
    name: "",
    dosage: "",
    frequency: "",
  });

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user?.id) {
        console.error("Error fetching user:", error);
        return;
      }
      setUserId(data.user.id);
    };
    getUser();
  }, []);

  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["medications", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("medications")
        .select("*")
        .eq("user_id", userId!); // use ! since we check enabled
      if (error) throw error;
      return data as Medication[];
    },
    enabled: !!userId,
  });

  const handleMarkAsTaken = async (medicationId: string) => {
    const today = new Date().toISOString().split("T")[0];
    const { error } = await supabase.from("medication_logs").insert({
      user_id: userId,
      medication_id: medicationId,
      date_taken: today,
      taken: true,
    });
    if (error) {
      toast.error("Error marking as taken");
    } else {
      toast.success("Marked as taken!");
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("medications").delete().eq("id", id);
    if (error) {
      toast.error("Delete failed");
    } else {
      toast.success("Deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["medications", userId] });
    }
  };

  const handleUpdate = async (id: string) => {
    const { error } = await supabase
      .from("medications")
      .update(editValues)
      .eq("id", id);
    if (error) {
      toast.error("Update failed");
    } else {
      toast.success("Updated successfully");
      setEditId(null);
      queryClient.invalidateQueries({ queryKey: ["medications", userId] });
    }
  };

  if (!userId) return <p className="text-sm text-muted-foreground">Loading user info...</p>;

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading medications...</p>;

  if (isError) {
    console.error("Medication fetch error:", error);
    return <p className="text-red-500">Failed to load medications. Try again later.</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your Medications</h2>
      {data.length === 0 ? (
        <p className="text-muted-foreground">No medications found.</p>
      ) : (
        <ul className="space-y-2">
          {data.map((med) => (
            <li
              key={med.id}
              className="border p-4 rounded-lg shadow-sm bg-white"
            >
              {editId === med.id ? (
                <div className="space-y-2">
                  <Input
                    value={editValues.name}
                    onChange={(e) =>
                      setEditValues({ ...editValues, name: e.target.value })
                    }
                    placeholder="Name"
                  />
                  <Input
                    value={editValues.dosage}
                    onChange={(e) =>
                      setEditValues({ ...editValues, dosage: e.target.value })
                    }
                    placeholder="Dosage"
                  />
                  <Input
                    value={editValues.frequency}
                    onChange={(e) =>
                      setEditValues({
                        ...editValues,
                        frequency: e.target.value,
                      })
                    }
                    placeholder="Frequency"
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => handleUpdate(med.id)}>Save</Button>
                    <Button variant="outline" onClick={() => setEditId(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="font-bold">{med.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {med.dosage} – {med.frequency}
                  </div>
                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => {
                        setEditId(med.id);
                        setEditValues({
                          name: med.name,
                          dosage: med.dosage,
                          frequency: med.frequency,
                        });
                      }}
                      className="text-blue-500 underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(med.id)}
                      className="text-red-500 underline"
                    >
                      Delete
                    </button>
                    {/* <button
                      onClick={() => handleMarkAsTaken(med.id)}
                      className="text-green-600 underline"
                    >
                      Mark as Taken
                    </button> */}
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MedicationList;
