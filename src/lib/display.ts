import type {
  DestinationType,
  DeviceStatus,
  SubscriptionStatus,
  DeviceVariant,
  DevicePlan,
} from "@/types/database";

export const DESTINATION_LABELS: Record<DestinationType, string> = {
  GOOGLE_REVIEWS: "Google Reviews",
  FACEBOOK: "Facebook",
  TRUSTPILOT: "Trustpilot",
  TRIPADVISOR: "Tripadvisor",
  CUSTOM_URL: "Custom URL",
};

export const DESTINATION_PLACEHOLDERS: Record<DestinationType, string> = {
  GOOGLE_REVIEWS: "https://g.page/r/your-business/review",
  FACEBOOK: "https://www.facebook.com/yourbusiness/reviews",
  TRUSTPILOT: "https://www.trustpilot.com/evaluate/yourbusiness.com",
  TRIPADVISOR: "https://www.tripadvisor.com/UserReviewEdit-...",
  CUSTOM_URL: "https://example.com/leave-a-review",
};

export const DESTINATION_COLORS: Record<DestinationType, string> = {
  GOOGLE_REVIEWS: "#4285F4",
  FACEBOOK: "#1877F2",
  TRUSTPILOT: "#00B67A",
  TRIPADVISOR: "#34E0A1",
  CUSTOM_URL: "#6B7280",
};

export const PLAN_LABELS: Record<DevicePlan, string> = {
  BASIC: "Basic",
  PRO: "Pro",
};

export const PLAN_PRICE_EUR: Record<DevicePlan, number> = {
  BASIC: 10,
  PRO: 20,
};

export const DEVICE_STATUS_LABELS: Record<DeviceStatus, string> = {
  ACTIVE: "Active",
  PAUSED: "Paused",
  SUSPENDED: "Suspended",
};

export const DEVICE_STATUS_TONE: Record<DeviceStatus, "green" | "amber" | "red"> = {
  ACTIVE: "green",
  PAUSED: "amber",
  SUSPENDED: "red",
};

export const SUBSCRIPTION_STATUS_LABELS: Record<SubscriptionStatus, string> = {
  active: "Active",
  trialing: "Trial",
  past_due: "Past due",
  canceled: "Canceled",
  unpaid: "Unpaid",
  incomplete: "Incomplete",
  incomplete_expired: "Expired",
  paused: "Paused",
};

export const SUBSCRIPTION_STATUS_TONE: Record<SubscriptionStatus, "green" | "amber" | "red" | "gray" | "blue"> = {
  active: "green",
  trialing: "blue",
  past_due: "amber",
  canceled: "red",
  unpaid: "red",
  incomplete: "amber",
  incomplete_expired: "red",
  paused: "gray",
};

export const DEVICE_VARIANT_LABELS: Record<DeviceVariant, string> = {
  STANDEE_CARD: "Standee Card",
  DESK_TILE: "Desk Tile",
};
