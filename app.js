const PROXY = 'https://super-pine-05c2.kw2025jp.workers.dev';

const MCT_ICONS = {
  sword: 'icons/mct/sword.svg', axe: 'icons/mct/axe.svg', mace: 'icons/mct/mace.svg',
  pot: 'icons/mct/pot.svg', uhc: 'icons/mct/uhc.svg', smp: 'icons/mct/smp.svg',
  nethop: 'icons/mct/nethop.svg', vanilla: 'icons/mct/vanilla.svg'
};

const PVP_ICONS = {
  sword: 'sword.svg', axe: 'axe.svg', crystal: 'vanilla.svg',
  pot: 'pot.svg', uhc: 'uhc.svg', smp: 'smp.svg', mace: 'mace.svg',
  neth_pot: 'nethop.svg'
};

const SUB_ICONS = {
  bed: 'icons/sub/bed.svg', debuff: 'icons/sub/debuff.svg', elytra: 'icons/sub/elytra.svg',
  manhunt: 'icons/sub/manhunt.svg', dia_smp: 'icons/sub/dia_smp.svg', speed: 'icons/sub/speed.svg',
  og_vanilla: 'icons/sub/og_vanilla.svg', minecart: 'icons/sub/minecart.svg', dia_crystal: 'icons/sub/dia_crystal.svg',
  bow: 'icons/sub/bow.svg', trident: 'icons/sub/trident.svg', creeper: 'icons/sub/creeper.svg'
};

const GM_LABELS = {
  sword: 'Sword', axe: 'Axe', mace: 'Mace', pot: 'Pot',
  uhc: 'UHC', smp: 'SMP', nethop: 'NethOP', vanilla: 'Vanilla',
  crystal: 'Crystal', neth_pot: 'NethOP',
  bed: 'Bed', debuff: 'DeBuff', elytra: 'Elytra',
  manhunt: 'Manhunt', dia_smp: 'Dia SMP', speed: 'Speed',
  og_vanilla: 'OG Vanilla', minecart: 'Minecart', dia_crystal: 'Dia Crystal',
  bow: 'Bow', trident: 'Trident', creeper: 'Creeper'
};

const ORDERS = {
  mct: ['sword', 'axe', 'mace', 'pot', 'uhc', 'smp', 'nethop', 'vanilla'],
  pvp: ['sword', 'axe', 'mace', 'pot', 'uhc', 'smp', 'neth_pot', 'crystal'],
  sub: ['bed', 'debuff', 'elytra', 'manhunt', 'dia_smp', 'speed', 'og_vanilla', 'minecart', 'dia_crystal', 'bow', 'trident', 'creeper'],
};

const TIER_COLORS = {
  1: { ht: '#ffd700', lt: '#b8960c' },
  2: { ht: '#f0f0f0', lt: '#a0a0a0' },
  3: { ht: '#cd7f32', lt: '#8b5a1a' },
  4: { ht: '#7a8fa6', lt: '#4e6070' },
  5: { ht: '#8a8a8a', lt: '#555555' },
};

function fmt(tier, pos, retired = false) {
  const label   = pos === 0 ? 'HT' : 'LT';
  const key     = pos === 0 ? 'ht' : 'lt';
  const colors  = TIER_COLORS[Math.min(tier, 5)] || TIER_COLORS[5];
  const color   = colors[key];
  const shadow  = pos === 0 && !retired ? `text-shadow:0 0 12px ${color}99;` : '';
  const opacity = retired ? 'opacity:0.3;' : '';
  return `<span style="color:${color};${shadow}${opacity}font-weight:900">${label}${tier}</span>`;
}

function fmtDate(ts) {
  return new Date(ts * 1000).toLocaleDateString('ja-JP');
}

function buildTable(rankings, iconMap, order = []) {
  let entries = Object.entries(rankings);
  if (order.length) {
    entries = entries.sort((a, b) => {
      const ai = order.indexOf(a[0]);
      const bi = order.indexOf(b[0]);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });
  }
  if (!entries.length) return '<p style="color:#444;font-size:0.85rem">No Tiers Found</p>';
  return `
    <table class="rank-table">
      <thead><tr>
        <th>Mode</th><th>Tier</th><th>Peak</th><th>Attained</th><th>Status</th>
      </tr></thead>
      <tbody>
        ${entries.map(([gm, info]) => {
          const icon  = iconMap[gm] ? `<img src="${iconMap[gm]}" class="gm-icon" alt="${gm}">` : '';
          const label = GM_LABELS[gm] || gm;
          return `
            <tr>
              <td><span class="gm-name">${icon}${label}</span></td>
              <td class="tier-cell">${fmt(info.tier, info.pos, info.retired)}</td>
              <td class="peak-cell">${fmt(info.peak_tier, info.peak_pos, info.retired)}</td>
              <td class="date-cell">${fmtDate(info.attained)}</td>
              <td><span class="status-dot ${info.retired ? 'retired-txt' : 'active'}">${info.retired ? '● Retired' : '● Active'}</span></td>
            </tr>`;
        }).join('')}
      </tbody>
    </table>`;
}

function buildCard(data, site) {
  const configs = {
    mct: { label: 'MCTiers',  iconMap: MCT_ICONS },
    pvp: { label: 'PvPTiers', iconMap: PVP_ICONS },
    sub: { label: 'SubTiers', iconMap: SUB_ICONS },
  };
  const { label, iconMap } = configs[site];
  const uuid    = (data.uuid || '').replace(/-/g, '');
  const fmtUuid = uuid.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');

  return `
    <div class="card">
      <div class="player-header">
        <img class="avatar"
             src="https://mc-heads.net/avatar/${fmtUuid}/52"
             onerror="this.style.display='none'" alt="">
        <div>
          <div class="site-badge">${label}</div>
          <div class="player-name">${data.name}</div>
          <div class="meta-row">
            <span class="pill">${data.region}</span>
            <span class="pill">#${data.overall} Overall</span>
            <span class="pill">${data.points} pts</span>
          </div>
        </div>
      </div>
      <div class="rankings-section">
        <div class="section-label">Tiers</div>
        ${buildTable(data.rankings || {}, iconMap, ORDERS[site] || [])}
      </div>
    </div>`;
}

async function fetchSafe(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function search() {
  const name = document.getElementById('nameInput').value.trim();
  if (!name) return;
  const btn = document.getElementById('btn');
  const out = document.getElementById('result');
  btn.disabled = true;
  out.innerHTML = '<p class="loading">Searching... (初回は少し時間がかかります)</p>';

  const [mctData, pvpData, subData] = await Promise.all([
    fetchSafe(`${PROXY}/mct/${encodeURIComponent(name)}`),
    fetchSafe(`${PROXY}/pvp/${encodeURIComponent(name)}`),
    fetchSafe(`${PROXY}/sub/${encodeURIComponent(name)}`)
  ]);

  btn.disabled = false;

  if (!mctData && !pvpData && !subData) {
    out.innerHTML = `<div class="error-box">Player Not Found</div>`;
    return;
  }

  let html = '<div class="results">';
  if (mctData) html += buildCard(mctData, 'mct');
  if (pvpData) html += buildCard(pvpData, 'pvp');
  if (subData) html += buildCard(subData, 'sub');
  html += '</div>';
  out.innerHTML = html;
}

document.getElementById('nameInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') search();
});
