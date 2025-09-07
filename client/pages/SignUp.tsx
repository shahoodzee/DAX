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
import {
  Github,
  Mail,
  Lock,
  Loader2,
  Chrome,
  ShieldCheck,
  Calendar,
  User,
  AtSign,
  Phone,
} from "lucide-react";

import CountryCodeSelect from "@/components/CountryCodeSelect";

export default function SignUp() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneCode, setPhoneCode] = useState("+1");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const profile = {
        firstName,
        lastName,
        username,
        phone: `${phoneCode} ${phoneNumber}`,
        dob,
      };
      console.info("[mock] register profile", profile);
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      toast({ title: "Account created", description: "Welcome aboard!" });
      navigate("/");
    } catch (err: any) {
      toast({
        title: "Sign up failed",
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
      description: `${provider.toUpperCase()} sign-up will be available shortly.`,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-valorant-dark text-white">
      <Card className="w-full max-w-xl bg-gray-900/60 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Create account</CardTitle>
          <CardDescription className="text-gray-400">
            Sign up with email and details, or use single sign-on.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSignUp} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    id="firstName"
                    required
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    id="lastName"
                    required
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Preferred username (optional)</Label>
              <div className="relative">
                <AtSign
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  id="username"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
            </div>

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
              <Label>Phone</Label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <CountryCodeSelect
                    value={phoneCode}
                    onChange={setPhoneCode}
                  />
                </div>
                <div className="col-span-2 relative">
                  <Phone
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    inputMode="tel"
                    placeholder="123456789"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of birth</Label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <Input
                  id="dob"
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm Password</Label>
                <div className="relative">
                  <ShieldCheck
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Input
                    id="confirm"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Create account"
              )}
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
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-valorant-cyan underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
