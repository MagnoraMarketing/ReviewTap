"use client";

import { useFormState, useFormStatus } from "react-dom";
import { signUp, type AuthActionState } from "./actions";

const initialState: AuthActionState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary w-full" disabled={pending}>
      {pending ? "Creating account…" : "Create account"}
    </button>
  );
}

export function SignupForm() {
  const [state, formAction] = useFormState(signUp, initialState);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <div>
        <label className="label" htmlFor="business_name">
          Business name
        </label>
        <input id="business_name" name="business_name" type="text" required className="input" />
      </div>
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
          minLength={8}
          className="input"
          autoComplete="new-password"
        />
        <p className="mt-1 text-xs text-gray-400">At least 8 characters.</p>
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.message && <p className="text-sm text-emerald-600">{state.message}</p>}
      <SubmitButton />
      <p className="text-center text-xs text-gray-400">
        By signing up you agree to our{" "}
        <a href="/terms" className="underline hover:text-gray-600">
          Terms
        </a>{" "}
        and{" "}
        <a href="/privacy" className="underline hover:text-gray-600">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
}
