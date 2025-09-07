import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      const params = new URL(window.location.href).searchParams;
      const code = params.get("code");
      if (!code) {
        navigate("/login");
        return;
      }
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        toast({
          title: "Auth error",
          description: error.message,
          variant: "destructive",
        });
        navigate("/login");
        return;
      }
      toast({ title: "Signed in", description: "Authentication successful" });
      navigate("/");
    };
    run();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin" />
    </div>
  );
}
