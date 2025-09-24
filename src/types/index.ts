// Core enums and types for Leads CRM

export type LeadStatus =
  | "new"
  | "contacted"
  | "follow_up_scheduled"
  | "on_hold"
  | "converted"
  | "lost";

export type LeadType = "commercial" | "residential";

export type LeadSource =
  | "website_enquiry"
  | "social_media"
  | "referral"
  | "phone_call"
  | "email_campaign"
  | "paid_ads"
  | "trade_show_event"
  | "other";

export type ContactMethod = "phone_call" | "email" | "sms" | "whatsapp" | "other";

export type Priority = "low" | "medium" | "urgent" | "high";

export type AddressType = "primary" | "billing" | "workplace";

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface Tag { id: number; name: string }
export interface MasterLeadSource { id: number; name: string; type?: string }

export interface LeadAddress {
  id?: number;
  address_type: AddressType | string;
  address_line1: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  is_default?: boolean;
}

export interface LeadDocument {
  id?: number;
  document_name: string;
  document_type: string;
  file_url: string;
  mime_type: string;
}

export interface LeadNoteInput { id?: number; note: string };

export interface Lead {
  id?: number;
  first_name: string;
  surname: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  lead_type?: LeadType | string;
  source?: LeadSource | string;
  status?: LeadStatus | string;
  score?: number;
  notes?: string;
  assigned_to?: number;
  account_type?: "company" | "individual" | string;
  priority?: Priority | string;
  industry?: string;
  contact_method?: ContactMethod | string;
  business_size?: "small" | "medium" | "large" | string;
  follow_up_date?: string; // YYYY-MM-DD
  tags?: (string | number)[];
  initialNotes?: (string | LeadNoteInput)[];
  leadDocuments?: LeadDocument[];
  leadAddresses?: LeadAddress[];
  is_archived?: boolean;
}

export interface LeadFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  source?: string;
  priority?: string;
  lead_type?: string;
  follow_up_date?: string;
  is_archived?: string | boolean;
}

export interface ApiErrorShape {
  message: string;
  status?: number;
  details?: unknown;
}


