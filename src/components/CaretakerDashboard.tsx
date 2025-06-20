// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { supabase } from "@/SupabaseClient";
// import { Database } from "@/types/supabase";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Progress } from "@/components/ui/progress";
// import { Calendar } from "@/components/ui/calendar";


// import {
//   Users, Bell, Calendar as CalendarIcon, Mail, AlertTriangle,
//   Check, Clock, Camera
// } from "lucide-react";
// import NotificationSettings from "./NotificationSettings";
// import { format, isToday, isBefore, startOfDay } from "date-fns";

// type MedicationLog = Database["public"]["Tables"]["medication_logs"]["Row"];

// const CaretakerDashboard = () => {
//   const [activeTab, setActiveTab] = useState("overview");
//   const [selectedDate, setSelectedDate] = useState<Date>(new Date());

//   const patientName = "Eleanor Thompson";
//   const adherenceRate = 85;
//   const currentStreak = 5;
//   const missedDoses = 3;

//   const { data: logs = [], isLoading } = useQuery<MedicationLog[]>({
//     queryKey: ["caretakerLogs"],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from("medication_logs")
//         .select("*")
//         .order("date_taken", { ascending: false });

//       if (error) throw error;
//       return data || [];
//     }
//   });

//   const takenDates = new Set(
//     logs.filter(log => log.taken).map(log => log.date_taken ?? "")
//   );

//   const dailyMedication = {
//     name: "Daily Medication Set",
//     time: "8:00 AM",
//     status: takenDates.has(format(new Date(), "yyyy-MM-dd")) ? "completed" : "pending"
//   };

//   const handleSendReminderEmail = () => {
//     alert("Reminder email sent to " + patientName);
//   };

//   const handleConfigureNotifications = () => setActiveTab("notifications");
//   const handleViewCalendar = () => setActiveTab("calendar");

//   return (
//     <div className="space-y-6">
//       {/* Header Section */}
//       <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 text-white">
//         <div className="flex items-center gap-4 mb-6">
//           <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
//             <Users className="w-8 h-8" />
//           </div>
//           <div>
//             <h2 className="text-3xl font-bold">Caretaker Dashboard</h2>
//             <p className="text-white/90 text-lg">Monitoring {patientName}'s medication adherence</p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <Card className="bg-white/10 backdrop-blur-sm p-4 text-white">
//             <div className="text-2xl font-bold">{adherenceRate}%</div>
//             <div className="text-white/80">Adherence Rate</div>
//           </Card>
//           <Card className="bg-white/10 backdrop-blur-sm p-4 text-white">
//             <div className="text-2xl font-bold">{currentStreak}</div>
//             <div className="text-white/80">Current Streak</div>
//           </Card>
//           <Card className="bg-white/10 backdrop-blur-sm p-4 text-white">
//             <div className="text-2xl font-bold">{missedDoses}</div>
//             <div className="text-white/80">Missed This Month</div>
//           </Card>
//           <Card className="bg-white/10 backdrop-blur-sm p-4 text-white">
//             <div className="text-2xl font-bold">{logs.filter(l => l.taken).length}</div>
//             <div className="text-white/80">Taken This Week</div>
//           </Card>
//         </div>
//       </div>

//       <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
//         <TabsList className="grid w-full grid-cols-4">
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="activity">Recent Activity</TabsTrigger>
//           <TabsTrigger value="calendar">Calendar View</TabsTrigger>
//           <TabsTrigger value="notifications">Notifications</TabsTrigger>
//         </TabsList>

//         {/* Overview Tab */}
//         <TabsContent value="overview" className="space-y-6">
//           <div className="grid lg:grid-cols-2 gap-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <CalendarIcon className="w-5 h-5 text-blue-600" />
//                   Today's Status
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
//                   <div>
//                     <h4 className="font-medium">{dailyMedication.name}</h4>
//                     <p className="text-sm text-muted-foreground">{dailyMedication.time}</p>
//                   </div>
//                   <Badge variant={dailyMedication.status === "pending" ? "destructive" : "secondary"}>
//                     {dailyMedication.status === "pending" ? "Pending" : "Completed"}
//                   </Badge>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
//               <CardContent className="space-y-3">
//                 <Button className="w-full justify-start" variant="outline" onClick={handleSendReminderEmail}>
//                   <Mail className="w-4 h-4 mr-2" /> Send Reminder Email
//                 </Button>
//                 <Button className="w-full justify-start" variant="outline" onClick={handleConfigureNotifications}>
//                   <Bell className="w-4 h-4 mr-2" /> Configure Notifications
//                 </Button>
//                 <Button className="w-full justify-start" variant="outline" onClick={handleViewCalendar}>
//                   <CalendarIcon className="w-4 h-4 mr-2" /> View Full Calendar
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>

//           <Card>
//             <CardHeader><CardTitle>Monthly Adherence Progress</CardTitle></CardHeader>
//             <CardContent>
//               <Progress value={adherenceRate} className="h-3 mb-4" />
//               <div className="grid grid-cols-3 gap-4 text-center text-sm">
//                 <div><div className="font-medium text-green-600">22 days</div><div className="text-muted-foreground">Taken</div></div>
//                 <div><div className="font-medium text-red-600">3 days</div><div className="text-muted-foreground">Missed</div></div>
//                 <div><div className="font-medium text-blue-600">5 days</div><div className="text-muted-foreground">Remaining</div></div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Activity Tab */}
//         <TabsContent value="activity" className="space-y-6">
//           <Card>
//             <CardHeader><CardTitle>Recent Medication Activity</CardTitle></CardHeader>
//             <CardContent>
//               {isLoading ? (
//                 <p>Loading...</p>
//               ) : (
//                 <div className="space-y-4">
//                   {logs.map((log, index) => (
//                     <div key={log.id || index} className="flex items-center justify-between p-4 border rounded-lg">
//                       <div className="flex items-center gap-3">
//                         <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
//                           log.taken ? 'bg-green-100' : 'bg-red-100'
//                         }`}>
//                           {log.taken ? (
//                             <Check className="w-5 h-5 text-green-600" />
//                           ) : (
//                             <AlertTriangle className="w-5 h-5 text-red-600" />
//                           )}
//                         </div>
//                         <div>
//                           <p className="font-medium">
//                             {log.date_taken ? format(new Date(log.date_taken), 'EEEE, MMMM d') : 'Unknown date'}
//                           </p>
//                           <p className="text-sm text-muted-foreground">
//                             {log.taken ? `Taken at ${log.time_taken || '-'}` : 'Medication missed'}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-2">
//                         {log.photo_url && (
//                           <Badge variant="outline"><Camera className="w-3 h-3 mr-1" /> Photo</Badge>
//                         )}
//                         <Badge variant={log.taken ? "secondary" : "destructive"}>
//                           {log.taken ? "Completed" : "Missed"}
//                         </Badge>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Calendar Tab */}
//         <TabsContent value="calendar" className="space-y-6">
//           <Card>
//             <CardHeader><CardTitle>Medication Calendar Overview</CardTitle></CardHeader>
//             <CardContent>
//               <div className="grid lg:grid-cols-2 gap-6">
//                 <div>
//                   <Calendar
//                     mode="single"
//                     selected={selectedDate}
//                     onSelect={(date) => date && setSelectedDate(date)}
//                     className="w-full"
//                     modifiersClassNames={{
//                       selected: "bg-blue-600 text-white hover:bg-blue-700",
//                     }}
//                     components={{
//                       DayContent: ({ date }) => {
//                         const dateStr = format(date, 'yyyy-MM-dd');
//                         const isTaken = takenDates.has(dateStr);
//                         const isPast = isBefore(date, startOfDay(new Date()));
//                         const isCurrentDay = isToday(date);

//                         return (
//                           <div className="relative w-full h-full flex items-center justify-center">
//                             <span>{date.getDate()}</span>
//                             {isTaken && (
//                               <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
//                                 <Check className="w-2 h-2 text-white" />
//                               </div>
//                             )}
//                             {!isTaken && isPast && !isCurrentDay && (
//                               <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full"></div>
//                             )}
//                           </div>
//                         );
//                       }
//                     }}
//                   />
//                 </div>

//                 <div>
//                   <h4 className="font-medium mb-4">Details for {format(selectedDate, 'MMMM d, yyyy')}</h4>
//                   <div className="space-y-4">
//                     {takenDates.has(format(selectedDate, 'yyyy-MM-dd')) ? (
//                       <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
//                         <Check className="w-5 h-5 text-green-600" />
//                         <p className="text-sm text-green-700">{patientName} took medication on this day.</p>
//                       </div>
//                     ) : isBefore(selectedDate, startOfDay(new Date())) ? (
//                       <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
//                         <AlertTriangle className="w-5 h-5 text-red-600" />
//                         <p className="text-sm text-red-700">{patientName} missed medication on this day.</p>
//                       </div>
//                     ) : isToday(selectedDate) ? (
//                       <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
//                         <Clock className="w-5 h-5 text-blue-600" />
//                         <p className="text-sm text-blue-700">Monitoring {patientName}'s medication for today.</p>
//                       </div>
//                     ) : (
//                       <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
//                         <CalendarIcon className="w-5 h-5 text-gray-600" />
//                         <p className="text-sm text-gray-700">This is a future date.</p>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="notifications">
//           <NotificationSettings />
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };

// export default CaretakerDashboard;

// import { useState, useMemo } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { supabase } from "@/SupabaseClient";
// import { Database } from "@/types/supabase";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Users,
//   Bell,
//   Calendar as CalendarIcon,
//   Mail,
//   AlertTriangle,
//   Check,
//   Clock,
//   Camera,
// } from "lucide-react";
// import NotificationSettings from "./NotificationSettings";
// import {
//   format,
//   subDays,
//   isBefore,
//   isToday,
//   startOfDay,
// } from "date-fns";

// type MedicationLog = Database["public"]["Tables"]["medication_logs"]["Row"];

// const CaretakerDashboard = () => {
//   const [activeTab, setActiveTab] = useState("overview");
//   const [selectedDate, setSelectedDate] = useState<Date>(new Date());

//   const patientName = "Eleanor Thompson";

//   const { data: logs = [], isLoading } = useQuery<MedicationLog[]>({
//     queryKey: ["caretakerLogs"],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from("medication_logs")
//         .select("*")
//         .order("date_taken", { ascending: false });

//       if (error) throw error;
//       return data || [];
//     },
//   });

//   const takenDates = useMemo(() => {
//     return new Set(
//       logs.filter((log) => log.taken).map((log) => log.date_taken ?? "")
//     );
//   }, [logs]);

//   const adherenceRate = useMemo(() => {
//     let count = 0;
//     for (let i = 0; i < 30; i++) {
//       const day = format(subDays(new Date(), i), "yyyy-MM-dd");
//       if (takenDates.has(day)) count++;
//     }
//     return Math.round((count / 30) * 100);
//   }, [takenDates]);

//   const currentStreak = useMemo(() => {
//     let streak = 0;
//     for (let i = 0; i < 30; i++) {
//       const day = format(subDays(new Date(), i), "yyyy-MM-dd");
//       if (takenDates.has(day)) {
//         streak++;
//       } else {
//         break;
//       }
//     }
//     return streak;
//   }, [takenDates]);

//   const missedDoses = useMemo(() => {
//     let missed = 0;
//     for (let i = 0; i < 30; i++) {
//       const day = format(subDays(new Date(), i), "yyyy-MM-dd");
//       if (!takenDates.has(day) && isBefore(subDays(new Date(), i), new Date())) {
//         missed++;
//       }
//     }
//     return missed;
//   }, [takenDates]);

//   const dailyMedication = {
//     name: "Daily Medication Set",
//     time: "8:00 AM",
//     status: takenDates.has(format(new Date(), "yyyy-MM-dd"))
//       ? "completed"
//       : "pending",
//   };

//   const handleSendReminderEmail = () => {
//     alert("Reminder email sent to " + patientName);
//   };
//   const handleConfigureNotifications = () => setActiveTab("notifications");
//   const handleViewCalendar = () => setActiveTab("calendar");

//   return (
//     <div className="space-y-6">
//       {/* Header Section */}
//       <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 text-white">
//         <div className="flex items-center gap-4 mb-6">
//           <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
//             <Users className="w-8 h-8" />
//           </div>
//           <div>
//             <h2 className="text-3xl font-bold">Caretaker Dashboard</h2>
//             <p className="text-white/90 text-lg">
//               Monitoring {patientName}'s medication adherence
//             </p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <Card className="bg-white/10 backdrop-blur-sm p-4 text-white">
//             <div className="text-2xl font-bold">{adherenceRate}%</div>
//             <div className="text-white/80">Adherence Rate</div>
//           </Card>
//           <Card className="bg-white/10 backdrop-blur-sm p-4 text-white">
//             <div className="text-2xl font-bold">{currentStreak}</div>
//             <div className="text-white/80">Current Streak</div>
//           </Card>
//           <Card className="bg-white/10 backdrop-blur-sm p-4 text-white">
//             <div className="text-2xl font-bold">{missedDoses}</div>
//             <div className="text-white/80">Missed This Month</div>
//           </Card>
//           <Card className="bg-white/10 backdrop-blur-sm p-4 text-white">
//             <div className="text-2xl font-bold">
//               {logs.filter((l) => l.taken).length}
//             </div>
//             <div className="text-white/80">Taken This Week</div>
//           </Card>
//         </div>
//       </div>

//       <Tabs
//         value={activeTab}
//         onValueChange={setActiveTab}
//         className="space-y-6"
//       >
//         <TabsList className="grid w-full grid-cols-4">
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="activity">Recent Activity</TabsTrigger>
//           <TabsTrigger value="calendar">Calendar View</TabsTrigger>
//           <TabsTrigger value="notifications">Notifications</TabsTrigger>
//         </TabsList>

//         <TabsContent value="overview" className="space-y-6">
//           <div className="grid lg:grid-cols-2 gap-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <CalendarIcon className="w-5 h-5 text-blue-600" />
//                   Today's Status
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
//                   <div>
//                     <h4 className="font-medium">{dailyMedication.name}</h4>
//                     <p className="text-sm text-muted-foreground">
//                       {dailyMedication.time}
//                     </p>
//                   </div>
//                   <Badge
//                     variant={
//                       dailyMedication.status === "pending"
//                         ? "destructive"
//                         : "secondary"
//                     }
//                   >
//                     {dailyMedication.status === "pending"
//                       ? "Pending"
//                       : "Completed"}
//                   </Badge>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader>
//                 <CardTitle>Quick Actions</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <button
//                   className="w-full flex items-center gap-2"
//                   onClick={handleSendReminderEmail}
//                 >
//                   <Mail className="w-4 h-4" />
//                   Send Reminder Email
//                 </button>
//                 <button
//                   className="w-full flex items-center gap-2"
//                   onClick={handleConfigureNotifications}
//                 >
//                   <Bell className="w-4 h-4" />
//                   Configure Notifications
//                 </button>
//                 <button
//                   className="w-full flex items-center gap-2"
//                   onClick={handleViewCalendar}
//                 >
//                   <CalendarIcon className="w-4 h-4" />
//                   View Full Calendar
//                 </button>
//               </CardContent>
//             </Card>
//           </div>

//           <Card>
//             <CardHeader>
//               <CardTitle>Monthly Adherence Progress</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <Progress value={adherenceRate} className="h-3 mb-4" />
//               <div className="grid grid-cols-3 gap-4 text-center text-sm">
//                 <div>
//                   <div className="font-medium text-green-600">
//                     {30 - missedDoses} days
//                   </div>
//                   <div className="text-muted-foreground">Taken</div>
//                 </div>
//                 <div>
//                   <div className="font-medium text-red-600">{missedDoses} days</div>
//                   <div className="text-muted-foreground">Missed</div>
//                 </div>
//                 <div>
//                   <div className="font-medium text-blue-600">
//                     {30 - (missedDoses + (30 - missedDoses))} days
//                   </div>
//                   <div className="text-muted-foreground">Remaining</div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="activity">
//           {/* Keep your recent logs UI as-is */}
//         </TabsContent>

//         <TabsContent value="calendar">
//           {/* Keep your calendar UI as-is */}
//         </TabsContent>

//         <TabsContent value="notifications">
//           <NotificationSettings />
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };

// export default CaretakerDashboard;

// import statements
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/SupabaseClient";
import { Database } from "@/types/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Users, Bell, Calendar as CalendarIcon, Mail,
  AlertTriangle, Check, Clock, Camera
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import NotificationSettings from "./NotificationSettings";
import {
  format, subDays, isBefore, isToday, startOfDay
} from "date-fns";
import { endOfMonth, getDate } from "date-fns";
type MedicationLog = Database["public"]["Tables"]["medication_logs"]["Row"];

const CaretakerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const patientName = "Eleanor Thompson";

  const { data: logs = [], isLoading } = useQuery<MedicationLog[]>({
    queryKey: ["caretakerLogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("medication_logs")
        .select("*")
        .order("date_taken", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const takenDates = useMemo(() => {
    return new Set(
      logs.filter((log) => log.taken).map((log) => log.date_taken ?? "")
    );
  }, [logs]);

  const adherenceRate = useMemo(() => {
    let count = 0;
    for (let i = 0; i < 30; i++) {
      const d = format(subDays(new Date(), i), "yyyy-MM-dd");
      if (takenDates.has(d)) count++;
    }
    return Math.round((count / 30) * 100);
  }, [takenDates]);

  const currentStreak = useMemo(() => {
    let streak = 0;
    for (let i = 0; i < 30; i++) {
      const d = format(subDays(new Date(), i), "yyyy-MM-dd");
      if (takenDates.has(d)) streak++;
      else break;
    }
    return streak;
  }, [takenDates]);

  const missedDoses = useMemo(() => {
    let missed = 0;
    for (let i = 0; i < 30; i++) {
      const d = format(subDays(new Date(), i), "yyyy-MM-dd");
      if (!takenDates.has(d) && isBefore(subDays(new Date(), i), new Date())) {
        missed++;
      }
    }
    return missed;
  }, [takenDates]);

  const dailyMedication = {
    name: "Daily Medication Set",
    time: "8:00 AM",
    status: takenDates.has(format(new Date(), "yyyy-MM-dd"))
      ? "completed"
      : "pending",
  };

  const handleSendReminderEmail = () => {
    alert("Reminder email sent to " + patientName);
  };

  const handleConfigureNotifications = () => setActiveTab("notifications");
  const handleViewCalendar = () => setActiveTab("calendar");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 text-white">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Caretaker Dashboard</h2>
            <p className="text-white/90 text-lg">
              Monitoring {patientName}'s medication adherence
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/10 backdrop-blur-sm p-4 text-white">
            <div className="text-2xl font-bold">{adherenceRate}%</div>
            <div className="text-white/80">Adherence Rate</div>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm p-4 text-white">
            <div className="text-2xl font-bold">{currentStreak}</div>
            <div className="text-white/80">Current Streak</div>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm p-4 text-white">
            <div className="text-2xl font-bold">{missedDoses}</div>
            <div className="text-white/80">Missed This Month</div>
          </Card>
          <Card className="bg-white/10 backdrop-blur-sm p-4 text-white">
            <div className="text-2xl font-bold">{logs.filter(l => l.taken).length}</div>
            <div className="text-white/80">Taken This Week</div>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview">
          {/* Add your same overview cards and quick actions */}
          <TabsContent value="overview" className="space-y-6">
  <div className="grid lg:grid-cols-2 gap-6">
    {/* Today's Status */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-blue-600" />
          Today's Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
          <div>
            <h4 className="font-medium">{dailyMedication.name}</h4>
            <p className="text-sm text-muted-foreground">{dailyMedication.time}</p>
          </div>
          <Badge variant={dailyMedication.status === "pending" ? "destructive" : "secondary"}>
            {dailyMedication.status === "pending" ? "Pending" : "Completed"}
          </Badge>
        </div>
      </CardContent>
    </Card>

    {/* Quick Actions */}
    <Card>
      <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full justify-start" variant="outline" onClick={handleSendReminderEmail}>
          <Mail className="w-4 h-4 mr-2" /> Send Reminder Email
        </Button>
        <Button className="w-full justify-start" variant="outline" onClick={handleConfigureNotifications}>
          <Bell className="w-4 h-4 mr-2" /> Configure Notifications
        </Button>
        <Button className="w-full justify-start" variant="outline" onClick={handleViewCalendar}>
          <CalendarIcon className="w-4 h-4 mr-2" /> View Full Calendar
        </Button>
      </CardContent>
    </Card>
  </div>

  {/* Monthly Adherence Progress */}
  <Card>
    <CardHeader><CardTitle>Monthly Adherence Progress</CardTitle></CardHeader>
       <CardContent>
    <Progress value={adherenceRate} className="h-3 mb-4" />
    <div className="grid grid-cols-3 gap-4 text-center text-sm">
      <div>
        <div className="font-medium text-green-600">
          {logs.filter(l => l.taken).length} days
        </div>
        <div className="text-muted-foreground">Taken</div>
      </div>
      <div>
        <div className="font-medium text-red-600">{missedDoses} days</div>
        <div className="text-muted-foreground">Missed</div>
      </div>
      <div>
        <div className="font-medium text-blue-600">
          {Math.abs(30 - (logs.filter(l => l.taken).length + missedDoses))}  days
        </div>
        <div className="text-muted-foreground">Remaining</div>
      </div>
    </div>
  </CardContent>
  </Card>
</TabsContent>

        </TabsContent>

        {/* Recent Activity */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Recent Medication Activity</CardTitle></CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading...</p>
              ) : (
                <div className="space-y-4">
                  {logs.map((log, index) => (
                    <div key={log.id || index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${log.taken ? "bg-green-100" : "bg-red-100"}`}>
                          {log.taken ? (
                            <Check className="w-5 h-5 text-green-600" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {log.date_taken ? format(new Date(log.date_taken), "EEEE, MMMM d") : "Unknown"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {log.taken ? `Taken at ${log.time_taken || "-"}` : "Medication missed"}
                          </p>
                        </div>
                      </div>
                     <div className="flex items-center gap-4">
  {log.photo_url && (
    <a
      href={log.photo_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <img
        src={log.photo_url}
        alt="Medication proof"
        className="w-12 h-12 object-cover rounded border shadow hover:scale-105 transition-transform"
      />
    </a>
  )}
  <Badge variant={log.taken ? "secondary" : "destructive"}>
    {log.taken ? "Completed" : "Missed"}
  </Badge>
</div>

                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar */}
        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Medication Calendar Overview</CardTitle></CardHeader>
            <CardContent>
              <div className="grid lg:grid-cols-2 gap-6">
                <div>
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
                        const isPast = isBefore(date, startOfDay(new Date()));
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
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full"></div>
                            )}
                          </div>
                        );
                      },
                    }}
                  />
                </div>
                <div>
                  <h4 className="font-medium mb-4">Details for {format(selectedDate, "MMMM d, yyyy")}</h4>
                  <div className="space-y-4">
                    {takenDates.has(format(selectedDate, "yyyy-MM-dd")) ? (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <Check className="w-5 h-5 text-green-600" />
                        <p className="text-sm text-green-700">{patientName} took medication on this day.</p>
                      </div>
                    ) : isBefore(selectedDate, startOfDay(new Date())) ? (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <p className="text-sm text-red-700">{patientName} missed medication on this day.</p>
                      </div>
                    ) : isToday(selectedDate) ? (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <p className="text-sm text-blue-700">Monitoring {patientName}'s medication for today.</p>
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <CalendarIcon className="w-5 h-5 text-gray-600" />
                        <p className="text-sm text-gray-700">This is a future date.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CaretakerDashboard;
