"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { SettingsPage } from "@/components/settings/settings-nav";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loadProfile, profileInitial } from "@/lib/profile";
import { createClient } from "@/lib/supabase/client";

/** D-SET-01 · Profile */
export default function ProfileSettings() {
  const [userId, setUserId] = useState<string | null>(null);
  const [savedName, setSavedName] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const dirty = name.trim() !== savedName;

  useEffect(() => {
    let cancelled = false;
    loadProfile().then((result) => {
      if (cancelled || !result) return;
      const nextName = result.profile.display_name?.trim() ?? "";
      setUserId(result.userId);
      setEmail(result.email);
      setName(nextName);
      setSavedName(nextName);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const save = async () => {
    if (!userId) return;
    setSaving(true);
    setError("");
    const supabase = createClient();
    const nextName = name.trim();
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ display_name: nextName })
      .eq("id", userId);
    setSaving(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setName(nextName);
    setSavedName(nextName);
  };

  const removeAccount = async () => {
    setDeleting(true);
    setError("");
    const response = await fetch("/auth/delete", { method: "POST" });
    if (!response.ok) {
      setDeleting(false);
      setError("Could not delete the account. Try again.");
      return;
    }
    router.push("/signup");
    router.refresh();
  };

  return (
    <SettingsPage title="Profile" width={560}>
      <div className="flex items-center gap-5">
        <span className="flex size-20 items-center justify-center rounded-full bg-brand-primary font-display text-2xl font-semibold text-white">
          {profileInitial(name, email)}
        </span>
        <div>
          <Button variant="outline" size="sm" className="rounded-[8px] font-normal">
            Change photo
          </Button>
          <p className="pt-1.5 text-xs text-text-secondary">JPG, GIF or PNG. 1MB max.</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="name" className="font-normal">Name</Label>
        <Input id="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email" className="font-normal">Email</Label>
        <Input id="email" type="email" autoComplete="email" value={email} readOnly />
      </div>

      <div>
        <Button
          disabled={!dirty || saving}
          onClick={save}
          className="h-11 rounded-[10px] px-5 disabled:bg-slate-100 disabled:text-slate-400 disabled:opacity-100"
        >
          {saving ? "Saving…" : "Save changes"}
        </Button>
        {error && (
          <p role="alert" className="pt-2 text-sm text-error">
            {error}
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 border-t border-line pt-6">
        <div>
          <h2 className="font-display text-sm text-text-primary">Delete account</h2>
          <p className="text-xs text-text-secondary">Permanently remove your account and all associated data.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="text-error hover:bg-error-tint hover:text-error">
              Delete account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete your account?</DialogTitle>
              <DialogDescription>
                This permanently removes your progress, phrases and subscription. You can&apos;t undo this.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button variant="destructive" onClick={removeAccount} disabled={deleting}>
                {deleting ? "Deleting…" : "Delete account"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SettingsPage>
  );
}
