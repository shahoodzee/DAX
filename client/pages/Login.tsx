import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Github, Mail, Lock, Loader2, Chrome } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      toast({ title: "Welcome back", description: "Signed in successfully" });
      navigate("/");
    } catch (err: any) {
      toast({
        title: "Sign in failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSSO = (provider: "google" | "github" | "sso") => {
    toast({
      title: "Coming soon",
      description: `${provider.toUpperCase()} sign-in will be available shortly.`,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-valorant-dark text-white">
      <Card className="w-full max-w-md bg-gray-900/60 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Sign in</CardTitle>
          <CardDescription className="text-gray-400">
            Access your account with email or single sign-on.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader2 className="animate-spin" /> : "Sign in"}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-2 text-xs text-gray-400">
            <div className="h-px flex-1 bg-gray-700" />
            <span>OR CONTINUE WITH</span>
            <div className="h-px flex-1 bg-gray-700" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onSSO("google")}
              className="border-gray-700 text-white bg-gray-800 hover:bg-gray-700"
            >
              <Chrome /> Google
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onSSO("github")}
              className="border-gray-700 text-white bg-gray-800 hover:bg-gray-700"
            >
              <Github /> GitHub
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onSSO("sso")}
              className="border-gray-700 text-white bg-gray-800 hover:bg-gray-700"
            >
              SSO
            </Button>
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/sign-up"
              className="text-valorant-cyan underline-offset-4 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
