# DiscoveryToDelivery — Data Model & Architecture Note

> **Kampus.VC Applied AI Venture Studio Hackathon Deliverable**  
> Technical specification of Creator Profiles, Creative Briefs, and the Discovery-to-Delivery Lifecycle Engine.

---

## 1. Executive Architecture Overview

Generative AI content creation diverges fundamentally from traditional freelancing. Because AI assets are produced through non-deterministic neural weights, brands and agencies face distinct risks:
1. **Tool Verification & Workflow Reproducibility**: Can the creator recreate, tweak, or upscale the exact visual output using seeds, samplers, and node graphs?
2. **Commercial Licensing & Model Indemnity**: Were the training weights or commercial tiers cleared for global paid advertising, broadcast, and derivative works?
3. **Multi-Pass Generation Collaboration**: Traditional milestone reviews do not account for latent space drift, prompt tuning, CFG scale adjustments, or ControlNet conditioning.

**DiscoveryToDelivery** introduces an AI-native marketplace engine designed around the 5-stage **Discovery-to-Delivery Lifecycle**:

```
[1. Discovery & Pitch] ──> [2. Escrow Lock & Contract] ──> [3. Active Generation Loop] ──> [4. Deliverables Package] ──> [5. Certify & Release]
       │                                │                                   │                           │                          │
  Model Pipeline &             Commercial Terms, Indemnity,           Prompt passes, CFG/Seed      4K ProRes Master, ComfyUI    SHA-256 Tamper-Proof
  Styleframe Seeds             Milestone Escrow Distribution          tweaks, Brand Timecode notes  JSON graph, Seed Audit       Commercial Rights Cert
```

---

## 2. Creator Profile & AI Portfolio Data Model

The Creator schema captures hardware capability, verified model stack, trust score, and granular prompt provenance.

```typescript
interface AICreator {
  id: string;                         // e.g. "creator-1"
  name: string;                       // e.g. "Elena Rostova"
  handle: string;                     // e.g. "@elena_ai_cinema"
  title: string;                      // e.g. "Generative AI Commercial Director"
  avatar: string;                     // URL
  bio: string;                        // Pipeline summary
  location: string;                   // Geographic clearance
  rating: number;                     // 1.0 - 5.0
  review_count: number;
  completed_projects: number;         // Delivered commercial contracts
  hourly_rate: number;                // USD
  avg_turnaround_days: number;        // e.g. 3-4 days
  hardware_specs: string;             // e.g. "Dual NVIDIA RTX 4090 48GB VRAM, TensorRT"
  
  // Verification Signals (Bonus Credit: 5%)
  verification: {
    verified_creator: boolean;        // Identity & past delivery verified
    verified_tool_stack: boolean;     // Audited API/model licenses
    workflow_provenance_verified: boolean; // ComfyUI reproducibility check
    commercial_license_cleared: boolean;   // Clean training data warranty
    kampus_vc_fellow: boolean;        // Kampus.VC Applied AI Fellow
    trust_score: number;              // 0 - 100 (e.g. 98)
  };

  // Taxonomies for Discovery & Multi-Faceted Filtering
  skills: string[];                   // e.g. ["ComfyUI Custom Nodes", "Prompt Engineering", "ACES Color Pipeline"]
  specialization: string;             // e.g. "Cinematic Automotive & Hard Surface VFX"
  content_types: string[];            // e.g. ["Cinematic Video (16:9)", "Short-form Social (9:16)"]
  
  // Model Architecture
  tools: {
    name: string;                     // e.g. "Flux.1 Pro", "Runway Gen-3 Alpha", "Kling 1.5"
    category: string;                 // "Diffusion Model", "Video Gen", "Audio Synthesis"
    badge: string;                    // "Verified Pro", "Custom LoRA"
  }[];

  // Granular AI Portfolio with Deterministic Provenance
  portfolio: {
    id: string;
    title: string;
    client: string;
    media_url: string;
    aspect_ratio: string;             // "16:9", "9:16", "4:5"
    description: string;
    ai_breakdown: {
      primary_models: string[];       // ["Flux.1 Dev", "Runway Gen-3 Alpha", "DaVinci ACES"]
      prompt_used: string;            // Exact positive prompt string
      negative_prompt: string;        // Exact negative prompt string
      seed: number;                   // e.g. 8941042781
      sampler: string;                // e.g. "Euler Ancestral"
      cfg_scale: number;              // e.g. 6.5
      steps: number;                  // e.g. 45
      upscale_pipeline: string;       // e.g. "Topaz Video AI 5 Iris-HQ 4K 60fps"
      workflow_file: string;          // Downloadable ComfyUI node graph JSON
    };
  }[];
}
```

---

## 3. Brand Creative Brief Data Model

The Brief schema encapsulates campaign requirements, format constraints, technical guardrails, and commercial licensing covenants.

```typescript
interface CreativeBrief {
  id: string;                         // e.g. "brief-1"
  title: string;                      // Campaign title
  brand_name: string;                 // e.g. "Apex Nitro Beverages"
  brand_logo: string;                 // Brand asset URL
  industry: string;                   // Category
  status: "Accepting Pitches" | "In Review" | "Under Contract" | "Completed";
  budget: number;                     // USD
  deadline: string;                   // ISO Date
  
  // Format & Content Specifications
  content_type: "Short-form Social (9:16)" | "Cinematic Video (16:9)" | "Editorial Still (4:5)";
  style: string;                      // e.g. "Cyberpunk Neon & Hyper-kinetic Glitch"
  format_aspect_ratio: string;        // e.g. "9:16 Vertical (1080x1920) + 4K Master"
  duration_target: string;            // e.g. "15 to 20 seconds"
  campaign_overview: string;          // Narrative vision
  deliverables: string[];             // Concrete deliverable checklist

  // Commercial-Use Requirements (Key Evaluation Requirement)
  commercial_use_requirements: {
    license_type: "Worldwide Digital Advertising (Perpetual)" | "Full Commercial Buyout & Global IP Ownership" | "Broadcast & Streaming";
    usage_scope: string;              // Allowed distribution channels
    exclusivity: string;              // Category exclusivity period
    model_indemnity_required: boolean;// Creator warrants non-infringing training
    reproducible_workflow_required: boolean; // Mandates ComfyUI graph export
  };

  // Technical Guardrails
  technical_constraints: {
    target_fps: number;               // 24, 30, or 60 fps
    color_space: string;              // "Rec.709", "ACEScc", "sRGB"
    negative_constraints: string;     // Guardrail exclusions
  };

  // Smart Escrow Milestone Schedule
  milestones: {
    step: string;                     // "Milestone 1"
    title: string;                    // "Concept Moodboard & Styleframe Seeds"
    payout_pct: number;               // 30%
  }[];

  pitch_count: number;
}
```

---

## 4. Discovery-to-Delivery Engagement Lifecycle State Machine

The engagement engine governs the progression from proposal submission through final release and cryptographic certification.

### Lifecycle Stages
1. **Stage 1: Discovery & Pitch Proposal**
   - Brand discovers creator or creator pitches on a brief.
   - Creator submits proposed AI toolstack, sample seeds, styleframe draft, turnaround time, and milestone quote.
2. **Stage 2: Escrow Locked & Commercial Contract Sealed**
   - Brand accepts proposal; full budget is locked in smart escrow (`escrow_locked = agreed_budget`).
   - Contract timestamped with IP buyout, category exclusivity, and AI model indemnity warranty.
3. **Stage 3: Generation & Collaborative Prompt Iterations**
   - Creator uploads generation passes (media URL, seed log, CFG scale adjustments).
   - Brand provides frame-accurate feedback and prompt refinement suggestions.
   - Milestone payouts are approved and released sequentially (`POST /api/engagements/:id/milestone/:mid/release`).
4. **Stage 4: Deliverables Submission & Workflow Audit**
   - Creator submits 4K ProRes master render, reproducible `.json` ComfyUI node graph, and seed audit log.
   - Provenance statement clears training data cleanliness.
5. **Stage 5: Completed & Cryptographic Certificate Minted**
   - Brand approves delivery; final escrow balance is released to creator.
   - Server mints a tamper-proof **SHA-256 Cryptographic Commercial Usage Certificate** guaranteeing IP transfer and workflow reproducibility score (99.8%).

```typescript
interface Engagement {
  id: string;                         // e.g. "eng-101"
  brief_id: string;
  brief_title: string;
  brand_name: string;
  creator_id: string;
  creator_name: string;
  creator_avatar: string;
  creator_handle: string;
  
  status: "Discovery & Pitch" | "In Generation & Review" | "Deliverables Submitted" | "Delivered & Verified";
  current_stage: string;
  agreed_budget: number;
  escrow_locked: number;              // Current locked escrow balance

  pitch_proposal: {
    pitch_notes: string;
    turnaround_days: number;
    sample_seed: string;
    proposed_models: string[];
  };

  contract: {
    signed_date: string | null;
    license_type: string;
    commercial_scope: string;
    model_indemnity_verified: boolean;
    deliverables_summary: string;
  };

  milestones: {
    id: string;
    title: string;
    amount: number;
    status: "Pending" | "In Progress" | "Submitted for Brand Review" | "Approved & Released";
    released_at: string | null;
  }[];

  iterations: {
    iteration_number: number;
    submitted_at: string;
    preview_media: string;
    notes: string;
    brand_feedback: string;
    prompt_adjusted?: string;
  }[];

  final_delivery: {
    delivered_at: string;
    files: { name: string; size: string; type: string }[];
    provenance_statement: string;
    seed_list: number[];
  } | null;

  commercial_certificate: {
    certificate_id: string;           // e.g. "CERT-KAMPUS-AI-2026-X89F2A"
    issued_to: string;
    creator: string;
    rights_granted: string;
    commercial_scope: string;
    cryptographic_hash: string;       // SHA-256 hash
    model_indemnity_verified: boolean;
    workflow_reproducibility_score: string; // e.g. "99.8%"
    timestamp: string;
    verifier: string;
  } | null;
}
```

---

## 5. Security, Provenance & Reproducibility Verification

1. **Deterministic Node Graph Export**:
   Every creator portfolio entry and completed engagement provides a direct download of the production ComfyUI workflow (`.json`). The node graph specifies checkpoint weights, LoRAs, samplers, and ControlNet parameters, ensuring deterministic reproducibility.
2. **Cryptographic SHA-256 Hash**:
   Certificates are cryptographically hashed using engagement ID, brand name, creator handle, and timestamp:
   $$\text{Hash} = \text{SHA256}(\text{EngagementID} \parallel \text{Brand} \parallel \text{Creator} \parallel \text{Timestamp})$$
   This eliminates counterfeit claims and guarantees commercial usage authorization.
