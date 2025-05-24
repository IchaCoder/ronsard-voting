"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, TrendingUp } from "lucide-react"

// Mock data for demonstration
const mockResults = {
  "Student Council President": {
    totalVotes: 145,
    candidates: [
      { name: "Sarah Johnson", votes: 67, percentage: 46.2, image: "/placeholder.svg?height=60&width=60" },
      { name: "Michael Chen", votes: 45, percentage: 31.0, image: "/placeholder.svg?height=60&width=60" },
      { name: "Emma Williams", votes: 33, percentage: 22.8, image: "/placeholder.svg?height=60&width=60" },
    ],
  },
  "Sports Captain": {
    totalVotes: 132,
    candidates: [
      { name: "David Rodriguez", votes: 78, percentage: 59.1, image: "/placeholder.svg?height=60&width=60" },
      { name: "Lisa Thompson", votes: 54, percentage: 40.9, image: "/placeholder.svg?height=60&width=60" },
    ],
  },
  "Head Boy/Girl": {
    totalVotes: 156,
    candidates: [
      { name: "Alex Parker", votes: 89, percentage: 57.1, image: "/placeholder.svg?height=60&width=60" },
      { name: "Jordan Smith", votes: 67, percentage: 42.9, image: "/placeholder.svg?height=60&width=60" },
    ],
  },
}

export function ResultsDisplay() {
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>("Student Council President")

  const currentResults = mockResults[selectedPortfolio as keyof typeof mockResults]
  const winner = currentResults?.candidates[0]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Live Results</h2>
          <p className="text-gray-600">Real-time voting results for all portfolios</p>
        </div>
        <div className="w-64">
          <Select value={selectedPortfolio} onValueChange={setSelectedPortfolio}>
            <SelectTrigger>
              <SelectValue placeholder="Select portfolio" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(mockResults).map((portfolio) => (
                <SelectItem key={portfolio} value={portfolio}>
                  {portfolio}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {currentResults && (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentResults.totalVotes}</div>
                <p className="text-xs text-muted-foreground">Cast for {selectedPortfolio}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Leading Candidate</CardTitle>
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{winner?.name}</div>
                <p className="text-xs text-muted-foreground">{winner?.percentage}% of votes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Candidates</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentResults.candidates.length}</div>
                <p className="text-xs text-muted-foreground">Running for this position</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Results for {selectedPortfolio}
                <Badge variant="secondary">Live</Badge>
              </CardTitle>
              <CardDescription>Current standings based on {currentResults.totalVotes} votes cast</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {currentResults.candidates.map((candidate, index) => (
                  <div key={candidate.name} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={candidate.image || "/placeholder.svg"}
                            alt={candidate.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          {index === 0 && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                              <Trophy className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{candidate.name}</h3>
                          <p className="text-sm text-gray-600">
                            {candidate.votes} votes ({candidate.percentage}%)
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{candidate.votes}</div>
                        <div className="text-sm text-gray-500">votes</div>
                      </div>
                    </div>
                    <Progress value={candidate.percentage} className="h-3" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Summary</CardTitle>
              <CardDescription>Overview of all portfolio results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(mockResults).map(([portfolio, data]) => (
                  <Card key={portfolio} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">{portfolio}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Total Votes:</span>
                          <span className="font-medium">{data.totalVotes}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Leading:</span>
                          <span className="font-medium">{data.candidates[0].name}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Lead Margin:</span>
                          <span className="font-medium">{data.candidates[0].percentage}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
