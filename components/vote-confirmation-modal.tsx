"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

interface Candidate {
  id: string
  firstName: string
  lastName: string
  image: string
  bio: string
}

interface Portfolio {
  id: string
  title: string
  description: string
  candidates: Candidate[]
}

interface VoteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  selections: Record<string, string>
  portfolios: Portfolio[]
}

export function VoteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  selections,
  portfolios,
}: VoteConfirmationModalProps) {
  const getSelectedCandidateInfo = (portfolioId: string) => {
    const candidateId = selections[portfolioId]
    if (!candidateId) return null

    const portfolio = portfolios.find((p) => p.id === portfolioId)
    return portfolio?.candidates.find((c) => c.id === candidateId)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Confirm Your Votes
          </DialogTitle>
          <DialogDescription>
            Please review your selections carefully. Once submitted, your votes cannot be changed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <AlertDescription>
              <strong>Important:</strong> You can only vote once. Make sure your selections are correct.
            </AlertDescription>
          </Alert>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Your Selections:</h3>
            <div className="space-y-3">
              {portfolios.map((portfolio) => {
                const candidate = getSelectedCandidateInfo(portfolio.id)
                return candidate ? (
                  <div key={portfolio.id} className="flex items-center gap-3">
                    <img
                      src={candidate.image || "/placeholder.svg"}
                      alt={`${candidate.firstName} ${candidate.lastName}`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{portfolio.title}</div>
                      <div className="text-sm text-gray-600">
                        {candidate.firstName} {candidate.lastName}
                      </div>
                    </div>
                  </div>
                ) : null
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Review Again
          </Button>
          <Button onClick={onConfirm}>Confirm & Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
