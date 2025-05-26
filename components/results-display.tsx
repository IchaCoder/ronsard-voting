"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, TrendingUp } from "lucide-react";
import { CandidateType } from "@/utils/types";
import { Categories } from "@/utils/enums";

type ResultsProps = {
  candidates: CandidateType[] | null;
};

export function ResultsDisplay({ candidates }: ResultsProps) {
  const [selectedPortfolio, setSelectedPortfolio] = useState<string>("head_girl");

  const transformedResults = useMemo(() => {
    if (!candidates || candidates.length === 0) return {};

    // Group candidates by portfolio
    const portfolioGroups: Record<string, CandidateType[]> = {};

    candidates.forEach((candidate) => {
      const portfolio = candidate.portfolio;
      if (!portfolioGroups[portfolio]) {
        portfolioGroups[portfolio] = [];
      }
      portfolioGroups[portfolio].push(candidate);
    });

    // Transform each portfolio group
    const result: Record<
      string,
      | {
          totalVotes: number;
          type: "multiple";
          candidates: Array<{
            name: string;
            votes: number;
            percentage: number;
            image: string;
          }>;
        }
      | {
          totalVotes: number;
          type: "single";
          candidate: {
            name: string;
            image: string;
            yesVotes: number;
            noVotes: number;
            yesPercentage: number;
            noPercentage: number;
          };
        }
    > = {};

    Object.entries(portfolioGroups).forEach(([portfolio, portfolioCandidates]) => {
      // Determine if this is a single-candidate or multiple-candidate portfolio
      if (portfolioCandidates.length === 1) {
        // Single candidate case (yes/no voting)
        const candidate = portfolioCandidates[0];
        const yesVotes = candidate.yes_votes || 0;
        const noVotes = candidate.no_votes || 0;
        const totalVotes = yesVotes + noVotes;

        const yesPercentage = totalVotes > 0 ? parseFloat(((yesVotes / totalVotes) * 100).toFixed(1)) : 0;
        const noPercentage = totalVotes > 0 ? parseFloat(((noVotes / totalVotes) * 100).toFixed(1)) : 0;

        // Add to result object
        result[portfolio] = {
          totalVotes,
          type: "single",
          candidate: {
            name: `${candidate.first_name} ${candidate.last_name}`,
            image: candidate.image || "/placeholder.svg?height=60&width=60",
            yesVotes,
            noVotes,
            yesPercentage,
            noPercentage,
          },
        };
      } else {
        // Multiple candidates case
        // Sort candidates by votes (highest first)
        const sortedCandidates = [...portfolioCandidates].sort((a, b) => (b.votes || 0) - (a.votes || 0));

        // Calculate total votes for this portfolio
        const totalVotes = sortedCandidates.reduce((sum, candidate) => sum + (candidate.votes || 0), 0);

        // Format each candidate
        const formattedCandidates = sortedCandidates.map((candidate) => {
          const votes = candidate.votes || 0;
          const percentage = totalVotes > 0 ? parseFloat(((votes / totalVotes) * 100).toFixed(1)) : 0;

          return {
            name: `${candidate.first_name} ${candidate.last_name}`,
            votes: votes,
            percentage: percentage,
            image: candidate.image || "/placeholder.svg?height=60&width=60",
          };
        });

        // Add to result object
        result[portfolio] = {
          totalVotes,
          type: "multiple",
          candidates: formattedCandidates,
        };
      }
    });

    return result;
  }, [candidates]);

  const currentResults = transformedResults[selectedPortfolio];
  const winner =
    currentResults?.type === "multiple"
      ? currentResults.candidates[0]
      : currentResults?.candidate?.yesPercentage > 50
      ? { name: currentResults.candidate.name, percentage: currentResults.candidate.yesPercentage }
      : null;

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
              {Object.keys(transformedResults).map((portfolio) => (
                <SelectItem key={portfolio} value={portfolio}>
                  {Categories[portfolio as keyof typeof Categories]}
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
                <div className="text-2xl font-bold">
                  {currentResults.type === "multiple" ? currentResults.candidates.length : 1}
                </div>
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
              {currentResults.type === "multiple" ? (
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
              ) : (
                <div className="space-y-6">
                  <div className="text-center space-y-4 p-6 bg-gray-50 rounded-lg">
                    <div className="relative mx-auto w-20 h-20">
                      <img
                        src={currentResults.candidate.image || "/placeholder.svg"}
                        alt={currentResults.candidate.name}
                        className="w-full h-full rounded-full object-cover border-2 border-gray-200"
                      />
                      {currentResults.candidate.yesPercentage > 50 && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                          <Trophy className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl text-gray-900">{currentResults.candidate.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">Single candidate - Yes/No voting</p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                          <div>
                            <h4 className="font-semibold text-lg text-green-700">YES</h4>
                            <p className="text-sm text-gray-600">
                              {currentResults.candidate.yesVotes} votes ({currentResults.candidate.yesPercentage}%)
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-700">{currentResults.candidate.yesVotes}</div>
                          <div className="text-sm text-gray-500">votes</div>
                        </div>
                      </div>
                      <Progress value={currentResults.candidate.yesPercentage} className="h-3" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                          <div>
                            <h4 className="font-semibold text-lg text-red-700">NO</h4>
                            <p className="text-sm text-gray-600">
                              {currentResults.candidate.noVotes} votes ({currentResults.candidate.noPercentage}%)
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-red-700">{currentResults.candidate.noVotes}</div>
                          <div className="text-sm text-gray-500">votes</div>
                        </div>
                      </div>
                      <Progress value={currentResults.candidate.noPercentage} className="h-3" />
                    </div>
                  </div>

                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">
                      {currentResults.candidate.yesPercentage > 50
                        ? `${currentResults.candidate.name} has been APPROVED with ${currentResults.candidate.yesPercentage}% support`
                        : `${currentResults.candidate.name} has been REJECTED with only ${currentResults.candidate.yesPercentage}% support`}
                    </p>
                  </div>
                </div>
              )}
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
                {Object.entries(transformedResults).map(([portfolio, data]) => (
                  <Card key={portfolio} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">{Categories[portfolio as keyof typeof Categories]}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Total Votes:</span>
                          <span className="font-medium">{data.totalVotes}</span>
                        </div>
                        {data.type === "multiple" ? (
                          <>
                            <div className="flex justify-between text-sm">
                              <span>Leading:</span>
                              <span className="font-medium">{data.candidates[0].name}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Lead Margin:</span>
                              <span className="font-medium">{data.candidates[0].percentage}%</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between text-sm">
                              <span>Candidate:</span>
                              <span className="font-medium">{data.candidate.name}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Approval:</span>
                              <span
                                className={`font-medium ${
                                  data.candidate.yesPercentage > 50 ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {data.candidate.yesPercentage}% YES
                              </span>
                            </div>
                          </>
                        )}
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
  );
}
