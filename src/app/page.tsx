export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with Logo */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <img
              src="https://media.licdn.com/dms/image/v2/C4D0BAQEFANa_obt8xg/company-logo_200_200/company-logo_200_200/0/1671178331115/kylient_software_solutions_pvt_ltd_logo?e=2147483647&v=beta&t=YgjZ4RnGiUdLJG_GDqR0dR1fG-zsAYtGlAgzYPQNOlk"
              alt="Kylient Logo"
              className="h-8 w-8 sm:h-10 sm:w-10 rounded"
            />
            <h1 className="text-lg sm:text-xl font-bold text-gray-800">Leads CRM</h1>
          </div>
          <a
            href="/leads"
            className="text-xs sm:text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 px-3 sm:px-4 py-2 rounded-md transition"
          >
            Go to Leads
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8 sm:space-y-10">
        <div>
          <p className="text-gray-600 text-sm sm:text-base">
            Simple CRM to manage leads and follow-ups.
          </p>
        </div>

        {/* Feature Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition">
            <h2 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Quick Add</h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Create a lead with name, contact, and follow-up date.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition">
            <h2 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Organize</h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Filter by status, type, priority, or date.
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition sm:col-span-2 lg:col-span-1">
            <h2 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Take Action</h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Edit details, add notes, or delete when done.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section>
          <h2 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">How it works</h2>
          <ol className="list-decimal list-inside text-xs sm:text-sm text-gray-700 space-y-1 sm:space-y-2">
            <li>Go to Leads and add a new record.</li>
            <li>Set status and schedule a follow-up date.</li>
            <li>Update progress or convert when qualified.</li>
          </ol>
        </section>
      </main>

      {/* Footer - Fixed at bottom */}
      <footer className="border-t bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <p className="text-center text-xs sm:text-sm text-gray-500">
            © {new Date().getFullYear()} Kylient Software Solutions Pvt Ltd. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
