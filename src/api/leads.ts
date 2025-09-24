import { apiFetch } from "@/utils/fetcher";
import { Lead, LeadFilters, PaginatedResponse } from "@/types";

const BASE = "/leads";

export async function getLeads(filters: LeadFilters = {}) {
  const params = new URLSearchParams();
  if (filters.page) params.set("page", String(filters.page));
  if (filters.pageSize) params.set("pageSize", String(filters.pageSize));
  if (filters.search) params.set("search", filters.search);
  if (filters.status) params.set("status", filters.status);
  if (filters.source) params.set("source", filters.source);
  if (filters.priority) params.set("priority", filters.priority);
  if (filters.lead_type) params.set("lead_type", filters.lead_type);
  if (filters.follow_up_date) params.set("follow_up_date", filters.follow_up_date);
  if (filters.is_archived !== undefined && filters.is_archived !== null && String(filters.is_archived) !== "") {
    params.set("is_archived", String(filters.is_archived));
  }
  const query = params.toString();
  return apiFetch<PaginatedResponse<Lead>>(`${BASE}${query ? `?${query}` : ""}`);
}

export async function getLead(id: string | number) {
  return apiFetch<Lead>(`${BASE}/${id}`);
}

export async function createLead(payload: Lead) {
  return apiFetch<Lead>(`${BASE}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateLead(id: string | number, payload: Partial<Lead>) {
  return apiFetch<Lead>(`${BASE}/${id}` , {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteLeads(leadIds: Array<number>) {
  const result = await apiFetch<{ success: boolean }>(`${BASE}`, {
    method: "DELETE",
    body: JSON.stringify({ leadIds }),
  });
  return result;
}

export async function addLeadNote(leadId: number, note: string) {
  return apiFetch(`${BASE}/${leadId}/notes`, {
    method: "POST",
    body: JSON.stringify({ note }),
  });
}

export async function convertLead(leadId: number) {
  return apiFetch(`${BASE}/${leadId}/convert`);
}

export async function convertLeadWithCheck(
  leadId: number,
  payload: { customer_id?: number; force_new_customer?: boolean } = {}
) {
  return apiFetch(`${BASE}/${leadId}/convert-with-check`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}


