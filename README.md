# Typpi — web front end

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui (Radix) · lucide-react

Built from the Figma file **Typpi (Copy) › Desktop Screen** (all 6 sections).

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. It redirects to the first onboarding step, and every
screen links on to the next.

## Screens → routes

| Figma | Route | Notes |
| --- | --- | --- |
| 01 · D-ONB-01…04 (+ ST-01…06) | `/onboarding/language`, `/purpose`, `/level`, `/start` | search, scroll fades, keyboard |
| 02 · D-LSN-01…06 | `/lesson` | one interactive lesson: type romaji → pick kanji → send. Wrong key, wrong kanji and hints (Tab) are live states |
| 03 · D-END-01 / 02 | `/lesson/complete` | 3-question quick check → result |
| 03 · D-PAY-01 | `/lesson/complete` → "Continue to the next lesson" | plans modal (also from Pathway and Settings) |
| 04 · D-ACC-01…04 | `/signup` | save progress → email → magic link → daily goal |
| 05 · D-PTH-01 | `/pathway` | |
| 05 · D-PTH-02 | `/pathway?plan=free` | shown after "Not now" on the paywall |
| 05 · D-PTH-03 | `/pathway/complete` | section complete |
| 05 · D-PHR-01 / 02 | `/phrases`, `/phrases?empty=1` | search + filter |
| 06 · D-SET-01…03 | `/settings`, `/settings/subscription`, `/settings/language` | |
| 06 · D-SET-04…06 | `/settings/features` | voting, "Suggest a feature" modal, status filter (pick "Done" style filters for the empty state) |

### Lesson keyboard shortcuts

Type `o k u r e m a s u` on your keyboard (or tap the on-screen keys). Then
`1–3` / `Space` pick a kanji, `Enter` sends, `Esc` goes back to the kana and `Tab` asks Hana for a hint.

## Project layout

```
src/
  app/                    one folder per route (see table above)
  components/
    ui/                   shadcn/ui: button, dialog, input, label, radio-group, switch, textarea, stars
    app/app-rail.tsx      left 72px rail (Pathway · Chats · Phrases · profile)
    brand/logo.tsx        Typpi logo (Small / Medium / Large)
    chat/                 avatar + chat bubbles
    onboarding/           onboarding shell, language picker, choice cards
    lesson/               lesson state machine, header, chat list, messages, composer + keyboard
    plans/                paywall / plans modal
    pathway/ phrases/ settings/
  lib/                    content + data: onboarding, lesson, pathway, phrases, plans, characters
public/avatars/           character avatars
```

Colours come from the Figma Design System page and are Tailwind utilities
(`bg-surface-page`, `text-text-secondary`, `bg-action-accent`, …), defined in
`src/app/globals.css`. Fonts are self-hosted with Fontsource (Inter, Noto Sans,
Noto Sans JP and Noto fallbacks for every language in the picker).

Everything is front end only, with sample data. Places that need the backend
(Supabase auth, saving progress, Stripe) are marked `TODO(backend)`.

## Known gaps / to confirm

Every screen was checked against its Figma frame.

- **Copy marked `TODO(copy)`**: quick-check questions 2–3, Hana's replies for
  the "A little" / "Confidently" levels, the Daily-life first lesson, and the
  "Changing a shift" subtitle aren't in Figma.
- **Avatars** are 1× exports from the frames (28–56px), because the workspace couldn't
  download the original images. Replace the files in `public/avatars/`, keeping the same names.
- **Icons** are lucide-react equivalents of the Figma icons.
- Sample data (Alex Lee, XP, stars, invoices, feature ideas) lives in the page or `src/lib` files.
