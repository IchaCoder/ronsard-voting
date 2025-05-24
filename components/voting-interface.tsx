"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Users, AlertCircle } from "lucide-react"
import { VoteConfirmationModal } from "@/components/vote-confirmation-modal"

// Voting schedule configuration - Update these times as needed
const VOTING_CONFIG = {
  startTime: new Date("2025-05-24T08:00:00"), // December 20, 2024 at 8:00 AM
  endTime: new Date("2025-05-24T17:00:00"), // December 20, 2024 at 5:00 PM
}

// Mock data for portfolios and candidates
const portfoliosData = [
  {
    id: "student-council-president",
    title: "Student Council President",
    description: "Lead the student body and represent student interests",
    candidates: [
      {
        id: "sarah-johnson",
        firstName: "Sarah",
        lastName: "Johnson",
        image: "/placeholder.svg?height=120&width=120",
        bio: "Experienced leader with a passion for student advocacy and positive change.",
      },
      {
        id: "michael-chen",
        firstName: "Michael",
        lastName: "Chen",
        image: "/placeholder.svg?height=120&width=120",
        bio: "Dedicated to improving school facilities and student life experiences.",
      },
      {
        id: "emma-williams",
        firstName: "Emma",
        lastName: "Williams",
        image: "/placeholder.svg?height=120&width=120",
        bio: "Committed to fostering inclusivity and academic excellence for all students.",
      },
    ],
  },
  {
    id: "sports-captain",
    title: "Sports Captain",
    description: "Organize and lead school sports activities and competitions",
    candidates: [
      {
        id: "david-rodriguez",
        firstName: "David",
        lastName: "Rodriguez",
        image: "/placeholder.svg?height=120&width=120",
        bio: "Varsity athlete with strong leadership skills and team spirit.",
      },
      {
        id: "lisa-thompson",
        firstName: "Lisa",
        lastName: "Thompson",
        image: "/placeholder.svg?height=120&width=120",
        bio: "Multi-sport athlete dedicated to promoting fitness and teamwork.",
      },
    ],
  },
  {
    id: "head-boy-girl",
    title: "Head Boy/Girl",
    description: "Represent the school at official events and ceremonies",
    candidates: [
      {
        id: "alex-parker",
        firstName: "Alex",
        lastName: "Parker",
        image: "/placeholder.svg?height=120&width=120",
        bio: "Outstanding academic record with excellent communication skills.",
      },
      {
        id: "jordan-smith",
        firstName: "Jordan",
        lastName: "Smith",
        image: "/placeholder.svg?height=120&width=120",
        bio: "Natural leader with a strong commitment to school values and traditions.",
      },
    ],
  },
  {
    id: "secretary",
    title: "Secretary",
    description: "Maintain records and coordinate student council meetings",
    candidates: [
      {
        id: "maya-patel",
        firstName: "Maya",
        lastName: "Patel",
        image: "/placeholder.svg?height=120&width=120",
        bio: "Highly organized with excellent attention to detail and communication skills.",
      },
      {
        id: "james-wilson",
        firstName: "James",
        lastName: "Wilson",
        image: "/placeholder.svg?height=120&width=120",
        bio: "Reliable and efficient with strong administrative and organizational abilities.",
      },
    ],
  },
]

// Create validation schema dynamically based on portfolios
const createVotingSchema = () => {
  const schemaObject: Record<string, z.ZodString> = {}
  portfoliosData.forEach((portfolio) => {
    schemaObject[portfolio.id] = z.string().min(1, `Please select a candidate for ${portfolio.title}`)
  })
  return z.object(schemaObject)
}

const votingSchema = createVotingSchema()
type VotingFormData = z.infer<typeof votingSchema>

type VotingStatus = "not-started" | "active" | "ended"

interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function VotingInterface() {
  const [selectedCandidates, setSelectedCandidates] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [votingStatus, setVotingStatus] = useState<VotingStatus>("not-started")
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<VotingFormData>({
    resolver: zodResolver(votingSchema),
  })

  // Update time and voting status every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)

      // Determine voting status
      if (now < VOTING_CONFIG.startTime) {
        setVotingStatus("not-started")
        const timeDiff = VOTING_CONFIG.startTime.getTime() - now.getTime()
        setTimeRemaining(calculateTimeRemaining(timeDiff))
      } else if (now >= VOTING_CONFIG.startTime && now < VOTING_CONFIG.endTime) {
        setVotingStatus("active")
        const timeDiff = VOTING_CONFIG.endTime.getTime() - now.getTime()
        setTimeRemaining(calculateTimeRemaining(timeDiff))
      } else {
        setVotingStatus("ended")
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const calculateTimeRemaining = (timeDiff: number): TimeRemaining => {
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)

    return { days, hours, minutes, seconds }
  }

  const formatDateTime = (date: Date) => {
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatTimeRemaining = (time: TimeRemaining) => {
    const parts = []
    if (time.days > 0) parts.push(`${time.days}d`)
    if (time.hours > 0) parts.push(`${time.hours}h`)
    if (time.minutes > 0) parts.push(`${time.minutes}m`)
    if (time.seconds > 0) parts.push(`${time.seconds}s`)
    return parts.join(" ") || "0s"
  }

  const handleCandidateSelect = async (portfolioId: string, candidateId: string) => {
    if (votingStatus !== "active") return

    const newSelections = { ...selectedCandidates, [portfolioId]: candidateId }
    setSelectedCandidates(newSelections)
    setValue(portfolioId, candidateId)
    await trigger(portfolioId)
  }

  const onSubmit = async (data: VotingFormData) => {
    if (votingStatus !== "active") return
    setShowConfirmation(true)
  }

  const confirmSubmission = async () => {
    setIsLoading(true)
    setShowConfirmation(false)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Votes submitted:", selectedCandidates)
      setIsSubmitted(true)
    } catch (error) {
      console.error("Failed to submit votes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getSelectedCandidateInfo = (portfolioId: string) => {
    const candidateId = selectedCandidates[portfolioId]
    if (!candidateId) return null

    const portfolio = portfoliosData.find((p) => p.id === portfolioId)
    return portfolio?.candidates.find((c) => c.id === candidateId)
  }

  const totalSelections = Object.keys(selectedCandidates).length
  const totalPortfolios = portfoliosData.length
  const isComplete = totalSelections === totalPortfolios

  // Voting Status Component
  const VotingStatusCard = () => {
    if (votingStatus === "not-started") {
      return (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-amber-700">
                <Clock className="h-6 w-6" />
                <span className="text-lg font-semibold">Voting Hasn't Started Yet</span>
              </div>
              <div className="space-y-2">
                <p className="text-amber-800">
                  <strong>Voting starts:</strong> {formatDateTime(VOTING_CONFIG.startTime)}
                </p>
                <p className="text-amber-800">
                  <strong>Voting ends:</strong> {formatDateTime(VOTING_CONFIG.endTime)}
                </p>
              </div>
              <div className="bg-amber-100 rounded-lg p-4">
                <p className="text-lg font-bold text-amber-900">Time until voting starts:</p>
                <p className="text-2xl font-mono text-amber-900">{formatTimeRemaining(timeRemaining)}</p>
              </div>
              <p className="text-sm text-amber-700">
                Please check back when voting begins to see the candidates and cast your vote.
              </p>
            </div>
          </CardContent>
        </Card>
      )
    }

    if (votingStatus === "ended") {
      return (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-red-700">
                <AlertCircle className="h-6 w-6" />
                <span className="text-lg font-semibold">Voting Has Ended</span>
              </div>
              <div className="space-y-2">
                <p className="text-red-800">
                  <strong>Voting started:</strong> {formatDateTime(VOTING_CONFIG.startTime)}
                </p>
                <p className="text-red-800">
                  <strong>Voting ended:</strong> {formatDateTime(VOTING_CONFIG.endTime)}
                </p>
              </div>
              <div className="bg-red-100 rounded-lg p-4">
                <p className="text-lg font-bold text-red-900">Voting period has concluded</p>
                <p className="text-sm text-red-700 mt-2">
                  Thank you to all students who participated in the election process.
                </p>
              </div>
              <p className="text-sm text-red-700">
                Results will be announced soon. Please check with your school administration for updates.
              </p>
            </div>
          </CardContent>
        </Card>
      )
    }

    // Active voting
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-green-700">
              <CheckCircle className="h-6 w-6" />
              <span className="text-lg font-semibold">Voting is Now Active</span>
            </div>
            <div className="space-y-2">
              <p className="text-green-800">
                <strong>Voting started:</strong> {formatDateTime(VOTING_CONFIG.startTime)}
              </p>
              <p className="text-green-800">
                <strong>Voting ends:</strong> {formatDateTime(VOTING_CONFIG.endTime)}
              </p>
            </div>
            <div className="bg-green-100 rounded-lg p-4">
              <p className="text-lg font-bold text-green-900">Time remaining to vote:</p>
              <p className="text-2xl font-mono text-green-900">{formatTimeRemaining(timeRemaining)}</p>
            </div>
            <p className="text-sm text-green-700">
              Select your preferred candidates below and submit your votes before time runs out.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold text-gray-900">Vote Submitted Successfully!</h2>
              <p className="text-gray-600">
                Thank you for participating in the Ecole Ronsard student elections. Your votes have been recorded
                securely.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
                <h3 className="font-semibold text-green-800 mb-2">Your Selections:</h3>
                <div className="space-y-2">
                  {portfoliosData.map((portfolio) => {
                    const candidate = getSelectedCandidateInfo(portfolio.id)
                    return candidate ? (
                      <div key={portfolio.id} className="flex justify-between text-sm">
                        <span className="text-green-700">{portfolio.title}:</span>
                        <span className="font-medium text-green-800">
                          {candidate.firstName} {candidate.lastName}
                        </span>
                      </div>
                    ) : null
                  })}
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">Results will be announced after the voting period ends.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Voting Status */}
      <VotingStatusCard />

      {/* Only show voting interface if voting is active */}
      {votingStatus === "active" && (
        <>
          {/* Progress Indicator */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Voting Progress</span>
                </div>
                <Badge variant={isComplete ? "default" : "secondary"}>
                  {totalSelections}/{totalPortfolios} portfolios
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(totalSelections / totalPortfolios) * 100}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {isComplete
                  ? "All selections complete! Ready to submit."
                  : `Select candidates for ${totalPortfolios - totalSelections} more portfolio(s).`}
              </p>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {portfoliosData.map((portfolio) => (
              <Card key={portfolio.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{portfolio.title}</CardTitle>
                      <CardDescription className="mt-1">{portfolio.description}</CardDescription>
                    </div>
                    {selectedCandidates[portfolio.id] && (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Selected
                      </Badge>
                    )}
                  </div>
                  {errors[portfolio.id] && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertDescription>{errors[portfolio.id]?.message}</AlertDescription>
                    </Alert>
                  )}
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {portfolio.candidates.map((candidate) => {
                      const isSelected = selectedCandidates[portfolio.id] === candidate.id
                      return (
                        <div
                          key={candidate.id}
                          className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md ${
                            isSelected
                              ? "border-blue-500 bg-blue-50 shadow-md"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => handleCandidateSelect(portfolio.id, candidate.id)}
                        >
                          {isSelected && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle className="h-5 w-5 text-blue-600" />
                            </div>
                          )}
                          <div className="text-center space-y-3">
                            <div className="relative mx-auto w-20 h-20">
                              <img
                                src={candidate.image || "/placeholder.svg"}
                                alt={`${candidate.firstName} ${candidate.lastName}`}
                                className="w-full h-full rounded-full object-cover border-2 border-gray-200"
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg text-gray-900">
                                {candidate.firstName} {candidate.lastName}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-3">{candidate.bio}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Submit Section */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <Clock className="h-5 w-5" />
                    <span>Review your selections before submitting</span>
                  </div>

                  {totalSelections > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
                      <h3 className="font-semibold mb-3">Your Current Selections:</h3>
                      <div className="space-y-2 text-sm">
                        {portfoliosData.map((portfolio) => {
                          const candidate = getSelectedCandidateInfo(portfolio.id)
                          return candidate ? (
                            <div key={portfolio.id} className="flex justify-between">
                              <span className="text-gray-600">{portfolio.title}:</span>
                              <span className="font-medium">
                                {candidate.firstName} {candidate.lastName}
                              </span>
                            </div>
                          ) : null
                        })}
                      </div>
                    </div>
                  )}

                  <Button type="submit" size="lg" disabled={!isComplete || isLoading} className="px-8">
                    {isLoading ? "Submitting..." : "Submit My Votes"}
                  </Button>

                  {!isComplete && (
                    <p className="text-sm text-gray-500">
                      Please select a candidate for all portfolios before submitting.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </form>

          <VoteConfirmationModal
            isOpen={showConfirmation}
            onClose={() => setShowConfirmation(false)}
            onConfirm={confirmSubmission}
            selections={selectedCandidates}
            portfolios={portfoliosData}
          />
        </>
      )}
    </div>
  )
}
