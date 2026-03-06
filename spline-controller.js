/* FREQ AI — Spline Digital Twin Controller
 * Manages 6-phase autonomous barge drafting simulation.
 * SCENARIO 1 (now): SVG placeholder — all controls, telemetry, and phase logic run fully.
 * SCENARIO 2 (drop-in): Set SPLINE_SCENE_URL below. Everything else works automatically.
 */
(function () {
  'use strict';

  // ─── CONFIGURATION ────────────────────────────────────────────────────────
  // Set to your Spline scene URL when the scene is ready.
  // Leave empty to use the SVG industrial placeholder.
  var SPLINE_SCENE_URL = '';

  // ─── PHASE DATA ───────────────────────────────────────────────────────────
  var PHASES = [
    {
      id: 'pre-survey',
      hudPhase: 'PRE-SURVEY',
      scanStatus: 'SCANNING\u2026',
      title: 'Phase 1 \u2014 Pre-Load Draft Survey',
      desc: 'Ghost LiDAR scans 6 hull stations \u2014 Fore Port, Fore Starboard, Mid Port, Mid Starboard, Aft Port, Aft Starboard. Baseline readings establish empty displacement and confirm safe operating parameters. Replaces a 45-minute manual walk-on surveyed by eye.',
      duration: 10000,
      splineState: 'Scanning',
      mobEnabled: false,
      draftStart: { fp: 10.20, fs: 10.18, mp: 10.25, ms: 10.23, ap: 10.15, as_: 10.13 },
      draftEnd:   { fp: 10.20, fs: 10.18, mp: 10.25, ms: 10.23, ap: 10.15, as_: 10.13 },
      cargoStart: 0,   cargoEnd: 0,
      trimStart: 0.02, trimEnd: 0.02,
      heelStart: 0.01, heelEnd: 0.01,
      gmStart: 4.85,   gmEnd: 4.85
    },
    {
      id: 'ballast-adj',
      hudPhase: 'BALLAST-ADJ',
      scanStatus: 'COMPLETE',
      title: 'Phase 2 \u2014 Ballast Adjustment',
      desc: 'The SOL system analyzes pre-survey readings and commands ballast adjustments to level the barge. Trim and heel values are driven toward zero for even weight distribution during loading. Automated sequence replaces manual ballast estimation.',
      duration: 10000,
      splineState: 'BallastAdjust',
      mobEnabled: false,
      draftStart: { fp: 10.20, fs: 10.18, mp: 10.25, ms: 10.23, ap: 10.15, as_: 10.13 },
      draftEnd:   { fp: 10.21, fs: 10.21, mp: 10.22, ms: 10.22, ap: 10.21, as_: 10.21 },
      cargoStart: 0,   cargoEnd: 0,
      trimStart: 0.02, trimEnd: 0.00,
      heelStart: 0.01, heelEnd: 0.00,
      gmStart: 4.85,   gmEnd: 4.85
    },
    {
      id: 'crane-pos',
      hudPhase: 'CRANE-POS',
      scanStatus: 'COMPLETE',
      title: 'Phase 3 \u2014 Crane Positioning',
      desc: 'The Lattice Core generates a G-Code load plan \u2014 optimal boom angle, slew position, and drop sequence to distribute aggregate evenly across the hold. The crane moves to the starting drop position before material flow begins.',
      duration: 8000,
      splineState: 'CranePosition',
      mobEnabled: true,
      draftStart: { fp: 10.21, fs: 10.21, mp: 10.22, ms: 10.22, ap: 10.21, as_: 10.21 },
      draftEnd:   { fp: 10.21, fs: 10.21, mp: 10.22, ms: 10.22, ap: 10.21, as_: 10.21 },
      cargoStart: 0,   cargoEnd: 0,
      trimStart: 0.00, trimEnd: 0.00,
      heelStart: 0.00, heelEnd: 0.00,
      gmStart: 4.85,   gmEnd: 4.85
    },
    {
      id: 'cargo-load',
      hudPhase: 'CARGO-LOAD',
      scanStatus: 'MONITORING',
      title: 'Phase 4 \u2014 Cargo Loading',
      desc: 'Aggregate material fills the barge hold via crane. Draft readings increase as the vessel sits lower in the water. The SOL system monitors displacement, stability, and distribution in real-time \u2014 replacing 3+ hours of periodic manual deck readings with continuous autonomous measurement.',
      duration: 30000,
      splineState: 'CargoLoading',
      mobEnabled: true,
      draftStart: { fp: 10.21, fs: 10.21, mp: 10.22, ms: 10.22, ap: 10.21, as_: 10.21 },
      draftEnd:   { fp: 12.40, fs: 12.38, mp: 12.48, ms: 12.46, ap: 12.52, as_: 12.50 },
      cargoStart: 0,    cargoEnd: 1850,
      trimStart: 0.00,  trimEnd: 0.18,
      heelStart: 0.00,  heelEnd: 0.03,
      gmStart: 4.85,    gmEnd: 4.62
    },
    {
      id: 'trim-corr',
      hudPhase: 'TRIM-CORR',
      scanStatus: 'CORRECTING',
      title: 'Phase 5 \u2014 Trim Correction',
      desc: 'Loading complete. Final trim and heel corrections bring the loaded barge to optimal sailing configuration. The SOL system redistributes ballast water and confirms draft readings stabilize at final target values before the post-load survey.',
      duration: 12000,
      splineState: 'TrimCorrection',
      mobEnabled: true,
      draftStart: { fp: 12.40, fs: 12.38, mp: 12.48, ms: 12.46, ap: 12.52, as_: 12.50 },
      draftEnd:   { fp: 12.44, fs: 12.44, mp: 12.46, ms: 12.46, ap: 12.45, as_: 12.45 },
      cargoStart: 1850, cargoEnd: 1850,
      trimStart: 0.18,  trimEnd: 0.01,
      heelStart: 0.03,  heelEnd: 0.00,
      gmStart: 4.62,    gmEnd: 4.60
    },
    {
      id: 'final-surv',
      hudPhase: 'FINAL-SURV',
      scanStatus: 'FINAL SCAN\u2026',
      title: 'Phase 6 \u2014 Final Draft Survey',
      desc: 'Ghost LiDAR performs a final scan of all 6 hull stations. Readings are compared against the load plan and displacement targets. A digital draft survey report generates automatically \u2014 ready for immediate submission to port authority and cargo owner.',
      duration: 10000,
      splineState: 'FinalScan',
      mobEnabled: false,
      draftStart: { fp: 12.44, fs: 12.44, mp: 12.46, ms: 12.46, ap: 12.45, as_: 12.45 },
      draftEnd:   { fp: 12.45, fs: 12.45, mp: 12.46, ms: 12.46, ap: 12.45, as_: 12.45 },
      cargoStart: 1850, cargoEnd: 1850,
      trimStart: 0.01,  trimEnd: 0.00,
      heelStart: 0.00,  heelEnd: 0.00,
      gmStart: 4.60,    gmEnd: 4.60
    }
  ];

  var TOTAL_DUR = PHASES.reduce(function (s, p) { return s + p.duration; }, 0); // 80000ms

  // ─── STATE ────────────────────────────────────────────────────────────────
  var sim = {
    state: 'unauthorized', // unauthorized | idle | running | paused | complete | mob
    phase: 0,
    phaseElapsed: 0,
    totalElapsed: 0,
    speed: 1,
    lastTS: null,
    rafId: null,
    mobFired: false,
    tel: { fp: 0, fs: 0, mp: 0, ms: 0, ap: 0, as_: 0, trim: 0, heel: 0, cargo: 0, gm: 4.85 }
  };

  var splineApp = null;
  var mobTimer = null;

  // ─── HELPERS ──────────────────────────────────────────────────────────────
  function lerp(a, b, t) { return a + (b - a) * Math.min(Math.max(t, 0), 1); }

  function lerpTel(ph, t) {
    var n = (sim.state === 'running') ? (Math.random() - 0.5) * 0.04 : 0;
    return {
      fp:  lerp(ph.draftStart.fp,  ph.draftEnd.fp,  t) + n,
      fs:  lerp(ph.draftStart.fs,  ph.draftEnd.fs,  t) + n,
      mp:  lerp(ph.draftStart.mp,  ph.draftEnd.mp,  t) + n,
      ms:  lerp(ph.draftStart.ms,  ph.draftEnd.ms,  t) + n,
      ap:  lerp(ph.draftStart.ap,  ph.draftEnd.ap,  t) + n,
      as_: lerp(ph.draftStart.as_, ph.draftEnd.as_, t) + n,
      cargo: Math.round(lerp(ph.cargoStart, ph.cargoEnd, t)),
      trim:  lerp(ph.trimStart, ph.trimEnd, t),
      heel:  lerp(ph.heelStart, ph.heelEnd, t),
      gm:    lerp(ph.gmStart,   ph.gmEnd,   t)
    };
  }

  function fmt2(v) { return (+v).toFixed(2); }
  function p2(n) { return (Math.round(n) < 10 ? '0' : '') + Math.round(n); }
  function fmtMMS(ms) { var s = Math.max(0, Math.round(ms / 1000)); return p2(Math.floor(s / 60)) + ':' + p2(s % 60); }
  function setText(id, v) { var e = document.getElementById(id); if (e) e.textContent = v; }
  function setStyle(id, prop, val) { var e = document.getElementById(id); if (e) e.style[prop] = val; }

  // ─── TELEMETRY DISPLAY ────────────────────────────────────────────────────
  function updateTelDisplay() {
    var t = sim.tel;
    setText('tel-fp',    fmt2(t.fp)    + ' ft');
    setText('tel-fs',    fmt2(t.fs)    + ' ft');
    setText('tel-mp',    fmt2(t.mp)    + ' ft');
    setText('tel-ms',    fmt2(t.ms)    + ' ft');
    setText('tel-ap',    fmt2(t.ap)    + ' ft');
    setText('tel-as',    fmt2(t.as_)   + ' ft');
    setText('tel-trim',  fmt2(t.trim)  + ' ft');
    setText('tel-heel',  fmt2(t.heel)  + '\u00b0');
    setText('tel-cargo', t.cargo.toLocaleString() + ' t');
    setText('tel-gm',    fmt2(t.gm)    + ' ft');
  }

  // ─── HUD UPDATE ───────────────────────────────────────────────────────────
  function updateHUD() {
    var ph = PHASES[sim.phase];
    setText('hud-phase',   ph.hudPhase);
    setText('hud-scan',    ph.scanStatus);
    setText('hud-elapsed', fmtMMS(sim.totalElapsed / sim.speed));
    setText('narration-title', ph.title);
    setText('narration-desc',  ph.desc);
  }

  // ─── PHASE STEPPER ────────────────────────────────────────────────────────
  function updateStepper() {
    for (var i = 0; i < 6; i++) {
      var el = document.getElementById('step-' + (i + 1));
      if (!el) continue;
      el.className = 'dt-step' +
        (i < sim.phase ? ' complete' : (i === sim.phase ? ' active' : ''));
    }
  }

  // ─── SVG PLACEHOLDER ─────────────────────────────────────────────────────
  // SVG coordinate constants (matches placeholder SVG in HTML)
  var SVG = {
    holdBottom: 318,  // y of hold floor
    holdTop: 274,     // y of hold ceiling
    wlEmpty: 320,     // waterline y when empty
    wlFull: 333,      // waterline y when fully loaded (barge sinks)
    scanFore: 258,    // scan beam x at fore
    scanAft: 870,     // scan beam x at aft
    draftEmpty: 10.20,
    draftFull: 12.45
  };

  function updatePlaceholder() {
    var t = sim.tel;

    // Cargo fill: hold height 44px (318-274), fill from bottom
    var cargoT = Math.min(t.cargo / 1850, 1);
    var holdH = SVG.holdBottom - SVG.holdTop; // 44px
    var fillH = Math.round(cargoT * holdH);
    var fillEl = document.getElementById('cargo-fill-dt');
    if (fillEl) {
      fillEl.setAttribute('height', fillH);
      fillEl.setAttribute('y', SVG.holdBottom - fillH);
    }

    // Waterline position (barge sinks as draft increases)
    var avgDraft = (t.fp + t.fs + t.mp + t.ms + t.ap + t.as_) / 6;
    var draftT = (avgDraft - SVG.draftEmpty) / (SVG.draftFull - SVG.draftEmpty);
    var wlY = Math.round(lerp(SVG.wlEmpty, SVG.wlFull, draftT));
    var wlEl = document.getElementById('wl-dt');
    if (wlEl) { wlEl.setAttribute('y1', wlY); wlEl.setAttribute('y2', wlY); }
    var wlLbl = document.getElementById('wl-dt-label');
    if (wlLbl) { wlLbl.setAttribute('y', wlY - 4); wlLbl.textContent = 'WL: ' + fmt2(avgDraft) + ' ft'; }

    // Station markers follow waterline
    var stX = [305, 335, 545, 575, 760, 790];
    var stIds = ['st-fp','st-fs','st-mp','st-ms','st-ap','st-as'];
    stIds.forEach(function (id, i) {
      var el = document.getElementById(id);
      if (el) el.setAttribute('cy', wlY);
    });

    // Material stream (Phase 4 only when running)
    var ph = PHASES[sim.phase];
    var streamEl = document.getElementById('material-stream-dt');
    if (streamEl) {
      var streamActive = ph.id === 'cargo-load' && sim.state === 'running';
      streamEl.style.display = streamActive ? 'block' : 'none';
      if (streamActive) {
        // Stream goes from crane tip (y≈95) down to waterline
        var streamH = Math.max(0, wlY - 95);
        streamEl.setAttribute('height', streamH);
      }
    }

    // Scan beam (phases 1 and 6 when running)
    var scanEl = document.getElementById('scan-beam-dt');
    if (scanEl) {
      var scanActive = (ph.id === 'pre-survey' || ph.id === 'final-surv') && sim.state === 'running';
      scanEl.style.display = scanActive ? 'block' : 'none';
      if (scanActive) {
        // Ping-pong fore→aft→fore, two cycles per phase
        var phT = sim.phaseElapsed / ph.duration;
        var cycle = (phT * 4) % 2; // 2 round trips
        var beamT = cycle < 1 ? cycle : 2 - cycle;
        var bx = Math.round(SVG.scanFore + beamT * (SVG.scanAft - SVG.scanFore));
        scanEl.setAttribute('x', bx);

        // Flash stations near scan beam
        stX.forEach(function (x, i) {
          var el = document.getElementById(stIds[i]);
          if (el) {
            var near = Math.abs(bx - x) < 50;
            el.setAttribute('r', near ? '7' : '4');
            el.setAttribute('opacity', near ? '1' : '0.6');
          }
        });
      } else {
        // Reset station sizes
        stIds.forEach(function (id) {
          var el = document.getElementById(id);
          if (el) { el.setAttribute('r', '4'); el.setAttribute('opacity', '0.6'); }
        });
      }
    }

    // Crane tip glow pulse during Phase 3 (positioning)
    var craneTip = document.getElementById('crane-tip-dt');
    if (craneTip) {
      var tipActive = ph.id === 'crane-pos' && sim.state === 'running';
      craneTip.setAttribute('opacity', tipActive ? '1' : '0.7');
    }
  }

  function resetPlaceholder() {
    var fillEl = document.getElementById('cargo-fill-dt');
    if (fillEl) { fillEl.setAttribute('height', 0); fillEl.setAttribute('y', SVG.holdBottom); }
    var wlEl = document.getElementById('wl-dt');
    if (wlEl) { wlEl.setAttribute('y1', SVG.wlEmpty); wlEl.setAttribute('y2', SVG.wlEmpty); }
    var wlLbl = document.getElementById('wl-dt-label');
    if (wlLbl) { wlLbl.setAttribute('y', SVG.wlEmpty - 4); wlLbl.textContent = 'WL: 10.20 ft'; }
    var streamEl = document.getElementById('material-stream-dt');
    if (streamEl) streamEl.style.display = 'none';
    var scanEl = document.getElementById('scan-beam-dt');
    if (scanEl) scanEl.style.display = 'none';
    ['st-fp','st-fs','st-mp','st-ms','st-ap','st-as'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.setAttribute('r', '4'); el.setAttribute('cy', SVG.wlEmpty); el.setAttribute('opacity', '0.6'); }
    });
  }

  // ─── ANIMATION LOOP ───────────────────────────────────────────────────────
  function animate(ts) {
    if (sim.state !== 'running') return;
    if (sim.lastTS === null) sim.lastTS = ts;
    var delta = Math.min((ts - sim.lastTS) * sim.speed, 500 * sim.speed);
    sim.lastTS = ts;

    sim.phaseElapsed += delta;
    sim.totalElapsed += delta;

    // Phase transitions
    while (sim.phase < 5 && sim.phaseElapsed >= PHASES[sim.phase].duration) {
      sim.phaseElapsed -= PHASES[sim.phase].duration;
      sim.phase++;
      onPhaseChange();
    }
    if (sim.phase >= 5 && sim.phaseElapsed >= PHASES[5].duration) {
      completeSequence();
      return;
    }

    // Compute telemetry
    var ph = PHASES[sim.phase];
    var t = Math.min(sim.phaseElapsed / ph.duration, 1);
    sim.tel = lerpTel(ph, t);

    updateHUD();
    updateTelDisplay();
    updateStepper();
    if (!splineApp) updatePlaceholder();
    setText('hud-elapsed', fmtMMS(sim.totalElapsed / sim.speed));

    // Enable MOB button when appropriate
    var mobBtn = document.getElementById('btn-mob');
    if (mobBtn && !sim.mobFired && ph.mobEnabled) mobBtn.disabled = false;

    sim.rafId = requestAnimationFrame(animate);
  }

  function onPhaseChange() {
    var ph = PHASES[sim.phase];
    if (splineApp) triggerSplineState(ph.splineState);
    // Disable MOB if new phase doesn't allow it
    var mobBtn = document.getElementById('btn-mob');
    if (mobBtn && !ph.mobEnabled) mobBtn.disabled = true;
  }

  // ─── COMPLETION ───────────────────────────────────────────────────────────
  function completeSequence() {
    cancelAnim();
    sim.state = 'complete';
    sim.phase = 5;
    sim.phaseElapsed = PHASES[5].duration;
    sim.tel = lerpTel(PHASES[5], 1);

    updateTelDisplay();
    updateHUD();
    for (var i = 0; i < 6; i++) {
      var el = document.getElementById('step-' + (i + 1));
      if (el) el.className = 'dt-step complete';
    }

    setText('hud-phase',   'COMPLETE');
    setText('hud-scan',    'VERIFIED');
    setText('narration-title', 'Survey Complete');
    setText('narration-desc',  'Full loading cycle finished. Zero crew deck exposure. All draft readings verified. Regulatory documentation generated automatically. This replaces a 4-hour manual operation.');

    // Fill completion summary
    var opSec = Math.round(sim.totalElapsed / 1000 / sim.speed);
    var opMin = Math.floor(opSec / 60), opS = opSec % 60;
    var opStr = opMin + ' min ' + p2(opS) + ' sec';
    setText('sum-time', opStr);
    setText('sum-freq-time', opStr);
    var avgFinal = (sim.tel.fp + sim.tel.mp + sim.tel.ap) / 3;
    setText('sum-draft', fmt2(avgFinal) + ' ft');
    setText('sum-trim',  fmt2(sim.tel.trim) + ' ft / ' + fmt2(sim.tel.heel) + '\u00b0');

    setStyle('completion-summary', 'display', 'block');
    if (!splineApp) updatePlaceholder();
    if (splineApp) triggerSplineState('Complete');
    setSimUIState('complete');
  }

  // ─── MOB ──────────────────────────────────────────────────────────────────
  function triggerMOB() {
    if (sim.state !== 'running' && sim.state !== 'paused') return;
    cancelAnim();
    sim.state = 'mob';
    sim.mobFired = true;
    setSimUIState('mob');

    var overlay = document.getElementById('mob-overlay');
    if (overlay) overlay.style.display = 'flex';
    setText('mob-countdown', '10');

    var count = 10;
    mobTimer = setInterval(function () {
      count--;
      setText('mob-countdown', count);
      if (count <= 0) {
        clearInterval(mobTimer);
        clearMOB();
      }
    }, 1000);
  }

  function clearMOB() {
    if (mobTimer) { clearInterval(mobTimer); mobTimer = null; }
    sim.state = 'paused';
    var overlay = document.getElementById('mob-overlay');
    if (overlay) overlay.style.display = 'none';
    setText('hud-scan', 'ALL CLEAR');
    setSimUIState('paused');
  }

  // ─── BUTTON STATE MACHINE ─────────────────────────────────────────────────
  function setSimUIState(state) {
    var IDs = ['btn-authorize','btn-initiate','btn-pause','btn-resume','btn-reset','btn-mob'];
    IDs.forEach(function (id) {
      var e = document.getElementById(id);
      if (e) e.disabled = true;
    });
    function en(id) { var e = document.getElementById(id); if (e) e.disabled = false; }

    switch (state) {
      case 'unauthorized':
        en('btn-authorize');
        break;
      case 'idle':
        en('btn-initiate');
        en('btn-reset');
        var auth = document.getElementById('btn-authorize');
        if (auth) { auth.disabled = true; auth.textContent = 'AUTHORIZED \u2713'; auth.classList.add('authorized'); }
        break;
      case 'running':
        en('btn-pause');
        en('btn-reset');
        break;
      case 'paused':
        en('btn-resume');
        en('btn-reset');
        break;
      case 'complete':
        en('btn-reset');
        break;
      case 'mob':
        // All disabled; countdown handles resume
        break;
    }
  }

  // ─── CONTROL HANDLERS ─────────────────────────────────────────────────────
  function handleAuthorize() {
    sim.state = 'idle';
    setText('hud-phase',   'AUTHORIZED');
    setText('hud-scan',    'READY');
    setText('narration-title', 'System Authorized');
    setText('narration-desc',  'FREQ AI autonomous barge drafting system is authorized. Press INITIATE SEQUENCE to begin the 6-phase survey and loading operation. Ghost LiDAR is locked on BARGE-402.');
    setSimUIState('idle');
    var vp = document.getElementById('dt-viewport');
    if (vp) vp.classList.add('authorized');
  }

  function handleInitiate() {
    if (sim.state !== 'idle' && sim.state !== 'paused') return;
    sim.state = 'running';
    sim.lastTS = null;
    setSimUIState('running');
    if (splineApp) triggerSplineState(PHASES[sim.phase].splineState);
    sim.rafId = requestAnimationFrame(animate);
  }

  function handlePause() {
    if (sim.state !== 'running') return;
    sim.state = 'paused';
    cancelAnim();
    setSimUIState('paused');
  }

  function handleResume() {
    if (sim.state !== 'paused') return;
    sim.state = 'running';
    sim.lastTS = null;
    sim.rafId = requestAnimationFrame(animate);
    setSimUIState('running');
  }

  function handleReset() {
    cancelAnim();
    if (mobTimer) { clearInterval(mobTimer); mobTimer = null; }
    var overlay = document.getElementById('mob-overlay');
    if (overlay) overlay.style.display = 'none';
    setStyle('completion-summary', 'display', 'none');

    sim.state = 'idle';
    sim.phase = 0; sim.phaseElapsed = 0; sim.totalElapsed = 0;
    sim.lastTS = null; sim.mobFired = false;
    sim.tel = { fp: 0, fs: 0, mp: 0, ms: 0, ap: 0, as_: 0, trim: 0, heel: 0, cargo: 0, gm: 4.85 };

    setSimUIState('idle');
    setText('hud-phase',   'AUTHORIZED');
    setText('hud-scan',    'READY');
    setText('hud-elapsed', '00:00');
    setText('narration-title', 'System Authorized');
    setText('narration-desc',  'Ready to initiate. Press INITIATE SEQUENCE to begin the 6-phase autonomous survey.');

    ['tel-fp','tel-fs','tel-mp','tel-ms','tel-ap','tel-as',
     'tel-trim','tel-heel','tel-cargo','tel-gm'].forEach(function (id) { setText(id, '\u2013'); });

    for (var i = 0; i < 6; i++) {
      var el = document.getElementById('step-' + (i + 1));
      if (el) el.className = 'dt-step' + (i === 0 ? ' active' : '');
    }

    resetPlaceholder();
    if (splineApp) triggerSplineState('Idle');
  }

  function cancelAnim() {
    if (sim.rafId) { cancelAnimationFrame(sim.rafId); sim.rafId = null; }
  }

  // ─── CAMERA ───────────────────────────────────────────────────────────────
  function handleCamera(view) {
    document.querySelectorAll('.cam-btn').forEach(function (b) {
      b.classList.toggle('active', b.dataset.view === view);
    });
    setText('cam-label', view.toUpperCase());
    if (splineApp) {
      try {
        var camName = view.charAt(0).toUpperCase() + view.slice(1);
        var cam = splineApp.findObjectByName(camName);
        if (cam && typeof splineApp.setActiveCamera === 'function') splineApp.setActiveCamera(cam);
      } catch (e) { /* camera API varies by Spline version */ }
    }
  }

  // ─── SPEED ────────────────────────────────────────────────────────────────
  function setSpeed(s) {
    sim.speed = s;
    document.querySelectorAll('.dt-speed-btn').forEach(function (b) {
      b.classList.toggle('active', parseInt(b.dataset.speed) === s);
    });
  }

  // ─── SPLINE RUNTIME ───────────────────────────────────────────────────────
  function triggerSplineState(stateName) {
    if (!splineApp) return;
    try {
      if (typeof splineApp.emitEvent === 'function') splineApp.emitEvent('stateChange', { state: stateName });
      if (typeof splineApp.setState === 'function') splineApp.setState(stateName);
    } catch (e) { /* ignore */ }
  }

  function loadSplineRuntime(url) {
    var script = document.createElement('script');
    script.src = 'https://unpkg.com/@splinetool/runtime@latest/build/runtime.js';
    script.onload = function () {
      var canvas = document.getElementById('canvas3d');
      if (!canvas || typeof window.SPLINE === 'undefined') return;
      var app = new window.SPLINE.Application(canvas);
      app.load(url).then(function () {
        splineApp = app;
        var ph = document.getElementById('dt-placeholder');
        if (ph) ph.style.display = 'none';
        canvas.style.display = 'block';
        triggerSplineState('Idle');
      }).catch(function (err) {
        console.warn('[FREQ AI] Spline load failed, using SVG placeholder:', err);
      });
    };
    document.head.appendChild(script);
  }

  // ─── INIT ─────────────────────────────────────────────────────────────────
  function init() {
    if (!document.getElementById('btn-authorize')) return; // Not on digital-twin page

    document.getElementById('btn-authorize').addEventListener('click', handleAuthorize);
    document.getElementById('btn-initiate').addEventListener('click', handleInitiate);
    document.getElementById('btn-pause').addEventListener('click', handlePause);
    document.getElementById('btn-resume').addEventListener('click', handleResume);
    document.getElementById('btn-reset').addEventListener('click', handleReset);

    var mobBtn = document.getElementById('btn-mob');
    if (mobBtn) mobBtn.addEventListener('click', triggerMOB);

    document.querySelectorAll('.cam-btn').forEach(function (b) {
      b.addEventListener('click', function () { handleCamera(b.dataset.view); });
    });

    document.querySelectorAll('.dt-speed-btn').forEach(function (b) {
      b.addEventListener('click', function () { setSpeed(parseInt(b.dataset.speed)); });
    });

    // Initial UI state
    setSimUIState('unauthorized');
    setText('hud-phase',   'IDLE');
    setText('hud-scan',    'LOCKED');
    setText('hud-elapsed', '00:00');

    if (SPLINE_SCENE_URL) loadSplineRuntime(SPLINE_SCENE_URL);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
