import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="space-y-8">
      {/* Voting Status Card Skeleton */}
      <Card className="border-gray-200">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-40" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full mx-auto max-w-md" />
              <Skeleton className="h-4 w-full mx-auto max-w-md" />
            </div>
            <div className="bg-gray-100 rounded-lg p-4">
              <Skeleton className="h-5 w-48 mx-auto mb-2" />
              <Skeleton className="h-8 w-32 mx-auto" />
            </div>
            <Skeleton className="h-4 w-full mx-auto max-w-md" />
          </div>
        </CardContent>
      </Card>

      {/* Progress Indicator Skeleton */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-32" />
            </div>
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gray-300 h-2 rounded-full w-1/4" />
          </div>
          <Skeleton className="h-4 w-64 mt-2" />
        </CardContent>
      </Card>

      {/* Portfolio Cards Skeleton */}
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="relative rounded-lg border-2 border-gray-200 p-4">
                  <div className="text-center space-y-3">
                    <Skeleton className="h-20 w-20 rounded-full mx-auto" />
                    <div>
                      <Skeleton className="h-5 w-32 mx-auto" />
                      <Skeleton className="h-4 w-full mt-1" />
                      <Skeleton className="h-4 w-3/4 mx-auto mt-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Submit Section Skeleton */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-64" />
            </div>
            <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
              <Skeleton className="h-5 w-40 mb-3 mx-auto" />
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </div>
            </div>
            <Skeleton className="h-10 w-40 mx-auto rounded-md" />
            <Skeleton className="h-4 w-80 mx-auto" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Loading;
