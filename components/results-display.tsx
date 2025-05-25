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

  const selectedResults = useMemo(() => {
    const filtered = candidates?.filter((candidate) => candidate.portfolio === selectedPortfolio) || [];
    const sortedCandidates = [...filtered].sort((a, b) => (b.votes || 0) - (a.votes || 0));

    // Calculate total votes
    const totalVotes = sortedCandidates.reduce((sum, candidate) => sum + (candidate.votes || 0), 0);

    // Create formatted candidates array with percentages
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

    return {
      totalVotes,
      candidates: formattedCandidates,
    };
  }, [candidates, selectedPortfolio]);

  const winner = selectedResults?.candidates?.[0];

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
      {
        totalVotes: number;
        candidates: Array<{
          name: string;
          votes: number;
          percentage: number;
          image: string;
        }>;
      }
    > = {};

    Object.entries(portfolioGroups).forEach(([portfolio, portfolioCandidates]) => {
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
        candidates: formattedCandidates,
      };
    });

    return result;
  }, [candidates]);

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
              {Object.entries(Categories).map(([key, portfolio]) => (
                <SelectItem key={key} value={key}>
                  {portfolio}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedResults && (
        <>
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{selectedResults?.totalVotes}</div>
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
                <div className="text-2xl font-bold">{selectedResults?.candidates.length}</div>
                <p className="text-xs text-muted-foreground">Running for this position</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Results for {Categories[selectedPortfolio as keyof typeof Categories]}
                <Badge variant="secondary">Live</Badge>
              </CardTitle>
              <CardDescription>Current standings based on {selectedResults?.totalVotes} votes cast</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {selectedResults?.candidates?.map((candidate, index) => (
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
                {Object.entries(transformedResults).map(([portfolio, data]) => (
                  <Card key={portfolio} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">{Categories[portfolio as keyof typeof Categories]}</h4>
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
  );
}
