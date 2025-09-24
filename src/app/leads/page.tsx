"use client";
import { useEffect, useState } from "react";
import { useLeadsStore } from "@/store/leadsStore";
import { Button, Card, Input, Select, Table, Td, Th, Badge, Spinner, EmptyState, Modal } from "@/components/ui";

export default function LeadsListPage() {
  const { list, loading, fetchList, setFilters, filters, removeMany, error } = useLeadsStore();
  const [localSearch, setLocalSearch] = useState(filters.search || "");
  const [selected, setSelected] = useState<number[]>([]);
  const [status, setStatus] = useState(filters.status || "");
  const [type, setType] = useState(filters.lead_type || "");
  const [priority, setPriority] = useState(filters.priority || "");
  const [followUp, setFollowUp] = useState(filters.follow_up_date || "");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIds, setDeleteIds] = useState<number[]>([]);
  const [archiving, setArchiving] = useState(false);
  const [initialDelayPassed, setInitialDelayPassed] = useState(false);

  function formatDate(dateString?: string) {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        const dd = String(date.getDate()).padStart(2, "0");
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const yyyy = date.getFullYear();
        return `${dd}-${mm}-${yyyy}`;
      }
      const onlyDate = dateString.split("T")[0];
      const [y, m, d] = onlyDate.split("-");
      if (y && m && d) return `${d.padStart(2, "0")}-${m.padStart(2, "0")}-${y}`;
      return onlyDate || dateString;
    } catch {
      return dateString;
    }
  }
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // Suppress empty-state message for the first second after mount
  useEffect(() => {
    const timer = setTimeout(() => setInitialDelayPassed(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  

  function applyFilters() {
    setFilters({ search: localSearch, status, lead_type: type, priority, follow_up_date: followUp, page: 1 });
    fetchList();
  }

  function clearAll() {
    setLocalSearch("");
    setStatus("");
    setType("");
    setPriority("");
    setFollowUp("");
    setFilters({ search: "", status: "", lead_type: "", priority: "", follow_up_date: "", page: 1 });
    fetchList();
  }

  function showDeleteConfirmation(id?: number) {
    if (archiving) return;
    const ids = id ? [id] : selected;
    if (!ids.length) return;
    setDeleteIds(ids);
    setDeleteError(null);
    setShowDeleteModal(true);
  }

  async function confirmDelete() {
    try {
      setArchiving(true);
      setDeleteError(null);
      await removeMany(deleteIds);
      setSelected([]);
      setShowDeleteModal(false);
      setDeleteIds([]);
    } catch (error: any) {
      console.error('Delete failed:', error);
      setDeleteError(error?.message || 'Failed to delete leads. Please try again.');
      // Keep modal open on error so user can see the error
    } finally {
      setArchiving(false);
    }
  }

  function cancelDelete() {
    setShowDeleteModal(false);
    setDeleteIds([]);
    setDeleteError(null);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold">Leads</h1>
            <p className="text-xs sm:text-sm text-gray-500">Manage and track your potential customers</p>
          </div>
          <div className="flex items-center gap-2">
            <a href="/leads/add">
              <Button className="text-xs sm:text-sm cursor-pointer">+ Add Lead</Button>
            </a>
          </div>
        </div>

      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          <div className="sm:col-span-2 lg:col-span-1"><Input placeholder="Search" value={localSearch} onChange={(e) => setLocalSearch(e.target.value)} /></div>
          <div>
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="follow_up_scheduled">Follow up scheduled</option>
              <option value="on_hold">On hold</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </Select>
          </div>
          <div>
            <Select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">Type</option>
              <option value="commercial">Commercial</option>
              <option value="residential">Residential</option>
            </Select>
          </div>
          <div>
            <Input type="date" value={followUp} onChange={(e) => setFollowUp(e.target.value)} />
          </div>
          <div>
            <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="">Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </Select>
          </div>
          <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
            <Button onClick={applyFilters} className="flex-1 text-xs sm:text-sm">Apply</Button>
            <Button variant="secondary" onClick={clearAll} className="flex-1 text-xs sm:text-sm">Clear</Button>
          </div>
        </div>
      </Card>

      <Card>
        <Table>
          <thead>
            <tr>
              <Th><input type="checkbox" onChange={(e)=>{
                const checked = e.target.checked;
                if (checked && list?.data) setSelected(list.data.map(l=>l.id!).filter(Boolean) as number[]);
                else setSelected([]);
              }} /></Th>
              <Th>Customer</Th>
              <Th>Email Address</Th>
              <Th>Status</Th>
              <Th>Follow-up Date</Th>
              <Th>Lead-Type</Th>
              <Th>Priority</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {!loading && initialDelayPassed && (list?.data?.filter(l=>!l.is_archived).length ?? 0) === 0 && (
              <tr>
                <Td colSpan={8}>
                  <EmptyState title="No leads found" subtitle="Try adjusting filters or add a new lead." />
                </Td>
              </tr>
            )}
            {list?.data?.filter(l=>!l.is_archived).map((lead) => (
              <tr key={lead.id}>
                <Td><input type="checkbox" checked={selected.includes(lead.id as number)} onChange={(e)=>{
                  const checked = e.target.checked;
                  setSelected((s)=> checked ? Array.from(new Set([...s, lead.id as number])) : s.filter(x=>x!==lead.id));
                }} /></Td>
                <Td>{lead.first_name} {lead.surname}</Td>
                <Td>{lead.email}</Td>
                <Td>
                  <Badge color={lead.status === "converted" ? "green" : lead.status === "lost" ? "red" : "blue"}>{lead.status}</Badge>
                </Td>
                <Td>{formatDate(lead.follow_up_date)}</Td>
                <Td>{lead.lead_type}</Td>
                <Td>
                  <Badge color={lead.priority === "urgent" ? "red" : lead.priority === "high" ? "yellow" : lead.priority === "medium" ? "blue" : "gray"}>{lead.priority}</Badge>
                </Td>
                <Td>
                  <div className="flex gap-2">
                    <a href={`/leads/${lead.id}`} className="text-orange-600 hover:underline cursor-pointer">Edit</a>
                    <button className="text-red-600 hover:underline cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed" onClick={()=>showDeleteConfirmation(lead.id as number)} disabled={archiving}>Archive</button>
                  </div>
                </Td>
              </tr>
            ))}
            {loading && (
              <tr>
                <Td colSpan={8}>
                  <div className="flex items-center gap-2 text-gray-600"><Spinner /> Loading...</div>
                </Td>
              </tr>
            )}
          </tbody>
        </Table>
        <div className="mt-3">
          <Button variant="danger" onClick={()=>showDeleteConfirmation()} disabled={!selected.length || archiving} className="cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">Archive Selected</Button>
        </div>
      </Card>

      <Modal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        title="Confirm Archive"
        onConfirm={confirmDelete}
        confirmText="Archive"
        confirmVariant="danger"
        confirmLoading={archiving}
      >
        <div>
          <p>Are you sure you want to archive {deleteIds.length} lead{deleteIds.length > 1 ? 's' : ''}? You can restore them later from the backend if needed.</p>
          {deleteError && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{deleteError}</p>
            </div>
          )}
        </div>
      </Modal>
      </div>
    </div>
  );
}


