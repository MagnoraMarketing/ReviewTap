/**
 * Shared between the admin test-subscription API route and the admin user
 * page so both agree on how to recognise a fake admin-granted subscription
 * versus a real Stripe-backed one (see app/api/admin/users/[id]/test-subscription).
 */
export const TEST_SUBSCRIPTION_CUSTOMER_PREFIX = "admin_test_";

export function isTestSubscription(stripeCustomerId: string | null | undefined): boolean {
  return Boolean(stripeCustomerId?.startsWith(TEST_SUBSCRIPTION_CUSTOMER_PREFIX));
}
