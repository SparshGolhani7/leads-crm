import { create } from "zustand";
import { Lead, LeadFilters, PaginatedResponse, ApiErrorShape } from "@/types";
import { getLeads, getLead, createLead, updateLead, deleteLeads } from "@/api/leads";

interface LeadsState {
  list: PaginatedResponse<Lead> | null;
  current: Lead | null;
  loading: boolean;
  error: ApiErrorShape | null;
  filters: LeadFilters;
  fetchList: (filters?: LeadFilters) => Promise<void>;
  fetchById: (id: number | string) => Promise<void>;
  create: (payload: Lead) => Promise<Lead>;
  update: (id: number | string, payload: Partial<Lead>) => Promise<Lead>;
  removeMany: (ids: number[]) => Promise<void>;
  setFilters: (filters: LeadFilters) => void;
  clearError: () => void;
}

export const useLeadsStore = create<LeadsState>((set, get) => ({
  list: null,
  current: null,
  loading: false,
  error: null,
  filters: { page: 1, pageSize: 10, is_archived: false },

  async fetchList(filters) {
    set({ loading: true, error: null });
    const nextFilters = { ...get().filters, ...(filters || {}) };
    try {
      const data = await getLeads(nextFilters);
      set({ list: data, filters: nextFilters });
    } catch (e: any) {
      set({ error: e });
    } finally {
      set({ loading: false });
    }
  },

  async fetchById(id) {
    set({ loading: true, error: null });
    try {
      const data = await getLead(id);
      set({ current: data });
    } catch (e: any) {
      set({ error: e });
    } finally {
      set({ loading: false });
    }
  },

  async create(payload) {
    set({ loading: true, error: null });
    try {
      const created = await createLead(payload);
      await get().fetchList();
      return created;
    } catch (e: any) {
      set({ error: e });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  async update(id, payload) {
    set({ loading: true, error: null });
    try {
      const updated = await updateLead(id, payload);
      await get().fetchList();
      return updated;
    } catch (e: any) {
      set({ error: e });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  async removeMany(ids) {
    set({ loading: true, error: null });
    try {
      await deleteLeads(ids);
      set((state) => {
        if (!state.list) return {} as any;
        const filtered = state.list.data.filter((l) => !ids.includes((l.id as number)));
        const newTotal = Math.max(0, (state.list.total || 0) - ids.length);
        return {
          list: {
            ...state.list,
            data: filtered,
            total: newTotal,
          },
        } as any;
      });
      const { filters, list } = get();
      const pageSize = filters.pageSize || 10;
      const currentPage = filters.page || 1;
      const totalAfter = list?.total || 0;
      const lastPage = Math.max(1, Math.ceil(totalAfter / pageSize));
      const nextPage = Math.min(currentPage, lastPage);
      await get().fetchList({ ...filters, page: nextPage, pageSize });
    } catch (e: any) {
      set({ error: e });
      throw e;
    } finally {
      set({ loading: false });
    }
  },

  setFilters(filters) {
    set((s) => ({ filters: { ...s.filters, ...filters } }));
  },

  clearError() {
    set({ error: null });
  },
}));


