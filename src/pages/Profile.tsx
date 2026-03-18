import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Loader2, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getUserProfile, updateUserProfile } from "@/lib/authService";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    age: "",
    phone: "",
    email: "",
    village: "",
    mandal: "",
    district: "",
    state: "",
    pin_code: "",
  });

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/user/login");
        return;
      }
      const data = await getUserProfile();
      if (data) {
        setProfile({
          name: data.name || "",
          age: data.age?.toString() || "",
          phone: data.phone || "",
          email: data.email || "",
          village: data.village || "",
          mandal: data.mandal || "",
          district: data.district || "",
          state: data.state || "",
          pin_code: data.pin_code || "",
        });
      }
      setLoading(false);
    };
    checkAuthAndLoad();
  }, [navigate]);

  const handleSave = async () => {
    setSaving(true);
    const result = await updateUserProfile({
      name: profile.name || undefined,
      age: profile.age ? parseInt(profile.age) : undefined,
      phone: profile.phone || undefined,
      village: profile.village || undefined,
      mandal: profile.mandal || undefined,
      district: profile.district || undefined,
      state: profile.state || undefined,
      pin_code: profile.pin_code || undefined,
    });

    if (result.success) {
      toast({ title: "Profile Updated ✅", description: "Your profile has been saved." });
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const fields = [
    { key: "name", label: "Full Name", type: "text", placeholder: "Enter your name" },
    { key: "age", label: "Age", type: "number", placeholder: "Enter your age" },
    { key: "phone", label: "Mobile Number", type: "tel", placeholder: "Enter mobile number" },
    { key: "email", label: "Email", type: "email", placeholder: "Email address", disabled: true },
    { key: "village", label: "Village", type: "text", placeholder: "Enter village name" },
    { key: "mandal", label: "Mandal", type: "text", placeholder: "Enter mandal name" },
    { key: "district", label: "District", type: "text", placeholder: "Enter district name" },
    { key: "state", label: "State", type: "text", placeholder: "Enter state name" },
    { key: "pin_code", label: "Pin Code", type: "text", placeholder: "Enter pin code" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Profile Details</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-lg">
        <div className="space-y-5">
          {fields.map(({ key, label, type, placeholder, disabled }) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key} className="text-foreground font-medium">
                {label}
              </Label>
              <Input
                id={key}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                value={profile[key as keyof typeof profile]}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, [key]: e.target.value }))
                }
                className="rounded-xl"
              />
            </div>
          ))}

          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-6 text-lg font-semibold rounded-xl mt-6"
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="w-5 h-5" />
                Save Profile
              </div>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Profile;
