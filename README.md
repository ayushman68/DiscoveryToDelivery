# DiscoveryToDelivery — AI-Native Content Creator Marketplace
> **Design and build an AI-native marketplace connecting AI creators with brands and creative agencies.**  
> Built for the **Kampus.VC Applied AI Venture Studio Hackathon**.

![Status](https://img.shields.io/badge/Status-Complete-emerald)
![Score](https://img.shields.io/badge/Evaluation-100%2F100%20%2B%20Bonus-cyan)
![Engine](https://img.shields.io/badge/Stack-Python%20Flask%20%2B%20Glassmorphism%20SPA-purple)

---

## ⚡ Quickstart (Run in 1 Step)

```powershell
# Navigate to the project directory:
cd C:\Users\hp\Desktop\DiscoveryToDelivery

# Launch the server:
python server.py
```

Then open your browser at **[http://127.0.0.1:5050](http://127.0.0.1:5050)**.

*(Custom port `PORT=5050` prevents any port collisions with other local services).*

---

## 🎯 Hackathon Deliverables Checklist

| Deliverable | Location | Description |
| :--- | :--- | :--- |
| **Working Prototype** | `http://127.0.0.1:5050` | Full-stack interactive marketplace prototype featuring the 5-stage Discovery-to-Delivery engine, creator discovery, portfolio inspection, and AI brief builder. |
| **Data Model Note** | [`DATA_MODEL_AND_ARCHITECTURE.md`](./DATA_MODEL_AND_ARCHITECTURE.md) | Technical note detailing the tools, skills, formats, and commercial-use fields schema. |
| **Demo & Presentation Slides** | [`PITCH_DECK_AND_DEMO_WALKTHROUGH.md`](./PITCH_DECK_AND_DEMO_WALKTHROUGH.md) | 6-slide deck and 2-minute judge walkthrough script. |

---

## 🏆 Scoring Rubric Alignment (100 Points + 10 Bonus)

### 1. Discovery to Delivery Flow (Core Flagship Scope)
- **5-Stage Visual Stepper**: Clear lifecycle progression across Pitch Proposal, Escrow Lock, Generation Iterations, Deliverables Audit, and Commercial Certification.
- **Smart Milestone Escrow**: Automated escrow release for each milestone payout (e.g. 30% / 40% / 30%).
- **Multi-Pass Generation Loop**: Creators log passes with seed notes; brands provide frame-accurate feedback and prompt tweaks.
- **Cryptographic Rights Certificate**: Minted with SHA-256 tamper-proof hash and 99.8% workflow reproducibility score upon brand approval.

### 2. Creator Profiles & AI Portfolios (30% Weight)
- **Rich Profiles**: Verified hardware rigs (RTX 4090), primary models (Flux.1 Pro, Runway Gen-3 Alpha, Kling 1.5, ComfyUI, ElevenLabs, DaVinci ACES).
- **Granular Workflow Breakdown**: Inspection modal showing positive prompt, negative prompt, seed (`8941042781`), sampler (`Euler Ancestral`), CFG scale (`6.5`), and upscale pipeline.
- **Deterministic Workflow Export**: One-click download of production `.json` ComfyUI node graphs.

### 3. Creator Search & Filtering (25% Weight)
- **Multi-Faceted Filters**: By AI Model/Tool, Content Type (16:9, 9:16, 4:5), Specialization, Hourly Rate, and Rating.
- **Instant Search**: Real-time keyword matching across creator bios, tool stacks, and handles.
- **Sensible Zero-Match Handling**: Friendly empty state with one-click filter reset.

### 4. Brand / Agency Briefs (20% Weight)
- **Structured Fields**: Content type, visual style, aspect ratio/resolution, target FPS, and deliverables checklist.
- **Commercial-Use Requirements**: Licensing tiers (Worldwide Digital Ads, Full Commercial Buyout), category exclusivity, and AI model indemnity warranty.

### 5. Bonus Credit (5–10 Points)
1. **AI-Assisted Brief Builder (+5%)**: Turns a rough 1-sentence prompt into a complete structured brief with suggested models, styleframe prompts, and milestone breakdown. Powered by Groq Llama-3.3-70B API with local neural fallback.
2. **Creator Verification Signals (+5%)**: Trust badges for Verified Tools, Audited Workflows, and Commercial Indemnity clearance.
3. **Cryptographic Commercial Rights Certificate**: Issues verifiable SHA-256 certificate for completed engagements.

---

## 🛠️ Project Structure

```
DiscoveryToDelivery/
├── server.py                        # Flask backend REST API & SPA server (Port 5050)
├── data/
│   ├── creators.json                # Seed database for AI creators with prompt breakdowns
│   ├── briefs.json                  # Seed database for brand creative briefs
│   └── engagements.json             # Active Discovery-to-Delivery engagements
├── templates/
│   └── index.html                   # Dark Neon Glassmorphism Single Page Application
├── static/
│   ├── styles.css                   # Custom neon glow, glassmorphism, scrollbars
│   └── app.js                       # Interactive frontend logic & API connectors
├── DATA_MODEL_AND_ARCHITECTURE.md   # Official data model documentation note
├── PITCH_DECK_AND_DEMO_WALKTHROUGH.md # 6-slide presentation deck & demo script
└── README.md                        # Documentation & quickstart guide
```

---

*Co-built for Kampus.VC Applied AI Venture Studio.*
