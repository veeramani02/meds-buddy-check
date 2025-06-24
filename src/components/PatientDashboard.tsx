import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Check, Calendar as CalendarIcon, User } from "lucide-react";
import MedicationTracker from "./MedicationTracker";
import { format, isToday, isBefore, startOfDay } from "date-fns";
import AddMedicationForm from "./Medication/AddMedicationForm";
import MedicationList from "./Medication/MedicationList";
import { supabase } from "@/SupabaseClient";
import { useMarkMedicationTaken } from "@/hooks/useMarkMedicationTaken";
import { useUser } from "@supabase/auth-helpers-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const PatientDashboard = () => {
  const user = useUser();
  const user_id = user?.id || "demo-user";
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [takenDates, setTakenDates] = useState<Set<string>>(new Set());

  const { mutate: markTaken } = useMarkMedicationTaken();
  const queryClient = useQueryClient();

  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");
  const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
  const isTodaySelected = isToday(selectedDate);
  const isSelectedDateTaken = takenDates.has(selectedDateStr);

  // ✅ Fetch taken dates
  useEffect(() => {
    const fetchTakenDates = async () => {
      const { data, error } = await supabase
        .from("medication_logs")
        .select("date_taken")
        .eq("user_id", user_id)
        .eq("taken", true);

      if (error) {
        console.error("Error fetching taken dates:", error.message);
        return;
      }

      const takenDateStrings = data.map((log) =>
        format(new Date(log.date_taken), "yyyy-MM-dd")
      );

      setTakenDates(new Set(takenDateStrings));
    };

    if (user_id) {
      fetchTakenDates();
    }
  }, [user_id]);

  // ✅ Mark as Taken handler
  const handleMarkTaken = (date: string, imageFile?: File, medicationId?: string) => {
    if (!user_id || !medicationId) return;

    markTaken({
      user_id,
      medication_id: medicationId,
      date_taken: date,
      imageFile,
    });

    setTakenDates((prev) => new Set(prev).add(date));
  };

  // ✅ Calculate streak
  const getStreakCount = () => {
    let streak = 0;
    let currentDate = new Date(today);

    while (takenDates.has(format(currentDate, "yyyy-MM-dd")) && streak < 30) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  };

  // ✅ Fetch Medications for this user
  const fetchMedications = async () => {
    const { data, error } = await supabase
      .from("medications")
      .select("id, name, user_id")
      .eq("user_id", user_id);

    if (error) throw new Error(error.message);

    // Remove duplicates based on `id`
    const unique = Array.from(new Map(data.map(med => [med.id, med])).values());
    return unique;
  };

  const { data: medications = [] } = useQuery({
    queryKey: ["medications", user_id],
    queryFn: fetchMedications,
    enabled: !!user_id,
  });

  return (
    <div className="space-y-6">
      {/* Header Streak Section */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">
              Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 18 ? "Afternoon" : "Evening"}!
            </h2>
            <p className="text-white/90 text-lg">Ready to stay on track with your medication?</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">{getStreakCount()}</div>
            <div className="text-white/80">Day Streak</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">{takenDates.has(todayStr) ? "✓" : "○"}</div>
            <div className="text-white/80">Today's Status</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="text-2xl font-bold">{Math.round((takenDates.size / 30) * 100)}%</div>
            <div className="text-white/80">Monthly Rate</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Section - Medication & Form */}
        <div className="lg:col-span-2">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <CalendarIcon className="w-6 h-6 text-blue-600" />
                {isTodaySelected ? "Today's Medication" : `Medication for ${format(selectedDate, "MMMM d, yyyy")}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Medication Tracker Cards */}
              <div className="mb-8">
                <MedicationTracker
                  
                  date={selectedDateStr}
                  isTaken={isSelectedDateTaken}
                  onMarkTaken={handleMarkTaken}
                  isToday={isTodaySelected}
                  medications={medications}
                />
              </div>
              <div className="mb-6">
              {/* Add Form + List */}
              <AddMedicationForm />
              </div>
              <div className="mt-6">
              <MedicationList />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Section - Calendar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Medication Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="w-full"
                modifiersClassNames={{
                  selected: "bg-blue-600 text-white hover:bg-blue-700",
                }}
                components={{
                  DayContent: ({ date }) => {
                    const dateStr = format(date, "yyyy-MM-dd");
                    const isTaken = takenDates.has(dateStr);
                    const isPast = isBefore(date, startOfDay(today));
                    const isCurrentDay = isToday(date);

                    return (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <span>{date.getDate()}</span>
                        {isTaken && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <Check className="w-2 h-2 text-white" />
                          </div>
                        )}
                        {!isTaken && isPast && !isCurrentDay && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full" />
                        )}
                      </div>
                    );
                  },
                }}
              />

              {/* Calendar Legend */}
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Medication taken</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span>Missed medication</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Today</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
