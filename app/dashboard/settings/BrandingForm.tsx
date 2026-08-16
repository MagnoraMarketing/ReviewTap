"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateBranding, type SettingsActionState } from "./actions";
import type { Profile } from "@/types/database";

const initialState: SettingsActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary" disabled={pending}>
      {pending ? "Saving…" : "Save branding"}
    </button>
  );
}

export function BrandingForm({ profile }: { profile: Profile | null }) {
  const [state, formAction] = useFormState(updateBranding, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="label" htmlFor="logo_url">
          Logo URL
        </label>
        <input
          id="logo_url"
          name="logo_url"
          type="url"
          placeholder="https://example.com/logo.png"
          defaultValue={profile?.logo_url ?? ""}
          className="input"
        />
        <p className="mt-1 text-xs text-gray-400">
          Shown instead of the ReviewTap logo on your Pro chooser page. Must be a secure https://
          link to an image.
        </p>
      </div>
      <div>
        <label className="label" htmlFor="accent_color">
          Accent color
        </label>
        <div className="flex items-center gap-2">
          <input
            id="accent_color"
            name="accent_color"
            type="text"
            placeholder="#3A63F0"
            defaultValue={profile?.accent_color ?? ""}
            maxLength={7}
            className="input"
          />
          {profile?.accent_color && (
            <span
              className="h-9 w-9 shrink-0 rounded-lg border border-gray-200"
              style={{ backgroundColor: profile.accent_color }}
              aria-hidden
            />
          )}
        </div>
        <p className="mt-1 text-xs text-gray-400">Hex color, e.g. #3A63F0. Used for small accents.</p>
      </div>
      <div>
        <label className="label" htmlFor="welcome_message">
          Welcome message
        </label>
        <input
          id="welcome_message"
          name="welcome_message"
          placeholder="Thanks for visiting us today!"
          defaultValue={profile?.welcome_message ?? ""}
          maxLength={200}
          className="input"
        />
      </div>
      <div>
        <label className="label" htmlFor="thank_you_message">
          Thank-you message
        </label>
        <input
          id="thank_you_message"
          name="thank_you_message"
          placeholder="Thank you for your feedback!"
          defaultValue={profile?.thank_you_message ?? ""}
          maxLength={200}
          className="input"
        />
        <p className="mt-1 text-xs text-gray-400">Shown right after a guest picks a star rating.</p>
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.message && <p className="text-sm text-emerald-600">{state.message}</p>}
      <SubmitButton />
    </form>
  );
}
