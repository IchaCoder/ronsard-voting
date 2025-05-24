import { CandidateManagement } from "@/components/candidate-management"

export default function CandidatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Candidate Management</h1>
        <p className="text-gray-600">Add and manage candidates for different portfolios</p>
      </div>
      <CandidateManagement />
    </div>
  )
}
