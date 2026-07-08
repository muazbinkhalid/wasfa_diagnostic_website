import { ReactNode } from 'react'

export const metadata = {
  title: 'Patient Portal - Wasfa Diagnostic',
  description: 'Manage your diagnostic reports and history.',
}

export default function PatientPortalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-900">Wasfa Patient Portal</span>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        {children}
      </main>
    </div>
  )
}
