// ============================================================
// Analyzer Engine Types
// ============================================================

import type { Page, AnalysisScores, AnalysisIssue, InternalLink } from "@/types";

export interface AnalyzerInput {
  page: Page;
  allPages: Page[];
  internalLinks: InternalLink[];
  siteSettings?: {
    firmName: string;
    firmPhone: string;
    firmAddress: string;
  };
}

export interface DimensionResult {
  score: number;
  issues: AnalysisIssue[];
}

export interface FullAnalysisResult {
  scores: AnalysisScores;
  issues: AnalysisIssue[];
}

export type ScoreDimension = keyof Omit<AnalysisScores, "overallScore">;

export interface CheckResult {
  passed: boolean;
  score: number; // 0-100 for this specific check
  message: string;
  recommendation: string;
  severity: "critical" | "warning" | "info" | "success";
  impact: "high" | "medium" | "low";
}
