# 🛡️ CIVIC GUARD AI
> **AI-Powered Public Service Intelligence & Threat Defense Platform**  
> *Tagline: Understand the Problem. Navigate the Solution. Stay Protected.*

🏆 **Target Tracks**:
- 🏆 **Best Use of Gemini API** (Gemini 2.5 Flash Multimodal JSON Core)
- 🎙️ **ElevenLabs Side Track** (Voice AI Dispatch & Bangla Speech Engine)
- 🎁 **Sponsor API Integrations**: Firecrawl (`BUILDDHAKA10K100R`) & Gen XYZ (`BEMK26`)

---

## 📌 Executive Summary & Vision

**CIVIC GUARD AI** is an authoritative, citizen-first digital assistance platform engineered to streamline administrative public service workflows and defend against digital fraud for Bangladesh.

Navigating Bangladeshi public services—such as replacing a lost Smart National ID (NID), renewing an e-Passport, filing campus clearance for a lost University Student ID, or contesting an unauthorized bank transaction—is traditionally confusing and fragmented.

CIVIC GUARD AI solves this through a unified dual-engine pipeline:

```
                  ┌──────────────────────────────────────────┐
                  │       CIVIC GUARD AI USER INPUT          │
                  │  (Bangla/English Voice, Text, Screenshot)│
                  └────────────────────┬─────────────────────┘
                                       │
                         [ Client Zero-PII Sanitizer ]
                         (Masks Phone, NID, & OTPs)
                                       │
                    ┌──────────────────┴──────────────────┐
                    ▼                                     ▼
     [ SHOMADHAN AI (Primary 75%) ]        [ SCAMSHIELD AI (Secondary 25%) ]
     • Grounded Web Verification           • Screenshot Bounding Box HUD
     • Step-by-Step Action Plans           • Risk Telemetry Score (0-100)
     • Verified .gov.bd Channels           • Incident Response Triage Mode
     • 1-Click PDF GD Generator            • Emergency Action Checklist
                    │                                     │
                    └──────────────────┬──────────────────┘
                                       │
                   ┌───────────────────┴───────────────────┐
                   ▼                                       ▼
    [ Interactive UI & Dynamic Theme ]    [ ElevenLabs Voice Dispatch Engine ]
    • Dark Mode (Default Obsidian)        • Bangla/English Speech Input (STT)
    • Light Mode (Clean Slate)            • High-Fidelity Voice Guidance (TTS)
```

---

## 🌟 Key Features

### 1. 🪪 Shomadhan AI Engine (Primary Core — 75% Focus)
- **Interactive Solution Tree**: Renders prerequisite document checklists with interactive checkboxes and progress completion meters.
- **Sequential Action Roadmap**: Clear step-by-step action plans paired with exact government department badges (e.g., *Agargaon NID Wing*, *Tejgaon Thana*, *Regional Passport Office*).
- **Bangladeshi Document & Card Directory**:
  - 🪪 **Smart National ID (NID) Card** (BDT 345 re-issue)
  - 🛂 **e-Passport & Renewal** (BDT 4,025 - 10,350)
  - 🎓 **University & Student ID Card** (DU, BUET, NSU, BRAC, SUST)
  - 💳 **Bank ATM / Credit Card Fraud** (Free emergency freeze)
  - 🚗 **BRTA Driving License** (BDT 875 duplicate permit)
  - 📜 **Digital Birth Registration (17-Digit BDRIS)**
- **Official Location Mapping**: Interactive cards displaying physical addresses, operating hours, and Google Maps navigation links.
- **Grounded Web Verification**: Cites verified `.gov.bd` domains.

---

### 2. 📑 1-Click Police General Diary (GD) & Dispute PDF Generator
- **Form 102 Bangladeshi Police GD Generator**: Converts lost NID, Passport, or Student ID details into an officially formatted Bangladesh Police General Diary draft PDF ready for instant printing and signing.
- **Bank Fraud Dispute Claim Generator**: Auto-fills a formal signed chargeback claim letter for unauthorized debit/credit card transactions.

---

### 3. 🚨 ScamShield AI Visual HUD & Incident Mode (Secondary Defense — 25% Focus)
- **Visual Bounding Box HUD**: Gemini 2.5 Flash Multimodal scans uploaded screenshots of suspicious SMS messages or phishing websites and overlays red bounding boxes (`[ymin, xmin, ymax, xmax]`) over dangerous domain links or PIN harvesting forms.
- **Telemetry Risk Gauge (0 - 100)**: Displays risk scores and threat indicator breakdowns (domain spoofing, urgency traps).
- **"I Already Clicked It" Emergency Incident Mode**: 1-click panic protocol providing immediate triage actions (*Freeze bKash PIN via `*247#`*, *block cards*, *call Cyber Police Helpline `13219`*).

---

### 4. 🔒 Client-Side Zero-PII Privacy Protection Layer
- `lib/piiScrubber.ts` automatically redacts sensitive citizen data before sending API requests:
  - Bangladeshi Mobile Numbers (`+8801...` $\rightarrow$ `[REDACTED_PHONE]`)
  - 10, 13, and 17-digit NID Numbers ($\rightarrow$ `[REDACTED_NID]`)
  - OTP & Security PIN Sequences ($\rightarrow$ `[REDACTED_OTP]`)
- Includes an interactive **Live PII Inspection Drawer** in the UI.

---

### 5. 🎙️ ElevenLabs Voice Companion (Voice AI Track)
- **Speech-to-Text (STT)**: Microphone speech recorder supporting Bangla (`bn-BD`) and English (`en-US`).
- **Text-to-Speech (TTS)**: Streams natural voice guidance using ElevenLabs Multilingual v2 API (`eleven_multilingual_v2`) with Web Speech API browser fallback.
- **Panic Audio Guide**: Plays natural Bangla emergency audio instructions during triage mode.

---

### 6. 🔥 Firecrawl Web Scraper Integration (Sponsor Integration)
- **Coupon**: `BUILDDHAKA10K100R`
- Grounded real-time scraping of official government portals (`services.nidw.gov.bd`, `epassport.gov.bd`, `bdris.gov.bd`, `bsp.brta.gov.bd`) via the Firecrawl API (`https://api.firecrawl.dev/v1/scrape`).

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS
- **Typography**: Google Fonts `Inter` + `Hind Siliguri` + `Noto Sans Bengali`
- **Iconography**: Lucide React Icons
- **PDF Engine**: jsPDF
- **AI Engine**: Google Gemini 2.5 Flash API (`gemini-2.5-flash`)
- **Voice Engine**: ElevenLabs Multilingual v2 API
- **Scraper Engine**: Firecrawl Scrape API

---

## ⚙️ Google AI Studio Prompt & Response Schema

For hackathon submission verification, the Gemini API is configured as follows:

### System Prompt
```text
You are CIVIC GUARD AI, an authoritative public service assistant & threat defense engine for Bangladesh.
Analyze the input (text query, voice transcript, or screenshot image) and route to either SHOMADHAN or SCAMSHIELD.
You MUST respond strictly in valid JSON matching the provided responseSchema.
```

### JSON Response Schema (`responseSchema`)
```json
{
  "type": "OBJECT",
  "properties": {
    "route_type": { "type": "STRING", "enum": ["SHOMADHAN", "SCAMSHIELD"] },
    "shomadhan_data": {
      "type": "OBJECT",
      "properties": {
        "problem_summary_en": { "type": "STRING" },
        "problem_summary_bn": { "type": "STRING" },
        "category": { "type": "STRING" },
        "required_documents": { "type": "ARRAY" },
        "action_steps": { "type": "ARRAY" },
        "verified_sources": { "type": "ARRAY" },
        "pdf_template_type": { "type": "STRING" }
      }
    },
    "scamshield_data": {
      "type": "OBJECT",
      "properties": {
        "risk_level": { "type": "STRING" },
        "risk_score": { "type": "INTEGER" },
        "threat_indicators": { "type": "ARRAY" },
        "bounding_boxes": { "type": "ARRAY" }
      }
    },
    "voice_summary_bn": { "type": "STRING" }
  }
}
```

---

## 🚀 Quickstart & Local Setup

### 1. Clone & Install Dependencies
```bash
cd "Civic Guard AI"
npm install
```

### 2. Configure Environment Variables (`.env`)
Create or edit your `.env` file:
```env
VITE_GEMINI_API_KEY=AIzaSyYourGeminiApiKeyHere
VITE_ELEVENLABS_API_KEY=xi-api-key-here
VITE_FIRECRAWL_API_KEY=your_firecrawl_key_here
VITE_FIRECRAWL_COUPON=BUILDDHAKA10K100R
VITE_GEN_XYZ_COUPON=BEMK26
```

### 3. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:3000/](http://localhost:3000/)** in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 📂 Project Structure

```
d:/Civic Guard AI
├── .env.example                  # Environment variables template
├── index.html                    # Entry HTML with Inter + Hind Siliguri + Noto Sans Bengali
├── package.json                  # Dependencies & scripts
├── tailwind.config.js            # Design tokens & color palette
├── vite.config.ts                # Vite build configuration
└── src/
    ├── main.tsx                  # Application entry
    ├── App.tsx                   # Main layout & route orchestrator
    ├── index.css                 # Global CSS & theme utility classes
    ├── types/
    │   └── index.ts              # TypeScript interface schemas
    ├── lib/
    │   ├── piiScrubber.ts        # Client-side zero-PII sanitization engine
    │   ├── geminiService.ts      # Gemini 2.5 Flash API caller & preset fallback
    │   ├── elevenLabsService.ts  # ElevenLabs TTS & Speech Recognition STT
    │   ├── firecrawlService.ts   # Firecrawl web extraction service
    │   └── pdfGenerator.ts       # Police GD & Bank Dispute PDF export engine
    └── components/
        ├── Header.tsx            # Navigation, twin engine tabs, theme toggle
        ├── ZeroPiiBanner.tsx     # PII protection status & live inspector
        ├── SettingsDrawer.tsx    # In-app API key configuration modal
        ├── ShomadhanEngine/
        │   ├── DocumentDirectory.tsx # NID, Passport, Varsity, Bank & BRTA cards
        │   ├── SolutionTree.tsx      # Prerequisite checklist & step roadmap
        │   ├── LocationMap.tsx       # Physical office locations & maps
        │   ├── SourceVerifier.tsx    # Grounded .gov.bd verifier & Firecrawl scraper
        │   ├── GdPdfModal.tsx        # 1-Click Police GD PDF draft generator
        │   └── ActionPlanDetailView.tsx # Standalone clean detail page view
        ├── ScamShieldEngine/
        │   ├── ThreatScanner.tsx     # SMS/URL/Screenshot input handler
        │   ├── VisualHudOverlay.tsx  # Multimodal bounding box canvas overlay
        │   ├── RiskTelemetry.tsx     # Threat score dial (0-100) & indicators
        │   └── IncidentMode.tsx      # Emergency panic triage protocol
        └── VoiceCompanion/
            ├── VoiceBar.tsx          # Microphone STT recorder & wave visualizer
            └── VoicePlayer.tsx       # ElevenLabs natural Bangla voice player
```

---

## 📄 License & Acknowledgments

Built for citizens of Bangladesh during the Hackathon Sprint. Grounded under official `.gov.bd` government web resources.
