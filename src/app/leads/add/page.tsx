"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLeadsStore } from "@/store/leadsStore";
import { Button, Card, Input, Select, Alert } from "@/components/ui";
import { Lead } from "@/types";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  first_name: Yup.string().required("First name is required"),
  surname: Yup.string().required("Surname is required"),
  email: Yup.string().email("Invalid email format").required("Email is required"),
  phone: Yup.string()
    .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .required("Phone number is required"),
  lead_type: Yup.string().required("Lead type is required"),
  company: Yup.string().when("lead_type", {
    is: (val: string) => val === "commercial",
    then: (schema) => schema.required("Company is required when lead type is commercial"),
    otherwise: (schema) => schema.optional(),
  }),
  status: Yup.string().required("Status is required"),
  contact_method: Yup.string().required("Preferred contact method is required"),
  priority: Yup.string().required("Priority is required"),
  follow_up_date: Yup.string().required("Follow-up date is required"),
  leadAddresses: Yup.array().of(
    Yup.object({
      address_type: Yup.string().required("Address type is required"),
    })
  ),
});

export default function AddLeadPage() {
  const router = useRouter();
  const { create, loading, error } = useLeadsStore();

  async function onSubmit(values: Lead) {
    await create(values);
    router.push("/leads");
  }

  const initialValues: Lead = {
    first_name: "",
    surname: "",
    email: "",
    phone: "",
    lead_type: "",
    company: "",
    source: "",
    status: "",
    contact_method: "",
    priority: "",
    follow_up_date: "",
    notes: "",
    leadAddresses: [{
      address_type: "",
      address_line1: "",
      address_line2: "",
      city: "",
      country: "United Kingdom",
      postal_code: "",
      is_default: true
    }]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-3 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base sm:text-xl font-semibold">Add Lead</h1>
            <p className="text-xs sm:text-sm text-gray-500">Create a new lead record</p>
          </div>
          <div className="flex items-center gap-2">
            <a href="/leads">
              <Button className="text-xs sm:text-sm">← Back to list</Button>
            </a>
          </div>
      </div>
      <Card>
        {error && (
          <div className="mb-3">
            <Alert>{error.message}</Alert>
          </div>
        )}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-4">
          <h2 className="text-sm sm:text-base font-semibold text-gray-800">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="text-sm text-gray-800">First Name <span className="text-red-600 font-bold">*</span></label>
              <Field as={Input} name="first_name" placeholder="Enter first name" />
              <ErrorMessage name="first_name" component="div" className="text-red-500 text-xs mt-1" />
            </div>
            <div>
              <label className="text-sm text-gray-800">Surname <span className="text-red-600 font-bold">*</span></label>
              <Field as={Input} name="surname" placeholder="Enter surname" />
              <ErrorMessage name="surname" component="div" className="text-red-500 text-xs mt-1" />
            </div>
            <div>
              <label className="text-sm text-gray-800">Email Address <span className="text-red-600 font-bold">*</span></label>
              <Field as={Input} type="email" name="email" placeholder="email@example.com" />
              <ErrorMessage name="email" component="div" className="text-red-500 text-xs mt-1" />
            </div>
            <div>
              <label className="text-sm text-gray-800">Phone Number <span className="text-red-600 font-bold">*</span></label>
              <Field name="phone">
                {({ field, form }: any) => (
                  <Input
                    {...field}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="e.g. 1234567890"
                    maxLength={10}
                    onChange={(e) => {
                      const value = (e.target as HTMLInputElement).value
                        .replace(/[^0-9]/g, "")
                        .slice(0, 10);
                      form.setFieldValue("phone", value);
                    }}
                  />
                )}
              </Field>
              <ErrorMessage name="phone" component="div" className="text-red-500 text-xs mt-1" />
            </div>
            <div>
              <label className="text-sm text-gray-800">Lead Type <span className="text-red-600 font-bold">*</span></label>
              <Field as={Select} name="lead_type">
                <option value="">Select type</option>
                <option value="commercial">Commercial</option>
                <option value="residential">Residential</option>
              </Field>
              <ErrorMessage name="lead_type" component="div" className="text-red-500 text-xs mt-1" />
            </div>
            {values.lead_type === "commercial" && (
              <div>
                <label className="text-sm text-gray-800">Company <span className="text-red-600 font-bold">*</span></label>
                <Field as={Input} name="company" placeholder="Enter company name" />
                <ErrorMessage name="company" component="div" className="text-red-500 text-xs mt-1" />
              </div>
            )}
            <div>
              <label className="text-sm text-gray-800">Lead Source</label>
              <Field as={Select} name="source">
                <option value="">Select source</option>
                <option value="website_enquiry">Website Enquiry</option>
                <option value="social_media">Social Media</option>
                <option value="referral">Referral</option>
                <option value="phone_call">Phone Call</option>
                <option value="email_campaign">Email Campaign</option>
                <option value="paid_ads">Paid Ads</option>
                <option value="trade_show_event">Trade Show/Event</option>
                <option value="other">Other</option>
              </Field>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-gray-800">Status <span className="text-red-600 font-bold">*</span></label>
              <Field as={Select} name="status">
                <option value="">Select status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="follow_up_scheduled">Follow up scheduled</option>
                <option value="on_hold">On hold</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </Field>
              <ErrorMessage name="status" component="div" className="text-red-500 text-xs mt-1" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-gray-800">Preferred Contact Method <span className="text-red-600 font-bold">*</span></label>
              <Field as={Select} name="contact_method">
                <option value="">Select</option>
                <option value="phone_call">Phone</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="other">Other</option>
              </Field>
              <ErrorMessage name="contact_method" component="div" className="text-red-500 text-xs mt-1" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-gray-800">Priority <span className="text-red-600 font-bold">*</span></label>
              <Field as={Select} name="priority">
                <option value="">Select priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </Field>
              <ErrorMessage name="priority" component="div" className="text-red-500 text-xs mt-1" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-gray-800">Follow-up Date <span className="text-red-600 font-bold">*</span></label>
              <div className="relative">
                <Field as={Input} type="date" name="follow_up_date" className="pr-10" />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <ErrorMessage name="follow_up_date" component="div" className="text-red-500 text-xs mt-1" />
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-3 sm:space-y-4">
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
            
            <div className="bg-gray-50 border rounded-lg p-3 sm:p-4 space-y-3 sm:space-y-4">
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
                  <label className="text-sm text-gray-800">Address Type <span className="text-red-600 font-bold">*</span></label>
                  <Field as={Select} name="leadAddresses.0.address_type">
                    <option value="">Select address type</option>
                    <option value="primary">Primary</option>
                    <option value="billing">Billing</option>
                    <option value="workplace">Workplace</option>
                  </Field>
                  <ErrorMessage name="leadAddresses.0.address_type" component="div" className="text-red-500 text-xs mt-1" />
                </div>
                <div>
                  <label className="text-sm text-gray-800">Postcode</label>
                  <div className="flex gap-2">
                    <Field as={Input} name="leadAddresses.0.postal_code" placeholder="E.G. SW1A 1AA" />
                    <Button type="button" className="text-xs px-2 py-1">Lookup</Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-800">Address Line 1</label>
                  <Field as={Input} name="leadAddresses.0.address_line1" placeholder="e.g. 123 High Street" />
                </div>
                <div>
                  <label className="text-sm text-gray-800">Address Line 2</label>
                  <Field as={Input} name="leadAddresses.0.address_line2" placeholder="Apartment, suite, etc." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-sm text-gray-800">City</label>
                    <Field as={Input} name="leadAddresses.0.city" placeholder="e.g. London" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-800">Country</label>
                    <Field as={Input} name="leadAddresses.0.country" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-800">Notes</label>
            <Field as="textarea" name="notes" className="w-full border rounded-md px-3 py-2 text-sm" rows={4} placeholder="Add any additional notes or details about this lead." />
          </div>

          <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => history.back()} className="cursor-pointer">Cancel</Button>
              <Button type="submit" disabled={loading} className="cursor-pointer">{loading ? "Saving..." : "Save"}</Button>
          </div>
            </Form>
          )}
        </Formik>
      </Card>
      </div>
    </div>
  );
}


