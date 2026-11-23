import { AppRail } from "@/components/app/app-rail";
import { SettingsNav } from "@/components/settings/settings-nav";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-surface-page md:min-h-screen md:bg-white">
      <AppRail active="settings" mobileNav />
      <SettingsNav />
      {children}
    </div>
  );
}
