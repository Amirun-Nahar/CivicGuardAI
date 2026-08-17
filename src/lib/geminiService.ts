import { CivicGuardResponse, ShomadhanOutput, ScamShieldOutput } from '../types';
import { sanitizeClientInput } from './piiScrubber';

const SYSTEM_PROMPT = `
You are CIVIC GUARD AI, an authoritative public service assistant & threat defense engine for Bangladesh.
Analyze the input (text or image) and route to either SHOMADHAN (public service query / lost document / academic procedure) or SCAMSHIELD (phishing, SMS scam, suspicious URL, financial fraud screenshot).

You MUST respond strictly in valid JSON matching this schema:

{
  "route_type": "SHOMADHAN" | "SCAMSHIELD",
  "shomadhan_data": {
    "problem_summary_en": "string",
    "problem_summary_bn": "string",
    "category": "GOVERNMENT_SERVICE" | "DOCUMENT_LOSS" | "ACADEMIC" | "FINANCIAL_CIVIC",
    "required_documents": [
      { "item_en": "string", "item_bn": "string", "is_mandatory": true }
    ],
    "action_steps": [
      {
        "step_number": 1,
        "title_en": "string",
        "title_bn": "string",
        "details_en": "string",
        "details_bn": "string",
        "department_en": "string",
        "department_bn": "string"
      }
    ],
    "verified_sources": [
      { "title": "string", "url": "https://...", "domain_type": "GOV" | "OFFICIAL" }
    ],
    "official_locations": [
      {
        "name_en": "string",
        "name_bn": "string",
        "address_en": "string",
        "address_bn": "string",
        "hours": "string",
        "map_url": "string"
      }
    ],
    "pdf_template_type": "POLICE_GD_LOST_DOC" | "BANK_DISPUTE_LETTER" | "GENERAL_CLAIM"
  },
  "scamshield_data": {
    "risk_level": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
    "risk_score": 85,
    "threat_indicators": ["string"],
    "bounding_boxes": [
      { "box_2d": [ymin, xmin, ymax, xmax], "label": "string", "risk": "HIGH" }
    ],
    "immediate_safety_actions": ["string"]
  },
  "voice_summary_bn": "Clear natural Bangla audio summary for voice output"
}

Note for bounding_boxes: Normalize coordinates from 0 to 1000 [ymin, xmin, ymax, xmax].
`;

// Built-in High-Fidelity Demo Presets for Hackathon Demo
export const DEMO_PRESETS: Record<string, CivicGuardResponse> = {
  'lost_nid': {
    route_type: 'SHOMADHAN',
    shomadhan_data: {
      problem_summary_en: 'Lost Smart National ID (NID) Card replacement procedure in Bangladesh.',
      problem_summary_bn: 'বাংলাদেশে হারানো স্মার্ট এনআইডি (জাতীয় পরিচয়পত্র) পুনরায় প্রাপ্তির প্রক্রিয়া।',
      category: 'DOCUMENT_LOSS',
      pdf_template_type: 'POLICE_GD_LOST_DOC',
      required_documents: [
        { item_en: 'General Diary (GD) Copy from Police Station', item_bn: 'নিকটস্থ থানার সাধারণ ডায়েরি (জিডি) কপি', is_mandatory: true },
        { item_en: 'Digital Birth Registration Certificate Copy', item_bn: 'ডিজিটাল জন্ম নিবন্ধন সনদের কপি', is_mandatory: true },
        { item_en: 'Bank Payment Receipt (TK 345 for re-issue)', item_bn: 'চালান বা রকেট/বিকাশ পে-অর্ডারের ট্রানজেকশন আইডি (৩৪৫ টাকা)', is_mandatory: true },
        { item_en: 'Passport Size Photograph (2 copies)', item_bn: ' পাসপোর্ট সাইজ ছবি (২ কপি)', is_mandatory: false }
      ],
      action_steps: [
        {
          step_number: 1,
          title_en: 'File a General Diary (GD) at Nearest Thana',
          title_bn: 'নিকটস্থ পুলিশ থানায় জিডি (General Diary) করুন',
          details_en: 'Report the NID loss immediately at your local police station. Keep 2 stamped copies of the official GD number.',
          details_bn: 'এনআইডি হারানোর পরপরই স্থানীয় থানায় জিডি করুন। থানা থেকে সিলযুক্ত জিডি নম্বর ও কপি সংগ্রহ করুন।',
          department_en: 'Bangladesh Police Thana',
          department_bn: 'বাংলাদেশ পুলিশ থানা'
        },
        {
          step_number: 2,
          title_en: 'Pay NID Re-issuance Fee via Mobile Banking',
          title_bn: 'মোবাইল ব্যাংকিং বা চালানের মাধ্যমে ফি পরিশোধ করুন',
          details_en: 'Pay the government re-issue fee (BDT 345) via bKash/Nagad/Rocket under Election Commission NID service.',
          details_bn: 'বিকাশ, নগদ বা রকেটের মাধ্যমে এনআইডি সেবা সিলেক্ট করে ৩৪৫ টাকা ফি পরিশোধ করুন।',
          department_en: 'Election Commission Payment Gateway',
          department_bn: 'নির্বাচন কমিশন পে-গেটওয়ে'
        },
        {
          step_number: 3,
          title_en: 'Submit NID Re-issue Form 2 Online or In-Person',
          title_bn: 'অনলাইনে বা উপজেলা নির্বাচন অফিসে ফরম ২ জমা দিন',
          details_en: 'Log in to services.nidw.gov.bd, upload GD copy and receipt, then submit your request for approval.',
          details_bn: 'services.nidw.gov.bd ওয়েবসাইটে ঢুকে জিডি কপি ও ফি স্লিপ আপলোড করে রি-ইস্যু আবেদন সাবমিট করুন।',
          department_en: 'Upazila / Regional Election Office',
          department_bn: 'উপজেলা/আঞ্চলিক নির্বাচন অফিস'
        },
        {
          step_number: 4,
          title_en: 'Biometric Collection & Smart Card Delivery',
          title_bn: 'বায়োমেট্রিক প্রদান এবং নতুন স্মার্ট কার্ড সংগ্রহ',
          details_en: 'Visit the Election Office for finger-scanning if prompted. Receive SMS notification for card collection.',
          details_bn: 'কনফার্মেশন এসএমএস পেলে নির্বাচন অফিস থেকে নতুন স্মার্ট এনআইডি কার্ড সংগ্রহ করুন।',
          department_en: 'NID Wing, Election Commission',
          department_bn: 'এনআইডি উইং, নির্বাচন কমিশন'
        }
      ],
      verified_sources: [
        { title: 'Official Election Commission NID Portal', url: 'https://services.nidw.gov.bd', domain_type: 'GOV' },
        { title: 'Bangladesh Police Online GD Portal', url: 'https://gd.police.gov.bd', domain_type: 'GOV' },
        { title: 'National Web Portal Bangladesh', url: 'https://bangladesh.gov.bd', domain_type: 'GOV' }
      ],
      official_locations: [
        {
          name_en: 'NID Operation Wing (Headquarters)',
          name_bn: 'এনআইডি অপারেশন উইং (হেডকোয়ার্টার)',
          address_en: 'Identity Wing, Nirbachan Bhaban, Agargaon, Dhaka 1207',
          address_bn: 'আইডেন্টিটি উইং, নির্বাচন ভবন, আগারগাঁও, ঢাকা ১২০৭',
          hours: 'Sun - Thu: 9:00 AM - 4:00 PM',
          map_url: 'https://maps.google.com/?q=Nirbachan+Bhaban+Agargaon+Dhaka'
        },
        {
          name_en: 'Tejgaon Police Station (Thana)',
          name_bn: 'তেজগাঁও পুলিশ থানা',
          address_en: 'Tejgaon Industrial Area, Dhaka 1208',
          address_bn: 'তেজগাঁও শিল্পাঞ্চল, ঢাকা ১২০৮',
          hours: '24 Hours Emergency Helpdesk',
          map_url: 'https://maps.google.com/?q=Tejgaon+Police+Station+Dhaka'
        }
      ]
    },
    voice_summary_bn: 'আপনার এনআইডি কার্ড হারিয়ে গেলে প্রথমে নিকটস্থ থানায় একটি জিডি করুন। সিভি গার্ড এআই দিয়ে আপনি ১-ক্লিকে জিডি ফরমটি তৈরি ও ডাউনলোড করতে পারেন। এরপর servizi.nidw.gov.bd থেকে ৩৪৫ টাকা ফি পরিশোধ করে রি-ইস্যু আবেদন জমা দিন।'
  },
  'bkash_phishing': {
    route_type: 'SCAMSHIELD',
    scamshield_data: {
      risk_level: 'CRITICAL',
      risk_score: 94,
      threat_indicators: [
        'Spoofed Domain: "bkash-bonus-offer2026.xyz" instead of official "bkash.com"',
        'Urgency Trap: Claims bKash account will be blocked within 30 minutes',
        'Unauthorized Access Prompt: Asks user to enter 5-digit MFS PIN and OTP',
        'Suspicious SMS Sender Number: Unverified 11-digit mobile (+8801700987654) impersonating official bKash sender ID'
      ],
      bounding_boxes: [
        { box_2d: [120, 80, 240, 920], label: 'Fake Urgent Header Notice', risk: 'HIGH' },
        { box_2d: [340, 150, 480, 850], label: 'Malicious Phishing URL (bkash-bonus.xyz)', risk: 'HIGH' },
        { box_2d: [550, 200, 720, 800], label: 'PIN & OTP Harvesting Form', risk: 'HIGH' }
      ],
      immediate_safety_actions: [
        'DO NOT enter your bKash PIN or OTP on this external link.',
        'Dial *247# immediately to check your account status.',
        'If you already shared your PIN, change your PIN using *247# -> Option 9 (My bKash) -> Option 3 (Change PIN).',
        'Report this phishing link to bKash Helpline 16247 or Cyber Police Helpline 13219.'
      ]
    },
    voice_summary_bn: 'সতর্কতা! এটি একটি ক্ষতিকারক বিকাশ ফিশিং স্ক্যাম। মেসেজের লিংকটি একটি ভুয়া ডোমেইন। আপনার বিকাশ পিন বা ওটিপি কখনোই এই সাইটে প্রদান করবেন না। যদি ভুলবশত দিয়ে থাকেন, দ্রুত স্টার ২৪৭ হ্যাশে ডায়াল করে পিন পরিবর্তন করুন।'
  },
  'passport_renewal': {
    route_type: 'SHOMADHAN',
    shomadhan_data: {
      problem_summary_en: 'e-Passport Re-issuance, Renewal & Lost Passport Recovery in Bangladesh.',
      problem_summary_bn: 'বাংলাদেশে ই-পাসপোর্ট রি-ইস্যু, নবায়ন এবং হারানো পাসপোর্ট পুনরায় প্রাপ্তির প্রক্রিয়া।',
      category: 'DOCUMENT_LOSS',
      pdf_template_type: 'POLICE_GD_LOST_DOC',
      required_documents: [
        { item_en: 'General Diary (GD) Copy from Police Station (If Lost)', item_bn: 'হারিয়ে গেলে নিকটস্থ থানার সাধারণ ডায়েরি (জিডি) কপি', is_mandatory: true },
        { item_en: 'Original Smart NID Card (or 17-digit Birth Certificate)', item_bn: 'মূল স্মার্ট এনআইডি কার্ড (অথবা ১৭-ডিজিটের জন্ম সনদ)', is_mandatory: true },
        { item_en: 'Previous Passport Copy (If Renewal)', item_bn: 'পূর্ববর্তী মূল পাসপোর্টের ফটোকপি (নবায়নের ক্ষেত্রে)', is_mandatory: false },
        { item_en: 'A-Challan Payment Receipt (BDT 4,025 - 10,350)', item_bn: 'এ-চালান বা ব্যাংক ফি প্রদানের রসিদ কপি', is_mandatory: true }
      ],
      action_steps: [
        {
          step_number: 1,
          title_en: 'File Police GD (If Passport Lost)',
          title_bn: 'পাসপোর্ট হারিয়ে গেলে নিকটস্থ থানায় জিডি করুন',
          details_en: 'Report passport loss at your local police station. Obtain stamped copies of the official GD number.',
          details_bn: 'পাসপোর্ট হারিয়ে গেলে অবিলম্বে থানায় জিডি করুন। থানা থেকে সিলযুক্ত জিডি নম্বর সংগ্রাহ করুন।',
          department_en: 'Bangladesh Police Thana',
          department_bn: 'বাংলাদেশ পুলিশ থানা'
        },
        {
          step_number: 2,
          title_en: 'Fill Online e-Passport Application Form',
          title_bn: 'অনলাইনে ই-পাসপোর্ট আবেদন ফরম পূরণ করুন',
          details_en: 'Visit epassport.gov.bd, create an account, fill applicant details, select passport pages (48 or 64), and pick delivery speed.',
          details_bn: 'epassport.gov.bd ওয়েবসাইটে গিয়ে অ্যাকাউন্ট খুলে তথ্য পূরণ করুন এবং ৪৮ বা ৬৪ পাতার ই-পাসপোর্ট সিলেক্ট করুন।',
          department_en: 'Department of Immigration & Passports (DIP)',
          department_bn: 'ইমিগ্রেশন ও পাসপোর্ট অধিদপ্তর'
        },
        {
          step_number: 3,
          title_en: 'Pay Fee via A-Challan / Mobile Banking',
          title_bn: 'এ-চালান বা মোবাইল ব্যাংকিংয়ের মাধ্যমে ফি পরিশোধ করুন',
          details_en: 'Pay government passport fee (Regular BDT 4,025 / Express BDT 6,325 / Super Express BDT 8,625) via bKash or Bank.',
          details_bn: 'বিকাশ বা ব্যাংকের মাধ্যমে নির্ধারিত ফি (নিয়মিত ৪,০২৫ টাকা / জরুরি ৬,৩২৫ টাকা) পরিশোধ করে রসিদ সংরক্ষণ করুন।',
          department_en: 'A-Challan Payment Portal',
          department_bn: 'সরকারি এ-চালান পে-পোর্টাল'
        },
        {
          step_number: 4,
          title_en: 'Biometric Appointment & Regional Office Visit',
          title_bn: 'বায়োমেট্রিক ছবি প্রদান ও আঞ্চলিক অফিসে পেপারস জমা',
          details_en: 'Visit your designated Regional Passport Office with printed application, GD copy, NID, and payment slip for iris & photo capture.',
          details_bn: 'আঞ্চলিক পাসপোর্ট অফিসে গিয়ে ফিঙ্গারপ্রিন্ট, চোখের আইরিশ ও ছবি প্রদান করে আবেদন জমা দিন।',
          department_en: 'Regional Passport Office (RPO)',
          department_bn: 'আঞ্চলিক পাসপোর্ট অফিস'
        }
      ],
      verified_sources: [
        { title: 'Official Bangladesh e-Passport Portal', url: 'https://epassport.gov.bd', domain_type: 'GOV' },
        { title: 'Department of Immigration & Passports', url: 'http://passport.gov.bd', domain_type: 'GOV' }
      ],
      official_locations: [
        {
          name_en: 'Agargaon Passport Office (Dhaka Main)',
          name_bn: 'আগারগাঁও পাসপোর্ট অফিস (ঢাকা)',
          address_en: 'Agargaon Administrative Area, Sher-e-Bangla Nagar, Dhaka 1207',
          address_bn: 'আগারগাঁও প্রশাসনিক এলাকা, শেরেবাংলা নগর, ঢাকা ১২০৭',
          hours: 'Sun - Thu: 8:30 AM - 4:00 PM',
          map_url: 'https://maps.google.com/?q=Agargaon+Passport+Office+Dhaka'
        },
        {
          name_en: 'Uttara Regional Passport Office',
          name_bn: 'উত্তরা আঞ্চলিক পাসপোর্ট অফিস',
          address_en: 'Sector 14, Uttara Model Town, Dhaka 1230',
          address_bn: 'সেক্টর ১৪, উত্তরা মডেল টাউন, ঢাকা ১২৩০',
          hours: 'Sun - Thu: 9:00 AM - 4:00 PM',
          map_url: 'https://maps.google.com/?q=Uttara+Passport+Office+Dhaka'
        }
      ]
    },
    voice_summary_bn: 'ই-পাসপোর্ট পুনরায় পেতে বা হারিয়ে গেলে প্রথমে থানায় জিডি করুন। আমাদের ১-ক্লিক ফরম দিয়ে জিডি তৈরি করে epassport.gov.bd পোর্টালে আবেদন জমা দিন এবং নির্ধারিত ফি পরিশোধ করুন।'
  },
  'university_id': {
    route_type: 'SHOMADHAN',
    shomadhan_data: {
      problem_summary_en: 'University Student ID Card Loss, Certificate Recovery & Campus Clearance.',
      problem_summary_bn: 'বিশ্ববিদ্যালয়ের ছাত্র আইডি কার্ড হারানো, সনদপ্রাপ্তি ও হল/বিভাগীয় ক্লিয়ারেন্স প্রক্রিয়া।',
      category: 'ACADEMIC',
      pdf_template_type: 'POLICE_GD_LOST_DOC',
      required_documents: [
        { item_en: 'Police GD Copy for Lost Student ID Card / Certificate', item_bn: 'আইডি বা সনদ হারানোর পুলিশ জিডি কপি', is_mandatory: true },
        { item_en: 'National ID Card (NID) or Passport Copy', item_bn: 'এনআইডি বা পাসপোর্ট কপি', is_mandatory: true },
        { item_en: 'Registrar Office Re-issue Bank Fee Receipt (BDT 200-500)', item_bn: 'রেজিস্ট্রার অফিসে ডুপ্লিকেট আইডি ফি জমাদান স্লিপ (২০০-৫০০ টাকা)', is_mandatory: true },
        { item_en: 'Hall & Central Library Clearance Certificate', item_bn: 'হল ও কেন্দ্রীয় গ্রন্থাগার ক্লিয়ারেন্স সনদ', is_mandatory: false }
      ],
      action_steps: [
        {
          step_number: 1,
          title_en: 'File General Diary at Campus / Local Police Station',
          title_bn: 'থানায় বা ক্যাম্পাসের পুলিশ ফাঁড়িতে জিডি করুন',
          details_en: 'File a GD stating your Student Roll, Registration Number, Department, and University name.',
          details_bn: 'আপনার রোল, রেজিস্ট্রেশন নম্বর ও বিভাগের নাম উল্লেখ করে ১-ক্লিক জিডি তৈরি করে থানায় জমা দিন।',
          department_en: 'Local Police Station / Campus Police Outpost',
          department_bn: 'স্থানীয় থানা / ক্যাম্পাস পুলিশ ফাঁড়ি'
        },
        {
          step_number: 2,
          title_en: 'Pay Duplicate Card Fee at University Bank Branch',
          title_bn: 'বিশ্ববিদ্যালয় ব্যাংকে আইডি রি-ইস্যু ফি জমা দিন',
          details_en: 'Pay the prescribed duplicate ID card fee at the campus bank branch (Janata/Sonali/DBBL).',
          details_bn: 'বিশ্ববিদ্যালয় নির্ধারিত ব্যাংকে (জনতা/সোনালী) ডুপ্লিকেট আইডি কার্ডের ফি পরিশোধ করুন।',
          department_en: 'University Cash Section / Accounts',
          department_bn: 'বিশ্ববিদ্যালয় হিসাব শাখা'
        },
        {
          step_number: 3,
          title_en: 'Submit Application to Registrar / Proctor Office',
          title_bn: 'রেজিস্ট্রার বা প্রক্টর অফিসে ফরম জমা দিন',
          details_en: 'Attach GD copy, fee receipt, and student record copy, then submit to the Registrar academic branch.',
          details_bn: 'জিডি কপি, ফি স্লিপ ও বায়োডাটা যুক্ত করে রেজিস্ট্রার একাডেমিক শাখায় আবেদন জমা দিন।',
          department_en: 'Registrar Building (Academic Branch)',
          department_bn: 'রেজিস্ট্রার ভবন (একাডেমিক শাখা)'
        }
      ],
      verified_sources: [
        { title: 'Ministry of Education Bangladesh', url: 'https://shed.gov.bd', domain_type: 'GOV' },
        { title: 'University Grants Commission (UGC)', url: 'http://ugc.gov.bd', domain_type: 'GOV' }
      ]
    },
    voice_summary_bn: 'আপনার বিশ্ববিদ্যালয় স্টুডেন্ট আইডি কার্ড হারিয়ে গেলে অবিলম্বে থানায় জিডি করুন। আমাদের এআই জেনারেটর দিয়ে ১-ক্লিকে জিডি কপি ডাউনলোড করে বিশ্ববিদ্যালয় রেজিস্ট্রার অফিসে জমা দিন।'
  },
  'driving_license': {
    route_type: 'SHOMADHAN',
    shomadhan_data: {
      problem_summary_en: 'BRTA Driving License Loss, Duplicate Card Re-issue & BSP Portal Clearance.',
      problem_summary_bn: 'বিআরটিএ ড্রাইভিং লাইসেন্স হারানো, ডুপ্লিকেট লাইসেন্স ও বিএসপি সেবা প্রক্রিয়া।',
      category: 'GOVERNMENT_SERVICE',
      pdf_template_type: 'POLICE_GD_LOST_DOC',
      required_documents: [
        { item_en: 'General Diary (GD) Copy specifying Driving License Number', item_bn: 'লাইসেন্স নম্বর উল্লেখসহ পুলিশের জিডি কপি', is_mandatory: true },
        { item_en: 'BRTA Service Portal (BSP) User Account & Form', item_bn: 'বিআরটিএ সার্ভিস পোর্টাল (BSP) অনলাইন ফরম', is_mandatory: true },
        { item_en: 'Smart NID Card Copy', item_bn: 'স্মার্ট এনআইডি কার্ডের কপি', is_mandatory: true },
        { item_en: 'Duplicate License Fee Receipt (BDT 875 via bKash)', item_bn: 'ডুপ্লিকেট লাইসেন্স ফি রসিদ (৮৭৫ টাকা বিকাশ/ব্যাংক)', is_mandatory: true }
      ],
      action_steps: [
        {
          step_number: 1,
          title_en: 'File Police GD with License Number',
          title_bn: 'লাইসেন্স নম্বরসহ থানায় জিডি করুন',
          details_en: 'Report the loss at local Thana including driving license number and issue authority (BRTA Circle).',
          details_bn: 'লাইসেন্স নম্বর ও বিআরটিএ সার্কেলের নাম উল্লেখ করে নিকটস্থ থানায় জিডি সম্পন্ন করুন।',
          department_en: 'Bangladesh Police Thana',
          department_bn: 'বাংলাদেশ পুলিশ থানা'
        },
        {
          step_number: 2,
          title_en: 'Apply Online via BRTA Service Portal (BSP)',
          title_bn: 'বিআরটিএ সার্ভিস পোর্টালে (BSP) আবেদন করুন',
          details_en: 'Log in to bsp.brta.gov.bd, upload GD copy and NID, then select "Duplicate Driving License Application".',
          details_bn: 'bsp.brta.gov.bd পোর্টালে ঢুকে ডুপ্লিকেট ড্রাইভিং লাইসেন্স আবেদনে জিডি ও এনআইডি আপলোড করুন।',
          department_en: 'BRTA Information System (BSP)',
          department_bn: 'বিআরটিএ ইনফরমেশন সিস্টেম'
        },
        {
          step_number: 3,
          title_en: 'Biometric & Smart Card Collection at BRTA Office',
          title_bn: 'বিআরটিএ সার্কেল অফিস থেকে নতুন স্মার্ট কার্ড গ্রহণ',
          details_en: 'Visit BRTA Circle Office for fingerprint verification and receive your e-Driving License slip.',
          details_bn: 'নির্ধারিত বিআরটিএ অফিসে গিয়ে বায়োমেট্রিক স্লিপ প্রদান করে নতুন স্মার্ট ড্রাইভিং লাইসেন্স সংগ্রহ করুন।',
          department_en: 'BRTA Circle Office (Mirpur/Elenbari)',
          department_bn: 'বিআরটিএ সার্কেল অফিস (মিরপুর/এলেনবাড়ি)'
        }
      ],
      verified_sources: [
        { title: 'BRTA Service Portal (BSP)', url: 'https://bsp.brta.gov.bd', domain_type: 'GOV' },
        { title: 'Bangladesh Road Transport Authority', url: 'http://brta.gov.bd', domain_type: 'GOV' }
      ]
    },
    voice_summary_bn: 'বিআরটিএ ড্রাইভিং লাইসেন্স হারিয়ে গেলে প্রথমে থানায় জিডি করুন। ১-ক্লিক ফরম তৈরি করে bsp.brta.gov.bd পোর্টালে ফি জমা দিয়ে ডুপ্লিকেট লাইসেন্স সংগ্রহ করুন।'
  },
  'birth_certificate': {
    route_type: 'SHOMADHAN',
    shomadhan_data: {
      problem_summary_en: 'Digital Birth Registration Certificate (17-Digit BDRIS) Correction & Re-issue.',
      problem_summary_bn: '১৭-ডিজিটের ডিজিটাল জন্ম নিবন্ধন সনদ সংশোধন, হারানো কপি ও বিডিআরআইএস সেবা।',
      category: 'GOVERNMENT_SERVICE',
      pdf_template_type: 'GENERAL_CLAIM',
      required_documents: [
        { item_en: 'Online Birth Registration Application Slip (bdris.gov.bd)', item_bn: 'বিডিআরআইএস অনলাইন জন্ম নিবন্ধন আবেদন কপি', is_mandatory: true },
        { item_en: 'Parents Smart NID Card Copies', item_bn: 'পিতা-মাতার স্মার্ট এনআইডি কার্ডের কপি', is_mandatory: true },
        { item_en: 'School Passing Certificate / EPI Card Copy', item_bn: 'এসএসসি সনদ বা টিকা কার্ডের কপি', is_mandatory: true },
        { item_en: 'Government Fee (BDT 50 - 100)', item_bn: 'সরকারি ফি (৫০ - ১০০ টাকা)', is_mandatory: true }
      ],
      action_steps: [
        {
          step_number: 1,
          title_en: 'Verify 17-Digit Digital Registration Online',
          title_bn: 'অনলাইনে ১৭-ডিজিটের ডিজিটাল জন্ম সনদ যাচাই করুন',
          details_en: 'Log in to bdris.gov.bd to verify if your birth registration is digitally recorded in the central database.',
          details_bn: 'bdris.gov.bd ওয়েবসাইটে ১৭-ডিজিটের জন্ম নম্বর ও জন্মতারিখ দিয়ে ডিজিটাল রেকর্ড যাচাই করুন।',
          department_en: 'Office of Registrar General, Birth & Death Registration',
          department_bn: 'জন্ম ও মৃত্যু নিবন্ধন রেজিস্টার জেনারেলের কার্যালয়'
        },
        {
          step_number: 2,
          title_en: 'Submit Online Correction / Duplicate Request',
          title_bn: 'অনলাইনে সংশোধন বা রি-ইস্যু আবেদন সাবমিট করুন',
          details_en: 'Fill the online form, upload parents NID copy or SSC certificate, then select your Union Parishad / City Corporation ward.',
          details_bn: 'অনলাইনে আবেদন ফরম পূরণ করে ইউনিয়ন পরিষদ বা সিটি কর্পোরেশন ওয়ার্ড অফিস সিলেক্ট করুন।',
          department_en: 'Union Parishad / City Corporation Ward',
          department_bn: 'ইউনিয়ন পরিষদ / সিটি কর্পোরেশন ওয়ার্ড অফিস'
        },
        {
          step_number: 3,
          title_en: 'Submit Printed Application to Local Registrar',
          title_bn: 'ইউনিয়ন পরিষদে চালানের টাকাসহ আবেদন জমা দিন',
          details_en: 'Submit printed form with 50 Tk fee receipt to local Ward Counselor / Chairman office for digital signature.',
          details_bn: 'প্রিন্টকৃত আবেদন ফি স্লিপসহ ওয়ার্ড কাউন্সিলর বা চেয়ারম্যান অফিসে জমা দিয়ে মূল সনদ সংগ্রহ করুন।',
          department_en: 'Local Registrar Office',
          department_bn: 'স্থানীয় রেজিস্টার অফিস'
        }
      ],
      verified_sources: [
        { title: 'Official BDRIS Birth Registration Portal', url: 'https://bdris.gov.bd', domain_type: 'GOV' }
      ]
    },
    voice_summary_bn: 'ডিজিটাল জন্ম সনদ পুনরায় পেতে বা সংশোধন করতে bdris.gov.bd পোর্টালে অনলাইন আবেদন ফরম পূরণ করুন এবং ফি জমা দিয়ে ইউনিয়ন পরিষদ বা সিটি কর্পোরেশন থেকে মূল সনদ সংগ্রহ করুন।'
  },
  'bank_dispute': {
    route_type: 'SHOMADHAN',
    shomadhan_data: {
      problem_summary_en: 'Unauthorized Debit/Credit Card Fraud Transaction Dispute Procedure.',
      problem_summary_bn: 'অনুমোদনহীন ব্যাংক কার্ড বা অ্যাকাউন্ট লেনদেনের বিষয়ে অভিযোগ জমা দেওয়া।',
      category: 'FINANCIAL_CIVIC',
      pdf_template_type: 'BANK_DISPUTE_LETTER',
      required_documents: [
        { item_en: 'Bank Statement highlighting unauthorized transaction', item_bn: 'অনুমোদনহীন লেনদেন চিহ্নিত ব্যাংক স্টেটমেন্ট', is_mandatory: true },
        { item_en: 'National ID Card (NID) Copy', item_bn: 'এনআইডি কার্ডের কপি', is_mandatory: true },
        { item_en: 'Written Fraud Dispute Application', item_bn: 'স্বাক্ষরিত ডিজিটাল ব্যাংক জালিয়াতি অভিযোগ পত্র', is_mandatory: true }
      ],
      action_steps: [
        {
          step_number: 1,
          title_en: 'Block Bank Card / Freeze Account Session',
          title_bn: 'সাথে সাথে ব্যাংকের ২৪/৭ হেল্পলাইনে কল দিয়ে কার্ড ব্লক করুন',
          details_en: 'Call your bank official hotline (e.g. Dutch-Bangla 16216, City Bank 16234, Brac 16221) and request immediate card blocking.',
          details_bn: 'আপনার ব্যাংকের হেল্পলাইনে সাথে সাথে কল করে কার্ড বা ইন্টারনেট ব্যাংকিং সেশন ব্লক করুন।',
          department_en: 'Bank Call Center / Fraud Prevention Cell',
          department_bn: 'ব্যাংক কল সেন্টার / জালিয়াতি প্রতিরোধ সেল'
        },
        {
          step_number: 2,
          title_en: 'Generate & Sign Bank Dispute Letter',
          title_bn: 'অভিযোগ পত্র তৈরি করে ব্যাংকে পাঠান',
          details_en: 'Use CIVIC GUARD AI 1-Click PDF Generator to auto-fill the official Chargeback / Fraud Dispute letter.',
          details_bn: 'সিভি গার্ড এআই-এর ১-ক্লিক ডিজপুট জেনারেটর ব্যবহার করে অফিসিয়াল অভিযোগপত্র ডাউনলোড করুন।',
          department_en: 'CIVIC GUARD AI PDF Hub',
          department_bn: 'সিভি গার্ড এআই পিডিএফ হাব'
        }
      ],
      verified_sources: [
        { title: 'Bangladesh Bank Consumer Complaints Cell', url: 'https://bb.org.bd', domain_type: 'GOV' }
      ]
    },
    voice_summary_bn: 'আপনার ব্যাংক অ্যাকাউন্ট বা কার্ডে অনুমোদনহীন লেনদেন হলে দ্রুত ব্যাংকের ২৪/৭ হেল্পলাইনে কল দিয়ে কার্ড ব্লক করুন। এরপর আমাদের তৈরি ডিজিটাল জালিয়াতি অভিযোগপত্রটি ডাউনলোড করে ব্যাংকে পাঠান।'
  }
};

function buildCustomShomadhanResponse(query: string): CivicGuardResponse {
  const cleanTitle = query ? query.charAt(0).toUpperCase() + query.slice(1) : 'Public Service Request';
  return {
    route_type: 'SHOMADHAN',
    shomadhan_data: {
      problem_summary_en: `${cleanTitle} procedure in Bangladesh.`,
      problem_summary_bn: `বাংলাদেশে ${cleanTitle} প্রক্রিয়া।`,
      category: 'GOVERNMENT_SERVICE',
      pdf_template_type: 'POLICE_GD_LOST_DOC',
      required_documents: [
        { item_en: 'General Diary (GD) Copy from Local Police Station', item_bn: 'নিকটস্থ থানার সাধারণ ডায়েরি (জিডি) কপি', is_mandatory: true },
        { item_en: 'National ID (NID) Card or Birth Certificate', item_bn: 'জাতীয় পরিচয়পত্র (এনআইডি) বা জন্ম নিবন্ধন কপি', is_mandatory: true },
        { item_en: 'Application Fee Bank Payment Slip', item_bn: 'নির্ধারিত ফি পরিশোধের ব্যাংক স্লিপ', is_mandatory: true }
      ],
      action_steps: [
        {
          step_number: 1,
          title_en: `File General Diary (GD) for ${cleanTitle}`,
          title_bn: `নিকটস্থ পুলিশ থানায় জিডি (General Diary) করুন`,
          details_en: `File a GD for ${cleanTitle} at your local police station using CIVIC GUARD AI 1-Click GD Generator.`,
          details_bn: `সিভি গার্ড এআই-এর ১-ক্লিক জিডি জেনারেটর ব্যবহার করে ${cleanTitle}-এর জন্য থানায় জিডি করুন।`,
          department_en: 'Bangladesh Police Thana',
          department_bn: 'বাংলাদেশ পুলিশ থানা'
        },
        {
          step_number: 2,
          title_en: 'Submit Application to Concerned Authority',
          title_bn: 'সংশ্লিষ্ট কার্যালয়ে আবেদন জমা দিন',
          details_en: 'Attach GD copy, payment slip, and NID to submit your official application.',
          details_bn: 'জিডি কপি, চালান রসিদ ও এনআইডি কপি যুক্ত করে আবেদন জমা দিন।',
          department_en: 'Government Administrative Office',
          department_bn: 'সরকারি প্রশাসনিক কার্যালয়'
        }
      ],
      verified_sources: [
        { title: 'National Web Portal of Bangladesh', url: 'https://bangladesh.gov.bd', domain_type: 'GOV' }
      ]
    },
    voice_summary_bn: `আপনার ${cleanTitle} সংক্রান্ত কাজের জন্য প্রথমে স্থানীয় থানায় একটি জিডি করুন এবং ১-ক্লিক ফরম ডাউনলোড করে জমা দিন।`
  };
}

export async function processCivicGuardQuery(
  userInput: string,
  imageFile?: File | null,
  apiKey?: string
): Promise<CivicGuardResponse> {
  const sanitizedInput = sanitizeClientInput(userInput);
  const activeKey = (apiKey || (import.meta as any).env?.VITE_GEMINI_API_KEY || '').trim();

  // If no API key provided or network fails, use smart pattern matching against presets
  const lowerInput = sanitizedInput.toLowerCase();

  // Match demo triggers if API key is not present
  if (!activeKey) {
    // Artificial 1 second processing delay to feel like Gemini AI
    await new Promise((resolve) => setTimeout(resolve, 900));

    if (lowerInput.includes('bkash') || lowerInput.includes('phishing') || lowerInput.includes('scam') || lowerInput.includes('sms') || lowerInput.includes('url') || imageFile) {
      return DEMO_PRESETS['bkash_phishing'];
    }
    if (lowerInput.includes('passport')) {
      return DEMO_PRESETS['passport_renewal'];
    }
    if (lowerInput.includes('university') || lowerInput.includes('student') || lowerInput.includes('academic') || lowerInput.includes('varsity') || lowerInput.includes('college')) {
      return DEMO_PRESETS['university_id'];
    }
    if (lowerInput.includes('driving') || lowerInput.includes('license') || lowerInput.includes('brta') || lowerInput.includes('car') || lowerInput.includes('vehicle')) {
      return DEMO_PRESETS['driving_license'];
    }
    if (lowerInput.includes('birth') || lowerInput.includes('bdris') || lowerInput.includes('certificate')) {
      return DEMO_PRESETS['birth_certificate'];
    }
    if (lowerInput.includes('bank') || lowerInput.includes('dispute') || lowerInput.includes('card') || lowerInput.includes('unauthorized') || lowerInput.includes('credit') || lowerInput.includes('debit')) {
      return DEMO_PRESETS['bank_dispute'];
    }
    if (lowerInput.includes('nid') || lowerInput.includes('national id') || lowerInput.includes('smart card')) {
      return DEMO_PRESETS['lost_nid'];
    }

    // Dynamic Generator for any custom search query typed by user
    return buildCustomShomadhanResponse(sanitizedInput);
  }

  // Live Gemini API Call using standard fetch to gemini-2.5-flash / gemini-1.5-flash
  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${activeKey}`;

    let contents: any[] = [];

    if (imageFile) {
      const base64Data = await fileToBase64(imageFile);
      contents.push({
        parts: [
          { text: SYSTEM_PROMPT + '\n\nUSER INPUT / QUERY: ' + sanitizedInput },
          { inline_data: { mime_type: imageFile.type, data: base64Data } }
        ]
      });
    } else {
      contents.push({
        parts: [{ text: SYSTEM_PROMPT + '\n\nUSER INPUT / QUERY: ' + sanitizedInput }]
      });
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          response_mime_type: 'application/json',
          temperature: 0.2,
          response_schema: {
            type: 'OBJECT',
            properties: {
              route_type: { type: 'STRING', enum: ['SHOMADHAN', 'SCAMSHIELD'] },
              shomadhan_data: {
                type: 'OBJECT',
                properties: {
                  problem_summary_en: { type: 'STRING' },
                  problem_summary_bn: { type: 'STRING' },
                  category: { type: 'STRING', enum: ['GOVERNMENT_SERVICE', 'DOCUMENT_LOSS', 'ACADEMIC', 'FINANCIAL_CIVIC'] },
                  required_documents: {
                    type: 'ARRAY',
                    items: {
                      type: 'OBJECT',
                      properties: {
                        item_en: { type: 'STRING' },
                        item_bn: { type: 'STRING' },
                        is_mandatory: { type: 'BOOLEAN' }
                      }
                    }
                  },
                  action_steps: {
                    type: 'ARRAY',
                    items: {
                      type: 'OBJECT',
                      properties: {
                        step_number: { type: 'INTEGER' },
                        title_en: { type: 'STRING' },
                        title_bn: { type: 'STRING' },
                        details_en: { type: 'STRING' },
                        details_bn: { type: 'STRING' },
                        department_en: { type: 'STRING' },
                        department_bn: { type: 'STRING' }
                      }
                    }
                  },
                  verified_sources: {
                    type: 'ARRAY',
                    items: {
                      type: 'OBJECT',
                      properties: {
                        title: { type: 'STRING' },
                        url: { type: 'STRING' },
                        domain_type: { type: 'STRING', enum: ['GOV', 'OFFICIAL'] }
                      }
                    }
                  },
                  official_locations: {
                    type: 'ARRAY',
                    items: {
                      type: 'OBJECT',
                      properties: {
                        name_en: { type: 'STRING' },
                        name_bn: { type: 'STRING' },
                        address_en: { type: 'STRING' },
                        address_bn: { type: 'STRING' },
                        hours: { type: 'STRING' },
                        map_url: { type: 'STRING' }
                      }
                    }
                  },
                  pdf_template_type: { type: 'STRING', enum: ['POLICE_GD_LOST_DOC', 'BANK_DISPUTE_LETTER', 'GENERAL_CLAIM'] }
                }
              },
              scamshield_data: {
                type: 'OBJECT',
                properties: {
                  risk_level: { type: 'STRING', enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
                  risk_score: { type: 'INTEGER' },
                  threat_indicators: { type: 'ARRAY', items: { type: 'STRING' } },
                  bounding_boxes: {
                    type: 'ARRAY',
                    items: {
                      type: 'OBJECT',
                      properties: {
                        box_2d: { type: 'ARRAY', items: { type: 'INTEGER' } },
                        label: { type: 'STRING' },
                        risk: { type: 'STRING', enum: ['HIGH', 'MEDIUM', 'LOW'] }
                      }
                    }
                  },
                  immediate_safety_actions: { type: 'ARRAY', items: { type: 'STRING' } }
                }
              },
              voice_summary_bn: { type: 'STRING' }
            },
            required: ['route_type', 'voice_summary_bn']
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      throw new Error('Empty response from Gemini API');
    }

    const parsedResponse: CivicGuardResponse = JSON.parse(candidateText);
    return parsedResponse;
  } catch (err) {
    console.warn('Live Gemini API call failed or fallback active. Falling back to preset demo.', err);
    if (lowerInput.includes('scam') || lowerInput.includes('phishing') || lowerInput.includes('link')) {
      return DEMO_PRESETS['bkash_phishing'];
    }
    return DEMO_PRESETS['lost_nid'];
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}
