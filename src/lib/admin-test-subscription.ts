/**
 * Shared between the fake-subscription API routes and the admin user page so
 * they all agree on how to recognise a non-Stripe subscription row versus a
 * real Stripe-backed one:
 *  - admin-granted test subscriptions (see app/api/admin/users/[id]/test-subscription)
 *  - self-serve free trials any user can start once (see app/api/trial)
 */
export const TEST_SUBSCRIPTION_CUSTOMER_PREFIX = "admin_test_";
export const SELF_TRIAL_CUSTOMER_PREFIX = "self_trial_";

export function isTestSubscription(stripeCustomerId: string | null | undefined): boolean {
  return Boolean(stripeCustomerId?.startsWith(TEST_SUBSCRIPTION_CUSTOMER_PREFIX));
}

export function isSelfTrialSubscription(stripeCustomerId: string | null | undefined): boolean {
  return Boolean(stripeCustomerId?.startsWith(SELF_TRIAL_CUSTOMER_PREFIX));
}

export function isFakeSubscription(stripeCustomerId: string | null | undefined): boolean {
  return isTestSubscription(stripeCustomerId) || isSelfTrialSubscription(stripeCustomerId);
}
