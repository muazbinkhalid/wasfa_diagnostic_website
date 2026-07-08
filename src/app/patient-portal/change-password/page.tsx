import ChangePasswordForm from './ChangePasswordForm'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function ChangePasswordPage() {
  return (
    <div className="max-w-md w-full mx-auto mt-12 bg-white rounded-xl shadow-lg border p-8">
      <div className="mb-6 flex items-center justify-between border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
        <Link
          href="/patient-portal/dashboard"
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          Back to Dashboard
        </Link>
      </div>
      <ChangePasswordForm />
    </div>
  )
}
