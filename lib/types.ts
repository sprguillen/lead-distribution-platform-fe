export type LeadStatus = 'SENT' | 'UNSENT' | 'DUPLICATE' | 'FAILED';

export const WEEKDAYS = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
] as const;

export type Weekday = (typeof WEEKDAYS)[number];

export type Broker = {
  id: number;
  name: string;
  isActive: boolean;
  dailyCap: number;
  timezone: string;
  openingTime: string;
  closingTime: string;
  workingDays: Weekday[];
  createdAt: string;
  updatedAt: string;
};

export type LeadForm = {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export type Lead = {
  id: number;
  name: string;
  email: string;
  phone: string;
  ipAddress: string;
  formName: string;
  status: LeadStatus;
  formId: number;
  distributionId: number | null;
  brokerId: number | null;
  createdAt: string;
  assignedAt: string | null;
  broker?: { id: number; name: string } | null;
  form?: { id: number; name: string; slug: string } | null;
};

export type DistributionBroker = {
  id: number;
  distributionId: number;
  brokerId: number;
  percentage: number;
  isActive: boolean;
  broker: Broker;
};

export type LeadCounts = {
  total: number;
  sent: number;
  unsent: number;
  duplicate: number;
  failed: number;
};

export type Distribution = {
  id: number;
  formId: number;
  form: LeadForm;
  brokers: DistributionBroker[];
  leads: Lead[];
  leadCounts: LeadCounts;
  createdAt: string;
  updatedAt: string;
};

export type BrokerDetail = Broker & {
  leads: Lead[];
  distributionSettings: Array<
    Pick<DistributionBroker, 'id' | 'percentage' | 'isActive'>
  >;
};

export type DashboardSummary = {
  leads: LeadCounts;
  brokers: { total: number; active: number };
  form: { exists: boolean; data: LeadForm | null };
  distribution: { exists: boolean; data: { id: number; formId: number } | null };
};
