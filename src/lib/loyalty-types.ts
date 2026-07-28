export type BonusType = "free_wash" | "free_service" | "custom";
export type BonusStatus = "available" | "redeemed" | "expired" | "cancelled";
export type BonusSource = "manual" | "loyalty" | "promo";

export type Customer = {
  id: string;
  phone: string;
  name: string | null;
  plateNormalized: string;
  plateDisplay: string;
  visitsCompleted: number;
  createdAt: string;
  updatedAt: string;
};

export type Bonus = {
  id: string;
  customerId: string;
  type: BonusType;
  serviceId: string | null;
  label: string;
  status: BonusStatus;
  source: BonusSource;
  notes: string | null;
  expiresAt: string | null;
  redeemedAt: string | null;
  redeemedBookingId: string | null;
  createdAt: string;
};

export type LoyaltySettings = {
  id: string;
  visitsRequired: number;
  rewardType: BonusType;
  rewardServiceId: string | null;
  rewardLabel: string;
  enabled: boolean;
  updatedAt: string;
};

export type CustomerProfile = Customer & {
  availableBonuses: Bonus[];
  redeemedBonuses: number;
  recentBookings: number;
};
