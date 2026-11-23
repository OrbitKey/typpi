"use client";

import { MobileSettingsHome } from "@/components/settings/settings-nav";
import { ProfileForm } from "@/components/settings/profile-form";

/** D-SET-01 · Profile. Phones land on the menu; the editor is /settings/account. */
export default function ProfileSettings() {
  return (
    <>
      <MobileSettingsHome />
      <div className="hidden md:contents">
        <ProfileForm />
      </div>
    </>
  );
}
