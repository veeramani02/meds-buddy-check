import { supabase } from "../SupabaseClient";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { format, isAfter, subDays, parseISO } from "date-fns";

const MedicationLogManager = () => {
  const session = useSession();
  const userId = session?.user?.id;

  const {
    data: logs,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["logs", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("medication_logs")
        .select(`
          id,
          date_taken,
          time_taken,
          taken,
          photo_url,
          medications (
            name,
            dosage
          )
        `)
        .eq("user_id", userId)
        .order("date_taken", { ascending: false });

      if (error) throw new Error(error.message);

      // Filter last 5 days including today
      const fiveDaysAgo = subDays(new Date(), 4);
      return data.filter((log) =>
        isAfter(new Date(log.date_taken), fiveDaysAgo)
      );
    },
    enabled: !!userId,
  });

  if (isLoading) return <p>Loading logs...</p>;
  if (isError) return <p>Error fetching logs.</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Recent Medication Activity</h2>
      {logs?.length === 0 && (
        <p className="text-gray-500 text-sm">No recent logs available.</p>
      )}
      <div className="space-y-3">
        {logs?.map((log) => {
          const dateObj = new Date(log.date_taken);
          const formattedDate = format(dateObj, "EEEE, MMMM d");

          return (
            <div
              key={log.id}
              className="border p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{formattedDate}</p>
                <p className="text-sm text-gray-600">
                  {log.taken
                    ? `Taken at ${log.time_taken?.slice(0, 5)} AM`
                    : "Medication missed"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {log.photo_url && (
                  <span className="text-xs px-2 py-1 bg-gray-200 rounded-full">
                    📷 Photo
                  </span>
                )}
                <span
                  className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    log.taken
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {log.taken ? "Completed" : "Missed"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MedicationLogManager;
