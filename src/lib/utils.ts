import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  const romanianMap: Record<string, string> = {
    ă: "a", â: "a", î: "i", ș: "s", ț: "t",
    Ă: "A", Â: "A", Î: "I", Ș: "S", Ț: "T",
  };
  return text
    .split("")
    .map((char) => romanianMap[char] || char)
    .join("")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatDate(date: Date | string | number): string {
  return new Intl.DateTimeFormat("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trimEnd() + "…";
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  if (score >= 40) return "text-orange-400";
  return "text-red-400";
}

export function getScoreBgColor(score: number): string {
  if (score >= 80) return "bg-emerald-500/20 border-emerald-500/30";
  if (score >= 60) return "bg-amber-500/20 border-amber-500/30";
  if (score >= 40) return "bg-orange-500/20 border-orange-500/30";
  return "bg-red-500/20 border-red-500/30";
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return "Excelent";
  if (score >= 80) return "Foarte bine";
  if (score >= 70) return "Bine";
  if (score >= 60) return "Acceptabil";
  if (score >= 40) return "Necesită îmbunătățiri";
  return "Critic";
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
