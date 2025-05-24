import { ResultsDisplay } from "@/components/results-display"

export default function ResultsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Voting Results</h1>
        <p className="text-gray-600">View current voting results and statistics</p>
      </div>
      <ResultsDisplay />
    </div>
  )
}
