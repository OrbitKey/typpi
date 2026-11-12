"use client";

import { useState } from "react";

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

const initial = { name: "Alex Lee", email: "alex.lee@example.com" };

/** D-SET-01 · Profile */
export default function ProfileSettings() {
  const [form, setForm] = useState(initial);
  const dirty = form.name !== initial.name || form.email !== initial.email;

  return (
    <SettingsPage title="Profile" width={560}>
      <div className="flex items-center gap-5">
        <span className="flex size-20 items-center justify-center rounded-full bg-brand-primary font-display text-2xl font-semibold text-white">
          A
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
        <Input id="name" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email" className="font-normal">Email</Label>
        <Input id="email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </div>
      <div className="flex items-center justify-between border-y border-line py-3">
        <div>
          <p className="font-display text-sm text-text-primary">Password</p>
          <p aria-label="Password hidden" className="text-sm tracking-[2px] text-text-secondary">
            ••••••••
          </p>
        </div>
        <Button variant="outline" size="sm" className="rounded-[8px] font-normal">
          Change password
        </Button>
      </div>

      <div>
        <Button disabled={!dirty} className="h-11 rounded-[10px] px-5 disabled:bg-slate-100 disabled:text-slate-400 disabled:opacity-100">
          Save changes
        </Button>
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
              {/* TODO(backend): delete account */}
              <Button variant="destructive">Delete account</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SettingsPage>
  );
}
