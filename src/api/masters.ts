import { apiFetch } from "@/utils/fetcher";
import { MasterLeadSource, PaginatedResponse, Tag } from "@/types";

export function getMasterLeadSources() {
  return apiFetch<MasterLeadSource[]>("/leads/master-lead-sources");
}

export function getTags() {
  return apiFetch<Tag[]>("/leads/tags");
}


