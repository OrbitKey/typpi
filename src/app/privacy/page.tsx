import type { Metadata } from "next";

import { LegalDocument, LegalSection } from "@/components/legal/legal-document";

export const metadata: Metadata = { title: "Privacy · Typpi" };

export default function PrivacyPage() {
  return (
    <LegalDocument title="Privacy" updated="18 November 2026">
      <LegalSection title="What we store">
        <p>When you use Typpi, the account holds:</p>
        <ul className="list-disc pl-5">
          <li>your email and the name you save</li>
          <li>the photo you upload</li>
          <li>the guide language, purpose and typing level from onboarding</li>
          <li>your daily goal, reminder time and plan</li>
          <li>stars and XP for lessons you finish</li>
          <li>whether you asked to hear when Travel opens</li>
          <li>phrases you save from a lesson</li>
        </ul>
      </LegalSection>
      <LegalSection title="How it’s used">
        <p>
          This information signs you in, shows your pathway and keeps your settings. The reminder time and the
          Travel request are saved. Those emails are not sent in this version.
        </p>
        <p>
          A photo is stored so your profile can show it. The file address can be opened by anyone who has the
          link.
        </p>
      </LegalSection>
      <LegalSection title="Where it lives">
        <p>Accounts, profile rows and photos are stored with Supabase. Typpi does not sell this information.</p>
      </LegalSection>
      <LegalSection title="Deleting it">
        <p>
          Delete account in Settings removes the sign-in and the profile row that belongs to it. Sign out only
          ends the session on this device.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
