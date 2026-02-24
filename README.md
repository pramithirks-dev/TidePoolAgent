# Marina — TidePool Donor Impact Intelligence Agent

**Marina** is a customer-facing conversational AI agent built for TidePool, a marine conservation crowdfunding platform. She directly addresses the most critical trust failure identified in EX1_AUDIT: **donors receiving no evidence of what their donation achieved** (Challenge 1: Invisible Impact), which was identified as the primary driver of TidePool's 68% donation decline (€38→€12) and 90% one-time donor rate.

## Agent Role

| Attribute | Detail |
|---|---|
| **Name** | Marina |
| **Type** | Customer-facing conversational AI chatbot |
| **Model** | `claude-sonnet-4-6` (Anthropic) |
| **Analytical Lens** | Donor Trust & Transparency |
| **Primary Challenge** | Challenge 1: Invisible Impact (EX1_AUDIT) |
| **Secondary** | Challenge 2: Undisclosed AI/Data Practices |

## What Marina Does

1. **Impact Reporting** — Delivers personalised, numerically precise reports showing exactly what a donor's contribution achieved (m² of reef, coral fragments, CO₂ sequestered)
2. **Data Transparency** — Proactively discloses what data TidePool holds, the legal basis under GDPR, and how to exercise data rights (Articles 13, 15, 17, 22)
3. **Ethical AI Disclosure** — Opens every conversation by declaring she is an AI, explaining how she personalises responses, and offering opt-out
4. **Recurring Giving Guidance** — Frames monthly giving around specific additional conservation outcomes — never with pressure or urgency

## Project Structure

```
TidePoolAgent/
├── marina.js           # Main agent (interactive + live demo modes)
├── demo_offline.js     # System-prompt-faithful offline demonstration
├── .env.example        # Environment variable template
├── package.json        # Node.js dependencies
└── README.md           # This file
```

## Setup

### Prerequisites
- Node.js v18+
- Anthropic API key (get one at console.anthropic.com)

### Installation

```bash
git clone https://github.com/pramithirks-dev/TidePoolAgent.git
cd TidePoolAgent
npm install
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

### Running the Agent

**Interactive mode** (live conversation):
```bash
export ANTHROPIC_API_KEY=your_key_here
node marina.js --interactive
```

**Live demo mode** (scripted scenario, saves transcript):
```bash
export ANTHROPIC_API_KEY=your_key_here
node marina.js --demo
```

**Offline demo** (no API key required — system-prompt-faithful scripted responses):
```bash
node demo_offline.js
```

## Trust & Transparency Features

Every interaction includes:
- **AI Identity Disclosure** — Marina declares she is an AI at conversation open
- **Data Transparency Report** — Itemises exactly what data is held and legal basis
- **Impact Attribution** — Connects donation amount to specific m² of reef
- **Financial Breakdown** — Shows % split: conservation / research / admin
- **GDPR Rights** — Articles 13, 15, 17, 22 explained with contact details
- **Human Oversight Disclosure** — Responses noted as subject to human review
- **Opt-Out Pathway** — Offered proactively at tidepool.org/privacy

## Constraints (What Marina Will Never Do)

- Fabricate conservation statistics or project outcomes
- Impersonate a human staff member
- Apply pressure or urgency language around giving
- Collect personal data beyond what is in the donor record
- Dismiss or deflect donor concerns about data privacy

## Assignment Context

- **Module:** Customer Engagement and Artificial Intelligence (Semester 2)
- **Exercise:** EX2 — Agent Design & Deployment
- **Case Study:** TidePool Marine Conservation Crowdfunding Platform
- **Based on:** EX1_AUDIT — three trust-related challenges causing donation decline

---
*AI Tool Declaration: Agent designed and deployed using Claude Sonnet 4.6 (Anthropic) via Claude Code.*
