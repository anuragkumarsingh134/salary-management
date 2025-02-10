
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { NavBar } from "@/components/NavBar";

const LoadingSkeleton = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <div className="container py-8 flex-1 flex flex-col space-y-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-32" />
          <div className="space-x-4">
            <Skeleton className="h-10 w-32 inline-block" />
            <Skeleton className="h-10 w-32 inline-block" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
