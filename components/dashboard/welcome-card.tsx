"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

interface WelcomeCardProps {
  userName: string;
  testsToComplete: number;
  progressPercentage: number;
}

export function WelcomeCard({
  userName,
  testsToComplete,
  progressPercentage,
}: WelcomeCardProps) {
  const router = useRouter();

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 text-white">
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Welcome back, {userName}! 👋</h2>
            <p className="text-blue-100">
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Daily Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-2 bg-blue-500/30" 
              indicatorClassName="bg-white"
            />
            <p className="text-sm text-blue-100">
              You have <span className="font-semibold text-white">{testsToComplete} tests</span> remaining today
            </p>
          </div>

          <Button
            onClick={() => router.push("/tests")}
            className="bg-white text-blue-600 hover:bg-white/90 transition-colors"
          >
            Continue Learning
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="w-48 h-48 relative shrink-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-600/20 rounded-full" />
          <Image
            src="/cubestar-logo.webp"
            alt="Doctor illustration"
            fill
            className="object-contain rounded-full"
          />
        </div>
      </div>
    </Card>
  );
} 