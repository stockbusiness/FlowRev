"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function PasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);

    if (password.length < 6) {
      setError("パスワードは6文字以上で入力してください");
      return;
    }
    if (password !== confirmPassword) {
      setError("確認用パスワードが一致しません");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw new Error(error.message);
      setSaved(true);
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="newPassword">新しいパスワード</Label>
          <Input
            id="newPassword"
            type="password"
            autoComplete="new-password"
            minLength={6}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setSaved(false);
            }}
            placeholder="6文字以上"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">新しいパスワード（確認）</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={6}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setSaved(false);
            }}
            placeholder="もう一度入力"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
          {error}
        </p>
      )}
      {saved && !error && (
        <p className="text-sm text-emerald-600 bg-emerald-50 rounded-md px-3 py-2">
          パスワードを変更しました
        </p>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={loading || !password}>
          {loading ? "変更中..." : "パスワードを変更"}
        </Button>
      </div>
    </form>
  );
}
