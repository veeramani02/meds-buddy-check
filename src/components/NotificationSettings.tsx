// import { useEffect, useState } from "react";
import { supabase } from "@/SupabaseClient";
import { useUser } from "@supabase/auth-helpers-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Mail, Bell, Pencil } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useState,useEffect } from "react";
const NotificationSettings = () => {
  const user = useUser();
  const [loading, setLoading] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(false);

  const [settings, setSettings] = useState({
    emailNotifications: false,
    emailAddress: "",
    reminderTime: "20:00",
    missedMedDelay: "2",
  });

  const [emailTemplate, setEmailTemplate] = useState({
    subject: "Medication Alert - Patient Name",
    body: `Hello,\n\nThis is a reminder that your patient has not taken their medication today.\nPlease check with them to ensure they take their prescribed medication.\n\nCurrent adherence rate: 85% (5-day streak)`,
  });

  useEffect(() => {
    if (!user) return;
    const fetchSettings = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("notification_settings")
        .select("*")
        .eq("caretaker_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        toast({ title: "Error fetching settings", description: error.message });
      } else if (data) {
        setSettings({
          emailNotifications: data.enable_notifications,
          emailAddress: data.email || "",
          reminderTime: data.daily_reminder_time || "20:00",
          missedMedDelay: data.missed_alert_duration?.toString() || "2",
        });

        setEmailTemplate({
          subject: data.email_subject || "Medication Alert - Patient Name",
          body: data.email_body || `Hello,\n\nThis is a reminder that your patient has not taken their medication today.\nPlease check with them to ensure they take their prescribed medication.\n\nCurrent adherence rate: 85% (5-day streak)`,
        });
      }
      setLoading(false);
    };

    fetchSettings();
  }, [user]);

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveSettings = async () => {
    if (!user) return;

    if (settings.emailNotifications && !settings.emailAddress.trim()) {
      toast({
        title: "Email is required",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      caretaker_id: user.id,
      email: settings.emailAddress,
      enable_notifications: settings.emailNotifications,
      missed_alerts_enabled: true,
      missed_alert_duration: parseInt(settings.missedMedDelay),
      daily_reminder_time: settings.reminderTime,
      email_subject: emailTemplate.subject,
      email_body: emailTemplate.body,
    };

    const { error } = await supabase
      .from("notification_settings")
      .upsert(payload, { onConflict: "caretaker_id" });

    if (error) {
      toast({ title: "Error saving settings", description: error.message });
    } else {
      toast({ title: "Notification settings saved successfully!" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email Notifications */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive medication alerts via email
                </p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  handleSettingChange("emailNotifications", checked)
                }
              />
            </div>

            {settings.emailNotifications && (
              <div className="ml-6 space-y-3">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="caretaker@example.com"
                    value={settings.emailAddress}
                    onChange={(e) =>
                      handleSettingChange("emailAddress", e.target.value)
                    }
                    className="mt-1"
                  />
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Missed Medication Settings - Always visible */}
          <div className="space-y-4 ml-1">
            <div className="space-y-0.5">
              <Label className="text-base">Missed Medication Settings</Label>
              <p className="text-sm text-muted-foreground">
                Configure when alerts should be sent for missed doses
              </p>
            </div>

            <div className="ml-6 space-y-3">
              <div>
                <Label>
                  Alert me if medication isn't taken within
                </Label>
                <Select
                  value={settings.missedMedDelay}
                  onValueChange={(value) =>
                    handleSettingChange("missedMedDelay", value)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="2">2 hours</SelectItem>
                    <SelectItem value="3">3 hours</SelectItem>
                    <SelectItem value="4">4 hours</SelectItem>
                    <SelectItem value="6">6 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Daily reminder time</Label>
                <Input
                  type="time"
                  value={settings.reminderTime}
                  onChange={(e) =>
                    handleSettingChange("reminderTime", e.target.value)
                  }
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Time to check if today's medication was taken
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Template Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-between">
            <span className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-green-600" />
              Email Preview
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditingTemplate(!editingTemplate)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg border text-sm space-y-3">
            {/* Subject */}
            <div>
              <strong>Subject:</strong>{" "}
              {editingTemplate ? (
                <Input
                  value={emailTemplate.subject}
                  onChange={(e) =>
                    setEmailTemplate((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              ) : (
                emailTemplate.subject
              )}
            </div>

            {/* Body */}
            <div>
              {editingTemplate ? (
                <textarea
                  rows={6}
                  value={emailTemplate.body}
                  onChange={(e) =>
                    setEmailTemplate((prev) => ({
                      ...prev,
                      body: e.target.value,
                    }))
                  }
                  className="w-full mt-2 p-2 border rounded-md text-sm"
                />
              ) : (
                <div className="text-muted-foreground whitespace-pre-line">
                  {emailTemplate.body}
                </div>
              )}
            </div>

            {/* Email To */}
            <div>
              <strong>Email To:</strong>{" "}
              {editingEmail ? (
                <Input
                  type="email"
                  value={settings.emailAddress}
                  onChange={(e) =>
                    handleSettingChange("emailAddress", e.target.value)
                  }
                  onBlur={() => setEditingEmail(false)}
                  className="mt-1"
                />
              ) : (
                <span>{settings.emailAddress || "Not Set"}</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSaveSettings}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700"
        >
          {loading ? "Saving..." : "Save Notification Settings"}
        </Button>
      </div>
    </div>
  );
};

export default NotificationSettings;
