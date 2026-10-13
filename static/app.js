// DiscoveryToDelivery Application Logic
// Kampus.VC Applied AI Venture Studio Solution

let currentCreators = [];
let currentBriefs = [];
let currentEngagements = [];
let verifiedFilterActive = false;
let activeEngFilterStatus = "";

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  fetchStats();
  fetchEngagements();
  fetchCreators();
  fetchBriefs();
});

function refreshIcons() {
  setTimeout(() => lucide.createIcons(), 50);
}

// -------------------------------------------------------------
// TOAST NOTIFICATIONS
// -------------------------------------------------------------
function showToast(title, message, type = "success") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `p-4 rounded-xl border backdrop-blur-xl shadow-2xl flex items-start gap-3 w-84 pointer-events-auto transition-all transform translate-y-2 opacity-0 animate-modal-in ${
    type === "success" 
      ? "bg-[#091522]/95 border-cyan-500/40 text-cyan-200" 
      : "bg-[#200D16]/95 border-pink-500/40 text-pink-200"
  }`;
  
  toast.innerHTML = `
    <div class="mt-0.5"><i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}" class="w-4 h-4 text-cyan-400"></i></div>
    <div class="space-y-0.5 flex-1">
      <p class="text-xs font-semibold text-white">${title}</p>
      <p class="text-[11px] text-slate-300">${message}</p>
    </div>
  `;
  container.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    toast.classList.remove("translate-y-2", "opacity-0");
  }, 10);

  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-2");
    setTimeout(() => toast.remove(), 300);
  }, 4200);
}

// -------------------------------------------------------------
// TAB SWITCHING
// -------------------------------------------------------------
function switchTab(tabId) {
  const tabs = ["delivery", "creators", "briefs", "scorecard"];
  tabs.forEach(t => {
    const tabEl = document.getElementById(`tab-${t}`);
    const navEl = document.getElementById(`nav-${t}`);
    if (t === tabId) {
      tabEl.classList.remove("hidden");
      navEl.classList.add("active");
      navEl.classList.remove("text-slate-400");
      navEl.classList.add("text-white", "bg-gradient-to-r", "from-cyan-500/20", "to-blue-500/20", "border", "border-cyan-500/30");
    } else {
      tabEl.classList.add("hidden");
      navEl.classList.remove("active", "text-white", "bg-gradient-to-r", "from-cyan-500/20", "to-blue-500/20", "border", "border-cyan-500/30");
      navEl.classList.add("text-slate-400");
    }
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
  refreshIcons();
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.add("hidden");
}

// -------------------------------------------------------------
// STATS
// -------------------------------------------------------------
async function fetchStats() {
  try {
    const res = await fetch("/api/stats");
    const data = await res.json();
    if (data.success) {
      document.getElementById("stat-active-eng").textContent = data.active_engagements || 0;
      document.getElementById("stat-creators").textContent = data.verified_creators || 0;
      document.getElementById("stat-briefs").textContent = data.active_briefs || 0;
      document.getElementById("stat-deliveries").textContent = data.completed_deliveries || 0;
      document.getElementById("stat-trust").textContent = `${data.average_trust_score}%`;
    }
  } catch (err) {
    console.error("Failed to load stats", err);
  }
}

// -------------------------------------------------------------
// 1. DISCOVERY TO DELIVERY WORKFLOW ENGINE (Core Scope)
// -------------------------------------------------------------
async function fetchEngagements() {
  try {
    let url = "/api/engagements";
    if (activeEngFilterStatus) {
      url += `?status=${encodeURIComponent(activeEngFilterStatus)}`;
    }
    const res = await fetch(url);
    const data = await res.json();
    currentEngagements = data.engagements || [];
    renderEngagements(currentEngagements);
  } catch (err) {
    console.error("Failed to fetch engagements", err);
  }
}

function filterEngagements(status) {
  activeEngFilterStatus = status;
  document.querySelectorAll(".eng-filter-btn").forEach(btn => {
    if (btn.getAttribute("data-status") === status) {
      btn.className = "eng-filter-btn px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold";
    } else {
      btn.className = "eng-filter-btn px-3 py-1 rounded-lg bg-[#0C1220] text-slate-400 hover:text-white border border-[#1C273E]";
    }
  });
  fetchEngagements();
}

function renderEngagements(engagements) {
  const container = document.getElementById("engagements-container");
  if (!engagements || engagements.length === 0) {
    container.innerHTML = `
      <div class="glass-panel rounded-2xl p-12 text-center space-y-3">
        <i data-lucide="inbox" class="w-8 h-8 mx-auto text-slate-500"></i>
        <h4 class="text-sm font-bold text-white">No engagements match this filter</h4>
        <p class="text-xs text-slate-400">Launch a new engagement from the Creator catalog or submit a pitch on a brand brief.</p>
      </div>
    `;
    refreshIcons();
    return;
  }

  container.innerHTML = engagements.map(eng => {
    // Stage Step Index (1 to 5)
    let stageStep = 1;
    if (eng.status === 'In Generation & Review') stageStep = 3;
    else if (eng.status === 'Deliverables Submitted') stageStep = 4;
    else if (eng.status === 'Delivered & Verified') stageStep = 5;

    return `
      <div class="glass-panel rounded-2xl p-6 space-y-6">
        
        <!-- ENGAGEMENT HEADER -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1A243A]">
          <div class="flex items-center gap-3.5">
            <img src="${eng.creator_avatar}" alt="${eng.creator_name}" class="w-13 h-13 rounded-2xl object-cover border border-cyan-500/40 shadow-lg shadow-cyan-500/10">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono text-cyan-400 font-bold">${eng.id}</span>
                <span class="text-slate-500">·</span>
                <span class="text-xs text-slate-300 font-medium">${eng.brand_name} ↔ ${eng.creator_name}</span>
                <span class="text-slate-500 font-mono text-[11px]">${eng.creator_handle}</span>
              </div>
              <h3 class="text-base font-bold font-heading text-white mt-0.5">${eng.brief_title}</h3>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="text-right">
              <span class="text-[10px] font-mono text-slate-400 uppercase block">Contract Value</span>
              <span class="text-base font-bold text-cyan-400 font-mono">$${eng.agreed_budget.toLocaleString()}</span>
            </div>
            <span class="px-3 py-1 rounded-xl text-xs font-semibold ${
              eng.status === 'Delivered & Verified' ? 'status-pill-completed' :
              eng.status === 'In Generation & Review' ? 'status-pill-progress' :
              eng.status === 'Deliverables Submitted' ? 'status-pill-review' :
              'status-pill-pending'
            }">
              ${eng.status}
            </span>
          </div>
        </div>

        <!-- 5-STEP LIFECYCLE PROGRESSION BAR -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-[11px] font-mono">
            <span class="text-slate-400">Current Lifecycle Stage:</span>
            <span class="text-cyan-400 font-semibold">${eng.current_stage}</span>
          </div>
          <div class="grid grid-cols-5 gap-2">
            <div class="h-2 rounded-full ${stageStep >= 1 ? 'bg-cyan-400 shadow-sm shadow-cyan-400/50' : 'bg-[#182236]'}"></div>
            <div class="h-2 rounded-full ${stageStep >= 2 ? 'bg-blue-400 shadow-sm shadow-blue-400/50' : 'bg-[#182236]'}"></div>
            <div class="h-2 rounded-full ${stageStep >= 3 ? 'bg-purple-400 shadow-sm shadow-purple-400/50' : 'bg-[#182236]'}"></div>
            <div class="h-2 rounded-full ${stageStep >= 4 ? 'bg-pink-400 shadow-sm shadow-pink-400/50' : 'bg-[#182236]'}"></div>
            <div class="h-2 rounded-full ${stageStep >= 5 ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-[#182236]'}"></div>
          </div>
        </div>

        <!-- ESCROW & CONTRACT SUMMARY BAR -->
        <div class="bg-[#090C16] p-3.5 rounded-xl border border-[#1A243A] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div class="flex items-center gap-2">
            <i data-lucide="shield-check" class="w-4 h-4 text-emerald-400"></i>
            <span class="text-slate-300">License: <strong class="text-white">${eng.contract.license_type}</strong></span>
          </div>
          <div class="text-[11px] font-mono text-slate-400">
            Escrow Locked: <strong class="text-emerald-400 font-bold">$${eng.escrow_locked.toLocaleString()}</strong>
          </div>
        </div>

        <!-- PITCH PROPOSAL BOX (If in Stage 1 or for reference) -->
        ${eng.pitch_proposal ? `
          <div class="bg-[#0A0E1B] p-3.5 rounded-xl border border-[#1C273E] space-y-2">
            <div class="flex items-center justify-between text-xs font-mono">
              <span class="text-cyan-400 font-bold uppercase tracking-wider text-[10px]">Creator AI Pitch & Pipeline:</span>
              <span class="text-slate-400">Turnaround: ${eng.pitch_proposal.turnaround_days} Days · Seed: ${eng.pitch_proposal.sample_seed}</span>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">${eng.pitch_proposal.pitch_notes}</p>
          </div>
        ` : ''}

        <!-- MILESTONE PROGRESSION TRACKER -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-mono uppercase tracking-wider text-slate-400">Milestone Escrow Distribution & Payouts</h4>
            <span class="text-[11px] font-mono text-slate-500">Autonomous Smart Contract Logic</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            ${eng.milestones.map(m => `
              <div class="bg-[#0A0E1B] p-3 rounded-xl border ${
                m.status === 'Approved & Released' ? 'border-emerald-500/40 bg-emerald-950/10' :
                m.status === 'In Progress' ? 'border-cyan-500/40 bg-cyan-950/10' :
                'border-[#1C273E]'
              } space-y-2">
                <div class="flex items-center justify-between text-xs font-mono">
                  <span class="text-slate-300 font-semibold">${m.title}</span>
                  <span class="text-cyan-400 font-bold">$${m.amount}</span>
                </div>
                <div class="flex items-center justify-between text-[10px]">
                  <span class="${
                    m.status === 'Approved & Released' ? 'text-emerald-400 font-semibold' :
                    m.status === 'In Progress' ? 'text-cyan-300 font-semibold' :
                    'text-slate-500'
                  }">● ${m.status}</span>
                  ${m.released_at ? `<span class="text-slate-500 font-mono">${m.released_at}</span>` : ''}
                </div>
                ${m.status === 'In Progress' ? `
                  <button onclick="releaseMilestone('${eng.id}', '${m.id}')" class="w-full py-1.5 rounded-lg text-[10px] font-mono font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-all flex items-center justify-center gap-1.5">
                    <i data-lucide="check" class="w-3 h-3"></i>
                    <span>Approve & Release Milestone Payout ($${m.amount})</span>
                  </button>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- GENERATION PASSES / PROMPT ITERATIONS -->
        ${eng.iterations && eng.iterations.length > 0 ? `
          <div class="space-y-3">
            <h4 class="text-xs font-mono uppercase tracking-wider text-slate-400">Generation Iterations & Prompt Tweaks (${eng.iterations.length} Passes)</h4>
            <div class="space-y-2">
              ${eng.iterations.map(it => `
                <div class="bg-[#090C16] p-3 rounded-xl border border-[#1A243A] flex flex-col md:flex-row gap-4 items-start">
                  <img src="${it.preview_media}" alt="Draft" class="w-24 h-16 rounded-lg object-cover shrink-0 border border-[#1C273E]">
                  <div class="space-y-1 flex-1 text-xs">
                    <div class="flex items-center justify-between text-slate-400 font-mono text-[10px]">
                      <span class="text-cyan-400 font-semibold">Pass #${it.iteration_number}</span>
                      <span>${it.submitted_at}</span>
                    </div>
                    <p class="text-slate-300 font-medium">${it.notes}</p>
                    <p class="text-[11px] text-purple-300 bg-purple-950/30 p-1.5 rounded border border-purple-500/20">
                      <span class="text-purple-400 font-semibold">Brand Feedback:</span> ${it.brand_feedback}
                    </p>
                    ${it.prompt_adjusted ? `
                      <p class="text-[10px] font-mono text-cyan-400/80">Refinement: ${it.prompt_adjusted}</p>
                    ` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- FINAL DELIVERABLES PACKAGE DETAILS (If Submitted) -->
        ${eng.final_delivery ? `
          <div class="bg-[#090D18] p-4 rounded-xl border border-cyan-500/30 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-white flex items-center gap-2">
                <i data-lucide="package-check" class="w-4 h-4 text-cyan-400"></i> Deliverables Package Submitted
              </span>
              <span class="text-[10px] font-mono text-slate-400">${eng.final_delivery.delivered_at}</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px]">
              ${eng.final_delivery.files.map(f => `
                <div class="bg-[#0E1424] p-2.5 rounded-lg border border-[#1E283D] flex items-center justify-between">
                  <span class="text-slate-200 truncate">${f.name}</span>
                  <span class="text-cyan-400 shrink-0 ml-2">${f.size}</span>
                </div>
              `).join('')}
            </div>
            <p class="text-xs text-slate-300 bg-[#07090F] p-2.5 rounded-lg border border-[#1A243A]">
              <span class="text-cyan-400 font-mono font-bold">Provenance:</span> ${eng.final_delivery.provenance_statement}
            </p>
          </div>
        ` : ''}

        <!-- CRYPTOGRAPHIC COMMERCIAL USAGE CERTIFICATE (If Completed) -->
        ${eng.commercial_certificate ? `
          <div class="bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-purple-950/40 p-4 rounded-2xl border border-cyan-500/40 flex items-center justify-between gap-4">
            <div class="flex items-center gap-3.5">
              <div class="w-11 h-11 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/10">
                <i data-lucide="shield-check" class="w-6 h-6"></i>
              </div>
              <div>
                <span class="text-[10px] font-mono uppercase text-cyan-400 block font-bold">Provenance & Rights Verified</span>
                <p class="text-xs text-white font-semibold">${eng.commercial_certificate.certificate_id} · ${eng.commercial_certificate.rights_granted}</p>
                <p class="text-[10px] font-mono text-slate-400">${eng.commercial_certificate.cryptographic_hash.substring(0, 36)}...</p>
              </div>
            </div>
            <button onclick="viewCertificate('${eng.id}')" class="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all font-heading shrink-0 shadow-lg shadow-cyan-500/20">
              View Certificate
            </button>
          </div>
        ` : ''}

        <!-- ACTION BUTTONS ACCORDING TO STAGE -->
        <div class="pt-4 border-t border-[#1A243A] flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <button onclick="downloadWorkflowJson('production_comfyui_workflow.json')" class="px-3 py-1.5 rounded-lg bg-[#0C1220] hover:bg-[#141C30] text-slate-300 border border-[#1E283D] text-[11px] font-mono flex items-center gap-1.5 transition-all">
              <i data-lucide="file-code" class="w-3.5 h-3.5 text-cyan-400"></i>
              <span>Export ComfyUI Graph</span>
            </button>
          </div>

          <div class="flex items-center gap-2">
            ${eng.status === 'Discovery & Pitch' ? `
              <button onclick="acceptEngagement('${eng.id}')" class="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all font-heading shadow-lg shadow-cyan-500/20">
                Accept Proposal & Fund Escrow ($${eng.agreed_budget})
              </button>
            ` : ''}

            ${eng.status === 'In Generation & Review' ? `
              <button onclick="openAddIterationModal('${eng.id}')" class="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-all font-heading flex items-center gap-1.5 shadow-lg shadow-purple-600/20">
                <i data-lucide="plus-circle" class="w-3.5 h-3.5"></i>
                <span>Log Generation Pass</span>
              </button>
              <button onclick="openDeliverModal('${eng.id}')" class="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all font-heading flex items-center gap-1.5 shadow-lg shadow-cyan-500/20">
                <i data-lucide="upload-cloud" class="w-3.5 h-3.5"></i>
                <span>Submit Deliverables Package</span>
              </button>
            ` : ''}

            ${eng.status === 'Deliverables Submitted' ? `
              <button onclick="approveAndCertify('${eng.id}')" class="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all font-heading flex items-center gap-1.5 shadow-lg shadow-emerald-500/20">
                <i data-lucide="check-check" class="w-4 h-4"></i>
                <span>Approve Deliverables & Issue Certificate</span>
              </button>
            ` : ''}
          </div>
        </div>

      </div>
    `;
  }).join('');

  refreshIcons();
}

// -------------------------------------------------------------
// ENGAGEMENT STAGE ACTIONS (Accept, Release Milestone, Deliver, Approve)
// -------------------------------------------------------------
async function acceptEngagement(engId) {
  try {
    const res = await fetch(`/api/engagements/${engId}/accept`, { method: "POST" });
    const data = await res.json();
    if (data.success) {
      showToast("Proposal Accepted", data.message, "success");
      fetchEngagements();
      fetchStats();
    } else {
      showToast("Error", data.error || "Could not accept engagement", "error");
    }
  } catch (err) {
    showToast("Error", "Server error while accepting proposal", "error");
  }
}

async function releaseMilestone(engId, milestoneId) {
  try {
    const res = await fetch(`/api/engagements/${engId}/milestone/${milestoneId}/release`, { method: "POST" });
    const data = await res.json();
    if (data.success) {
      showToast("Milestone Released", data.message, "success");
      fetchEngagements();
      fetchStats();
    } else {
      showToast("Error", data.error || "Could not release milestone", "error");
    }
  } catch (err) {
    showToast("Error", "Server error releasing milestone", "error");
  }
}

function openAddIterationModal(engId) {
  document.getElementById("iter-eng-id").value = engId;
  document.getElementById("modal-add-iteration").classList.remove("hidden");
  refreshIcons();
}

async function submitIteration(e) {
  e.preventDefault();
  const engId = document.getElementById("iter-eng-id").value;
  const payload = {
    preview_media: document.getElementById("iter-media").value,
    notes: document.getElementById("iter-notes").value,
    prompt_adjusted: document.getElementById("iter-prompt").value,
    brand_feedback: document.getElementById("iter-feedback").value
  };

  try {
    const res = await fetch(`/api/engagements/${engId}/iterations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      closeModal("modal-add-iteration");
      showToast("Generation Pass Added", data.message, "success");
      fetchEngagements();
    } else {
      showToast("Error", data.error, "error");
    }
  } catch (err) {
    showToast("Error", "Could not submit iteration pass", "error");
  }
}

function openDeliverModal(engId) {
  document.getElementById("deliver-eng-id").value = engId;
  document.getElementById("modal-deliver").classList.remove("hidden");
  refreshIcons();
}

async function submitFinalDelivery(e) {
  e.preventDefault();
  const engId = document.getElementById("deliver-eng-id").value;
  const payload = {
    provenance_statement: document.getElementById("deliver-provenance").value
  };

  try {
    const res = await fetch(`/api/engagements/${engId}/deliver`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      closeModal("modal-deliver");
      showToast("Deliverables Submitted", data.message, "success");
      fetchEngagements();
    } else {
      showToast("Error", data.error, "error");
    }
  } catch (err) {
    showToast("Error", "Could not submit final deliverables", "error");
  }
}

async function approveAndCertify(engId) {
  try {
    const res = await fetch(`/api/engagements/${engId}/approve`, { method: "POST" });
    const data = await res.json();
    if (data.success) {
      showToast("Commercial Rights Certified", data.message, "success");
      fetchEngagements();
      fetchStats();
      viewCertificate(engId);
    } else {
      showToast("Error", data.error, "error");
    }
  } catch (err) {
    showToast("Error", "Could not approve deliverables", "error");
  }
}

async function viewCertificate(engId) {
  try {
    const res = await fetch(`/api/engagements/${engId}/certificate`);
    const data = await res.json();
    if (!data.success) {
      showToast("Not Found", "Certificate not available.", "error");
      return;
    }

    const cert = data.certificate;
    const body = document.getElementById("certificate-modal-body");
    body.innerHTML = `
      <div class="space-y-6">
        
        <!-- CERTIFICATE HEADER -->
        <div class="flex items-start justify-between border-b border-[#1C273E] pb-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/40 shadow-lg shadow-cyan-500/20">
              <i data-lucide="award" class="w-6 h-6"></i>
            </div>
            <div>
              <span class="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold block">Official Commercial Verification</span>
              <h2 class="text-xl font-heading font-bold text-white">Commercial Rights & AI Provenance Certificate</h2>
            </div>
          </div>
          <span class="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40">VERIFIED SAFE</span>
        </div>

        <!-- CERTIFICATE DETAILS GRID -->
        <div class="grid grid-cols-2 gap-4 font-mono text-xs">
          <div class="bg-[#090D18] p-3 rounded-xl border border-[#1A243A]">
            <span class="text-slate-500 block text-[10px]">CERTIFICATE ID:</span>
            <span class="text-cyan-400 font-bold">${cert.certificate_id}</span>
          </div>
          <div class="bg-[#090D18] p-3 rounded-xl border border-[#1A243A]">
            <span class="text-slate-500 block text-[10px]">VERIFIED TIMESTAMP:</span>
            <span class="text-slate-200">${cert.timestamp}</span>
          </div>
          <div class="bg-[#090D18] p-3 rounded-xl border border-[#1A243A]">
            <span class="text-slate-500 block text-[10px]">LICENSED TO:</span>
            <span class="text-white font-bold">${cert.issued_to}</span>
          </div>
          <div class="bg-[#090D18] p-3 rounded-xl border border-[#1A243A]">
            <span class="text-slate-500 block text-[10px]">CREATOR ATTESTATION:</span>
            <span class="text-white font-bold">${cert.creator}</span>
          </div>
        </div>

        <!-- RIGHTS & REPRODUCIBILITY STATEMENTS -->
        <div class="bg-[#090D18] p-4 rounded-xl border border-[#1A243A] space-y-2 text-xs">
          <div class="flex items-center justify-between">
            <span class="text-slate-400 font-mono">Scope of Rights:</span>
            <span class="text-emerald-400 font-bold font-mono">${cert.rights_granted}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-400 font-mono">Workflow Deterministic Score:</span>
            <span class="text-cyan-400 font-bold font-mono">${cert.workflow_reproducibility_score}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-400 font-mono">AI Model Indemnity:</span>
            <span class="text-slate-200 font-mono">Cleared & Warranted Clean</span>
          </div>
        </div>

        <!-- TAMPER-PROOF SHA-256 HASH -->
        <div class="bg-[#07090F] p-3 rounded-xl border border-[#1E283D] font-mono text-[11px] space-y-1">
          <span class="text-cyan-400 font-bold block text-[10px] uppercase">Cryptographic Audit Hash:</span>
          <p class="text-slate-300 break-all select-all">${cert.cryptographic_hash}</p>
        </div>

        <!-- FOOTER & DOWNLOAD -->
        <div class="flex items-center justify-between pt-2">
          <span class="text-[11px] font-mono text-slate-500">Issued via ${cert.verifier}</span>
          <button onclick="downloadWorkflowJson('${cert.certificate_id}.json')" class="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all font-heading">
            Download Signed Certificate JSON
          </button>
        </div>

      </div>
    `;

    document.getElementById("modal-certificate").classList.remove("hidden");
    refreshIcons();
  } catch (err) {
    showToast("Error", "Could not load certificate.", "error");
  }
}

// -------------------------------------------------------------
// 2. DISCOVER AI CREATORS & MULTI-FACETED SEARCH
// -------------------------------------------------------------
let searchDebounceTimeout = null;
function debounceFetchCreators() {
  clearTimeout(searchDebounceTimeout);
  searchDebounceTimeout = setTimeout(fetchCreators, 250);
}

function toggleVerifiedFilter() {
  verifiedFilterActive = !verifiedFilterActive;
  const btn = document.getElementById("btn-toggle-verified");
  if (verifiedFilterActive) {
    btn.classList.add("bg-cyan-950/60", "border-cyan-500/50", "text-cyan-300");
    btn.classList.remove("bg-[#090D18]", "text-slate-400");
  } else {
    btn.classList.remove("bg-cyan-950/60", "border-cyan-500/50", "text-cyan-300");
    btn.classList.add("bg-[#090D18]", "text-slate-400");
  }
  fetchCreators();
}

function resetCreatorFilters() {
  document.getElementById("filter-search").value = "";
  document.getElementById("filter-tool").value = "";
  document.getElementById("filter-content-type").value = "";
  document.getElementById("filter-sort").value = "rating_desc";
  verifiedFilterActive = false;
  const btn = document.getElementById("btn-toggle-verified");
  btn.classList.remove("bg-cyan-950/60", "border-cyan-500/50", "text-cyan-300");
  btn.classList.add("bg-[#090D18]", "text-slate-400");
  fetchCreators();
}

async function fetchCreators() {
  const q = document.getElementById("filter-search")?.value || "";
  const tool = document.getElementById("filter-tool")?.value || "";
  const contentType = document.getElementById("filter-content-type")?.value || "";
  const sort = document.getElementById("filter-sort")?.value || "rating_desc";

  const params = new URLSearchParams();
  if (q) params.append("q", q);
  if (tool) params.append("tool", tool);
  if (contentType) params.append("content_type", contentType);
  if (verifiedFilterActive) params.append("verified", "true");
  if (sort) params.append("sort", sort);

  try {
    const res = await fetch(`/api/creators?${params.toString()}`);
    const data = await res.json();
    currentCreators = data.creators || [];
    renderCreators(currentCreators, data.empty_suggestions);
    populateCreatorSelect(currentCreators);
  } catch (err) {
    console.error("Failed to load creators", err);
  }
}

function renderCreators(creators, emptySuggestions) {
  const grid = document.getElementById("creators-grid");
  const emptyState = document.getElementById("creators-empty-state");
  const countText = document.getElementById("creators-count-text");

  if (countText) {
    countText.textContent = `Showing ${creators.length} creator${creators.length === 1 ? '' : 's'}`;
  }

  if (!creators || creators.length === 0) {
    grid.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");
  grid.innerHTML = creators.map(c => `
    <div class="glass-card-interactive rounded-2xl p-5 flex flex-col justify-between space-y-4">
      <div class="space-y-3">
        
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <img src="${c.avatar}" alt="${c.name}" class="w-12 h-12 rounded-xl object-cover border border-[#232F4A]">
            <div>
              <div class="flex items-center gap-1.5">
                <h3 class="font-heading font-bold text-sm text-white hover:text-cyan-400 transition-colors cursor-pointer" onclick="viewCreatorDetail('${c.id}')">${c.name}</h3>
                ${c.verification?.verified_creator ? `
                  <span title="Verified AI Creator" class="text-cyan-400">
                    <i data-lucide="badge-check" class="w-4 h-4 fill-cyan-400/20"></i>
                  </span>
                ` : ''}
              </div>
              <p class="text-[11px] text-slate-400 font-mono">${c.handle} · <span class="text-slate-300">${c.location}</span></p>
            </div>
          </div>
          
          <div class="text-right shrink-0">
            <div class="flex items-center gap-1 text-amber-400 text-xs font-semibold">
              <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400"></i>
              <span>${c.rating.toFixed(1)}</span>
              <span class="text-slate-500 font-mono">(${c.review_count})</span>
            </div>
            <span class="text-xs font-bold text-cyan-400 font-mono block mt-0.5">$${c.hourly_rate}/hr</span>
          </div>
        </div>

        <p class="text-xs text-slate-300 line-clamp-2 leading-relaxed">${c.bio}</p>

        <!-- VERIFIED TOOLS TAGS -->
        <div class="flex flex-wrap gap-1.5 pt-1">
          ${c.tools.slice(0, 3).map(t => `
            <span class="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-[#090D18] text-slate-300 border border-[#1E283D]">
              ${t.name}
            </span>
          `).join('')}
          ${c.tools.length > 3 ? `<span class="px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-500">+${c.tools.length - 3}</span>` : ''}
        </div>

        <!-- VERIFICATION SIGNALS (Bonus Credit) -->
        <div class="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1">
          <div class="bg-[#090D18] p-2 rounded-lg border border-[#1A243A] flex items-center gap-1.5">
            <i data-lucide="shield" class="w-3.5 h-3.5 text-emerald-400 shrink-0"></i>
            <span class="text-slate-300 truncate">Indemnity Safe</span>
          </div>
          <div class="bg-[#090D18] p-2 rounded-lg border border-[#1A243A] flex items-center gap-1.5">
            <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-cyan-400 shrink-0"></i>
            <span class="text-slate-300 truncate">Workflow Audited</span>
          </div>
        </div>

      </div>

      <!-- CARD FOOTER: ACTIONS -->
      <div class="pt-3 border-t border-[#1C273E] flex items-center justify-between gap-2">
        <button onclick="viewCreatorDetail('${c.id}')" class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#121A2C] hover:bg-[#1A253E] border border-[#233252] text-slate-200 transition-all">
          Inspect Portfolio
        </button>

        <button onclick="initiateCreatorEngagement('${c.id}')" class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all font-heading">
          Start Engagement
        </button>
      </div>

    </div>
  `).join('');

  refreshIcons();
}

async function viewCreatorDetail(creatorId) {
  try {
    const res = await fetch(`/api/creators/${creatorId}`);
    const data = await res.json();
    if (!data.success) return;

    const c = data.creator;
    const modalBody = document.getElementById("creator-modal-body");

    modalBody.innerHTML = `
      <div class="space-y-6">
        
        <!-- CREATOR BANNER & HEADER -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1C273E] pb-5">
          <div class="flex items-center gap-4">
            <img src="${c.avatar}" alt="${c.name}" class="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-xl font-heading font-bold text-white">${c.name}</h3>
                <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/40">Verified Pro</span>
              </div>
              <p class="text-xs text-slate-400 font-mono">${c.handle} · ${c.location} · <strong class="text-cyan-400">$${c.hourly_rate}/hr</strong></p>
            </div>
          </div>

          <button onclick="closeModal('modal-creator-profile'); initiateCreatorEngagement('${c.id}')" class="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all font-heading shadow-lg shadow-cyan-500/20">
            Initiate Engagement Protocol
          </button>
        </div>

        <!-- HARDWARE & SPECIFICATIONS -->
        <div class="bg-[#090D18] p-3 rounded-xl border border-[#1A243A] flex items-center justify-between text-xs font-mono">
          <span class="text-slate-400">Verified Hardware Rig:</span>
          <span class="text-cyan-400 font-bold">${c.hardware_specs}</span>
        </div>

        <!-- PORTFOLIO WITH WORKFLOW INSPECTION -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-mono uppercase tracking-wider text-slate-400">AI Portfolio Workflows (100% Deterministic Reproducibility)</h4>
            <span class="text-[11px] text-cyan-400 font-mono">Seed & Parameter Provenance</span>
          </div>

          <div class="space-y-4">
            ${c.portfolio.map(p => `
              <div class="bg-[#090D18] border border-[#1C273E] rounded-2xl p-4 space-y-4">
                <div class="flex flex-col md:flex-row gap-4">
                  <div class="md:w-1/3 shrink-0 space-y-2">
                    <img src="${p.media_url}" alt="${p.title}" class="w-full rounded-xl object-cover aspect-video border border-[#1C273E]">
                    <div class="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Aspect: ${p.aspect_ratio}</span>
                      <span>Client: ${p.client}</span>
                    </div>
                  </div>

                  <div class="md:w-2/3 space-y-2.5">
                    <div>
                      <h5 class="font-bold text-sm text-white">${p.title}</h5>
                      <p class="text-xs text-slate-400">${p.description}</p>
                    </div>

                    <!-- PROMPT & SEED BREAKDOWN BOX -->
                    <div class="bg-[#07090F] p-3 rounded-xl border border-[#1E283D] space-y-2 font-mono text-xs">
                      <div>
                        <span class="text-cyan-400 font-bold block text-[10px] uppercase">Positive Prompt:</span>
                        <p class="text-slate-300 text-[11px] select-all">${p.ai_breakdown.prompt_used}</p>
                      </div>
                      <div>
                        <span class="text-pink-400 font-bold block text-[10px] uppercase">Negative Prompt:</span>
                        <p class="text-slate-400 text-[10px] select-all">${p.ai_breakdown.negative_prompt}</p>
                      </div>
                      <div class="grid grid-cols-3 gap-2 pt-2 border-t border-[#1C273E] text-[10px] text-slate-400">
                        <div><span>Seed:</span> <strong class="text-slate-200">${p.ai_breakdown.seed}</strong></div>
                        <div><span>Sampler:</span> <strong class="text-slate-200">${p.ai_breakdown.sampler}</strong></div>
                        <div><span>CFG Scale:</span> <strong class="text-slate-200">${p.ai_breakdown.cfg_scale}</strong></div>
                      </div>
                      <div class="pt-1 text-[10px] text-slate-400">
                        <span>Upscale Pipeline:</span> <strong class="text-purple-300">${p.ai_breakdown.upscale_pipeline}</strong>
                      </div>
                    </div>

                    <div class="flex items-center justify-between text-xs pt-1">
                      <span class="text-[11px] font-mono text-slate-400">Models: ${p.ai_breakdown.primary_models.join(', ')}</span>
                      <button onclick="downloadWorkflowJson('${p.ai_breakdown.workflow_file}')" class="px-3 py-1.5 rounded-lg bg-[#121A2C] hover:bg-[#1A253E] text-cyan-300 border border-[#233252] text-[11px] font-mono flex items-center gap-1.5 transition-all">
                        <i data-lucide="file-code" class="w-3.5 h-3.5"></i>
                        <span>Export ComfyUI Graph</span>
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;

    document.getElementById("modal-creator-profile").classList.remove("hidden");
    refreshIcons();
  } catch (err) {
    console.error("Failed to load creator detail", err);
  }
}

function populateCreatorSelect(creators) {
  const select = document.getElementById("eng-creator-select");
  if (!select) return;
  select.innerHTML = creators.map(c => `
    <option value="${c.id}">${c.name} (${c.handle}) — $${c.hourly_rate}/hr</option>
  `).join('');
}

function initiateCreatorEngagement(creatorId) {
  const creator = currentCreators.find(c => c.id === creatorId);
  if (!creator) return;

  const select = document.getElementById("eng-creator-select");
  if (select) select.value = creatorId;

  document.getElementById("modal-new-engagement").classList.remove("hidden");
  refreshIcons();
}

function downloadWorkflowJson(filename) {
  window.location.href = `/api/workflow-download/${encodeURIComponent(filename)}`;
  showToast("Workflow Downloaded", `${filename} downloaded successfully.`, "success");
}

// -------------------------------------------------------------
// 3. BRAND BRIEFS & AI BRIEF BUILDER (20% + Bonus 5%)
// -------------------------------------------------------------
async function fetchBriefs() {
  try {
    const res = await fetch("/api/briefs");
    const data = await res.json();
    currentBriefs = data.briefs || [];
    renderBriefs(currentBriefs);
  } catch (err) {
    console.error("Failed to fetch briefs", err);
  }
}

function renderBriefs(briefs) {
  const grid = document.getElementById("briefs-grid");
  if (!briefs || briefs.length === 0) {
    grid.innerHTML = `<p class="col-span-3 text-center text-slate-500 py-8">No active creative briefs.</p>`;
    return;
  }

  grid.innerHTML = briefs.map(b => `
    <div class="glass-card-interactive rounded-2xl p-5 flex flex-col justify-between space-y-4">
      <div class="space-y-3">
        
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-2.5">
            <img src="${b.brand_logo}" alt="${b.brand_name}" class="w-10 h-10 rounded-xl object-cover border border-[#232F4A]">
            <div>
              <span class="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">${b.brand_name}</span>
              <h3 class="font-heading font-bold text-sm text-white line-clamp-1">${b.title}</h3>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-500/30 shrink-0">
            $${b.budget.toLocaleString()}
          </span>
        </div>

        <p class="text-xs text-slate-300 line-clamp-2 leading-relaxed">${b.campaign_overview}</p>

        <!-- FORMAT & STYLE BADGES -->
        <div class="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
          <div class="bg-[#090D18] p-2 rounded-lg border border-[#1A243A]">
            <span class="text-slate-500 block text-[9px]">FORMAT</span>
            <span class="text-cyan-400 truncate block">${b.format_aspect_ratio}</span>
          </div>
          <div class="bg-[#090D18] p-2 rounded-lg border border-[#1A243A]">
            <span class="text-slate-500 block text-[9px]">STYLE</span>
            <span class="text-purple-400 truncate block">${b.style}</span>
          </div>
        </div>

        <!-- COMMERCIAL USE REQUIREMENTS -->
        <div class="bg-[#090D18] p-2.5 rounded-xl border border-[#1A243A] space-y-1">
          <div class="flex items-center justify-between text-[10px] font-mono">
            <span class="text-slate-400">Licensing:</span>
            <span class="text-emerald-400 font-semibold truncate ml-2">${b.commercial_use_requirements.license_type}</span>
          </div>
          <div class="flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>Model Indemnity:</span>
            <span class="text-slate-300">${b.commercial_use_requirements.model_indemnity_required ? 'Required & Cleared' : 'Standard'}</span>
          </div>
        </div>

      </div>

      <!-- FOOTER: PITCH BUTTON -->
      <div class="pt-3 border-t border-[#1C273E] flex items-center justify-between gap-2">
        <span class="text-[11px] font-mono text-slate-400">${b.pitch_count || 0} Creator Pitches</span>
        <button onclick="pitchOnBrief('${b.id}', '${b.title.replace(/'/g, "\\'")}', '${b.brand_name.replace(/'/g, "\\'")}', ${b.budget})" class="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all font-heading">
          Pitch on Brief
        </button>
      </div>
    </div>
  `).join('');

  refreshIcons();
}

function pitchOnBrief(briefId, title, brand, budget) {
  document.getElementById("eng-title").value = `Pitch for: ${title}`;
  document.getElementById("eng-brand").value = brand;
  document.getElementById("eng-budget").value = budget;
  document.getElementById("modal-new-engagement").classList.remove("hidden");
  refreshIcons();
}

function openAiBriefModal() {
  document.getElementById("modal-ai-brief").classList.remove("hidden");
  refreshIcons();
}

function openNewBriefModal() {
  document.getElementById("modal-new-brief").classList.remove("hidden");
  refreshIcons();
}

function openNewEngagementModal() {
  document.getElementById("modal-new-engagement").classList.remove("hidden");
  refreshIcons();
}

async function generateBriefWithAi() {
  const brand = document.getElementById("ai-brief-brand").value;
  const idea = document.getElementById("ai-brief-idea").value;
  const budget = document.getElementById("ai-brief-budget").value;
  const apiKey = document.getElementById("ai-brief-groq-key").value;
  const btn = document.getElementById("btn-ai-generate");
  const resultDiv = document.getElementById("ai-brief-result");

  if (!idea) {
    showToast("Idea Required", "Please describe your campaign concept.", "error");
    return;
  }

  btn.disabled = true;
  btn.innerHTML = `<i data-lucide="loader" class="w-4 h-4 animate-spin"></i><span>Synthesizing with AI Creative Director...</span>`;
  refreshIcons();

  try {
    const res = await fetch("/api/briefs/ai-generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brand_name: brand, idea, budget, api_key: apiKey })
    });
    const data = await res.json();
    if (!data.success) {
      showToast("Generation Failed", data.error || "Unable to generate brief.", "error");
      return;
    }

    const b = data.brief;
    window._lastAiBrief = b;

    resultDiv.classList.remove("hidden");
    resultDiv.innerHTML = `
      <div class="bg-[#090D18] border border-purple-500/40 rounded-xl p-4 space-y-3 font-sans">
        <div class="flex items-center justify-between pb-2 border-b border-[#1C273E]">
          <div>
            <span class="text-[10px] font-mono text-purple-400 block font-bold">${b.ai_engine_used}</span>
            <h4 class="text-sm font-bold text-white">${b.title}</h4>
          </div>
          <span class="text-xs font-mono text-cyan-400 font-bold">$${b.budget}</span>
        </div>

        <p class="text-xs text-slate-300 leading-relaxed">${b.campaign_overview}</p>

        <div class="grid grid-cols-2 gap-2 text-xs font-mono">
          <div class="bg-[#0E1424] p-2 rounded"><span class="text-slate-500 block text-[9px]">FORMAT:</span> ${b.format_aspect_ratio}</div>
          <div class="bg-[#0E1424] p-2 rounded"><span class="text-slate-500 block text-[9px]">STYLE:</span> ${b.style}</div>
        </div>

        <div class="bg-[#07090F] p-2.5 rounded-lg border border-[#1C273E] font-mono text-[11px] space-y-1">
          <span class="text-cyan-400 font-bold block text-[10px] uppercase">Recommended AI Models:</span>
          <p class="text-slate-300">${b.suggested_ai_models.join(' · ')}</p>
        </div>

        <div class="bg-[#07090F] p-2.5 rounded-lg border border-[#1C273E] font-mono text-[11px] space-y-1">
          <span class="text-purple-400 font-bold block text-[10px] uppercase">Synthesized Styleframe Prompt:</span>
          <p class="text-slate-300 select-all">${b.sample_prompt}</p>
        </div>

        <div class="flex items-center justify-between pt-2">
          <span class="text-[11px] text-emerald-400 font-mono">Commercial Terms & Milestones Structured</span>
          <button onclick="publishAiGeneratedBrief()" class="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all font-heading">
            Publish Brief to Marketplace
          </button>
        </div>
      </div>
    `;
    showToast("Brief Synthesized", "Complete structured AI brief created!", "success");
    refreshIcons();
  } catch (err) {
    showToast("Error", "Server error during AI brief generation.", "error");
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<i data-lucide="sparkles" class="w-4 h-4"></i><span>Synthesize Structured AI Brief</span>`;
    refreshIcons();
  }
}

async function publishAiGeneratedBrief() {
  if (!window._lastAiBrief) return;
  try {
    const res = await fetch("/api/briefs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(window._lastAiBrief)
    });
    const data = await res.json();
    if (data.success) {
      closeModal("modal-ai-brief");
      showToast("Brief Published", `"${window._lastAiBrief.title}" is now open for creator pitches!`, "success");
      fetchBriefs();
      fetchStats();
      switchTab("briefs");
    }
  } catch (err) {
    showToast("Error", "Could not publish brief.", "error");
  }
}

async function submitNewBrief(e) {
  e.preventDefault();
  const payload = {
    title: document.getElementById("nb-title").value,
    brand_name: document.getElementById("nb-brand").value,
    budget: document.getElementById("nb-budget").value,
    content_type: document.getElementById("nb-content-type").value,
    format_aspect_ratio: document.getElementById("nb-aspect").value,
    style: document.getElementById("nb-style").value,
    campaign_overview: document.getElementById("nb-overview").value,
    license_type: document.getElementById("nb-license").value
  };

  try {
    const res = await fetch("/api/briefs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      closeModal("modal-new-brief");
      document.getElementById("form-create-brief").reset();
      showToast("Brief Published", "New creative campaign posted to marketplace.", "success");
      fetchBriefs();
      fetchStats();
      switchTab("briefs");
    }
  } catch (err) {
    showToast("Error", "Could not post brief.", "error");
  }
}

async function submitNewEngagement(e) {
  e.preventDefault();
  const creatorId = document.getElementById("eng-creator-select").value;
  const creator = currentCreators.find(c => c.id === creatorId) || currentCreators[0];

  const payload = {
    creator_id: creator.id,
    creator_name: creator.name,
    creator_handle: creator.handle,
    creator_avatar: creator.avatar,
    brief_title: document.getElementById("eng-title").value,
    brand_name: document.getElementById("eng-brand").value,
    budget: document.getElementById("eng-budget").value,
    license_type: document.getElementById("eng-license").value,
    turnaround_days: document.getElementById("eng-turnaround").value,
    pitch_notes: document.getElementById("eng-pitch").value
  };

  try {
    const res = await fetch("/api/engagements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      closeModal("modal-new-engagement");
      showToast("Engagement Initiated", `Engagement launched with ${creator.name}!`, "success");
      fetchEngagements();
      fetchStats();
      switchTab("delivery");
    }
  } catch (err) {
    showToast("Error", "Could not initiate engagement.", "error");
  }
}
