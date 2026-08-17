export type AppTheme = 'dark' | 'light';
export type AppLanguage = 'en' | 'bn' | 'both';
export type AppRoute = 'SHOMADHAN' | 'SCAMSHIELD';

export interface RequiredDocument {
  item_en: string;
  item_bn: string;
  is_mandatory: boolean;
}

export interface ActionStep {
  step_number: number;
  title_en: string;
  title_bn: string;
  details_en: string;
  details_bn: string;
  department_en?: string;
  department_bn?: string;
}

export interface VerifiedSource {
  title: string;
  url: string;
  domain_type: 'GOV' | 'OFFICIAL';
}

export interface OfficialLocation {
  name_en: string;
  name_bn: string;
  address_en: string;
  address_bn: string;
  hours: string;
  map_url?: string;
}

export interface ShomadhanOutput {
  problem_summary_en: string;
  problem_summary_bn: string;
  category: 'GOVERNMENT_SERVICE' | 'DOCUMENT_LOSS' | 'ACADEMIC' | 'FINANCIAL_CIVIC';
  required_documents: RequiredDocument[];
  action_steps: ActionStep[];
  verified_sources: VerifiedSource[];
  official_locations?: OfficialLocation[];
  pdf_template_type?: 'POLICE_GD_LOST_DOC' | 'BANK_DISPUTE_LETTER' | 'GENERAL_CLAIM';
}

export interface BoundingBox {
  box_2d: [number, number, number, number]; // [ymin, xmin, ymax, xmax] 0-1000 normalized
  label: string;
  risk?: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface ScamShieldOutput {
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  risk_score: number; // 0 to 100
  threat_indicators: string[];
  bounding_boxes?: BoundingBox[];
  immediate_safety_actions: string[];
}

export interface CivicGuardResponse {
  route_type: AppRoute;
  shomadhan_data?: ShomadhanOutput;
  scamshield_data?: ScamShieldOutput;
  voice_summary_bn: string;
}

export interface GdFormData {
  policeStation: string;
  district: string;
  applicantName: string;
  fatherName: string;
  phone: string;
  nidOrPassport: string;
  address: string;
  incidentType: string;
  lostItemDetails: string;
  incidentLocation: string;
  incidentDateTime: string;
  reason: string;
}

export interface BankDisputeFormData {
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  phone: string;
  transactionId: string;
  disputedAmount: string;
  disputeReason: string;
  fraudType: string;
  incidentDate: string;
}
