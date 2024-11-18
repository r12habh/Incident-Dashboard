// app/dashboard/page.js
import IncidentDashboard from '@/components/dashboard/IncidentDashboard'

export const metadata = {
  title: 'Incident Dashboard | PagerDuty',
  description: 'Monitor and manage PagerDuty incidents'
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-6">
      <IncidentDashboard />
    </main>
  )
}
