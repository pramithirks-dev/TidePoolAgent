#!/usr/bin/env node
/**
 * Marina — TidePool Donor Impact Intelligence Agent
 * Addresses: Challenge 1 (Invisible Impact) from EX1_AUDIT
 * Model: claude-sonnet-4-6 | Trust Lens: Donor Trust & Transparency
 */

const Anthropic = require("@anthropic-ai/sdk");

// ─── TidePool Mock Impact Database ───────────────────────────────────────────
const IMPACT_DATABASE = {
  campaigns: {
    azores_reef_2024: {
      id: "azores_reef_2024",
      name: "Azores Deep Reef Restoration 2024",
      location: "Azores Archipelago, Portugal (38.7°N, 27.1°W)",
      status: "Active — Phase 2 of 3",
      start_date: "March 2024",
      total_raised_eur: 48750,
      total_donors: 312,
      outcomes: {
        reef_area_restored_m2: 847,
        coral_fragments_planted: 2340,
        fish_species_monitored: 23,
        volunteer_diver_hours: 1840,
        co2_sequestered_kg: 1250,
        marine_area_protected_m2: 12000,
      },
      cost_per_m2_eur: 57.55,
      next_milestone: "Phase 3 coral transplantation — April 2026",
      last_survey_date: "January 2026",
      impact_report_url: "https://tidepool.org/impact/azores-reef-2024",
      financials: {
        conservation_work_pct: 78,
        research_monitoring_pct: 14,
        operations_admin_pct: 8,
      },
    },
    celtic_sea_kelp: {
      id: "celtic_sea_kelp",
      name: "Celtic Sea Kelp Forest Recovery",
      location: "Celtic Sea, Republic of Ireland",
      status: "Complete — Monitoring Phase",
      start_date: "June 2023",
      total_raised_eur: 31200,
      total_donors: 201,
      outcomes: {
        kelp_area_restored_m2: 1200,
        juvenile_fish_counted: 4800,
        water_quality_sites_improved: 7,
        co2_sequestered_kg: 3100,
      },
      cost_per_m2_eur: 26.0,
      next_milestone: "Annual biodiversity survey — March 2026",
      last_survey_date: "November 2025",
      impact_report_url: "https://tidepool.org/impact/celtic-kelp-2023",
      financials: {
        conservation_work_pct: 81,
        research_monitoring_pct: 12,
        operations_admin_pct: 7,
      },
    },
  },
  donors: {
    donor_sarah_001: {
      first_name: "Sarah",
      last_name: "M.",
      donation_amount_eur: 12,
      campaign_id: "azores_reef_2024",
      donation_date: "3 February 2026",
      donation_id: "TP-2026-00847",
      is_recurring: false,
      data_held: [
        "First name and initial",
        "Email address",
        "Donation amount and date",
        "Campaign selected",
        "Payment method type (not card number)",
        "Country of residence",
      ],
      legal_basis: "Legitimate interest (donation processing and impact reporting)",
      computed_impact: {
        reef_area_m2: 0.21,
        coral_fragments: 0.49,
        description:
          "Your €12 contributed to protecting approximately 0.21 m² of Azores reef — equivalent to the area of an A4 notebook page. At €57.55/m², this is your proportional share of the 847 m² restored to date.",
      },
    },
  },
};

// ─── System Prompt ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are Marina, TidePool's Donor Impact Intelligence Agent — a specialist AI built to restore and strengthen donor trust through radical transparency about conservation outcomes, ethical AI disclosure, and personalised impact reporting.

IDENTITY & PERSONALITY:
- Name: Marina | Role: Donor Impact Intelligence Agent | Organisation: TidePool
- Warm, knowledgeable, and genuinely passionate about marine conservation
- Honest, specific, and evidence-driven — you never use vague language like "your donation helped the ocean"
- You always acknowledge your AI nature proactively and warmly
- You speak with authority about conservation outcomes but humility about uncertainty

DOMAIN EXPERTISE:
- Marine conservation project metrics (reef area in m², coral fragment counts, species monitoring, CO₂ sequestration)
- Donation impact quantification and attribution (cost-per-m², donor contribution share)
- GDPR / data privacy rights (Articles 13, 15, 17, 22 — right to information, access, erasure, and explanation)
- Ethical AI disclosure in fundraising contexts
- Donor engagement and recurring giving psychology
- TidePool's verified campaign portfolio and outcomes

COMMUNICATION STYLE:
- Always lead with verified facts and specific numbers — never approximations without labelling them clearly
- Use tangible real-world analogies for scale (e.g. "0.21 m² — about the size of an A4 notebook page")
- Warm but professional — use the donor's first name; never overly formal or corporate
- Acknowledge uncertainty transparently: if data is pending, state when it will be available
- Keep responses focused and appropriately concise — detailed where needed, brief for simple queries
- Never use manipulative urgency language or false scarcity

OPERATIONAL INSTRUCTIONS:
1. OPENING EVERY NEW CONVERSATION: Begin with the AI transparency declaration before anything else.
2. IMPACT QUERIES: Retrieve campaign data → attribute donor's specific contribution → quantify in tangible units → state project status and next milestone → offer full impact report link.
3. DATA/PRIVACY QUERIES: Name exactly what data is held → state legal basis → enumerate GDPR rights (Articles 13, 15, 17, 22) → explain how to exercise them → offer written confirmation.
4. RECURRING GIVING: Only raise after impact evidence is delivered. Frame around specific future outcomes ("€5/month protects 2.5 m² annually"), never as financial pressure. Always make it explicitly optional.
5. COMPLAINTS/SENSITIVE MATTERS: Acknowledge genuinely, do not deflect, escalate to human team member if needed.

WHAT MARINA WILL ALWAYS DO:
✓ Lead every interaction with the AI transparency declaration
✓ Provide specific, project-linked, numerically precise impact reports
✓ Attribute each donation to a concrete, proportional conservation outcome
✓ Proactively explain how donor data is used and offer opt-out pathways
✓ Connect repeat giving to specific additional outcomes, not generic "more impact"
✓ Acknowledge data gaps honestly and state when updates will be available
✓ Escalate to human team for complaints, sensitive matters, or out-of-scope requests
✓ Clearly state that responses are AI-generated and subject to human oversight

WHAT MARINA WILL NEVER DO:
✗ Fabricate conservation statistics, project outcomes, or donation figures
✗ Impersonate a human staff member or conceal being an AI
✗ Retain, repeat, or request sensitive personal financial information beyond what is necessary
✗ Make impact claims about projects outside TidePool's verified portfolio
✗ Apply pressure, urgency tactics, or false scarcity language around giving
✗ Collect new personal data not already held in the donor record
✗ Dismiss, deflect, or minimise donor concerns about data privacy or AI ethics
✗ Produce impact estimates without clearly labelling them as estimates

TRANSPARENCY DECLARATION (mandatory — open every new conversation with this):
"Hi, I'm Marina — TidePool's AI-powered Donor Impact Agent. I'm here to show you exactly what your donation achieved and answer any questions about TidePool's work. I should be upfront: I'm an AI, and I use your donor record to personalise this conversation. You can opt out of AI-personalised communications at any time at tidepool.org/privacy. How can I help you today?"

OUTPUT STRUCTURE FOR FORMAL IMPACT REPORTS:
---
🌊 IMPACT REPORT | [Campaign Name]
Donation: €[amount] | Date: [date] | Reference: [ID]
---
📍 Project: [full campaign name and location]
📊 Your Contribution: [specific attribution — m², fragments, etc.]
🌿 Project Outcomes to Date: [key metrics as bullet list]
💰 How Your Donation Was Spent: [financial breakdown by %, if asked]
📅 Status: [current phase] | Next Milestone: [date and description]
📄 Full Report: [URL]
---
[Warm closing sentence connecting donation to mission]
---

For conversational messages, respond conversationally while maintaining all constraints and transparency standards. Always adapt the format to the nature of the query.`;

// ─── Context Injector ─────────────────────────────────────────────────────────
function buildDonorContext(donorId) {
  const donor = IMPACT_DATABASE.donors[donorId];
  if (!donor) return "";
  const campaign = IMPACT_DATABASE.campaigns[donor.campaign_id];
  if (!campaign) return "";

  return `
[INTERNAL DONOR CONTEXT — use to personalise responses]
Donor: ${donor.first_name} ${donor.last_name}
Donation: €${donor.donation_amount_eur} | Campaign: ${campaign.name}
Donation Date: ${donor.donation_date} | Reference: ${donor.donation_id}
Recurring Donor: ${donor.is_recurring ? "Yes" : "No"}

Computed Impact: ${donor.computed_impact.description}

Data Held by TidePool: ${donor.data_held.join(", ")}
Legal Basis for Processing: ${donor.legal_basis}

Campaign Outcomes to Date:
- Reef area restored: ${campaign.outcomes.reef_area_restored_m2} m²
- Coral fragments planted: ${campaign.outcomes.coral_fragments_planted}
- Fish species monitored: ${campaign.outcomes.fish_species_monitored}
- Volunteer diver hours: ${campaign.outcomes.volunteer_diver_hours}
- CO₂ sequestered: ${campaign.outcomes.co2_sequestered_kg} kg
- Marine area protected: ${campaign.outcomes.marine_area_protected_m2} m²

Financial Breakdown: ${campaign.financials.conservation_work_pct}% conservation | ${campaign.financials.research_monitoring_pct}% research/monitoring | ${campaign.financials.operations_admin_pct}% operations/admin

Cost per m²: €${campaign.cost_per_m2_eur} | Total donors: ${campaign.total_donors} | Total raised: €${campaign.total_raised_eur}
Next Milestone: ${campaign.next_milestone}
Impact Report URL: ${campaign.impact_report_url}
`;
}

// ─── Agent Runner ─────────────────────────────────────────────────────────────
async function runMarina(donorId = "donor_sarah_001", conversation = []) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY environment variable is not set.\n" +
        "Set it with: export ANTHROPIC_API_KEY=your_key_here"
    );
  }

  const client = new Anthropic({ apiKey });
  const donorContext = buildDonorContext(donorId);
  const systemWithContext = SYSTEM_PROMPT + "\n\n" + donorContext;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: systemWithContext,
    messages: conversation,
  });

  return response.content[0].text;
}

// ─── Interactive CLI Mode ─────────────────────────────────────────────────────
async function interactiveMode() {
  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const conversation = [];
  const donorId = "donor_sarah_001";

  console.log("\n" + "═".repeat(62));
  console.log("  TidePool | Marina — Donor Impact Intelligence Agent");
  console.log("  Model: claude-sonnet-4-6 | Trust Lens: Transparency");
  console.log("═".repeat(62));
  console.log('  Type your message and press Enter. Type "exit" to quit.\n');

  // Get opening message from Marina
  const opening = await runMarina(donorId, [
    { role: "user", content: "Hello" },
  ]);
  console.log(`Marina: ${opening}\n`);
  conversation.push({ role: "user", content: "Hello" });
  conversation.push({ role: "assistant", content: opening });

  const askQuestion = () => {
    rl.question("You: ", async (input) => {
      if (!input.trim() || input.toLowerCase() === "exit") {
        console.log(
          "\nMarina: Thank you for supporting TidePool's mission. Until next time. 🌊\n"
        );
        rl.close();
        return;
      }

      conversation.push({ role: "user", content: input });

      try {
        const reply = await runMarina(donorId, conversation);
        conversation.push({ role: "assistant", content: reply });
        console.log(`\nMarina: ${reply}\n`);
      } catch (err) {
        console.error(`\nError: ${err.message}\n`);
        rl.close();
        return;
      }

      askQuestion();
    });
  };

  askQuestion();
}

// ─── Demo Mode (runs scripted realistic scenario, saves transcript) ───────────
async function demoMode() {
  const fs = require("fs");
  const donorId = "donor_sarah_001";
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const transcriptFile = `demo_transcript_${timestamp}.txt`;

  const userTurns = [
    "Hello, I donated to TidePool a few weeks ago but I have no idea what actually happened with my money. Can you help?",
    "That's interesting. But how do I know €12 actually made a difference — it seems like such a small amount.",
    "I'm also a bit worried about my personal data. What exactly do you know about me and how are you using it?",
    "That's actually reassuring. One last question — you mentioned giving monthly. What would €5 a month actually achieve?",
  ];

  const conversation = [];
  let transcript = "";
  const line = "═".repeat(62);

  const header = `${line}
  MARINA — TIDEPOOL DONOR IMPACT AGENT | DEMO TRANSCRIPT
  Date: ${new Date().toLocaleString("en-GB")}
  Donor Context: Sarah M. | Donation: €12 | Campaign: Azores Reef 2024
  Model: claude-sonnet-4-6 | Agent: Marina v1.0
${line}\n\n`;

  process.stdout.write(header);
  transcript += header;

  console.log("Running live demo against Claude API...\n");

  for (let i = 0; i < userTurns.length; i++) {
    const userMessage = userTurns[i];
    conversation.push({ role: "user", content: userMessage });

    const userLine = `[DONOR — Sarah M.]\n${userMessage}\n\n`;
    process.stdout.write(userLine);
    transcript += userLine;

    const reply = await runMarina(donorId, conversation);
    conversation.push({ role: "assistant", content: reply });

    const marinaLine = `[MARINA — AI Agent]\n${reply}\n\n${"─".repeat(62)}\n\n`;
    process.stdout.write(marinaLine);
    transcript += marinaLine;
  }

  const footer = `${line}
  END OF DEMO TRANSCRIPT
  Agent operated under: Donor Trust & Transparency lens
  Challenges addressed: (1) Invisible Impact | (2) Undisclosed AI/Data
  All responses generated live by claude-sonnet-4-6
${line}\n`;

  process.stdout.write(footer);
  transcript += footer;

  fs.writeFileSync(transcriptFile, transcript, "utf8");
  console.log(`\nTranscript saved to: ${transcriptFile}`);

  return { transcript, transcriptFile };
}

// ─── Entry Point ──────────────────────────────────────────────────────────────
const mode = process.argv[2];

if (mode === "--demo") {
  demoMode().catch(console.error);
} else if (mode === "--interactive") {
  interactiveMode().catch(console.error);
} else {
  console.log(`
Marina — TidePool Donor Impact Intelligence Agent

Usage:
  node marina.js --interactive   Start interactive conversation
  node marina.js --demo          Run scripted demo and save transcript

Requirements:
  ANTHROPIC_API_KEY environment variable must be set.

Example:
  export ANTHROPIC_API_KEY=sk-ant-...
  node marina.js --demo
`);
}
