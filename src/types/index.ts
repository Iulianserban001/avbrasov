// ============================================================
// Core Types for Avocat Brașov Legal SEO Platform
// ============================================================

// === USER & AUTH ===
export type UserRole = "OWNER" | "ADMIN" | "EDITOR" | "LEGAL_REVIEWER" | "SEO_ANALYST";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  bio?: string;
  barMembership?: string;
  credentials?: string;
  practiceAreas: string[];
  yearsExp?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// === PAGE ===
export type PageType =
  | "HOMEPAGE"
  | "MONEY_PAGE"
  | "SERVICE_HUB"
  | "SERVICE_DETAIL"
  | "LOCALITY"
  | "ATTORNEY_PROFILE"
  | "GUIDE"
  | "FAQ_PAGE"
  | "CONTACT"
  | "LEGAL_PAGE";

export type PageStatus =
  | "DRAFT"
  | "IN_REVIEW"
  | "APPROVED"
  | "SCHEDULED"
  | "PUBLISHED"
  | "UPDATE_REQUIRED"
  | "ARCHIVED";

export interface ContentBlock {
  id: string;
  type: "heading" | "paragraph" | "faq" | "list" | "cta" | "trust" | "local" | "process" | "documents" | "timeline" | "eligibility" | "image";
  content: string;
  metadata?: Record<string, unknown>;
}

export interface HeadingEntry {
  level: number;
  text: string;
  id: string;
}

export interface BreadcrumbEntry {
  label: string;
  url: string;
}

export interface Page {
  id: string;
  slug: string;
  pageType: PageType;
  status: PageStatus;

  // SEO
  title: string;
  metaDescription?: string;
  canonicalUrl?: string;
  noIndex: boolean;
  noFollow: boolean;
  targetKeyword?: string;

  // Content
  h1: string;
  content: ContentBlock[];
  excerpt?: string;
  featuredImage?: string;
  headings: HeadingEntry[];

  // Schema
  schemaType?: string;
  schemaData?: Record<string, unknown>;

  // Authorship
  authorId?: string;
  authorName?: string;
  reviewerId?: string;
  reviewerName?: string;
  reviewedAt?: string;
  legalDisclaimer: boolean;

  // Locality & Service
  localityId?: string;
  localityName?: string;
  serviceId?: string;
  serviceName?: string;

  // Freshness
  publishedAt?: string;
  updatedContentAt?: string;
  nextReviewDate?: string;

  // Linking
  relatedPages: string[];
  breadcrumbs: BreadcrumbEntry[];

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// === LEGAL SERVICE ===
export interface LegalService {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  icon?: string;

  // Template fields
  eligibility?: string;
  process?: string;
  documents?: string;
  timelines?: string;
  costs?: string;

  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// === LOCALITY ===
export type LocalityType = "MUNICIPALITY" | "CITY" | "COMMUNE" | "VILLAGE";

export interface Locality {
  id: string;
  name: string;
  slug: string;
  type: LocalityType;
  countyId?: string;
  countyName?: string;

  population?: number;
  courtName?: string;
  notaryOffices?: string;
  localFaqs?: FaqItem[];
  localReferences?: Record<string, string>;
  zipCode?: string;
  latitude?: number;
  longitude?: number;

  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// === FAQ ===
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
}

// === INTERNAL LINK ===
export interface InternalLink {
  id: string;
  sourcePageId: string;
  sourcePageTitle?: string;
  sourcePageSlug?: string;
  targetPageId: string;
  targetPageTitle?: string;
  targetPageSlug?: string;
  anchorText: string;
  context?: string;
  isAutomatic: boolean;
  isSuggested: boolean;
  isApproved: boolean;
  createdAt: string;
}

// === ANALYZER ===
export interface AnalysisScores {
  seoScore: number;
  technicalSeoScore: number;
  contentQualityScore: number;
  eeatScore: number;
  localRelevanceScore: number;
  aiSearchReadiness: number;
  conversionClarityScore: number;
  internalLinkingScore: number;
  freshnessScore: number;
  riskScore: number;
  overallScore: number;
}

export type IssueSeverity = "critical" | "warning" | "info" | "success";
export type IssuePriority = "high" | "medium" | "low";

export interface AnalysisIssue {
  id: string;
  category: string;
  severity: IssueSeverity;
  message: string;
  recommendation: string;
  impact: IssuePriority;
  dimension: keyof Omit<AnalysisScores, "overallScore">;
}

export interface PageAnalysis {
  id: string;
  pageId: string;
  pageTitle?: string;
  pageSlug?: string;
  scores: AnalysisScores;
  issues: AnalysisIssue[];
  analyzedAt: string;
}

// === SEARCH PERFORMANCE (GSC mock) ===
export interface SearchPerformanceEntry {
  id: string;
  pageUrl: string;
  query?: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  device?: string;
  country?: string;
  date: string;
}

// === CRAWL RESULT ===
export interface CrawlResult {
  id: string;
  url: string;
  statusCode?: number;
  responseTime?: number;
  title?: string;
  metaDescription?: string;
  h1?: string;
  canonicalUrl?: string;
  isIndexable: boolean;
  issues?: { type: string; severity: IssueSeverity; message: string }[];
  crawledAt: string;
}

// === AUDIT LOG ===
export interface AuditLogEntry {
  id: string;
  userId: string;
  userName?: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: Record<string, unknown>;
  createdAt: string;
}

// === SITE SETTINGS ===
export interface SiteSettings {
  firmName: string;
  firmPhone: string;
  firmEmail: string;
  firmAddress: string;
  firmCity: string;
  firmCounty: string;
  firmZipCode: string;
  firmLatitude: number;
  firmLongitude: number;
  firmDescription: string;
  socialFacebook?: string;
  socialLinkedIn?: string;
  socialInstagram?: string;
  googleMapsEmbed?: string;
  metaTitleSuffix: string;
  defaultOgImage?: string;
}

// === DASHBOARD STATS ===
export interface DashboardStats {
  totalPages: number;
  publishedPages: number;
  draftPages: number;
  pagesNeedingFix: number;
  avgSeoScore: number;
  avgContentScore: number;
  avgEeatScore: number;
  orphanPages: number;
  thinContentPages: number;
  pagesWithWeakMeta: number;
  pagesWithNoTrustSignals: number;
  pagesInReview: number;
  totalServices: number;
  totalLocalities: number;
  totalLinks: number;
}
