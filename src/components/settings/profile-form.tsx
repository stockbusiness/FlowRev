"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileFormProps {
  email: string;
  displayName: string | null;
}

export function ProfileForm({ email, displayName }: ProfileFormProps) {
  const [name, setName]       = useState(displayName ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ display_name: name || null }),
    });

    setLoading(false);
    if (res.ok) {
      setMessage({ type: "success", text: "プロフィールを更新しました" });
    } else {
      setMessage({ type: "error", text: "更新に失敗しました" });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div className="space-y-1.5">
        <Label htmlFor="email">メールアドレス</Label>
        <Input id="email" value={email} disabled className="bg-muted" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="display_name">表示名</Label>
        <Input
          id="display_name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="表示名を入力"
          maxLength={50}
        />
      </div>

      {message && (
        <p className={`text-sm px-3 py-2 rounded-md ${
          message.type === "success"
            ? "text-emerald-700 bg-emerald-50"
            : "text-destructive bg-destructive/10"
        }`}>
          {message.text}
        </p>
      )}

      <Button type="submit" disabled={loading}>
        {loading ? "保存中..." : "保存する"}
      </Button>
    </form>
  );
}
