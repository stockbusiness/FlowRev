import { Header } from "@/components/layout/header";
import { SettingsClient } from "@/components/settings/settings-client";
import { getProfile } from "@/lib/supabase/profile";

export default async function SettingsPage() {
  const { profile, email } = await getProfile();

  return (
    <>
      <Header title="設定" />
      <main className="flex-1 overflow-auto p-6">
        <SettingsClient email={email} initialDisplayName={profile.display_name ?? ""} />
      </main>
    </>
  );
}
