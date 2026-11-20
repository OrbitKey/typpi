import type { Metadata } from "next";

import { LegalDocument, LegalSection } from "@/components/legal/legal-document";

export const metadata: Metadata = { title: "Terms · Typpi" };

export default function TermsPage() {
  return (
    <LegalDocument title="Terms" updated="18 November 2026">
      <LegalSection title="The service">
        <p>
          Typpi is a place to practise typing Japanese in short chat lessons. These terms cover the account you
          create and the lessons, progress and settings saved with it.
        </p>
      </LegalSection>
      <LegalSection title="Your account">
        <p>
          You sign in with a link sent to your email. Keep that inbox to yourself. You can change your name and
          photo in Settings, and you can delete the account from the same page.
        </p>
      </LegalSection>
      <LegalSection title="Lessons">
        <p>
          Completed lessons store stars and XP on your account. The playable lesson in this version is Running
          late. Later lessons are listed on the path before their chats are ready.
        </p>
      </LegalSection>
      <LegalSection title="Plans">
        <p>
          Free, Individual and Premium can be chosen in the app. A paid choice is saved on the profile. This
          version does not charge a card, Apple Pay or Google Pay.
        </p>
      </LegalSection>
      <LegalSection title="Using Typpi">
        <p>
          Use your own account. Don’t try to open someone else’s, break the service, or upload a photo you don’t
          have the right to use.
        </p>
      </LegalSection>
    </LegalDocument>
  );
}
