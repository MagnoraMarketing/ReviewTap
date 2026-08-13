"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateProfile, type SettingsActionState } from "./actions";
import type { Profile } from "@/types/database";

const initialState: SettingsActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary" disabled={pending}>
      {pending ? "Saving…" : "Save changes"}
    </button>
  );
}

export function SettingsForm({ profile }: { profile: Profile | null }) {
  const [state, formAction] = useFormState(updateProfile, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="label" htmlFor="business_name">
          Business name
        </label>
        <input
          id="business_name"
          name="business_name"
          defaultValue={profile?.business_name ?? ""}
          className="input"
        />
      </div>
      <div>
        <label className="label" htmlFor="name">
          Your name
        </label>
        <input id="name" name="name" defaultValue={profile?.name ?? ""} className="input" />
      </div>
      <div>
        <label className="label" htmlFor="phone">
          Phone
        </label>
        <input id="phone" name="phone" defaultValue={profile?.phone ?? ""} className="input" />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.message && <p className="text-sm text-emerald-600">{state.message}</p>}
      <SubmitButton />
    </form>
  );
}
