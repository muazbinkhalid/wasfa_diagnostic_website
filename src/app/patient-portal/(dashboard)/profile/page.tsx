import Link from 'next/link'

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">My Profile</h2>
        <div className="text-sm text-gray-500 py-4 text-center">
          Profile management details will appear here.
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Security</h2>
        <Link 
          href="/patient-portal/change-password"
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
        >
          Change Password
        </Link>
      </div>
    </div>
  )
}
