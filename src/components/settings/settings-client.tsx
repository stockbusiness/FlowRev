"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "./profile-form";
import { PasswordForm } from "./password-form";

interface SettingsClientProps {
  email: string;
  initialDisplayName: string;
}

export function SettingsClient({ email, initialDisplayName }: SettingsClientProps) {
  const router = useRouter();

  async function handleProfileSubmit(displayName: string) {
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName }),
    });
    if (!res.ok) throw new Error("保存に失敗しました");
    router.refresh();
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">プロフィール</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm
            email={email}
            initialDisplayName={initialDisplayName}
            onSubmit={handleProfileSubmit}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">パスワード変更</CardTitle>
        </CardHeader>
        <CardContent>
          <PasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}
