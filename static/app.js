// DiscoveryToDelivery — Enterprise AI Creator Marketplace Engine
// Studio Creative Platform Engine

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
  setTimeout(() => lucide.createIcons(), 40);
}

// -------------------------------------------------------------
// TOAST NOTIFICATIONS (Clean, Tactile, Modern)
// -------------------------------------------------------------
function showToast(title, message, type = "success") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = "p-4 rounded-xl border border-white/15 bg-[#10131C] backdrop-blur-xl shadow-2xl flex items-start gap-3 w-88 pointer-events-auto transition-all transform translate-y-3 opacity-0 animate-modal-luxury";
  
  const iconName = type === "success" ? "check-circle" : "alert-circle";
  const iconColor = type === "success" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-amber-400 bg-amber-500/10 border-amber-500/20";

  toast.innerHTML = `
    <div class="w-7 h-7 rounded-lg ${iconColor} border flex items-center justify-center shrink-0 mt-0.5">
      <i data-lucide="${iconName}" class="w-4 h-4"></i>
    </div>
    <div class="space-y-0.5 flex-1 min-w-0">
      <p class="text-xs font-heading font-bold text-white tracking-tight">${title}</p>
      <p class="text-[11px] text-slate-400 leading-snug break-words font-sans">${message}</p>
    </div>
  `;
  container.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    toast.classList.remove("translate-y-3", "opacity-0");
  }, 10);

  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-3");
    setTimeout(() => toast.remove(), 300);
  }, 4200);
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
      navEl.className = "nav-tab active flex items-center gap-2 px-4 py-2 rounded-full transition-all text-white bg-white/10 border border-white/20 shadow-sm";
    } else {
      tabEl.classList.add("hidden");
      navEl.className = "nav-tab flex items-center gap-2 px-4 py-2 rounded-full transition-all text-slate-400 hover:text-white hover:bg-white/[0.04]";
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
// 1. DISCOVERY TO DELIVERY WORKFLOW ENGINE
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
      btn.className = "eng-filter-btn px-3 py-1 rounded-full bg-white text-[#090A0F] font-semibold text-xs transition-all";
    } else {
      btn.className = "eng-filter-btn px-3 py-1 rounded-full bg-white/[0.04] text-slate-400 hover:text-white border border-white/10 transition-all";
    }
  });
  fetchEngagements();
}

function renderEngagements(engagements) {
  const container = document.getElementById("engagements-container");
  if (!engagements || engagements.length === 0) {
    container.innerHTML = `
      <div class="studio-card p-16 text-center space-y-4">
        <div class="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 text-slate-400 flex items-center justify-center mx-auto">
          <i data-lucide="inbox" class="w-6 h-6"></i>
        </div>
        <div class="space-y-1">
          <h4 class="text-base font-heading font-bold text-white">No Engagements in this Pipeline Stage</h4>
          <p class="text-xs text-slate-400 max-w-md mx-auto">Commission a creator or submit a pitch on an open brief to start tracking generative milestones.</p>
        </div>
        <button onclick="openNewEngagementModal()" class="btn-primary px-6 py-2.5 text-xs font-bold font-heading">
          Commission New Project
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

    const statusBadgeClass = 
      eng.status === 'Delivered & Verified' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
      eng.status === 'In Generation & Review' ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' :
      eng.status === 'Deliverables Submitted' ? 'bg-purple-500/10 text-purple-300 border-purple-500/20' :
      'bg-amber-500/10 text-amber-300 border-amber-500/20';

    return `
      <div class="studio-card p-6 sm:p-7 space-y-6 relative transition-all">
        
        <!-- CARD HEADER -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
          <div class="flex items-center gap-4">
            <div class="relative">
              <img src="${eng.creator_avatar}" alt="${eng.creator_name}" class="w-13 h-13 rounded-xl object-cover border border-white/10">
              <span class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#090A0F] flex items-center justify-center text-[9px] text-black font-bold" title="Verified Creator">✓</span>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs font-mono text-slate-400 font-bold">${eng.id}</span>
                <span class="text-slate-600">·</span>
                <span class="text-xs text-slate-300 font-medium">${eng.brand_name} <span class="text-slate-500">→</span> ${eng.creator_name}</span>
                <span class="text-slate-500 font-mono text-[11px]">${eng.creator_handle}</span>
              </div>
              <h3 class="text-lg font-heading font-extrabold text-white mt-0.5 tracking-tight">${eng.brief_title}</h3>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="text-right">
              <span class="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">Agreed Budget</span>
              <span class="text-lg font-heading font-extrabold text-white font-mono">$${eng.agreed_budget.toLocaleString()}</span>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-mono font-semibold border ${statusBadgeClass}">
              ${eng.status}
            </span>
          </div>
        </div>

        <!-- 5-STAGE PIPELINE PROGRESSION STEPPER -->
        <div class="glass-strong p-4 rounded-xl border border-white/[0.08] space-y-3">
          <div class="flex items-center justify-between text-xs font-mono">
            <span class="text-slate-400 flex items-center gap-1.5">
              <i data-lucide="activity" class="w-3.5 h-3.5 text-indigo-400"></i> Active State:
            </span>
            <span class="text-white font-bold">${eng.current_stage}</span>
          </div>
          
          <div class="grid grid-cols-5 gap-2">
            <div class="h-1.5 rounded-full ${stageStep >= 1 ? 'bg-indigo-400' : 'bg-white/[0.08]'}"></div>
            <div class="h-1.5 rounded-full ${stageStep >= 2 ? 'bg-indigo-400' : 'bg-white/[0.08]'}"></div>
            <div class="h-1.5 rounded-full ${stageStep >= 3 ? 'bg-indigo-400' : 'bg-white/[0.08]'}"></div>
            <div class="h-1.5 rounded-full ${stageStep >= 4 ? 'bg-indigo-400' : 'bg-white/[0.08]'}"></div>
            <div class="h-1.5 rounded-full ${stageStep >= 5 ? 'bg-emerald-400' : 'bg-white/[0.08]'}"></div>
          </div>

          <div class="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
            <span class="${stageStep >= 1 ? 'text-white font-bold' : ''}">01. Proposal</span>
            <span class="${stageStep >= 2 ? 'text-white font-bold' : ''}">02. Escrow Locked</span>
            <span class="${stageStep >= 3 ? 'text-white font-bold' : ''}">03. Revisions</span>
            <span class="${stageStep >= 4 ? 'text-white font-bold' : ''}">04. Deliverables Audit</span>
            <span class="${stageStep >= 5 ? 'text-emerald-400 font-bold' : ''}">05. Rights Transferred</span>
          </div>
        </div>

        <!-- ESCROW & CONTRACT SUMMARY BAR -->
        <div class="glass-strong p-4 rounded-xl border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div class="flex items-center gap-2">
            <i data-lucide="shield-check" class="w-4 h-4 text-emerald-400 shrink-0"></i>
            <span class="text-slate-300">Commercial Warranty: <strong class="text-white">${eng.contract.license_type}</strong></span>
          </div>
          <div class="text-[11px] font-mono text-slate-400 flex items-center gap-3">
            <span>Escrow Balance: <strong class="text-white font-bold">$${eng.escrow_locked.toLocaleString()}</strong></span>
            <span class="text-slate-600">·</span>
            <span class="text-emerald-400 font-medium">Model Indemnity Cleared</span>
          </div>
        </div>

        <!-- PITCH PROPOSAL BOX -->
        ${eng.pitch_proposal ? `
          <div class="glass-strong p-4 rounded-xl border border-white/[0.08] space-y-2">
            <div class="flex items-center justify-between text-xs font-mono">
              <span class="text-slate-300 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <i data-lucide="sparkles" class="w-3.5 h-3.5 text-indigo-400"></i> Production Pipeline Specs:
              </span>
              <span class="text-slate-400">Turnaround: ${eng.pitch_proposal.turnaround_days} Days · Seed Board: #${eng.pitch_proposal.sample_seed}</span>
            </div>
            <p class="text-xs text-slate-300 leading-relaxed font-sans">${eng.pitch_proposal.pitch_notes}</p>
          </div>
        ` : ''}

        <!-- MILESTONE ESCROW DISTRIBUTION TRACKER -->
        <div class="space-y-2.5">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <i data-lucide="check-square" class="w-3.5 h-3.5 text-slate-400"></i> Milestone Escrow Schedule
            </h4>
            <span class="text-[11px] font-mono text-slate-500">Autonomous Release Mechanism</span>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            ${eng.milestones.map(m => `
              <div class="glass-strong p-3.5 rounded-xl border ${
                m.status === 'Approved & Released' ? 'border-emerald-500/30 bg-emerald-500/5' :
                m.status === 'In Progress' ? 'border-indigo-500/30 bg-indigo-500/5' :
                'border-white/[0.08]'
              } space-y-2.5">
                <div class="flex items-center justify-between text-xs font-mono">
                  <span class="text-slate-300 font-bold truncate">${m.title}</span>
                  <span class="text-white font-bold">$${m.amount}</span>
                </div>
                <div class="flex items-center justify-between text-[10px]">
                  <span class="${
                    m.status === 'Approved & Released' ? 'text-emerald-400 font-bold' :
                    m.status === 'In Progress' ? 'text-indigo-400 font-bold' :
                    'text-slate-500'
                  } font-mono">● ${m.status}</span>
                  ${m.released_at ? `<span class="text-slate-500 font-mono">${m.released_at}</span>` : ''}
                </div>
                ${m.status === 'In Progress' ? `
                  <button onclick="releaseMilestone('${eng.id}', '${m.id}')" class="btn-primary w-full py-1.5 text-[11px] font-semibold">
                    <i data-lucide="check" class="w-3 h-3 mr-1"></i>
                    <span>Approve & Release ($${m.amount})</span>
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
              <i data-lucide="repeat" class="w-3.5 h-3.5 text-indigo-400"></i> Revision Drafts & Feedback (${eng.iterations.length} Passes)
            </h4>
            <div class="space-y-2.5">
              ${eng.iterations.map(it => `
                <div class="glass-strong p-3.5 rounded-xl border border-white/[0.08] flex flex-col md:flex-row gap-4 items-start">
                  <img src="${it.preview_media}" alt="Draft" class="w-28 h-20 rounded-lg object-cover shrink-0 border border-white/10">
                  <div class="space-y-1.5 flex-1 text-xs">
                    <div class="flex items-center justify-between text-slate-400 font-mono text-[10px]">
                      <span class="font-bold py-0.5 px-2 rounded-full bg-white/[0.06] text-slate-300 border border-white/10">Revision #${it.iteration_number}</span>
                      <span>${it.submitted_at}</span>
                    </div>
                    <p class="text-slate-200 font-medium">${it.notes}</p>
                    <p class="text-[11px] text-slate-300 bg-white/[0.03] p-2.5 rounded-lg border border-white/[0.08]">
                      <span class="text-indigo-400 font-bold font-mono">Client Feedback:</span> ${it.brand_feedback}
                    </p>
                    ${it.prompt_adjusted ? `
                      <p class="text-[10px] font-mono text-slate-300 bg-white/[0.02] p-1.5 rounded-md border border-white/[0.06]">
                        <span class="text-slate-400 font-bold">Prompt Adjustments:</span> ${it.prompt_adjusted}
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
          <div class="glass-strong p-5 rounded-xl border border-white/15 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-heading font-bold text-white flex items-center gap-2">
                <i data-lucide="package-check" class="w-4 h-4 text-emerald-400"></i> Final Master Deliverables Package
              </span>
              <span class="text-[10px] font-mono text-slate-400">${eng.final_delivery.delivered_at}</span>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono text-[11px]">
              ${eng.final_delivery.files.map(f => `
                <div class="bg-white/[0.04] p-3 rounded-lg border border-white/[0.08] flex items-center justify-between">
                  <span class="text-slate-200 truncate">${f.name}</span>
                  <span class="text-slate-400 shrink-0 ml-2 font-bold">${f.size}</span>
                </div>
              `).join('')}
            </div>
            
            <p class="text-xs text-slate-300 bg-white/[0.03] p-3 rounded-lg border border-white/[0.08] leading-relaxed">
              <span class="text-slate-400 font-mono font-bold">Model Provenance:</span> ${eng.final_delivery.provenance_statement}
            </p>
          </div>
        ` : ''}

        <!-- COMMERCIAL USAGE CERTIFICATE -->
        ${eng.commercial_certificate ? `
          <div class="glass-strong p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <i data-lucide="shield-check" class="w-6 h-6"></i>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">SHA-256 VERIFIED</span>
                  <span class="text-xs text-white font-bold font-mono">${eng.commercial_certificate.certificate_id}</span>
                </div>
                <p class="text-xs text-slate-200 font-semibold mt-0.5">${eng.commercial_certificate.rights_granted}</p>
                <p class="text-[10px] font-mono text-slate-400">${eng.commercial_certificate.cryptographic_hash.substring(0, 36)}...</p>
              </div>
            </div>
            
            <button onclick="viewCertificate('${eng.id}')" class="btn-secondary px-4 py-2 text-xs font-semibold shrink-0">
              View Certificate
            </button>
          </div>
        ` : ''}

        <!-- CARD FOOTER ACTIONS ACCORDING TO CURRENT STAGE -->
        <div class="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <button onclick="downloadWorkflowJson('production_comfyui_workflow.json')" class="btn-secondary px-3.5 py-1.5 text-xs font-mono flex items-center gap-1.5">
              <i data-lucide="file-code" class="w-3.5 h-3.5 text-indigo-400"></i>
              <span>Export ComfyUI Graph (.json)</span>
            </button>
          </div>

          <div class="flex items-center gap-2.5">
            ${eng.status === 'Discovery & Pitch' ? `
              <button onclick="acceptEngagement('${eng.id}')" class="btn-primary px-5 py-2 text-xs font-bold font-heading">
                Accept Proposal & Fund Escrow ($${eng.agreed_budget})
              </button>
            ` : ''}

            ${eng.status === 'In Generation & Review' ? `
              <button onclick="openAddIterationModal('${eng.id}')" class="btn-secondary px-4 py-2 text-xs font-semibold flex items-center gap-1.5">
                <i data-lucide="plus" class="w-3.5 h-3.5"></i>
                <span>Submit Revision Draft</span>
              </button>
              <button onclick="openDeliverModal('${eng.id}')" class="btn-primary px-4 py-2 text-xs font-bold font-heading flex items-center gap-1.5">
                <i data-lucide="upload" class="w-3.5 h-3.5"></i>
                <span>Submit Deliverables</span>
              </button>
            ` : ''}

            ${eng.status === 'Deliverables Submitted' ? `
              <button onclick="approveAndCertify('${eng.id}')" class="btn-primary px-5 py-2 text-xs font-bold font-heading flex items-center gap-1.5">
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
      showToast("Revision Logged", data.message, "success");
      fetchEngagements();
    } else {
      showToast("Error", data.error, "error");
    }
  } catch (err) {
    showToast("Error", "Could not submit revision draft", "error");
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
        <div class="flex items-start justify-between border-b border-white/10 pb-5">
          <div class="flex items-center gap-3.5">
            <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#090A0F] font-bold text-sm font-heading">
              D2D
            </span>
            <div>
              <span class="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-300 border border-white/10">Verification Protocol</span>
              <h2 class="text-2xl font-heading font-extrabold text-white mt-1">Commercial IP & Provenance Certificate</h2>
            </div>
          </div>
          <span class="px-3 py-1 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">100% INDEMNIFIED</span>
        </div>

        <!-- CERTIFICATE CREDENTIAL MATRIX -->
        <div class="grid grid-cols-2 gap-3 font-mono text-xs">
          <div class="glass-strong p-3.5 rounded-xl border border-white/[0.08]">
            <span class="text-slate-500 block text-[10px]">CERTIFICATE SERIAL</span>
            <span class="text-white font-bold">${cert.certificate_id}</span>
          </div>
          <div class="glass-strong p-3.5 rounded-xl border border-white/[0.08]">
            <span class="text-slate-500 block text-[10px]">TIMESTAMP (UTC)</span>
            <span class="text-slate-300">${cert.timestamp}</span>
          </div>
          <div class="glass-strong p-3.5 rounded-xl border border-white/[0.08]">
            <span class="text-slate-500 block text-[10px]">LICENSED BUYER</span>
            <span class="text-white font-bold">${cert.issued_to}</span>
          </div>
          <div class="glass-strong p-3.5 rounded-xl border border-white/[0.08]">
            <span class="text-slate-500 block text-[10px]">VERIFIED CREATOR</span>
            <span class="text-white font-bold">${cert.creator}</span>
          </div>
        </div>

        <!-- COMMERCIAL RIGHTS & REPRODUCIBILITY SCOPE -->
        <div class="glass-strong p-4 rounded-xl border border-white/[0.08] space-y-2 text-xs font-mono">
          <div class="flex items-center justify-between">
            <span class="text-slate-400">Granted Commercial Rights:</span>
            <span class="text-emerald-400 font-bold">${cert.rights_granted}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-400">Workflow Deterministic Score:</span>
            <span class="text-white font-bold">${cert.workflow_reproducibility_score}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-400">Commercial Scope:</span>
            <span class="text-indigo-300 font-bold">${cert.commercial_scope}</span>
          </div>
        </div>

        <!-- CRYPTOGRAPHIC SHA-256 AUDIT HASH -->
        <div class="bg-black/60 p-4 rounded-xl border border-white/10 font-mono text-[11px] space-y-1.5">
          <span class="text-slate-400 font-bold block text-[10px] uppercase tracking-wider flex items-center gap-1.5">
            <i data-lucide="fingerprint" class="w-3.5 h-3.5 text-indigo-400"></i> Tamper-Proof Cryptographic Hash:
          </span>
          <p class="text-slate-300 break-all select-all font-mono">${cert.cryptographic_hash}</p>
        </div>

        <!-- FOOTER & EXPORT -->
        <div class="flex items-center justify-between pt-2">
          <span class="text-[11px] font-mono text-slate-500">Issued via ${cert.verifier}</span>
          <button onclick="downloadWorkflowJson('${cert.certificate_id}.json')" class="btn-primary px-5 py-2.5 text-xs font-bold font-heading">
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
    btn.className = "flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono text-[11px] transition-all";
  } else {
    btn.className = "flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-slate-400 hover:text-white transition-all font-mono text-[11px]";
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
  btn.className = "flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-slate-400 hover:text-white transition-all font-mono text-[11px]";
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
    <div class="studio-card p-6 flex flex-col justify-between space-y-4 transition-all">
      <div class="space-y-3.5">
        
        <!-- CARD HEADER -->
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3.5">
            <div class="relative">
              <img src="${c.avatar}" alt="${c.name}" class="w-13 h-13 rounded-xl object-cover border border-white/10">
              ${c.verification?.verified_creator ? `
                <span class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#090A0F] flex items-center justify-center text-[9px] text-black font-bold">✓</span>
              ` : ''}
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <h3 class="font-heading font-bold text-sm text-white hover:text-indigo-300 transition-colors cursor-pointer" onclick="viewCreatorDetail('${c.id}')">${c.name}</h3>
                ${c.verification?.kampus_vc_fellow ? `
                  <span class="text-[9px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-bold">STUDIO FELLOW</span>
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
            <span class="text-xs font-bold text-white font-mono block mt-0.5">$${c.hourly_rate}/hr</span>
          </div>
        </div>

        <p class="text-xs text-slate-400 line-clamp-2 leading-relaxed font-sans">${c.bio}</p>

        <!-- VERIFIED TOOLS TAGS -->
        <div class="flex flex-wrap gap-1.5 pt-1">
          ${c.tools.slice(0, 3).map(t => `
            <span class="px-2.5 py-1 rounded-md text-[10px] font-mono bg-white/[0.04] text-slate-300 border border-white/[0.08]">
              ${t.name}
            </span>
          `).join('')}
          ${c.tools.length > 3 ? `<span class="px-2 py-1 rounded-md text-[10px] font-mono text-slate-400 bg-white/[0.04] border border-white/[0.08]">+${c.tools.length - 3}</span>` : ''}
        </div>

        <!-- VERIFICATION SIGNALS -->
        <div class="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1">
          <div class="glass-strong p-2 rounded-lg border border-white/[0.08] flex items-center gap-1.5">
            <i data-lucide="shield" class="w-3.5 h-3.5 text-emerald-400 shrink-0"></i>
            <span class="text-slate-300 truncate">Indemnity Cleared</span>
          </div>
          <div class="glass-strong p-2 rounded-lg border border-white/[0.08] flex items-center gap-1.5">
            <i data-lucide="check-circle" class="w-3.5 h-3.5 text-indigo-400 shrink-0"></i>
            <span class="text-slate-300 truncate">${c.verification?.trust_score || 98}% Delivery Score</span>
          </div>
        </div>

      </div>

      <!-- CARD FOOTER ACTIONS -->
      <div class="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
        <button onclick="viewCreatorDetail('${c.id}')" class="btn-secondary px-3.5 py-1.5 text-xs font-semibold">
          Inspect Pipeline
        </button>

        <button onclick="initiateCreatorEngagement('${c.id}')" class="btn-primary px-4 py-1.5 text-xs font-bold font-heading">
          Commission Creator
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
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div class="flex items-center gap-4">
            <img src="${c.avatar}" alt="${c.name}" class="w-16 h-16 rounded-2xl object-cover border border-white/10">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-2xl font-heading font-extrabold text-white">${c.name}</h3>
                <span class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">VERIFIED PRO</span>
              </div>
              <p class="text-xs text-slate-400 font-mono mt-0.5">${c.handle} · ${c.location} · <strong class="text-white">$${c.hourly_rate}/hr</strong> · <strong class="text-emerald-400">${c.completed_projects} Projects Delivered</strong></p>
            </div>
          </div>

          <button onclick="closeModal('modal-creator-profile'); initiateCreatorEngagement('${c.id}')" class="btn-primary px-5 py-2.5 text-xs font-bold font-heading">
            Commission Project
          </button>
        </div>

        <!-- HARDWARE RIG BANNER -->
        <div class="glass-strong p-4 rounded-xl border border-white/[0.08] flex items-center justify-between text-xs font-mono">
          <span class="text-slate-400 flex items-center gap-2"><i data-lucide="cpu" class="w-4 h-4 text-indigo-400"></i> Hardware Studio Rig:</span>
          <span class="text-white font-bold">${c.hardware_specs}</span>
        </div>

        <!-- PORTFOLIO WITH WORKFLOW INSPECTION -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-mono uppercase tracking-wider text-slate-400">AI Portfolio Workflows (Reproducible Production)</h4>
            <span class="text-[11px] text-slate-400 font-mono">Seed & Parameter Provenance</span>
          </div>

          <div class="space-y-4">
            ${c.portfolio.map(p => `
              <div class="glass-strong border border-white/[0.08] rounded-xl p-5 space-y-4">
                <div class="flex flex-col md:flex-row gap-5">
                  <div class="md:w-1/3 shrink-0 space-y-2">
                    <img src="${p.media_url}" alt="${p.title}" class="w-full rounded-xl object-cover aspect-video border border-white/10">
                    <div class="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Aspect: <strong class="text-white">${p.aspect_ratio}</strong></span>
                      <span>Client: <strong class="text-slate-200">${p.client}</strong></span>
                    </div>
                  </div>

                  <div class="md:w-2/3 space-y-3">
                    <div>
                      <h5 class="font-heading font-bold text-base text-white">${p.title}</h5>
                      <p class="text-xs text-slate-400 font-sans mt-0.5">${p.description}</p>
                    </div>

                    <!-- PROMPT MATRIX BOX -->
                    <div class="bg-black/50 p-4 rounded-xl border border-white/[0.08] space-y-2.5 font-mono text-xs">
                      <div>
                        <span class="text-slate-400 font-bold block text-[10px] uppercase tracking-wider">Positive Prompt:</span>
                        <p class="text-slate-300 text-[11px] select-all leading-relaxed">${p.ai_breakdown.prompt_used}</p>
                      </div>
                      <div>
                        <span class="text-slate-500 font-bold block text-[10px] uppercase tracking-wider">Negative Prompt:</span>
                        <p class="text-slate-400 text-[10px] select-all">${p.ai_breakdown.negative_prompt}</p>
                      </div>
                      <div class="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.08] text-[10px] text-slate-400">
                        <div><span>Seed:</span> <strong class="text-slate-200">#${p.ai_breakdown.seed}</strong></div>
                        <div><span>Sampler:</span> <strong class="text-slate-200">${p.ai_breakdown.sampler}</strong></div>
                        <div><span>CFG Scale:</span> <strong class="text-slate-200">${p.ai_breakdown.cfg_scale}</strong></div>
                      </div>
                      <div class="pt-1 text-[10px] text-slate-400">
                        <span>Upscale Pipeline:</span> <strong class="text-slate-300">${p.ai_breakdown.upscale_pipeline}</strong>
                      </div>
                    </div>

                    <div class="flex items-center justify-between text-xs pt-1">
                      <span class="text-[11px] font-mono text-slate-400">Models: ${p.ai_breakdown.primary_models.join(' · ')}</span>
                      <button onclick="downloadWorkflowJson('${p.ai_breakdown.workflow_file}')" class="btn-secondary px-3.5 py-1.5 text-xs font-mono flex items-center gap-1.5">
                        <i data-lucide="file-code" class="w-3.5 h-3.5 text-indigo-400"></i>
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
  showToast("Workflow Downloaded", `${filename} exported with deterministic parameters.`, "success");
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
    <div class="studio-card p-6 flex flex-col justify-between space-y-4 transition-all">
      <div class="space-y-3.5">
        
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-3">
            <img src="${b.brand_logo}" alt="${b.brand_name}" class="w-11 h-11 rounded-xl object-cover border border-white/10">
            <div>
              <span class="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">${b.brand_name}</span>
              <h3 class="font-heading font-bold text-sm text-white line-clamp-1">${b.title}</h3>
            </div>
          </div>
          <span class="px-2.5 py-1 rounded-full text-xs font-mono font-bold text-white bg-white/[0.06] border border-white/10 shrink-0">
            $${b.budget.toLocaleString()}
          </span>
        </div>

        <p class="text-xs text-slate-400 line-clamp-2 leading-relaxed font-sans">${b.campaign_overview}</p>

        <!-- FORMAT & STYLE BADGES -->
        <div class="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
          <div class="glass-strong p-2.5 rounded-lg border border-white/[0.08]">
            <span class="text-slate-500 block text-[9px]">FORMAT</span>
            <span class="text-white truncate block font-bold">${b.format_aspect_ratio}</span>
          </div>
          <div class="glass-strong p-2.5 rounded-lg border border-white/[0.08]">
            <span class="text-slate-500 block text-[9px]">STYLE</span>
            <span class="text-slate-300 truncate block font-bold">${b.style}</span>
          </div>
        </div>

        <!-- COMMERCIAL USE REQUIREMENTS -->
        <div class="glass-strong p-3 rounded-xl border border-white/[0.08] space-y-1">
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
        <span class="text-[11px] font-mono text-slate-400">${b.pitch_count || 0} Pitches Received</span>
        <button onclick="pitchOnBrief('${b.id}', '${b.title.replace(/'/g, "\\'")}', '${b.brand_name.replace(/'/g, "\\'")}', ${b.budget})" class="btn-primary px-4 py-1.5 text-xs font-bold font-heading">
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
  btn.innerHTML = `<i data-lucide="loader" class="w-4 h-4 animate-spin"></i><span>Generating Structured Brief...</span>`;
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
      <div class="glass-strong border border-white/20 rounded-xl p-5 space-y-3.5 font-sans">
        <div class="flex items-center justify-between pb-2.5 border-b border-white/[0.08]">
          <div>
            <span class="text-[9px] uppercase font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-300 border border-white/10 font-bold block mb-1">${b.ai_engine_used}</span>
            <h4 class="text-base font-heading font-bold text-white">${b.title}</h4>
          </div>
          <span class="text-sm font-mono text-white font-bold">$${b.budget}</span>
        </div>

        <p class="text-xs text-slate-300 leading-relaxed">${b.campaign_overview}</p>

        <div class="grid grid-cols-2 gap-2 text-xs font-mono">
          <div class="glass-strong p-2.5 rounded-lg border border-white/[0.08]"><span class="text-slate-500 block text-[9px]">FORMAT:</span> <strong class="text-white">${b.format_aspect_ratio}</strong></div>
          <div class="glass-strong p-2.5 rounded-lg border border-white/[0.08]"><span class="text-slate-500 block text-[9px]">STYLE:</span> <strong class="text-slate-300">${b.style}</strong></div>
        </div>

        <div class="bg-black/50 p-3 rounded-lg border border-white/[0.08] font-mono text-[11px] space-y-1">
          <span class="text-slate-400 font-bold block text-[10px] uppercase">Recommended Models:</span>
          <p class="text-slate-300">${b.suggested_ai_models.join(' · ')}</p>
        </div>

        <div class="bg-black/50 p-3 rounded-lg border border-white/[0.08] font-mono text-[11px] space-y-1">
          <span class="text-slate-400 font-bold block text-[10px] uppercase">Sample Styleframe Prompt:</span>
          <p class="text-slate-300 select-all">${b.sample_prompt}</p>
        </div>

        <div class="flex items-center justify-between pt-2">
          <span class="text-[11px] text-emerald-400 font-mono">Commercial Terms Structured</span>
          <button onclick="publishAiGeneratedBrief()" class="btn-primary px-5 py-2 text-xs font-bold font-heading">
            Publish Brief to Marketplace
          </button>
        </div>
      </div>
    `;
    showToast("Brief Generated", "Structured creative brief ready to publish.", "success");
    refreshIcons();
  } catch (err) {
    showToast("Error", "Server error during brief generation.", "error");
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<i data-lucide="sparkles" class="w-4 h-4"></i><span>Generate Structured Brief</span>`;
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
      showToast("Project Commissioned", `Engagement launched with ${creator.name}!`, "success");
      fetchEngagements();
      fetchStats();
      switchTab("delivery");
    }
  } catch (err) {
    showToast("Error", "Could not initiate engagement.", "error");
  }
}
