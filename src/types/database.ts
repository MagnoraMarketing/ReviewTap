export type DestinationType =
  | "GOOGLE_REVIEWS"
  | "FACEBOOK"
  | "TRUSTPILOT"
  | "TRIPADVISOR"
  | "CUSTOM_URL";

export type DeviceStatus = "ACTIVE" | "PAUSED" | "SUSPENDED";

export type DeviceVariant = "STANDEE_CARD" | "DESK_TILE";

/**
 * BASIC: single fixed destination, direct redirect (original MVP behaviour).
 * PRO: visitor lands on a chooser page and picks from several enabled
 * platforms, with a share option - see `destinations`.
 */
export type DevicePlan = "BASIC" | "PRO";

export type SubscriptionStatus =
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "unpaid"
  | "incomplete"
  | "incomplete_expired"
  | "paused";

export type ScanType = "NFC" | "QR" | "DIRECT" | "UNKNOWN";

export type UserRole = "USER" | "ADMIN";

export type FeedbackStatus = "NEW" | "READ" | "RESOLVED";

// NOTE: these are `type` aliases, not `interface`s, on purpose. Postgrest-js's
// GenericTable constrains Row/Insert/Update to `Record<string, unknown>`, and
// TypeScript only considers a plain object *type alias* (not an `interface`)
// to structurally satisfy that index-signature check - using `interface` here
// makes every `.from(...)` call resolve to `never`.
export type Profile = {
  id: string;
  email: string;
  business_name: string | null;
  name: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

export type Subscription = {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string | null;
  plan: DevicePlan;
  status: SubscriptionStatus;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
};

export type DeviceDestination = {
  type: DestinationType;
  url: string;
  enabled: boolean;
};

export type Device = {
  id: string;
  user_id: string;
  public_id: string;
  name: string;
  variant: DeviceVariant;
  plan: DevicePlan;
  status: DeviceStatus;
  destination_type: DestinationType;
  destination_url: string | null;
  destinations: DeviceDestination[];
  stripe_checkout_session_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Scan = {
  id: string;
  device_id: string;
  scan_type: ScanType;
  destination_type: DestinationType | null;
  timestamp: string;
  user_agent: string | null;
  referrer: string | null;
  country: string | null;
  city: string | null;
  device_type: string | null;
};

export type Feedback = {
  id: string;
  device_id: string;
  rating: number;
  message: string | null;
  status: FeedbackStatus;
  created_at: string;
  updated_at: string;
};

type Empty = Record<string, never>;

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string; email: string };
        Update: Partial<Profile>;
        Relationships: [];
      };
      subscriptions: {
        Row: Subscription;
        Insert: Partial<Subscription> & { user_id: string; stripe_customer_id: string };
        Update: Partial<Subscription>;
        Relationships: [];
      };
      devices: {
        Row: Device;
        Insert: Partial<Device> & { user_id: string; public_id: string; name: string };
        Update: Partial<Device>;
        Relationships: [
          {
            foreignKeyName: "devices_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      scans: {
        Row: Scan;
        Insert: Partial<Scan> & { device_id: string };
        Update: Partial<Scan>;
        Relationships: [
          {
            foreignKeyName: "scans_device_id_fkey";
            columns: ["device_id"];
            isOneToOne: false;
            referencedRelation: "devices";
            referencedColumns: ["id"];
          },
        ];
      };
      feedback: {
        Row: Feedback;
        Insert: Partial<Feedback> & { device_id: string; rating: number };
        Update: Partial<Feedback>;
        Relationships: [
          {
            foreignKeyName: "feedback_device_id_fkey";
            columns: ["device_id"];
            isOneToOne: false;
            referencedRelation: "devices";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Empty;
    Functions: {
      get_redirect_target: {
        Args: { p_public_id: string };
        Returns: {
          device_id: string;
          device_status: DeviceStatus;
          device_plan: DevicePlan;
          destination_type: DestinationType;
          destination_url: string | null;
          destinations: DeviceDestination[];
          subscription_active: boolean;
          business_name: string | null;
        }[];
      };
    };
    Enums: Empty;
    CompositeTypes: Empty;
  };
};
