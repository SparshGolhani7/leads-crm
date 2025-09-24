"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLeadsStore } from "@/store/leadsStore";
import { Button, Card, Input, Select, Alert } from "@/components/ui";
import { Lead } from "@/types";

export default function EditLeadPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);
  const { fetchById, current, update, loading, error, clearError } = useLeadsStore();
  const [form, setForm] = useState<Lead | null>(null);

  useEffect(() => {
    fetchById(id);
  }, [id, fetchById]);

  useEffect(() => {
    if (current) setForm(current);
  }, [current]);

  function set<K extends keyof Lead>(key: K, value: Lead[K]) {
    setForm((f) => (f ? { ...f, [key]: value } : f));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    await update(id, form);
    router.push("/leads");
  }

  if (!form) return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-30">
      <div className="flex items-center gap-2 text-gray-100">
        <span className="inline-block w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold">Edit Lead</h1>
            <p className="text-xs sm:text-sm text-gray-500">Update lead details</p>
          </div>
        </div>
      <Card>
        {error && (
          <div className="mb-3">
            <Alert>
              {error.message}
            </Alert>
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm">First Name <span className="text-red-600 font-bold">*</span></label>
              <Input value={form.first_name} onChange={(e) => set("first_name", e.target.value)} required />
            </div>
            <div>
              <label className="text-sm">Surname <span className="text-red-600 font-bold">*</span></label>
              <Input value={form.surname} onChange={(e) => set("surname", e.target.value)} required />
            </div>
            <div>
              <label className="text-sm">Email Address <span className="text-red-600 font-bold">*</span></label>
              <Input type="email" value={form.email || ""} onChange={(e) => set("email", e.target.value)} required />
            </div>
            <div>
              <label className="text-sm">Phone Number <span className="text-red-600 font-bold">*</span></label>
              <Input 
                value={form.phone || ""} 
                inputMode="numeric"
                pattern="[0-9]*"
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                  set("phone", value);
                }}
                maxLength={10}
                required 
              />
            </div>
            <div>
              <label className="text-sm">Lead Type <span className="text-red-600 font-bold">*</span></label>
              <Select value={form.lead_type || ""} onChange={(e) => set("lead_type", e.target.value)} required>
                <option value="">Select type</option>
                <option value="commercial">Commercial</option>
                <option value="residential">Residential</option>
              </Select>
            </div>
            <div>
              <label className="text-sm">Lead Source <span className="text-red-600 font-bold">*</span></label>
              <Select value={form.source || ""} onChange={(e) => set("source", e.target.value)} required>
                <option value="">Select source</option>
                <option value="website_enquiry">Website Enquiry</option>
                <option value="social_media">Social Media</option>
                <option value="referral">Referral</option>
                <option value="phone_call">Phone Call</option>
                <option value="email_campaign">Email Campaign</option>
                <option value="paid_ads">Paid Ads</option>
                <option value="trade_show_event">Trade Show/Event</option>
                <option value="other">Other</option>
              </Select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm">Status <span className="text-red-600 font-bold">*</span></label>
              <Select value={form.status || "new"} onChange={(e) => set("status", e.target.value)}>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="follow_up_scheduled">Follow up scheduled</option>
                <option value="on_hold">On hold</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </Select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm">Preferred Contact Method <span className="text-red-600 font-bold">*</span></label>
              <Select value={form.contact_method || ""} onChange={(e) => set("contact_method", e.target.value)}>
                <option value="">Select</option>
                <option value="phone_call">Phone</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="other">Other</option>
              </Select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm">Priority <span className="text-red-600 font-bold">*</span></label>
              <Select value={form.priority || ""} onChange={(e) => set("priority", e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </Select>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm">Follow-up Date <span className="text-red-600 font-bold">*</span></label>
              <div className="relative">
                <Input 
                  type="date" 
                  value={form.follow_up_date || ""} 
                  onChange={(e) => set("follow_up_date", e.target.value)} 
                  className="pr-10"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Addresses
              </h3>
              <Button type="button" variant="secondary" className="text-xs px-2 py-1">
                + Add Address
              </Button>
            </div>
            
            <div className="bg-gray-50 border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="font-medium">Address</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Default</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm">Address Type <span className="text-red-600 font-bold">*</span></label>
                  <Select value={form.leadAddresses?.[0]?.address_type || ""} onChange={(e) => {
                    const addresses = form.leadAddresses || [];
                    addresses[0] = { ...addresses[0], address_type: e.target.value };
                    setForm(f => f ? { ...f, leadAddresses: addresses } : f);
                  }} required>
                    <option value="">Select address type</option>
                    <option value="primary">Primary</option>
                    <option value="billing">Billing</option>
                    <option value="workplace">Workplace</option>
                  </Select>
                </div>
                <div>
                  <label className="text-sm">Postcode</label>
                  <div className="flex gap-2">
                    <Input 
                      value={form.leadAddresses?.[0]?.postal_code || ""} 
                      onChange={(e) => {
                        const addresses = form.leadAddresses || [];
                        addresses[0] = { ...addresses[0], postal_code: e.target.value };
                        setForm(f => f ? { ...f, leadAddresses: addresses } : f);
                      }}
                      placeholder="E.G. SW1A 1AA"
                    />
                    <Button type="button" className="text-xs px-2 py-1">Lookup</Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm">Address Line 1</label>
                  <Input 
                    value={form.leadAddresses?.[0]?.address_line1 || ""} 
                    onChange={(e) => {
                      const addresses = form.leadAddresses || [];
                      addresses[0] = { ...addresses[0], address_line1: e.target.value };
                      setForm(f => f ? { ...f, leadAddresses: addresses } : f);
                    }}
                    placeholder="e.g. 123 High Street"
                  />
                </div>
                <div>
                  <label className="text-sm">Address Line 2</label>
                  <Input 
                    value={form.leadAddresses?.[0]?.address_line2 || ""} 
                    onChange={(e) => {
                      const addresses = form.leadAddresses || [];
                      addresses[0] = { ...addresses[0], address_line2: e.target.value };
                      setForm(f => f ? { ...f, leadAddresses: addresses } : f);
                    }}
                    placeholder="Apartment, suite, etc."
                  />
                </div>
                <div>
                  <label className="text-sm">City <span className="text-red-600 font-bold">*</span></label>
                  <Input 
                    value={form.leadAddresses?.[0]?.city || ""} 
                    onChange={(e) => {
                      const addresses = form.leadAddresses || [];
                      addresses[0] = { ...addresses[0], city: e.target.value };
                      setForm(f => f ? { ...f, leadAddresses: addresses } : f);
                    }}
                    placeholder="e.g. London"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm">Country <span className="text-red-600 font-bold">*</span></label>
                  <Input 
                    value={form.leadAddresses?.[0]?.country || "United Kingdom"} 
                    onChange={(e) => {
                      const addresses = form.leadAddresses || [];
                      addresses[0] = { ...addresses[0], country: e.target.value };
                      setForm(f => f ? { ...f, leadAddresses: addresses } : f);
                    }}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm">Notes</label>
            <textarea className="w-full border rounded-md px-3 py-2 text-sm" rows={4}
              value={form.notes || ""}
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => history.back()} className="cursor-pointer">Cancel</Button>
            <Button type="submit" disabled={loading} className="cursor-pointer">{loading ? "Saving..." : "Save"}</Button>
          </div>
        </form>
      </Card>
      </div>
    </div>
  );
}


