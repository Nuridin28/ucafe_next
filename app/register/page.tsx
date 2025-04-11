"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { validateEmail, validatePassword, validateRequired } from "@/lib/utils";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [role, setRole] = useState("user"); // Роль по умолчанию
  const router = useRouter();
  const { register } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();

  const validateForm = (): boolean => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!validateRequired(name)) {
      newErrors.name = t("validation.required");
    }

    if (!validateRequired(email)) {
      newErrors.email = t("validation.required");
    } else if (!validateEmail(email)) {
      newErrors.email = t("validation.invalidEmail");
    }

    if (!validateRequired(password)) {
      newErrors.password = t("validation.required");
    } else if (!validatePassword(password)) {
      newErrors.password = t("validation.passwordRequirements");
    }

    if (!validateRequired(confirmPassword)) {
      newErrors.confirmPassword = t("validation.required");
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = t("validation.passwordsDoNotMatch");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password, role); // Роль передаем в функцию регистрации
      toast({
        title: t("register.success"),
        description: t("register.successMessage"),
      });
      router.push("/login");
    } catch (error) {
      toast({
        title: t("register.error"),
        description: t("register.errorMessage"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            UCAFE
          </CardTitle>
          <CardDescription className="text-center">
            {t("register.createAccount")}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("register.name")}</Label>
              <Input
                id="name"
                type="text"
                placeholder={t("register.namePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("register.email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("register.password")}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={
                    errors.password ? "border-destructive pr-10" : "pr-10"
                  }
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {t("validation.passwordHint")}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {t("register.confirmPassword")}
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={
                    errors.confirmPassword
                      ? "border-destructive pr-10"
                      : "pr-10"
                  }
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Роль пользователя */}
            <div className="space-y-2">
              <Label htmlFor="role">{t("register.role")}</Label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="user">{t("register.user")}</option>
                <option value="admin">{t("register.admin")}</option>
              </select>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t("register.registering") : t("register.register")}
            </Button>
            <div className="text-center text-sm">
              {t("register.haveAccount")}{" "}
              <Link href="/login" className="text-primary hover:underline">
                {t("register.login")}
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
