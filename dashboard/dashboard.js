const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 3131;

const AGENTS = [
  { id: 'bartholomew', name: 'Bartholomew', role: 'Orchestrator', model: 'Claude Opus 4.6', phase: 'Orchestration', workspace: path.join(os.homedir(), '.openclaw/workspace-bartholomew') },
  { id: 'alani', name: 'Alani', role: 'Business Analyst', model: 'Claude Sonnet 4.6', phase: 'Discovery', workspace: path.join(os.homedir(), '.openclaw/workspace-business-analyst') },
  { id: 'alex', name: 'Alex', role: 'Product Manager', model: 'Claude Sonnet 4.6', phase: 'Discovery', workspace: path.join(os.homedir(), '.openclaw/workspace-pm') },
  { id: 'tony', name: 'Tony', role: 'Revenue Strategist', model: 'Claude Sonnet 4.6', phase: 'Discovery', workspace: path.join(os.homedir(), '.openclaw/workspace-revenue-strategist') },
  { id: 'aiden', name: 'Aiden', role: 'UI/UX Designer', model: 'Claude Sonnet 4.6', phase: 'Design', workspace: path.join(os.homedir(), '.openclaw/workspace-ux-designer') },
  { id: 'kyler', name: 'Kyler', role: 'CTO / Architect', model: 'Claude Sonnet 4.6', phase: 'Design', workspace: path.join(os.homedir(), '.openclaw/workspace-cto') },
  { id: 'victoria', name: 'Victoria', role: 'Tech Lead', model: 'Claude Sonnet 4.6', phase: 'Build', workspace: path.join(os.homedir(), '.openclaw/workspace-tech-lead') },
  { id: 'johnny', name: 'Johnny', role: 'Backend Engineer', model: 'Qwen3 Coder', phase: 'Build', workspace: path.join(os.homedir(), '.openclaw/workspace-backend-engineer') },
  { id: 'jett', name: 'Jett', role: 'Frontend Engineer', model: 'Qwen3 Coder', phase: 'Build', workspace: path.join(os.homedir(), '.openclaw/workspace-frontend-engineer') },
  { id: 'jason', name: 'Jason', role: 'QA Engineer', model: 'Claude Sonnet 4.6', phase: 'QA', workspace: path.join(os.homedir(), '.openclaw/workspace-qa-engineer') },
  { id: 'kenny', name: 'Kenny', role: 'Marketing Manager', model: 'Claude Sonnet 4.6', phase: 'Launch', workspace: path.join(os.homedir(), '.openclaw/workspace-marketing-manager') },
];

const CYCLES_DIR = path.join(os.homedir(), '.openclaw/workspace-bartholomew/cycles');
const PHASE_ORDER = ['Orchestration', 'Discovery', 'Strategy', 'Architecture', 'Build', 'QA', 'Launch'];

function parseStateFile(content) {
  const state = { status: 'Idle', cycle: 'None', phase: 'None', lastCompleted: '—', nextAction: '—', blocker: 'None', updated: '—' };
  for (const line of content.split('\n')) {
    if (line.startsWith('Status:')) state.status = line.replace('Status:', '').trim();
    else if (line.startsWith('Current cycle:')) state.cycle = line.replace('Current cycle:', '').trim();
    else if (line.startsWith('Current phase:')) state.phase = line.replace('Current phase:', '').trim();
    else if (line.startsWith('Last completed:')) state.lastCompleted = line.replace('Last completed:', '').trim();
    else if (line.startsWith('Next action:')) state.nextAction = line.replace('Next action:', '').trim();
    else if (line.startsWith('Blocker:')) state.blocker = line.replace('Blocker:', '').trim();
    else if (line.startsWith('Updated:')) state.updated = line.replace('Updated:', '').trim();
  }
  return state;
}

function getAgentData() {
  return AGENTS.map(agent => {
    const statePath = path.join(agent.workspace, 'STATE.md');
    let state = { status: 'Idle', cycle: 'None', phase: '—', lastCompleted: '—', nextAction: 'Awaiting task', blocker: 'None', updated: '—' };
    try {
      if (fs.existsSync(statePath)) state = parseStateFile(fs.readFileSync(statePath, 'utf8'));
    } catch (e) {}
    return { ...agent, state };
  });
}

function getCyclesData() {
  const cycles = [];
  try {
    if (!fs.existsSync(CYCLES_DIR)) return cycles;
    const folders = fs.readdirSync(CYCLES_DIR).filter(f => fs.statSync(path.join(CYCLES_DIR, f)).isDirectory());
    for (const folder of folders) {
      const cycleDir = path.join(CYCLES_DIR, folder);
      const files = fs.readdirSync(cycleDir);
      const isComplete = files.includes('launch-package.md');
      const hasQA = files.includes('qa-report.md');
      const hasBuild = files.includes('backend-completion-report.md') || files.includes('frontend-completion-report.md');
      const hasDesign = files.includes('ux-spec.md') || files.includes('architecture-spec.md');
      const hasProduct = files.includes('product-decision.md');
      let currentPhase = 'Discovery';
      if (isComplete) currentPhase = 'Complete';
      else if (hasQA) currentPhase = 'Launch';
      else if (hasBuild) currentPhase = 'QA';
      else if (hasDesign) currentPhase = 'Build';
      else if (hasProduct) currentPhase = 'Design';

      let appDescription = '';
      const pdPath = path.join(cycleDir, 'product-decision.md');
      if (fs.existsSync(pdPath)) {
        try {
          const content = fs.readFileSync(pdPath, 'utf8');
          const m = content.match(/##\s*Core Problem\s*\n([^\n#]+)/);
          if (m) appDescription = m[1].trim();
        } catch (e) {}
      }
      if (!appDescription) {
        const rrPath = path.join(cycleDir, 'research-report.md');
        if (fs.existsSync(rrPath)) {
          try {
            const content = fs.readFileSync(rrPath, 'utf8');
            const m = content.match(/##\s*Signal Summary\s*\n([^\n#]+)/);
            if (m) appDescription = m[1].trim();
          } catch (e) {}
        }
      }
      cycles.push({ name: folder, phase: currentPhase, isComplete, appDescription });
    }
  } catch (e) {}
  return cycles;
}

const HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>OpenClaw — Pipeline Monitor</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #111111; --surface: #181818; --surface-2: #1f1f1f;
    --border: #272727; --border-2: #333333;
    --text-primary: #e8e8e8; --text-secondary: #888; --text-muted: #555;
    --yellow: #f5c842; --yellow-dim: #7a6218; --yellow-bg: #1c1a10; --yellow-border: #3d3210;
    --red: #e05555; --red-dim: #7a2a2a; --red-bg: #1c1010; --red-border: #4a1f1f;
    --green: #4caf7d; --green-bg: #0f1f15; --green-border: #1e4030;
    --idle-dot: #444;
  }
  body { background: var(--bg); color: var(--text-primary); font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif; font-size: 13px; line-height: 1.5; min-height: 100vh; }
  header { display: flex; align-items: center; justify-content: space-between; padding: 18px 28px; border-bottom: 1px solid var(--border); background: var(--surface); }
  .header-left { display: flex; align-items: center; gap: 12px; }
  .logo-mark { width: 32px; height: 32px; background: var(--surface-2); border: 1px solid var(--border-2); border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 15px; }
  .header-title { font-size: 14px; font-weight: 600; }
  .header-sub { font-size: 11px; color: var(--text-muted); }
  .live-pill { display: flex; align-items: center; gap: 7px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 20px; padding: 5px 12px; font-size: 11px; color: var(--text-secondary); }
  .live-dot { width: 6px; height: 6px; background: #5a8a5a; border-radius: 50%; animation: blink 2.5s ease-in-out infinite; }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
  .summary-strip { display: flex; gap: 1px; background: var(--border); border-bottom: 1px solid var(--border); }
  .summary-item { flex: 1; background: var(--surface); padding: 12px 20px; }
  .summary-label { font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 4px; }
  .summary-value { font-size: 20px; font-weight: 600; }
  .summary-value.s-working { color: var(--yellow); }
  .summary-value.s-blocked { color: var(--red); }
  .summary-value.s-cycle { font-size: 13px; padding-top: 3px; color: var(--text-secondary); }
  .page-body { display: grid; grid-template-columns: 1fr 300px; gap: 0; }
  .pipeline-col { padding: 24px 28px; border-right: 1px solid var(--border); min-width: 0; }
  .cycles-col { padding: 20px 16px; background: var(--surface); min-height: calc(100vh - 120px); }
  .cycles-header { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.2px; color: var(--text-muted); margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid var(--border); }
  .cycles-empty { font-size: 12px; color: var(--text-muted); text-align: center; padding: 32px 0; line-height: 1.8; }
  .cycle-card { background: var(--surface-2); border: 1px solid var(--border); border-radius: 10px; padding: 14px; margin-bottom: 10px; }
  .cycle-card.is-active { border-color: var(--yellow-border); background: var(--yellow-bg); }
  .cycle-card.is-complete { border-color: var(--green-border); background: var(--green-bg); }
  .cycle-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 8px; }
  .cycle-name { font-size: 13px; font-weight: 600; word-break: break-word; }
  .cycle-status-badge { font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 4px; white-space: nowrap; flex-shrink: 0; }
  .badge-in-progress { color: var(--yellow); background: rgba(245,200,66,.08); border: 1px solid var(--yellow-border); }
  .badge-complete { color: var(--green); background: rgba(76,175,125,.08); border: 1px solid var(--green-border); }
  .cycle-description { font-size: 11px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 10px; }
  .cycle-phase-row { display: flex; align-items: center; gap: 8px; }
  .cycle-phase-label { font-size: 10px; color: var(--text-muted); }
  .cycle-phase-value { font-size: 10px; color: var(--text-secondary); background: var(--surface); border: 1px solid var(--border); border-radius: 4px; padding: 1px 7px; }
  .cycle-card.is-active .cycle-phase-value { color: var(--yellow); border-color: var(--yellow-border); background: rgba(245,200,66,.06); }
  .cycle-card.is-complete .cycle-phase-value { color: var(--green); border-color: var(--green-border); background: rgba(76,175,125,.06); }
  .phase-group { margin-bottom: 28px; }
  .phase-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .phase-name { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.2px; color: var(--text-muted); white-space: nowrap; }
  .phase-line { flex: 1; height: 1px; background: var(--border); }
  .agent-list { display: flex; flex-direction: column; gap: 8px; }
  .agent-row { display: grid; grid-template-columns: 220px 1fr; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; min-height: 72px; }
  .agent-row.is-working { border-color: var(--yellow-border); background: var(--yellow-bg); }
  .agent-row.is-blocked { border-color: var(--red-border); background: var(--red-bg); }
  .agent-identity { padding: 14px 16px; border-right: 1px solid var(--border); display: flex; flex-direction: column; justify-content: center; gap: 6px; }
  .agent-row.is-working .agent-identity { border-right-color: var(--yellow-border); }
  .agent-row.is-blocked .agent-identity { border-right-color: var(--red-border); }
  .identity-top { display: flex; align-items: center; gap: 8px; }
  .status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; background: var(--idle-dot); }
  .is-working .status-dot { background: var(--yellow); box-shadow: 0 0 6px var(--yellow-dim); animation: pulse-yellow 2s ease-in-out infinite; }
  .is-blocked .status-dot { background: var(--red); box-shadow: 0 0 6px var(--red-dim); }
  @keyframes pulse-yellow { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
  .agent-name { font-size: 13px; font-weight: 600; }
  .agent-meta { font-size: 11px; color: var(--text-muted); padding-left: 16px; }
  .status-badge { display: inline-block; font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: 4px; margin-left: 16px; margin-top: 2px; border: 1px solid transparent; }
  .badge-idle { color: var(--text-muted); background: var(--surface-2); border-color: var(--border); }
  .badge-working { color: var(--yellow); background: rgba(245,200,66,.08); border-color: var(--yellow-border); }
  .badge-blocked { color: var(--red); background: rgba(224,85,85,.08); border-color: var(--red-border); }
  .agent-activity { padding: 12px 16px; display: flex; flex-direction: column; justify-content: center; gap: 8px; }
  .activity-feed { display: flex; flex-direction: column; gap: 6px; }
  .activity-bubble { display: inline-flex; align-items: flex-start; gap: 8px; max-width: 100%; }
  .bubble-label { font-size: 10px; color: var(--text-muted); white-space: nowrap; padding-top: 2px; min-width: 70px; }
  .bubble-text { font-size: 12px; color: var(--text-secondary); background: var(--surface-2); border: 1px solid var(--border); border-radius: 6px; padding: 4px 10px; line-height: 1.4; }
  .is-working .bubble-text.current { color: #d4b84a; background: rgba(245,200,66,.06); border-color: var(--yellow-border); }
  .is-blocked .bubble-text.current { color: var(--red); background: rgba(224,85,85,.06); border-color: var(--red-border); }
  .cycle-tag { font-size: 10px; color: var(--text-muted); background: var(--surface-2); border: 1px solid var(--border); border-radius: 4px; padding: 1px 7px; display: inline-block; }
  footer { text-align: center; padding: 16px; color: var(--text-muted); font-size: 11px; border-top: 1px solid var(--border); }
</style>
</head>
<body>
<header>
  <div class="header-left">
    <div class="logo-mark">🦞</div>
    <div>
      <div class="header-title">OpenClaw Pipeline Monitor</div>
      <div class="header-sub">App Factory — Agent Status</div>
    </div>
  </div>
  <div class="live-pill"><div class="live-dot"></div><span>Live · updates every 5s</span></div>
</header>
<div class="summary-strip" id="summary-strip"></div>
<div class="page-body">
  <div class="pipeline-col" id="main-content"></div>
  <div class="cycles-col">
    <div class="cycles-header">📦 App Portfolio</div>
    <div id="cycles-content"><div class="cycles-empty">No cycles yet.<br>Start a cycle to see apps here.</div></div>
  </div>
</div>
<footer id="footer">—</footer>
<script>
const PHASE_ORDER = ['Orchestration','Discovery','Strategy','Architecture','Build','QA','Launch'];
function rowClass(s) { const v = s.toLowerCase(); return v === 'in progress' ? 'is-working' : v === 'blocked' ? 'is-blocked' : ''; }
function badgeClass(s) { const v = s.toLowerCase(); return v === 'in progress' ? 'badge-working' : v === 'blocked' ? 'badge-blocked' : 'badge-idle'; }
function badgeLabel(s) { const v = s.toLowerCase(); return v === 'in progress' ? 'Working' : v === 'blocked' ? 'Blocked' : 'Idle'; }
function renderRow(agent) {
  const s = agent.state;
  const hasCycle = s.cycle && s.cycle !== 'None' && s.cycle !== '—';
  const isWorking = s.status.toLowerCase() === 'in progress';
  const isBlocked = s.status.toLowerCase() === 'blocked';
  return \`<div class="agent-row \${rowClass(s.status)}">
    <div class="agent-identity">
      <div class="identity-top"><div class="status-dot"></div><span class="agent-name">\${agent.name}</span></div>
      <div class="agent-meta">\${agent.role} · \${agent.model}</div>
      \${hasCycle ? \`<div class="agent-meta">Cycle: <span class="cycle-tag">\${s.cycle}</span></div>\` : ''}
      <span class="status-badge \${badgeClass(s.status)}">\${badgeLabel(s.status)}</span>
    </div>
    <div class="agent-activity"><div class="activity-feed">
      \${(isWorking || isBlocked) ? \`<div class="activity-bubble"><span class="bubble-label">\${isBlocked ? '⚠ blocked' : 'working on'}</span><span class="bubble-text current">\${isBlocked ? s.blocker : s.nextAction}</span></div>\` : ''}
      \${s.nextAction !== '—' && !isWorking && !isBlocked ? \`<div class="activity-bubble"><span class="bubble-label">next up</span><span class="bubble-text">\${s.nextAction}</span></div>\` : ''}
      \${s.lastCompleted !== '—' ? \`<div class="activity-bubble"><span class="bubble-label">last done</span><span class="bubble-text">\${s.lastCompleted}</span></div>\` : ''}
    </div></div>
  </div>\`;
}
function renderCycleCard(cycle) {
  const cardClass = cycle.isComplete ? 'is-complete' : 'is-active';
  const bClass = cycle.isComplete ? 'badge-complete' : 'badge-in-progress';
  const bText = cycle.isComplete ? '✓ Complete' : 'In Progress';
  const desc = cycle.appDescription || 'Description available after Discovery phase.';
  return \`<div class="cycle-card \${cardClass}">
    <div class="cycle-top"><div class="cycle-name">\${cycle.name}</div><span class="cycle-status-badge \${bClass}">\${bText}</span></div>
    <div class="cycle-description">\${desc}</div>
    <div class="cycle-phase-row"><span class="cycle-phase-label">Phase:</span><span class="cycle-phase-value">\${cycle.phase}</span></div>
  </div>\`;
}
async function refresh() {
  try {
    const [ar, cr] = await Promise.all([fetch('/api/agents'), fetch('/api/cycles')]);
    const agents = await ar.json();
    const cycles = await cr.json();
    const working = agents.filter(a => a.state.status.toLowerCase() === 'in progress').length;
    const blocked = agents.filter(a => a.state.status.toLowerCase() === 'blocked').length;
    const idle = agents.filter(a => a.state.status.toLowerCase() === 'idle').length;
    document.getElementById('summary-strip').innerHTML = \`
      <div class="summary-item"><div class="summary-label">Agents</div><div class="summary-value">\${agents.length}</div></div>
      <div class="summary-item"><div class="summary-label">Working</div><div class="summary-value s-working">\${working}</div></div>
      <div class="summary-item"><div class="summary-label">Idle</div><div class="summary-value">\${idle}</div></div>
      <div class="summary-item"><div class="summary-label">Blocked</div><div class="summary-value s-blocked">\${blocked}</div></div>
      <div class="summary-item"><div class="summary-label">Apps in Portfolio</div><div class="summary-value s-cycle">\${cycles.length}</div></div>\`;
    if (cycles.length === 0) {
      document.getElementById('cycles-content').innerHTML = '<div class="cycles-empty">No cycles yet.<br>Start a cycle to see apps here.</div>';
    } else {
      const sorted = [...cycles.filter(c => !c.isComplete), ...cycles.filter(c => c.isComplete)];
      document.getElementById('cycles-content').innerHTML = sorted.map(renderCycleCard).join('');
    }
    const byPhase = {};
    for (const agent of agents) { const p = agent.phase || 'Other'; if (!byPhase[p]) byPhase[p] = []; byPhase[p].push(agent); }
    const phases = [...PHASE_ORDER, ...Object.keys(byPhase).filter(p => !PHASE_ORDER.includes(p))];
    let html = '';
    for (const phase of phases) {
      if (!byPhase[phase]) continue;
      html += \`<div class="phase-group"><div class="phase-header"><span class="phase-name">\${phase}</span><div class="phase-line"></div></div><div class="agent-list">\${byPhase[phase].map(renderRow).join('')}</div></div>\`;
    }
    document.getElementById('main-content').innerHTML = html;
    document.getElementById('footer').textContent = 'Last updated ' + new Date().toLocaleTimeString();
  } catch(e) { console.error('Refresh failed:', e); }
}
refresh();
setInterval(refresh, 5000);
</script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  if (req.url === '/api/agents') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify(getAgentData()));
  } else if (req.url === '/api/cycles') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify(getCyclesData()));
  } else {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(HTML);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('\n🦞 OpenClaw Pipeline Monitor');
  console.log('   Mac:  http://localhost:' + PORT);
  console.log('   PC:   http://[your-mac-ip]:' + PORT);
  console.log("   Mac IP: run 'ipconfig getifaddr en1'\n");
  console.log('   Watching STATE.md files. Updates every 5s.');
  console.log('   Ctrl+C to stop.\n');
});
