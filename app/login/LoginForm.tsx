"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import { signInWithPassword, signInWithMagicLink, type AuthActionState } from "./actions";

const initialState: AuthActionState = {};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary w-full" disabled={pending}>
      {pending ? "Please wait…" : label}
    </button>
  );
}

export function LoginForm({ next }: { next?: string }) {
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [passwordState, passwordAction] = useFormState(signInWithPassword, initialState);
  const [magicState, magicAction] = useFormState(signInWithMagicLink, initialState);

  const state = mode === "password" ? passwordState : magicState;

  return (
    <div className="mt-6">
      {mode === "password" ? (
        <form action={passwordAction} className="space-y-4">
          <input type="hidden" name="next" value={next ?? "/dashboard"} />
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input id="email" name="email" type="email" required className="input" autoComplete="email" />
          </div>
          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="input"
              autoComplete="current-password"
            />
          </div>
          {state.error && <p className="text-sm text-red-600">{state.error}</p>}
          <SubmitButton label="Log in" />
        </form>
      ) : (
        <form action={magicAction} className="space-y-4">
          <div>
            <label className="label" htmlFor="magic-email">
              Email
            </label>
            <input id="magic-email" name="email" type="email" required className="input" autoComplete="email" />
          </div>
          {state.error && <p className="text-sm text-red-600">{state.error}</p>}
          {state.message && <p className="text-sm text-emerald-600">{state.message}</p>}
          <SubmitButton label="Send magic link" />
        </form>
      )}

      <button
        type="button"
        onClick={() => setMode(mode === "password" ? "magic" : "password")}
        className="mt-4 w-full text-center text-sm font-medium text-brand-600 hover:text-brand-700"
      >
        {mode === "password" ? "Use a magic link instead" : "Use a password instead"}
      </button>
    </div>
  );
}
