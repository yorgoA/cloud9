export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Customer {
  id: string;
  user_id: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  points_balance: number;
  created_at: string;
  updated_at: string;
}

export interface LoyaltyClaim {
  id: string;
  customer_id: string;
  claim_date: string;
  points_awarded: number;
  created_at: string;
}

export interface RewardCatalog {
  id: string;
  name: string;
  description: string | null;
  points_required: number;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface RewardRedemption {
  id: string;
  customer_id: string;
  reward_id: string;
  points_used: number;
  status: "pending" | "validated" | "expired" | "cancelled";
  redeem_token: string | null;
  created_at: string;
  validated_at: string | null;
}

export interface RedemptionToken {
  id: string;
  customer_id: string;
  reward_id: string;
  points_required: number;
  token: string;
  expires_at: string;
  used_at: string | null;
  created_at: string;
}

export interface DailyCode {
  id: string;
  code: string;
  active: boolean;
  created_at: string;
}

export interface WeeklyQr {
  id: string;
  token: string;
  week_key: string;
  created_at: string;
}

export interface Cloud9Mood {
  id: string;
  week_key: string;
  message: string;
  created_at: string;
  updated_at: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price_cents: number | null;
  category: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: string;
  path: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
}
