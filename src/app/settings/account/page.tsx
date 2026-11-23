"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { ProfileForm } from "@/components/settings/profile-form";

/** Phone profile editor. Wide screens already edit the profile at /settings. */
export default function AccountSettings() {
  const router = useRouter();

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)");
    const leave = () => {
      if (wide.matches) router.replace("/settings");
    };
    leave();
    wide.addEventListener("change", leave);
    return () => wide.removeEventListener("change", leave);
  }, [router]);

  return (
    <div className="contents md:hidden">
      <ProfileForm back />
    </div>
  );
}
