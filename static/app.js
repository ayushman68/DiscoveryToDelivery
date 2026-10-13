// DiscoveryToDelivery — Enterprise AI Creator Marketplace Engine
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
// LUXURY TOAST NOTIFICATIONS
// -------------------------------------------------------------
function showToast(title, message, type = "success") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `p-4 rounded-2xl border backdrop-blur-2xl shadow-2xl flex items-start gap-3.5 w-88 pointer-events-auto transition-all transform translate-y-3 opacity-0 animate-modal-luxury ${
    type === "success" 
      ? "bg-[#060B18]/95 border-cyan-500/40 text-cyan-200 shadow-cyan-500/10" 
      : "bg-[#180610]/95 border-pink-500/40 text-pink-200 shadow-pink-500/10"
  }`;
  
  toast.innerHTML = `
    <div class="mt-0.5 w-8 h-8 rounded-xl ${type === 'success' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-pink-500/20 text-pink-400 border border-pink-500/30'} flex items-center justify-center shrink-0">
      <i data-lucide="${type === 'success' ? 'check-circle-2' : 'alert-circle'}" class="w-4 h-4"></i>
    </div>
    <div class="space-y-0.5 flex-1 min-w-0">
      <p class="text-xs font-heading font-bold text-white tracking-tight">${title}</p>
      <p class="text-[11px] text-slate-300 leading-snug break-words">${message}</p>
    </div>
  `;
  container.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    toast.classList.remove("translate-y-3", "opacity-0");
  }, 10);

  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-3");
    setTimeout(() => toast.remove(), 320);
  }, 4400);
}

// -------------------------------------------------------------
// NAVIGATION TAB SWITCHING
// -------------------------------------------------------------
function switchTab(tabId) {
  const tabs = ["delivery", "creators", "briefs"];
  tabs.forEach(t => {
    const tabEl = document.getElementById(`tab-${t}`);
    const navEl = document.getElementById(`nav-${t}`);
    if (t === tabId) {
      tabEl.classList.remove("hidden");
      navEl.classList.add("active", "text-white", "bg-gradient-to-r", "from-cyan-500/20", "via-blue-500/15", "to-purple-500/20", "border-cyan-400/40", "shadow-sm", "shadow-cyan-500/20");
      navEl.classList.remove("text-slate-400", "hover:bg-white/[0.04]");
    } else {
      tabEl.classList.add("hidden");
      navEl.classList.remove("active", "text-white", "bg-gradient-to-r", "from-cyan-500/20", "via-blue-500/15", "to-purple-500/20", "border-cyan-400/40", "shadow-sm", "shadow-cyan-500/20");
      navEl.classList.add("text-slate-400", "hover:bg-white/[0.04]");
    }
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
  refreshIcons();
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.add("hidden");
}

// -------------------------------------------------------------
// TELEMETRY & STATS
// -------------------------------------------------------------
async function fetchStats() {
  try {
    const res = await fetch("/api/stats");
    const data = await res.json();
    if (data.success) {
      document.getElementById("stat-active-eng").textContent = data.active_engagements || 0;
      document.getElementById("stat-creators").textContent = data.verified_creators || 0;
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
      btn.className = "eng-filter-btn px-3 py-1 rounded-lg bg-[#0C1220] text-slate-400 hover:text-white border border-white/[0.08]";
    }
  });
  fetchEngagements();
}

function renderEngagements(engagements) {
  const container = document.getElementById("engagements-container");
  if (!engagements || engagements.length === 0) {
    container.innerHTML = `
      <div class="glass-surface rounded-3xl p-16 text-center space-y-4 border-white/[0.08]">
        <div class="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
          <i data-lucide="inbox" class="w-7 h-7"></i>
        </div>
        <div class="space-y-1">
          <h4 class="text-base font-heading font-bold text-white">No Engagements in this Pipeline Stage</h4>
          <p class="text-xs text-slate-400 max-w-md mx-auto">Launch an engagement from the Creator catalog or submit a pitch on a brand brief to start tracking generative milestones.</p>
        </div>
        <button onclick="openNewEngagementModal()" class="btn-shimmer px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-400 text-slate-950 font-heading">
          Launch New Engagement Protocol
        </button>
      </div>
    `;
    refreshIcons();
    return;
  }

  container.innerHTML = engagements.map(eng => {
    let stageStep = 1;
    if (eng.status === 'In Generation & Review') stageStep = 3;
    else if (eng.status === 'Deliverables Submitted') stageStep = 4;
    else if (eng.status === 'Delivered & Verified') stageStep = 5;

    return `
      <div class="glass-surface rounded-3xl p-6 sm:p-7 space-y-6 border-white/[0.08] relative group">
        
        <!-- CARD HEADER -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
          <div class="flex items-center gap-4">
            <div class="relative">
              <img src="${eng.creator_avatar}" alt="${eng.creator_name}" class="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-400/40 shadow-lg shadow-cyan-500/15">
              <span class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#04060A] flex items-center justify-center text-[9px] text-slate-950 font-bold" title="Verified Creator">✓</span>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono text-cyan-400 font-bold tracking-wider">${eng.id}</span>
                <span class="text-slate-600">·</span>
                <span class="text-xs text-slate-300 font-semibold">${eng.brand_name} <span class="text-cyan-400">↔</span> ${eng.creator_name}</span>
                <span class="text-slate-500 font-mono text-[11px]">${eng.creator_handle}</span>
              </div>
              <h3 class="text-lg font-heading font-extrabold text-white mt-0.5 tracking-tight">${eng.brief_title}</h3>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="text-right">
              <span class="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Contract Budget</span>
              <span class="text-lg font-heading font-extrabold text-cyan-400 font-mono">$${eng.agreed_budget.toLocaleString()}</span>
            </div>
            <span class="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold ${
              eng.status === 'Delivered & Verified' ? 'badge-metallic-emerald' :
              eng.status === 'In Generation & Review' ? 'badge-metallic-cyan' :
              eng.status === 'Deliverables Submitted' ? 'badge-metallic-purple' :
              'badge-metallic-gold'
            }">
              ${eng.status}
            </span>
          </div>
        </div>

        <!-- 5-STAGE PIPELINE PROGRESSION STEPPER -->
        <div class="bg-[#060913] p-4 rounded-2xl border border-white/[0.06] space-y-3">
          <div class="flex items-center justify-between text-xs font-mono">
            <span class="text-slate-400 flex items-center gap-1.5">
              <i data-lucide="activity" class="w-3.5 h-3.5 text-cyan-400"></i> Active State:
            </span>
            <span class="text-cyan-400 font-bold">${eng.current_stage}</span>
          </div>
          
          <div class="grid grid-cols-5 gap-2">
            <div class="h-2 rounded-full ${stageStep >= 1 ? 'bg-cyan-400 shadow-sm shadow-cyan-400/50' : 'bg-white/[0.06]'}"></div>
            <div class="h-2 rounded-full ${stageStep >= 2 ? 'bg-blue-400 shadow-sm shadow-blue-400/50' : 'bg-white/[0.06]'}"></div>
            <div class="h-2 rounded-full ${stageStep >= 3 ? 'bg-purple-400 shadow-sm shadow-purple-400/50' : 'bg-white/[0.06]'}"></div>
            <div class="h-2 rounded-full ${stageStep >= 4 ? 'bg-pink-400 shadow-sm shadow-pink-400/50' : 'bg-white/[0.06]'}"></div>
            <div class="h-2 rounded-full ${stageStep >= 5 ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : 'bg-white/[0.06]'}"></div>
          </div>

          <div class="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
            <span class="${stageStep >= 1 ? 'text-cyan-400 font-bold' : ''}">01. Proposal</span>
            <span class="${stageStep >= 2 ? 'text-blue-400 font-bold' : ''}">02. Escrow Locked</span>
            <span class="${stageStep >= 3 ? 'text-purple-400 font-bold' : ''}">03. Multi-Pass Gen</span>
            <span class="${stageStep >= 4 ? 'text-pink-400 font-bold' : ''}">04. Audit Package</span>
            <span class="${stageStep >= 5 ? 'text-emerald-400 font-bold' : ''}">05. IP Certified</span>
          </div>
        </div>

        <!-- ESCROW & CONTRACT SUMMARY BAR -->
        <div class="bg-[#070A14] p-4 rounded-2xl border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div class="flex items-center gap-2">
            <i data-lucide="shield-check" class="w-4 h-4 text-emerald-400 shrink-0"></i>
            <span class="text-slate-300">Commercial Warranty: <strong class="text-white">${eng.contract.license_type}</strong></span>
          </div>
          <div class="text-[11px] font-mono text-slate-400 flex items-center gap-3">
            <span>Escrow Balance: <strong class="text-emerald-400 font-bold">$${eng.escrow_locked.toLocaleString()}</strong></span>
            <span class="text-slate-600">·</span>
            <span class="text-cyan-400">Model Indemnity Cleared</span>
          </div>
        </div>

        <!-- PITCH PROPOSAL BOX -->
        ${eng.pitch_proposal ? `
          <div class="bg-[#060913] p-4 rounded-2xl border border-white/[0.06] space-y-2">
            <div class="flex items-center justify-between text-xs font-mono">
              <span class="text-cyan-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <i data-lucide="sparkles" class="w-3.5 h-3.5"></i> Proposed Generative Pipeline:
              </span>
              <span class="text-slate-400">Turnaround: ${eng.pitch_proposal.turnaround_days} Days · Styleframe Seed: #${eng.pitch_proposal.sample_seed}</span>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed font-sans">${eng.pitch_proposal.pitch_notes}</p>
          </div>
        ` : ''}

        <!-- MILESTONE ESCROW DISTRIBUTION TRACKER -->
        <div class="space-y-2.5">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <i data-lucide="coins" class="w-3.5 h-3.5 text-amber-400"></i> Smart Milestone Escrow Distribution
            </h4>
            <span class="text-[11px] font-mono text-slate-500">Autonomous Release Protocol</span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            ${eng.milestones.map(m => `
              <div class="bg-[#070A14] p-3.5 rounded-2xl border ${
                m.status === 'Approved & Released' ? 'border-emerald-500/40 bg-emerald-950/15' :
                m.status === 'In Progress' ? 'border-cyan-500/40 bg-cyan-950/15' :
                'border-white/[0.08]'
              } space-y-2.5">
                <div class="flex items-center justify-between text-xs font-mono">
                  <span class="text-slate-300 font-bold truncate">${m.title}</span>
                  <span class="text-cyan-400 font-bold">$${m.amount}</span>
                </div>
                <div class="flex items-center justify-between text-[10px]">
                  <span class="${
                    m.status === 'Approved & Released' ? 'text-emerald-400 font-bold' :
                    m.status === 'In Progress' ? 'text-cyan-300 font-bold' :
                    'text-slate-500'
                  } font-mono">● ${m.status}</span>
                  ${m.released_at ? `<span class="text-slate-500 font-mono">${m.released_at}</span>` : ''}
                </div>
                ${m.status === 'In Progress' ? `
                  <button onclick="releaseMilestone('${eng.id}', '${m.id}')" class="btn-shimmer w-full py-2 rounded-xl text-[10px] font-mono font-bold bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-400/20">
                    <i data-lucide="check" class="w-3 h-3"></i>
                    <span>Approve & Release Payout ($${m.amount})</span>
                  </button>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- GENERATION PASSES / PROMPT ITERATIONS FEED -->
        ${eng.iterations && eng.iterations.length > 0 ? `
          <div class="space-y-3">
            <h4 class="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <i data-lucide="repeat" class="w-3.5 h-3.5 text-purple-400"></i> Generation Passes & Seed Log (${eng.iterations.length} Iterations)
            </h4>
            <div class="space-y-2.5">
              ${eng.iterations.map(it => `
                <div class="bg-[#060913] p-3.5 rounded-2xl border border-white/[0.08] flex flex-col md:flex-row gap-4 items-start">
                  <img src="${it.preview_media}" alt="Draft" class="w-28 h-20 rounded-xl object-cover shrink-0 border border-white/[0.12] shadow-md">
                  <div class="space-y-1.5 flex-1 text-xs">
                    <div class="flex items-center justify-between text-slate-400 font-mono text-[10px]">
                      <span class="badge-metallic-purple px-2 py-0.5 rounded text-[10px] font-bold">Pass #${it.iteration_number}</span>
                      <span>${it.submitted_at}</span>
                    </div>
                    <p class="text-slate-300 font-medium">${it.notes}</p>
                    <p class="text-[11px] text-purple-300 bg-purple-950/40 p-2 rounded-xl border border-purple-500/25">
                      <span class="text-purple-400 font-bold font-mono">Brand Feedback:</span> ${it.brand_feedback}
                    </p>
                    ${it.prompt_adjusted ? `
                      <p class="text-[10px] font-mono text-cyan-400 bg-cyan-950/30 p-1.5 rounded-lg border border-cyan-500/20">
                        <span class="text-cyan-300 font-bold">Adjusted Prompt:</span> ${it.prompt_adjusted}
                      </p>
                    ` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- FINAL DELIVERABLES PACKAGE DETAILS -->
        ${eng.final_delivery ? `
          <div class="bg-[#070A14] p-5 rounded-2xl border border-cyan-500/40 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-heading font-bold text-white flex items-center gap-2">
                <i data-lucide="package-check" class="w-4 h-4 text-cyan-400"></i> Final Master Deliverables Package Submitted
              </span>
              <span class="text-[10px] font-mono text-slate-400">${eng.final_delivery.delivered_at}</span>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-[11px]">
              ${eng.final_delivery.files.map(f => `
                <div class="bg-[#0B1020] p-3 rounded-xl border border-white/[0.08] flex items-center justify-between">
                  <span class="text-slate-200 truncate">${f.name}</span>
                  <span class="text-cyan-400 shrink-0 ml-2 font-bold">${f.size}</span>
                </div>
              `).join('')}
            </div>
            
            <p class="text-xs text-slate-300 bg-[#04060A] p-3 rounded-xl border border-white/[0.08] leading-relaxed">
              <span class="text-cyan-400 font-mono font-bold">Provenance Warranty:</span> ${eng.final_delivery.provenance_statement}
            </p>
          </div>
        ` : ''}

        <!-- CRYPTOGRAPHIC COMMERCIAL USAGE CERTIFICATE -->
        ${eng.commercial_certificate ? `
          <div class="bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-purple-950/40 p-5 rounded-2xl border border-cyan-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl shadow-cyan-500/10">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-400/40 shadow-lg shadow-cyan-500/20">
                <i data-lucide="shield-check" class="w-6 h-6"></i>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="badge-metallic-cyan px-2 py-0.5 rounded text-[9px] font-mono font-bold">SHA-256 VERIFIED</span>
                  <span class="text-xs text-white font-bold font-mono">${eng.commercial_certificate.certificate_id}</span>
                </div>
                <p class="text-xs text-slate-200 font-semibold mt-0.5">${eng.commercial_certificate.rights_granted}</p>
                <p class="text-[10px] font-mono text-slate-400">${eng.commercial_certificate.cryptographic_hash.substring(0, 38)}...</p>
              </div>
            </div>
            
            <button onclick="viewCertificate('${eng.id}')" class="btn-shimmer px-4 py-2.5 rounded-xl text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-all font-heading shrink-0 shadow-lg shadow-cyan-400/20">
              View Verifiable Certificate
            </button>
          </div>
        ` : ''}

        <!-- CARD FOOTER ACTIONS ACCORDING TO CURRENT STAGE -->
        <div class="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <button onclick="downloadWorkflowJson('production_comfyui_workflow.json')" class="px-3.5 py-2 rounded-xl bg-[#090D1A] hover:bg-[#10172C] text-slate-300 border border-white/[0.09] text-[11px] font-mono flex items-center gap-1.5 transition-all">
              <i data-lucide="file-code" class="w-3.5 h-3.5 text-cyan-400"></i>
              <span>Export ComfyUI Graph (.json)</span>
            </button>
          </div>

          <div class="flex items-center gap-2.5">
            ${eng.status === 'Discovery & Pitch' ? `
              <button onclick="acceptEngagement('${eng.id}')" class="btn-shimmer px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-all font-heading shadow-lg shadow-cyan-400/20">
                Accept Proposal & Fund Escrow ($${eng.agreed_budget})
              </button>
            ` : ''}

            ${eng.status === 'In Generation & Review' ? `
              <button onclick="openAddIterationModal('${eng.id}')" class="btn-shimmer px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white transition-all font-heading flex items-center gap-1.5 shadow-lg shadow-purple-600/25">
                <i data-lucide="plus-circle" class="w-3.5 h-3.5"></i>
                <span>Log Generation Pass</span>
              </button>
              <button onclick="openDeliverModal('${eng.id}')" class="btn-shimmer px-4 py-2 rounded-xl text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-all font-heading flex items-center gap-1.5 shadow-lg shadow-cyan-400/20">
                <i data-lucide="upload-cloud" class="w-3.5 h-3.5"></i>
                <span>Submit Deliverables Package</span>
              </button>
            ` : ''}

            ${eng.status === 'Deliverables Submitted' ? `
              <button onclick="approveAndCertify('${eng.id}')" class="btn-shimmer px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition-all font-heading flex items-center gap-1.5 shadow-lg shadow-emerald-400/20">
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
// LIFECYCLE ACTION HANDLERS
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
      showToast("Milestone Escrow Released", data.message, "success");
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
      showToast("Generation Pass Logged", data.message, "success");
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
      showToast("Deliverables Package Submitted", data.message, "success");
      fetchEngagements();
    } else {
      showToast("Error", data.error, "error");
    }
  } catch (err) {
    showToast("Error", "Could not submit deliverables package", "error");
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

// -------------------------------------------------------------
// VERIFIABLE CRYPTOGRAPHIC CERTIFICATE MODAL
// -------------------------------------------------------------
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
        <div class="flex items-start justify-between border-b border-white/[0.12] pb-5">
          <div class="flex items-center gap-3.5">
            <div class="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border-2 border-cyan-400/50 shadow-xl shadow-cyan-500/25">
              <i data-lucide="award" class="w-7 h-7"></i>
            </div>
            <div>
              <span class="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold block">Official Digital Authenticity Guarantee</span>
              <h2 class="text-2xl font-heading font-extrabold text-white mt-0.5">Commercial IP & Provenance Certificate</h2>
            </div>
          </div>
          <span class="badge-metallic-emerald px-3 py-1 rounded-full text-[10px] font-mono font-bold">100% INDEMNIFIED</span>
        </div>

        <!-- CERTIFICATE CREDENTIAL MATRIX -->
        <div class="grid grid-cols-2 gap-4 font-mono text-xs">
          <div class="bg-[#070A14] p-3.5 rounded-xl border border-white/[0.08]">
            <span class="text-slate-500 block text-[10px]">CERTIFICATE SERIAL:</span>
            <span class="text-cyan-400 font-bold">${cert.certificate_id}</span>
          </div>
          <div class="bg-[#070A14] p-3.5 rounded-xl border border-white/[0.08]">
            <span class="text-slate-500 block text-[10px]">TIMESTAMP (UTC):</span>
            <span class="text-slate-200">${cert.timestamp}</span>
          </div>
          <div class="bg-[#070A14] p-3.5 rounded-xl border border-white/[0.08]">
            <span class="text-slate-500 block text-[10px]">LICENSED BUYER:</span>
            <span class="text-white font-bold">${cert.issued_to}</span>
          </div>
          <div class="bg-[#070A14] p-3.5 rounded-xl border border-white/[0.08]">
            <span class="text-slate-500 block text-[10px]">VERIFIED CREATOR:</span>
            <span class="text-white font-bold">${cert.creator}</span>
          </div>
        </div>

        <!-- COMMERCIAL RIGHTS & REPRODUCIBILITY SCOPE -->
        <div class="bg-[#070A14] p-4 rounded-xl border border-white/[0.08] space-y-2.5 text-xs font-mono">
          <div class="flex items-center justify-between">
            <span class="text-slate-400">Granted Commercial Rights:</span>
            <span class="text-emerald-400 font-bold">${cert.rights_granted}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-400">Workflow Deterministic Score:</span>
            <span class="text-cyan-400 font-bold">${cert.workflow_reproducibility_score}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-400">Commercial Scope:</span>
            <span class="text-purple-300 font-bold">${cert.commercial_scope}</span>
          </div>
        </div>

        <!-- CRYPTOGRAPHIC SHA-256 AUDIT HASH -->
        <div class="bg-[#04060A] p-4 rounded-2xl border border-cyan-500/30 font-mono text-[11px] space-y-1.5 shadow-inner">
          <span class="text-cyan-400 font-bold block text-[10px] uppercase tracking-widest flex items-center gap-1.5">
            <i data-lucide="fingerprint" class="w-3.5 h-3.5"></i> Tamper-Proof Cryptographic Hash:
          </span>
          <p class="text-slate-300 break-all select-all font-mono">${cert.cryptographic_hash}</p>
        </div>

        <!-- FOOTER & EXPORT -->
        <div class="flex items-center justify-between pt-2">
          <span class="text-[11px] font-mono text-slate-500">Issued via ${cert.verifier}</span>
          <button onclick="downloadWorkflowJson('${cert.certificate_id}.json')" class="btn-shimmer px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-400 text-slate-950 font-heading">
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
    btn.classList.remove("bg-[#070A14]", "text-slate-400");
  } else {
    btn.classList.remove("bg-cyan-950/60", "border-cyan-500/50", "text-cyan-300");
    btn.classList.add("bg-[#070A14]", "text-slate-400");
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
  btn.classList.add("bg-[#070A14]", "text-slate-400");
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
    countText.textContent = `Showing ${creators.length} vetted creator${creators.length === 1 ? '' : 's'}`;
  }

  if (!creators || creators.length === 0) {
    grid.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");
  grid.innerHTML = creators.map(c => `
    <div class="glass-card-luxury rounded-3xl p-6 flex flex-col justify-between space-y-4">
      <div class="space-y-3.5">
        
        <!-- CARD HEADER -->
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3.5">
            <div class="relative">
              <img src="${c.avatar}" alt="${c.name}" class="w-13 h-13 rounded-2xl object-cover border border-white/[0.14] shadow-md">
              ${c.verification?.verified_creator ? `
                <span class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-cyan-400 border-2 border-[#04060A] flex items-center justify-center text-[9px] text-slate-950 font-bold">✓</span>
              ` : ''}
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <h3 class="font-heading font-bold text-sm text-white hover:text-cyan-400 transition-colors cursor-pointer" onclick="viewCreatorDetail('${c.id}')">${c.name}</h3>
                ${c.verification?.kampus_vc_fellow ? `
                  <span class="badge-metallic-purple px-1.5 py-0.2 rounded text-[9px] font-mono">FELLOW</span>
                ` : ''}
              </div>
              <p class="text-[11px] text-slate-400 font-mono">${c.handle} · <span class="text-slate-300">${c.location}</span></p>
            </div>
          </div>
          
          <div class="text-right shrink-0">
            <div class="flex items-center gap-1 text-amber-400 text-xs font-semibold">
              <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400"></i>
              <span class="font-bold">${c.rating.toFixed(1)}</span>
              <span class="text-slate-500 font-mono text-[10px]">(${c.review_count})</span>
            </div>
            <span class="text-xs font-bold text-cyan-400 font-mono block mt-0.5">$${c.hourly_rate}/hr</span>
          </div>
        </div>

        <p class="text-xs text-slate-300 line-clamp-2 leading-relaxed font-sans">${c.bio}</p>

        <!-- VERIFIED TOOLS TAGS -->
        <div class="flex flex-wrap gap-1.5 pt-1">
          ${c.tools.slice(0, 3).map(t => `
            <span class="px-2.5 py-1 rounded-xl text-[10px] font-mono bg-[#070A14] text-slate-300 border border-white/[0.08]">
              ${t.name}
            </span>
          `).join('')}
          ${c.tools.length > 3 ? `<span class="px-2 py-1 rounded-xl text-[10px] font-mono text-slate-500 bg-[#070A14] border border-white/[0.08]">+${c.tools.length - 3}</span>` : ''}
        </div>

        <!-- VERIFICATION SIGNALS -->
        <div class="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1">
          <div class="bg-[#070A14] p-2 rounded-xl border border-white/[0.06] flex items-center gap-1.5">
            <i data-lucide="shield" class="w-3.5 h-3.5 text-emerald-400 shrink-0"></i>
            <span class="text-slate-300 truncate">Indemnity Safe</span>
          </div>
          <div class="bg-[#070A14] p-2 rounded-xl border border-white/[0.06] flex items-center gap-1.5">
            <i data-lucide="check-circle-2" class="w-3.5 h-3.5 text-cyan-400 shrink-0"></i>
            <span class="text-slate-300 truncate">${c.verification?.trust_score || 98}% Trust Score</span>
          </div>
        </div>

      </div>

      <!-- CARD FOOTER ACTIONS -->
      <div class="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
        <button onclick="viewCreatorDetail('${c.id}')" class="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#090D1A] hover:bg-[#121A30] border border-white/[0.09] text-slate-200 transition-all font-heading">
          Inspect Pipeline
        </button>

        <button onclick="initiateCreatorEngagement('${c.id}')" class="btn-shimmer px-4 py-2 rounded-xl text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-all font-heading">
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
        
        <!-- CREATOR BANNER -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.1] pb-6">
          <div class="flex items-center gap-4">
            <img src="${c.avatar}" alt="${c.name}" class="w-18 h-18 rounded-3xl object-cover border-2 border-cyan-400/50 shadow-xl shadow-cyan-500/20">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-2xl font-heading font-extrabold text-white">${c.name}</h3>
                <span class="badge-metallic-cyan px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold">VERIFIED PRO</span>
              </div>
              <p class="text-xs text-slate-400 font-mono mt-0.5">${c.handle} · ${c.location} · <strong class="text-cyan-400">$${c.hourly_rate}/hr</strong> · <strong class="text-emerald-400">${c.completed_projects} Projects Delivered</strong></p>
            </div>
          </div>

          <button onclick="closeModal('modal-creator-profile'); initiateCreatorEngagement('${c.id}')" class="btn-shimmer px-5 py-3 rounded-xl text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-all font-heading shadow-lg shadow-cyan-400/20">
            Initiate Engagement Protocol
          </button>
        </div>

        <!-- HARDWARE RIG BANNER -->
        <div class="bg-[#070A14] p-4 rounded-2xl border border-white/[0.08] flex items-center justify-between text-xs font-mono">
          <span class="text-slate-400 flex items-center gap-2"><i data-lucide="cpu" class="w-4 h-4 text-cyan-400"></i> Hardware Studio Rig:</span>
          <span class="text-cyan-400 font-bold">${c.hardware_specs}</span>
        </div>

        <!-- PORTFOLIO WITH WORKFLOW INSPECTION -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-mono uppercase tracking-wider text-slate-400">AI Portfolio Workflows (Deterministic Reproducibility)</h4>
            <span class="text-[11px] text-cyan-400 font-mono">Seed & Parameter Provenance</span>
          </div>

          <div class="space-y-4">
            ${c.portfolio.map(p => `
              <div class="bg-[#070A14] border border-white/[0.08] rounded-2xl p-5 space-y-4">
                <div class="flex flex-col md:flex-row gap-5">
                  <div class="md:w-1/3 shrink-0 space-y-2">
                    <img src="${p.media_url}" alt="${p.title}" class="w-full rounded-xl object-cover aspect-video border border-white/[0.1] shadow-md">
                    <div class="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Aspect: <strong class="text-white">${p.aspect_ratio}</strong></span>
                      <span>Client: <strong class="text-cyan-400">${p.client}</strong></span>
                    </div>
                  </div>

                  <div class="md:w-2/3 space-y-3">
                    <div>
                      <h5 class="font-heading font-bold text-base text-white">${p.title}</h5>
                      <p class="text-xs text-slate-400 font-sans mt-0.5">${p.description}</p>
                    </div>

                    <!-- PROMPT MATRIX BOX -->
                    <div class="bg-[#04060A] p-4 rounded-xl border border-white/[0.08] space-y-2.5 font-mono text-xs shadow-inner">
                      <div>
                        <span class="text-cyan-400 font-bold block text-[10px] uppercase tracking-wider">Positive Prompt:</span>
                        <p class="text-slate-300 text-[11px] select-all leading-relaxed">${p.ai_breakdown.prompt_used}</p>
                      </div>
                      <div>
                        <span class="text-pink-400 font-bold block text-[10px] uppercase tracking-wider">Negative Prompt:</span>
                        <p class="text-slate-400 text-[10px] select-all">${p.ai_breakdown.negative_prompt}</p>
                      </div>
                      <div class="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.06] text-[10px] text-slate-400">
                        <div><span>Seed:</span> <strong class="text-slate-200">#${p.ai_breakdown.seed}</strong></div>
                        <div><span>Sampler:</span> <strong class="text-slate-200">${p.ai_breakdown.sampler}</strong></div>
                        <div><span>CFG Scale:</span> <strong class="text-slate-200">${p.ai_breakdown.cfg_scale}</strong></div>
                      </div>
                      <div class="pt-1 text-[10px] text-slate-400">
                        <span>Upscale Pipeline:</span> <strong class="text-purple-300">${p.ai_breakdown.upscale_pipeline}</strong>
                      </div>
                    </div>

                    <div class="flex items-center justify-between text-xs pt-1">
                      <span class="text-[11px] font-mono text-slate-400">Models: ${p.ai_breakdown.primary_models.join(' · ')}</span>
                      <button onclick="downloadWorkflowJson('${p.ai_breakdown.workflow_file}')" class="px-3.5 py-1.5 rounded-xl bg-[#090D1A] hover:bg-[#121A30] text-cyan-300 border border-white/[0.09] text-[11px] font-mono flex items-center gap-1.5 transition-all">
                        <i data-lucide="file-code" class="w-3.5 h-3.5"></i>
                        <span>Export ComfyUI Node Graph</span>
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
  showToast("ComfyUI Graph Downloaded", `${filename} exported successfully with deterministic node parameters.`, "success");
}

// -------------------------------------------------------------
// 3. BRAND BRIEFS & AI BRIEF BUILDER
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
    grid.innerHTML = `<p class="col-span-3 text-center text-slate-500 py-12">No active creative briefs.</p>`;
    return;
  }

  grid.innerHTML = briefs.map(b => `
    <div class="glass-card-luxury rounded-3xl p-6 flex flex-col justify-between space-y-4">
      <div class="space-y-3.5">
        
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <img src="${b.brand_logo}" alt="${b.brand_name}" class="w-12 h-12 rounded-2xl object-cover border border-white/[0.12] shadow-md">
            <div>
              <span class="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">${b.brand_name}</span>
              <h3 class="font-heading font-bold text-sm text-white line-clamp-1">${b.title}</h3>
            </div>
          </div>
          <span class="badge-metallic-cyan px-2.5 py-1 rounded-full text-[11px] font-mono font-bold shrink-0">
            $${b.budget.toLocaleString()}
          </span>
        </div>

        <p class="text-xs text-slate-300 line-clamp-2 leading-relaxed font-sans">${b.campaign_overview}</p>

        <!-- FORMAT & STYLE BADGES -->
        <div class="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
          <div class="bg-[#070A14] p-2.5 rounded-xl border border-white/[0.06]">
            <span class="text-slate-500 block text-[9px]">FORMAT</span>
            <span class="text-cyan-400 truncate block font-bold">${b.format_aspect_ratio}</span>
          </div>
          <div class="bg-[#070A14] p-2.5 rounded-xl border border-white/[0.06]">
            <span class="text-slate-500 block text-[9px]">STYLE</span>
            <span class="text-purple-400 truncate block font-bold">${b.style}</span>
          </div>
        </div>

        <!-- COMMERCIAL USE REQUIREMENTS -->
        <div class="bg-[#070A14] p-3 rounded-2xl border border-white/[0.06] space-y-1">
          <div class="flex items-center justify-between text-[10px] font-mono">
            <span class="text-slate-400">Licensing Rights:</span>
            <span class="text-emerald-400 font-bold truncate ml-2">${b.commercial_use_requirements.license_type}</span>
          </div>
          <div class="flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span>Model Indemnity:</span>
            <span class="text-slate-300 font-bold">${b.commercial_use_requirements.model_indemnity_required ? 'Required & Cleared' : 'Standard'}</span>
          </div>
        </div>

      </div>

      <!-- FOOTER -->
      <div class="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
        <span class="text-[11px] font-mono text-slate-400">${b.pitch_count || 0} Pitches Submitted</span>
        <button onclick="pitchOnBrief('${b.id}', '${b.title.replace(/'/g, "\\'")}', '${b.brand_name.replace(/'/g, "\\'")}', ${b.budget})" class="btn-shimmer px-4 py-2 rounded-xl text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-all font-heading">
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
      <div class="bg-[#070A14] border border-purple-500/40 rounded-2xl p-5 space-y-3.5 font-sans">
        <div class="flex items-center justify-between pb-2.5 border-b border-white/[0.08]">
          <div>
            <span class="badge-metallic-purple px-2 py-0.5 rounded text-[9px] font-mono font-bold block mb-1">${b.ai_engine_used}</span>
            <h4 class="text-base font-heading font-bold text-white">${b.title}</h4>
          </div>
          <span class="text-sm font-mono text-cyan-400 font-bold">$${b.budget}</span>
        </div>

        <p class="text-xs text-slate-300 leading-relaxed">${b.campaign_overview}</p>

        <div class="grid grid-cols-2 gap-2 text-xs font-mono">
          <div class="bg-[#0B1020] p-2.5 rounded-xl border border-white/[0.06]"><span class="text-slate-500 block text-[9px]">FORMAT:</span> <strong class="text-cyan-400">${b.format_aspect_ratio}</strong></div>
          <div class="bg-[#0B1020] p-2.5 rounded-xl border border-white/[0.06]"><span class="text-slate-500 block text-[9px]">STYLE:</span> <strong class="text-purple-400">${b.style}</strong></div>
        </div>

        <div class="bg-[#04060A] p-3 rounded-xl border border-white/[0.08] font-mono text-[11px] space-y-1">
          <span class="text-cyan-400 font-bold block text-[10px] uppercase">Recommended AI Models:</span>
          <p class="text-slate-300">${b.suggested_ai_models.join(' · ')}</p>
        </div>

        <div class="bg-[#04060A] p-3 rounded-xl border border-white/[0.08] font-mono text-[11px] space-y-1">
          <span class="text-purple-400 font-bold block text-[10px] uppercase">Synthesized Styleframe Prompt:</span>
          <p class="text-slate-300 select-all">${b.sample_prompt}</p>
        </div>

        <div class="flex items-center justify-between pt-2">
          <span class="text-[11px] text-emerald-400 font-mono">Commercial Terms & Milestones Structured</span>
          <button onclick="publishAiGeneratedBrief()" class="btn-shimmer px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-all font-heading">
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
