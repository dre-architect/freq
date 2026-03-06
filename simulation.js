/* FREQ AI — Barge Drafting Simulation
 * Vanilla JS state machine. No auto-start. User must press START.
 */
(function () {
  'use strict';

  // ─── CONSTANTS ────────────────────────────────────────────────────────────

  // Phase durations at 1× speed (ms)
  var PHASE_DUR = [20000, 15000, 60000, 20000, 20000, 15000];
  var TOTAL_DUR = 150000; // sum of above

  var PHASES = [
    { name: 'Initial Survey',      desc: 'Empty vessel baseline. Draft ~3.2 ft all stations. Cargo mass 0 T. Loading parameters pending.' },
    { name: 'Pre-Load Assessment', desc: 'Baseline confirmed. Loading authorized. Values stabilize before cargo operations commence.' },
    { name: 'Active Loading',      desc: 'Real-time monitoring during cargo loading. Continuous draft measurement across all 6 stations. Stability tracking active.' },
    { name: 'Cargo Verification',  desc: 'Loading plateau reached. Trim analysis in progress. Minor distribution corrections visible.' },
    { name: 'Post-Load Assessment','desc': 'Final readings locked. GM computed. Trim and heel verified within tolerances.' },
    { name: 'Final Survey & Report','desc': 'Sequence complete. Draft survey generated. All documentation compiled and logged.' }
  ];

  var LEFT_STEPS = [
    { title: 'STEP 1: CREW DEPLOYMENT',
      text: 'A crew member is dispatched to the barge deck. No safety harness required by standard procedure. Active crane and loading equipment present in the operational zone.',
      annotation: 'Man-overboard risk active — no automated safeguard' },
    { title: 'STEP 2: FORE DRAFT READING',
      text: 'Crew member visually reads the painted draft mark at the bow. Reading is estimated to the nearest half-inch by eye. Value radioed to shore operator.',
      annotation: '± 0.5 inch visual error introduced at every reading' },
    { title: 'STEP 3: MIDSHIP DRAFT READING',
      text: 'Crew walks to midship position. Second reading taken and radioed. Each transit across the active deck is a separate exposure event.',
      annotation: '2nd radio relay — compounding error accumulates' },
    { title: 'STEP 4: AFT DRAFT READING',
      text: 'Crew walks to stern for final reading. Three readings now radioed to shore and manually recorded on a paper log.',
      annotation: 'Manual paper log — no audit trail, no real-time data' },
    { title: 'STEP 5: MANUAL CALCULATION',
      text: 'Shore operator manually calculates displacement using hydrostatic tables. Arithmetic errors possible. Process requires 45–90 minutes for calculation and verification.',
      annotation: 'No real-time feedback during loading — operating blind' },
    { title: 'STEP 6: LOADING BEGINS — UNMONITORED',
      text: 'Loading commences based on pre-calculated targets. No real-time draft monitoring during active loading. Crew returns to deck periodically to re-check draft marks by eye.',
      annotation: 'UNMONITORED INTERVAL — deviation goes undetected' },
    { title: 'STEP 7: POST-LOAD SURVEY (REPEAT)',
      text: 'After loading completes, the entire measurement process repeats for the final draft survey. Total elapsed time: 3–4 hours. Report compiled manually.',
      annotation: 'TOTAL: ~4 HOURS | ERROR RATE: 1–3% | Risk present throughout' }
  ];

  // SVG barge geometry constants
  var KEEL_Y   = 168; // bottom of hull in SVG coords
  var DECK_Y   = 22;  // top of hull (deck)
  var HULL_H   = KEEL_Y - DECK_Y; // 146px
  var MAX_FT   = 12.5;             // total hull height in feet
  var PX_PER_FT = HULL_H / MAX_FT; // ~11.68 px/ft

  // Draft values: from empty (3.2 ft) to full (9.84 ft) by station
  var DRAFT_EMPTY = { fp: 3.20, fs: 3.18, mp: 3.25, ms: 3.23, ap: 3.15, as_: 3.13 };
  var DRAFT_FULL  = { fp: 9.80, fs: 9.78, mp: 9.87, ms: 9.85, ap: 9.92, as_: 9.90 };

  // Loading begins at phase 2 (index 2), which starts at 35s cumulative
  var LOAD_START_MS = PHASE_DUR[0] + PHASE_DUR[1]; // 35000ms

  // ─── STATE ────────────────────────────────────────────────────────────────

  var sim = {
    state:        'idle',    // idle | running | paused | complete | safety_alert
    phase:        0,         // 0-indexed (0-5)
    phaseElapsed: 0,         // ms elapsed within current phase
    totalElapsed: 0,         // ms elapsed overall
    leftStep:     0,         // 0-indexed (0-6)
    viewMode:     'schematic',
    speed:        1,
    lastTS:       null,
    rafId:        null,
    // live telemetry values
    draft: Object.assign({}, DRAFT_EMPTY),
    trim:  0.05, heel: 0.01, gm: 5.20, freeboard: 6.50,
    displacement: 1000.0, cargoMass: 0.0, loadProgress: 0,
    estRemain: '00:02:30'
  };

  // ─── ELEMENT CACHE ────────────────────────────────────────────────────────

  var el = {};

  function cacheEls() {
    var ids = [
      'sim-start','sim-pause','sim-reset','sim-status-dot','sim-status-label',
      'view-schematic','view-telemetry','speed-1','speed-2','speed-4',
      'schematic-view','telemetry-view',
      'left-step-num','left-step-title','left-step-text','left-annotation',
      'left-dots','left-prev','left-next',
      'phase-bar','phase-name','phase-desc',
      'completion-panel','mob-banner','mob-reset','mob-trigger',
      'completion-time','completion-cargo','completion-draft',
      'tel-fp','tel-fs','tel-mp','tel-ms','tel-ap','tel-as_',
      'tel-trim','tel-heel','tel-gm','tel-fb',
      'tel-disp','tel-cargo','tel-load','tel-est',
      'tel-phase','tel-timestamp','tel-mob-row',
      'barge-waterline','wl-label','cargo-fill',
      'draft-arr-fore','draft-arr-mid','draft-arr-aft',
      'mob-indicator'
    ];
    ids.forEach(function (id) {
      el[id] = document.getElementById(id);
    });
    // station groups
    var stations = ['fp','fs','mp','ms','ap','as_'];
    stations.forEach(function (s) {
      el['sg-'+s+'-vt'] = document.getElementById('sg-'+s+'-vt');
      el['sg-'+s+'-vb'] = document.getElementById('sg-'+s+'-vb');
      el['sg-'+s+'-hl'] = document.getElementById('sg-'+s+'-hl');
      el['sg-'+s+'-hr'] = document.getElementById('sg-'+s+'-hr');
      el['sg-'+s+'-val'] = document.getElementById('sg-'+s+'-val');
    });
  }

  // ─── MATH HELPERS ─────────────────────────────────────────────────────────

  function lerp(a, b, t) { return a + (b - a) * Math.min(Math.max(t, 0), 1); }

  function clamp(v, a, b) { return Math.min(Math.max(v, a), b); }

  function fmt(v, d) { return (+v).toFixed(d !== undefined ? d : 2); }

  function formatTime(s) {
    s = Math.max(0, Math.round(s));
    var h = Math.floor(s / 3600);
    var m = Math.floor((s % 3600) / 60);
    var sec = s % 60;
    return p2(h) + ':' + p2(m) + ':' + p2(sec);
  }

  function p2(n) { return n < 10 ? '0' + n : '' + n; }

  function pad2(n) { return p2(n); }

  // ─── TELEMETRY COMPUTE ────────────────────────────────────────────────────

  function computeTelemetry() {
    // Overall progress 0→1 based on total elapsed
    var overall = clamp(sim.totalElapsed / TOTAL_DUR, 0, 1);

    // Draft progress: loading starts at LOAD_START_MS (phase 2 onset)
    var draftT = clamp((sim.totalElapsed - LOAD_START_MS) / (TOTAL_DUR - LOAD_START_MS), 0, 1);

    // Noise: ±0.02 only when running
    var noise = sim.state === 'running' ? 0.02 : 0;
    function n() { return (Math.random() - 0.5) * 2 * noise; }

    var stations = ['fp','fs','mp','ms','ap','as_'];
    stations.forEach(function (s) {
      sim.draft[s] = lerp(DRAFT_EMPTY[s], DRAFT_FULL[s], draftT) + n();
    });

    var avgDraft = (sim.draft.fp + sim.draft.fs + sim.draft.mp +
                    sim.draft.ms + sim.draft.ap + sim.draft.as_) / 6;

    sim.cargoMass    = lerp(0, 1482.6, draftT);
    sim.loadProgress = clamp(Math.round(draftT * 100), 0, 100);
    sim.displacement = 1000 + sim.cargoMass;
    sim.trim         = clamp(lerp(0.05, 0.21, draftT) + n() * 0.3, 0, 1);
    sim.heel         = clamp(0.01 + n() * 0.5, 0, 1);
    sim.gm           = lerp(5.20, 4.50, draftT);
    sim.freeboard    = clamp(MAX_FT - avgDraft, 0, 12);

    var remainMs = (TOTAL_DUR - sim.totalElapsed) / sim.speed;
    sim.estRemain = formatTime(remainMs / 1000);
  }

  // ─── SVG SCHEMATIC UPDATE ─────────────────────────────────────────────────

  // Station config: [svgId-prefix, x-position, labelOffsetY (negative = above)]
  var STATION_CONFIG = [
    { key: 'fp',  x: 98,  labelY: -14, code: 'FP' },
    { key: 'fs',  x: 132, labelY: -26, code: 'FS' },
    { key: 'mp',  x: 272, labelY: -14, code: 'MP' },
    { key: 'ms',  x: 320, labelY: -26, code: 'MS' },
    { key: 'ap',  x: 455, labelY: -14, code: 'AP' },
    { key: 'as_', x: 490, labelY: -26, code: 'AS' }
  ];

  function updateSchematic() {
    var avgDraft = (sim.draft.fp + sim.draft.fs + sim.draft.mp +
                    sim.draft.ms + sim.draft.ap + sim.draft.as_) / 6;
    var wlY = clamp(KEEL_Y - avgDraft * PX_PER_FT, DECK_Y + 4, KEEL_Y - 4);

    // Waterline line
    if (el['barge-waterline']) {
      el['barge-waterline'].setAttribute('y1', wlY);
      el['barge-waterline'].setAttribute('y2', wlY);
    }

    // Waterline label
    if (el['wl-label']) {
      el['wl-label'].setAttribute('y', wlY - 4);
      el['wl-label'].textContent = 'WL: ' + fmt(avgDraft) + ' ft AVG';
    }

    // Cargo fill rectangle (from waterline down to keel)
    if (el['cargo-fill']) {
      var cfY = wlY;
      var cfH = Math.max(0, KEEL_Y - cfY);
      el['cargo-fill'].setAttribute('y', cfY);
      el['cargo-fill'].setAttribute('height', cfH);
    }

    // Draft dimension arrows
    updateDraftArrow('draft-arr-fore', wlY);
    updateDraftArrow('draft-arr-mid',  wlY);
    updateDraftArrow('draft-arr-aft',  wlY);

    // Station markers
    STATION_CONFIG.forEach(function (sc) {
      var draft = sim.draft[sc.key];
      var stWlY = clamp(KEEL_Y - draft * PX_PER_FT, DECK_Y + 4, KEEL_Y - 4);
      var cx = sc.x;

      // Crosshair — vertical top half
      var vt = el['sg-' + sc.key + '-vt'];
      if (vt) { vt.setAttribute('y1', stWlY - 4); vt.setAttribute('y2', stWlY); }
      var vb = el['sg-' + sc.key + '-vb'];
      if (vb) { vb.setAttribute('y1', stWlY); vb.setAttribute('y2', stWlY + 4); }
      var hl = el['sg-' + sc.key + '-hl'];
      if (hl) { hl.setAttribute('y1', stWlY); hl.setAttribute('y2', stWlY); }
      var hr = el['sg-' + sc.key + '-hr'];
      if (hr) { hr.setAttribute('y1', stWlY); hr.setAttribute('y2', stWlY); }

      var valEl = el['sg-' + sc.key + '-val'];
      if (valEl) {
        valEl.setAttribute('y', stWlY + sc.labelY);
        valEl.textContent = sc.code + ' | ' + fmt(draft) + ' ft | NOM';
      }
    });
  }

  function updateDraftArrow(id, wlY) {
    var arr = el[id];
    if (!arr) return;
    arr.setAttribute('y1', wlY);
    arr.setAttribute('y2', KEEL_Y - 2);
  }

  // ─── TELEMETRY DISPLAY UPDATE ─────────────────────────────────────────────

  function updateTelemetry() {
    setText('tel-fp',  fmt(sim.draft.fp));
    setText('tel-fs',  fmt(sim.draft.fs));
    setText('tel-mp',  fmt(sim.draft.mp));
    setText('tel-ms',  fmt(sim.draft.ms));
    setText('tel-ap',  fmt(sim.draft.ap));
    setText('tel-as_', fmt(sim.draft.as_));
    setText('tel-trim', fmt(sim.trim) + ' ft');
    setText('tel-heel', fmt(sim.heel, 2) + '\u00b0');
    setText('tel-gm',  fmt(sim.gm) + ' ft');
    setText('tel-fb',  fmt(sim.freeboard) + ' ft');
    setText('tel-disp', fmt(sim.displacement, 1) + ' T');
    setText('tel-cargo', fmt(sim.cargoMass, 1) + ' T');
    setText('tel-load', sim.loadProgress + '%');
    setText('tel-est',  sim.estRemain);
    setText('tel-phase', (sim.phase + 1) + ' OF 6');

    var now = new Date();
    setText('tel-timestamp',
      p2(now.getHours()) + ':' + p2(now.getMinutes()) + ':' + p2(now.getSeconds()));
  }

  function setText(id, val) {
    var e = el[id];
    if (e) e.textContent = val;
  }

  // ─── PHASE BAR UPDATE ─────────────────────────────────────────────────────

  function updatePhaseBar() {
    for (var i = 0; i < 6; i++) {
      var dot = document.getElementById('phase-dot-' + i);
      var lbl = document.getElementById('phase-label-' + i);
      if (!dot) continue;
      var cls, lblTxt;
      if (i < sim.phase) {
        cls = 'phase-dot complete'; lblTxt = 'COMPLETE';
      } else if (i === sim.phase) {
        cls = 'phase-dot active';   lblTxt = 'ACTIVE';
      } else {
        cls = 'phase-dot pending';  lblTxt = 'PENDING';
      }
      var inner = dot.querySelector('.phase-dot');
      if (inner) inner.className = cls;
      if (lbl) lbl.textContent = lblTxt;
    }
    if (el['phase-name']) el['phase-name'].textContent = 'Phase ' + (sim.phase + 1) + ': ' + PHASES[sim.phase].name;
    if (el['phase-desc']) el['phase-desc'].textContent = PHASES[sim.phase].desc;
  }

  // ─── LEFT PANEL ───────────────────────────────────────────────────────────

  function renderLeftStep() {
    var step = LEFT_STEPS[sim.leftStep];
    if (!step) return;
    setText('left-step-num', 'STEP ' + (sim.leftStep + 1) + ' OF 7');
    setText('left-step-title', step.title);
    setText('left-step-text', step.text);
    setText('left-annotation', step.annotation);

    // Dots
    if (el['left-dots']) {
      var dots = el['left-dots'].querySelectorAll('.left-dot');
      dots.forEach(function (d, i) {
        d.className = 'left-dot' +
          (i === sim.leftStep ? ' active' : (i < sim.leftStep ? ' done' : ''));
      });
    }

    if (el['left-prev']) el['left-prev'].disabled = sim.leftStep === 0 || sim.state === 'running';
    if (el['left-next']) el['left-next'].disabled = sim.leftStep === 6 || sim.state === 'running';
  }

  function syncLeftStep() {
    var phaseP = sim.phaseElapsed / PHASE_DUR[sim.phase];
    var step;
    switch (sim.phase) {
      case 0: step = phaseP < 0.5 ? 0 : 1; break;
      case 1: step = 2; break;
      case 2: step = phaseP < 0.5 ? 3 : 4; break;
      case 3: step = 5; break;
      case 4: step = 5; break;
      case 5: step = 6; break;
      default: step = 0;
    }
    if (step !== sim.leftStep) {
      sim.leftStep = step;
      renderLeftStep();
    }
  }

  // ─── ANIMATION LOOP ───────────────────────────────────────────────────────

  function animate(ts) {
    if (sim.state !== 'running') return;

    if (sim.lastTS === null) sim.lastTS = ts;
    var delta = (ts - sim.lastTS) * sim.speed;
    sim.lastTS = ts;
    // Cap to 500ms of real-time (handles tab switch)
    delta = Math.min(delta, 500 * sim.speed);

    sim.phaseElapsed += delta;
    sim.totalElapsed += delta;

    // Phase transitions
    while (sim.phase < 5 && sim.phaseElapsed >= PHASE_DUR[sim.phase]) {
      sim.phaseElapsed -= PHASE_DUR[sim.phase];
      sim.phase++;
    }

    if (sim.phase >= 5 && sim.phaseElapsed >= PHASE_DUR[5]) {
      finishSimulation();
      return;
    }

    syncLeftStep();
    computeTelemetry();
    updateSchematic();
    updateTelemetry();
    updatePhaseBar();

    sim.rafId = requestAnimationFrame(animate);
  }

  // ─── STATE TRANSITIONS ────────────────────────────────────────────────────

  function setSimState(state) {
    sim.state = state;

    var startBtn  = el['sim-start'];
    var pauseBtn  = el['sim-pause'];
    var resetBtn  = el['sim-reset'];
    var dot       = el['sim-status-dot'];
    var lbl       = el['sim-status-label'];

    function setDot(cls, text) {
      if (dot) dot.className = 'status-dot ' + cls;
      if (lbl) lbl.textContent = text;
    }

    // Hide/show mob banner
    if (el['mob-banner']) el['mob-banner'].style.display = state === 'safety_alert' ? 'flex' : 'none';

    switch (state) {
      case 'idle':
        show(startBtn); startBtn.textContent = '\u25b6 INITIATE SEQUENCE';
        hide(pauseBtn);
        if (resetBtn) resetBtn.disabled = true;
        setDot('dot-gray', 'SYSTEM READY');
        if (el['completion-panel']) el['completion-panel'].style.display = 'none';
        break;

      case 'running':
        hide(startBtn);
        show(pauseBtn); pauseBtn.textContent = '\u23f8 PAUSE';
        if (resetBtn) resetBtn.disabled = false;
        setDot('dot-green', 'SEQUENCE ACTIVE');
        sim.lastTS = null;
        sim.rafId = requestAnimationFrame(animate);
        break;

      case 'paused':
        show(startBtn); startBtn.textContent = '\u25b6 RESUME';
        hide(pauseBtn);
        if (resetBtn) resetBtn.disabled = false;
        setDot('dot-amber', 'SEQUENCE PAUSED');
        cancelAnim();
        break;

      case 'complete':
        show(startBtn); startBtn.textContent = '\u21ba RUN AGAIN';
        hide(pauseBtn);
        if (resetBtn) resetBtn.disabled = false;
        setDot('dot-blue', 'SURVEY COMPLETE');
        cancelAnim();
        if (el['completion-panel']) el['completion-panel'].style.display = 'block';
        break;

      case 'safety_alert':
        hide(startBtn);
        hide(pauseBtn);
        if (resetBtn) resetBtn.disabled = false;
        setDot('dot-red', 'SAFETY ALERT \u2014 E-STOP ACTIVE');
        cancelAnim();
        if (el['mob-indicator']) el['mob-indicator'].style.display = 'block';
        if (el['tel-mob-row']) el['tel-mob-row'].style.display = 'grid';
        break;
    }
  }

  function cancelAnim() {
    if (sim.rafId) { cancelAnimationFrame(sim.rafId); sim.rafId = null; }
  }

  function show(e) { if (e) e.style.display = 'inline-flex'; }
  function hide(e) { if (e) e.style.display = 'none'; }

  // ─── CONTROL HANDLERS ─────────────────────────────────────────────────────

  function handleStart() {
    if (sim.state === 'idle' || sim.state === 'complete') {
      if (sim.state === 'complete') resetData();
      setSimState('running');
    } else if (sim.state === 'paused') {
      setSimState('running');
    }
  }

  function handlePause() {
    if (sim.state === 'running') setSimState('paused');
  }

  function handleReset() {
    cancelAnim();
    resetData();
    setSimState('idle');
    computeTelemetry();
    updateSchematic();
    updateTelemetry();
    updatePhaseBar();
    renderLeftStep();
    if (el['mob-indicator']) el['mob-indicator'].style.display = 'none';
    if (el['tel-mob-row']) el['tel-mob-row'].style.display = 'none';
  }

  function resetData() {
    sim.phase = 0; sim.phaseElapsed = 0; sim.totalElapsed = 0;
    sim.leftStep = 0; sim.lastTS = null;
    sim.draft = Object.assign({}, DRAFT_EMPTY);
    sim.trim = 0.05; sim.heel = 0.01; sim.gm = 5.20; sim.freeboard = 6.50;
    sim.displacement = 1000.0; sim.cargoMass = 0.0; sim.loadProgress = 0;
    sim.estRemain = '00:02:30';
  }

  function finishSimulation() {
    sim.phase = 5;
    sim.phaseElapsed = PHASE_DUR[5];
    sim.totalElapsed = TOTAL_DUR;
    computeTelemetry();
    updateSchematic();
    updateTelemetry();
    updatePhaseBar();
    setSimState('complete');
    // Fill completion panel
    var opSec = Math.round(TOTAL_DUR / 1000 / sim.speed);
    var m = Math.floor(opSec / 60), s = opSec % 60;
    setText('completion-time', m + ' min ' + p2(s) + ' sec');
    setText('completion-cargo', '1,482.6 T (VERIFIED)');
    setText('completion-draft', '9.84 ft');
  }

  function handleMobTrigger() {
    if (sim.state !== 'running' && sim.state !== 'paused') return;
    setSimState('safety_alert');
  }

  function handleMobReset() {
    if (el['mob-indicator']) el['mob-indicator'].style.display = 'none';
    if (el['tel-mob-row']) el['tel-mob-row'].style.display = 'none';
    if (el['mob-banner']) el['mob-banner'].style.display = 'none';
    setSimState('paused');
  }

  function setView(mode) {
    sim.viewMode = mode;
    if (el['schematic-view']) el['schematic-view'].style.display = mode === 'schematic' ? 'block' : 'none';
    if (el['telemetry-view']) el['telemetry-view'].style.display = mode === 'telemetry' ? 'block' : 'none';
    if (el['view-schematic']) el['view-schematic'].classList.toggle('active', mode === 'schematic');
    if (el['view-telemetry']) el['view-telemetry'].classList.toggle('active', mode === 'telemetry');
  }

  function setSpeed(s) {
    sim.speed = s;
    ['speed-1','speed-2','speed-4'].forEach(function (id) {
      if (el[id]) el[id].classList.remove('active');
    });
    var target = s === 1 ? 'speed-1' : s === 2 ? 'speed-2' : 'speed-4';
    if (el[target]) el[target].classList.add('active');
  }

  // ─── PHASE NODE HOVER ─────────────────────────────────────────────────────

  function initPhaseTooltips() {
    document.querySelectorAll('.phase-node-wrap').forEach(function (wrap, i) {
      if (i >= PHASES.length) return;
      wrap.addEventListener('mouseenter', function (e) {
        var tip = document.getElementById('phase-tooltip');
        if (!tip) return;
        tip.textContent = PHASES[i].name + ': ' + PHASES[i].desc;
        tip.style.display = 'block';
        var rect = wrap.getBoundingClientRect();
        var parent = wrap.offsetParent;
        tip.style.left = (wrap.offsetLeft) + 'px';
        tip.style.top = (wrap.offsetTop - tip.offsetHeight - 8) + 'px';
      });
      wrap.addEventListener('mouseleave', function () {
        var tip = document.getElementById('phase-tooltip');
        if (tip) tip.style.display = 'none';
      });
    });
  }

  // ─── INIT ─────────────────────────────────────────────────────────────────

  function init() {
    cacheEls();
    if (!el['sim-start']) return; // not on platform page

    // Wire buttons
    el['sim-start'].addEventListener('click', handleStart);
    el['sim-pause'].addEventListener('click', handlePause);
    el['sim-reset'].addEventListener('click', handleReset);
    if (el['view-schematic']) el['view-schematic'].addEventListener('click', function () { setView('schematic'); });
    if (el['view-telemetry']) el['view-telemetry'].addEventListener('click', function () { setView('telemetry'); });
    if (el['speed-1']) el['speed-1'].addEventListener('click', function () { setSpeed(1); });
    if (el['speed-2']) el['speed-2'].addEventListener('click', function () { setSpeed(2); });
    if (el['speed-4']) el['speed-4'].addEventListener('click', function () { setSpeed(4); });
    if (el['left-prev']) el['left-prev'].addEventListener('click', function () {
      if (sim.leftStep > 0 && sim.state !== 'running') { sim.leftStep--; renderLeftStep(); }
    });
    if (el['left-next']) el['left-next'].addEventListener('click', function () {
      if (sim.leftStep < 6 && sim.state !== 'running') { sim.leftStep++; renderLeftStep(); }
    });
    if (el['mob-trigger']) el['mob-trigger'].addEventListener('click', handleMobTrigger);
    if (el['mob-reset'])   el['mob-reset'].addEventListener('click', handleMobReset);

    initPhaseTooltips();

    // Initial render
    setSimState('idle');
    computeTelemetry();
    updateSchematic();
    updateTelemetry();
    updatePhaseBar();
    renderLeftStep();
    setView('schematic');
    setSpeed(1);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
