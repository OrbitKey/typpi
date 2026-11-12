import { AppRail } from "@/components/app/app-rail";
import { SettingsNav } from "@/components/settings/settings-nav";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white">
      <AppRail active="settings" />
      <SettingsNav />
      {children}
    </div>
  );
}
