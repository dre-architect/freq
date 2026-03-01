/**
 * FREQ AI — Barge Drafting Simulation
 * PlayCanvas Engine — pc.createScript() API
 * UI overlays: vanilla HTML/CSS/JS positioned over the canvas
 * Zero auto behavior — user controls every interaction
 */
(function () {
  'use strict';

  // Wait for PlayCanvas to load
  function waitForPC(cb) {
    if (typeof pc !== 'undefined') return cb();
    var check = setInterval(function () {
      if (typeof pc !== 'undefined') { clearInterval(check); cb(); }
    }, 100);
  }

  waitForPC(function () {
    // ─── APP INIT ───
    var canvas = document.getElementById('freqCanvas');
    if (!canvas) return;

    // Set canvas resolution
    canvas.width = canvas.clientWidth * (window.devicePixelRatio || 1);
    canvas.height = canvas.clientHeight * (window.devicePixelRatio || 1);

    var app = new pc.Application(canvas, {
      mouse: new pc.Mouse(canvas),
      keyboard: new pc.Keyboard(window)
    });
    app.setCanvasFillMode(pc.FILLMODE_NONE);
    app.setCanvasResolution(pc.RESOLUTION_AUTO);
    app.start();

    // Resize handler
    function resizeCanvas() {
      canvas.width = canvas.clientWidth * (window.devicePixelRatio || 1);
      canvas.height = canvas.clientHeight * (window.devicePixelRatio || 1);
      app.resizeCanvas();
    }
    window.addEventListener('resize', resizeCanvas);

    // Scene settings
    app.scene.ambientLight = new pc.Color(0.15, 0.18, 0.25);
    app.scene.rendering.toneMapping = pc.TONEMAP_ACES;
    app.scene.skyboxIntensity = 0.3;
    app.scene.rendering.fog = pc.FOG_LINEAR;
    app.scene.fogColor = new pc.Color(0.03, 0.05, 0.09);
    app.scene.fogStart = 80;
    app.scene.fogEnd = 200;

    // ─── MATERIALS ───
    var matHull = new pc.StandardMaterial();
    matHull.diffuse = new pc.Color(0.25, 0.28, 0.32);
    matHull.metalness = 0.6;
    matHull.shininess = 40;
    matHull.update();

    var matDeck = new pc.StandardMaterial();
    matDeck.diffuse = new pc.Color(0.35, 0.32, 0.28);
    matDeck.metalness = 0.2;
    matDeck.shininess = 20;
    matDeck.update();

    var matWater = new pc.StandardMaterial();
    matWater.diffuse = new pc.Color(0.02, 0.45, 0.53);
    matWater.opacity = 0.7;
    matWater.blendType = pc.BLEND_NORMAL;
    matWater.metalness = 0.8;
    matWater.shininess = 90;
    matWater.update();

    var matCargo = new pc.StandardMaterial();
    matCargo.diffuse = new pc.Color(0.4, 0.35, 0.25);
    matCargo.metalness = 0.1;
    matCargo.shininess = 10;
    matCargo.update();

    var matDock = new pc.StandardMaterial();
    matDock.diffuse = new pc.Color(0.3, 0.3, 0.3);
    matDock.metalness = 0.4;
    matDock.shininess = 15;
    matDock.update();

    var matMarker = new pc.StandardMaterial();
    matMarker.diffuse = new pc.Color(0.48, 0.23, 0.93); // #7C3AED
    matMarker.emissive = new pc.Color(0.48, 0.23, 0.93);
    matMarker.emissiveIntensity = 0.5;
    matMarker.update();

    var matMarkerActive = new pc.StandardMaterial();
    matMarkerActive.diffuse = new pc.Color(0.02, 0.71, 0.83); // #06B6D4
    matMarkerActive.emissive = new pc.Color(0.02, 0.71, 0.83);
    matMarkerActive.emissiveIntensity = 1.0;
    matMarkerActive.update();

    // ─── BARGE HULL ───
    // Main hull body — box approximation of a flat-bottomed barge
    var hull = new pc.Entity('hull');
    hull.addComponent('render', { type: 'box' });
    hull.render.material = matHull;
    hull.setLocalScale(30, 3, 8);  // long x, height y, wide z
    hull.setLocalPosition(0, 0, 0);
    app.root.addChild(hull);

    // Deck
    var deck = new pc.Entity('deck');
    deck.addComponent('render', { type: 'box' });
    deck.render.material = matDeck;
    deck.setLocalScale(29, 0.2, 7.5);
    deck.setLocalPosition(0, 1.6, 0);
    app.root.addChild(deck);

    // Hull side rails
    var railL = new pc.Entity('railLeft');
    railL.addComponent('render', { type: 'box' });
    railL.render.material = matHull;
    railL.setLocalScale(30, 0.8, 0.15);
    railL.setLocalPosition(0, 2.0, 3.85);
    app.root.addChild(railL);

    var railR = new pc.Entity('railRight');
    railR.addComponent('render', { type: 'box' });
    railR.render.material = matHull;
    railR.setLocalScale(30, 0.8, 0.15);
    railR.setLocalPosition(0, 2.0, -3.85);
    app.root.addChild(railR);

    // Bow shape (angled front)
    var bow = new pc.Entity('bow');
    bow.addComponent('render', { type: 'box' });
    bow.render.material = matHull;
    bow.setLocalScale(2, 2.5, 7);
    bow.setLocalPosition(16, 0.2, 0);
    bow.setLocalEulerAngles(0, 0, 15);
    app.root.addChild(bow);

    // ─── MEASUREMENT STATIONS (6 markers) ───
    var stationDefs = [
      { name: 'FP', x: 12, z: 3.0, label: 'FORE PORT' },
      { name: 'FS', x: 12, z: -3.0, label: 'FORE STBD' },
      { name: 'MP', x: 0, z: 3.0, label: 'MID PORT' },
      { name: 'MS', x: 0, z: -3.0, label: 'MID STBD' },
      { name: 'AP', x: -12, z: 3.0, label: 'AFT PORT' },
      { name: 'AS', x: -12, z: -3.0, label: 'AFT STBD' }
    ];
    var stationEntities = {};
    stationDefs.forEach(function (sd) {
      var marker = new pc.Entity('station_' + sd.name);
      marker.addComponent('render', { type: 'cylinder' });
      marker.render.material = matMarker;
      marker.setLocalScale(0.4, 0.3, 0.4);
      marker.setLocalPosition(sd.x, 1.8, sd.z);
      app.root.addChild(marker);
      stationEntities[sd.name] = marker;
    });

    // ─── CARGO (initially hidden, scales up during loading) ───
    var cargo = new pc.Entity('cargo');
    cargo.addComponent('render', { type: 'box' });
    cargo.render.material = matCargo;
    cargo.setLocalScale(20, 0.01, 5); // starts flat
    cargo.setLocalPosition(0, 1.6, 0);
    app.root.addChild(cargo);

    // ─── WATER PLANE ───
    var water = new pc.Entity('water');
    water.addComponent('render', { type: 'box' });
    water.render.material = matWater;
    water.setLocalScale(200, 0.1, 200);
    water.setLocalPosition(0, -0.5, 0);
    app.root.addChild(water);

    // ─── DOCK ───
    var dock = new pc.Entity('dock');
    dock.addComponent('render', { type: 'box' });
    dock.render.material = matDock;
    dock.setLocalScale(40, 4, 6);
    dock.setLocalPosition(0, 0.5, -10);
    app.root.addChild(dock);

    // Dock bollards
    for (var bi = -2; bi <= 2; bi++) {
      var bollard = new pc.Entity('bollard_' + bi);
      bollard.addComponent('render', { type: 'cylinder' });
      bollard.render.material = matDock;
      bollard.setLocalScale(0.5, 1, 0.5);
      bollard.setLocalPosition(bi * 8, 3.0, -7.2);
      app.root.addChild(bollard);
    }

    // ─── LIGHTING ───
    var dirLight = new pc.Entity('dirLight');
    dirLight.addComponent('light', {
      type: 'directional',
      color: new pc.Color(0.85, 0.9, 1.0),
      intensity: 1.2,
      castShadows: true,
      shadowResolution: 2048,
      shadowBias: 0.05,
      normalOffsetBias: 0.05
    });
    dirLight.setLocalEulerAngles(45, 135, 0);
    app.root.addChild(dirLight);

    var fillLight = new pc.Entity('fillLight');
    fillLight.addComponent('light', {
      type: 'directional',
      color: new pc.Color(0.4, 0.5, 0.7),
      intensity: 0.4,
      castShadows: false
    });
    fillLight.setLocalEulerAngles(30, -60, 0);
    app.root.addChild(fillLight);

    // ─── CAMERA ───
    var cameraEntity = new pc.Entity('camera');
    cameraEntity.addComponent('camera', {
      clearColor: new pc.Color(0.03, 0.05, 0.09),
      farClip: 500,
      fov: 45
    });
    cameraEntity.setLocalPosition(25, 18, 20);
    cameraEntity.lookAt(0, 0, 0);
    app.root.addChild(cameraEntity);

    // ─── CAMERA CONTROLLER (pc.createScript) ───
    var CameraOrbit = pc.createScript('cameraOrbit');
    CameraOrbit.attributes.add('target', { type: 'vec3', default: [0, 1, 0] });
    CameraOrbit.attributes.add('distance', { type: 'number', default: 35 });
    CameraOrbit.attributes.add('yaw', { type: 'number', default: 45 });
    CameraOrbit.attributes.add('pitch', { type: 'number', default: -25 });
    CameraOrbit.attributes.add('sensitivity', { type: 'number', default: 0.3 });
    CameraOrbit.attributes.add('enabled', { type: 'boolean', default: true });

    CameraOrbit.prototype.initialize = function () {
      this._targetYaw = this.yaw;
      this._targetPitch = this.pitch;
      this._targetDist = this.distance;
      this._targetPos = new pc.Vec3().copy(this.target);
      this._currentYaw = this.yaw;
      this._currentPitch = this.pitch;
      this._currentDist = this.distance;
      this._currentPos = new pc.Vec3().copy(this.target);
      this._dragging = false;

      this.app.mouse.on(pc.EVENT_MOUSEDOWN, this._onMouseDown, this);
      this.app.mouse.on(pc.EVENT_MOUSEUP, this._onMouseUp, this);
      this.app.mouse.on(pc.EVENT_MOUSEMOVE, this._onMouseMove, this);
      this.app.mouse.on(pc.EVENT_MOUSEWHEEL, this._onMouseWheel, this);
    };

    CameraOrbit.prototype._onMouseDown = function (e) {
      if (!this.enabled) return;
      this._dragging = true;
    };
    CameraOrbit.prototype._onMouseUp = function () {
      this._dragging = false;
    };
    CameraOrbit.prototype._onMouseMove = function (e) {
      if (!this._dragging || !this.enabled) return;
      this._targetYaw -= e.dx * this.sensitivity;
      this._targetPitch += e.dy * this.sensitivity;
      this._targetPitch = pc.math.clamp(this._targetPitch, -80, 10);
    };
    CameraOrbit.prototype._onMouseWheel = function (e) {
      if (!this.enabled) return;
      this._targetDist -= e.wheel * 2;
      this._targetDist = pc.math.clamp(this._targetDist, 10, 80);
      e.event.preventDefault();
    };

    CameraOrbit.prototype.setView = function (yaw, pitch, dist, target) {
      this._targetYaw = yaw;
      this._targetPitch = pitch;
      this._targetDist = dist;
      if (target) this._targetPos.copy(target);
    };

    CameraOrbit.prototype.update = function (dt) {
      var lerp = 1 - Math.pow(0.01, dt);
      this._currentYaw = pc.math.lerp(this._currentYaw, this._targetYaw, lerp);
      this._currentPitch = pc.math.lerp(this._currentPitch, this._targetPitch, lerp);
      this._currentDist = pc.math.lerp(this._currentDist, this._targetDist, lerp);
      this._currentPos.lerp(this._currentPos, this._targetPos, lerp);

      var yawRad = this._currentYaw * pc.math.DEG_TO_RAD;
      var pitchRad = this._currentPitch * pc.math.DEG_TO_RAD;
      var cosPitch = Math.cos(pitchRad);

      var x = this._currentPos.x + this._currentDist * cosPitch * Math.sin(yawRad);
      var y = this._currentPos.y + this._currentDist * Math.sin(-pitchRad);
      var z = this._currentPos.z + this._currentDist * cosPitch * Math.cos(yawRad);

      this.entity.setPosition(x, y, z);
      this.entity.lookAt(this._currentPos);
    };

    cameraEntity.addComponent('script');
    cameraEntity.script.create('cameraOrbit');
    var orbitScript = cameraEntity.script.cameraOrbit;

    // ─── CAMERA PRESETS ───
    var cameraPresets = {
      orbit:    { yaw: 45, pitch: -25, dist: 35, target: new pc.Vec3(0, 1, 0) },
      overhead: { yaw: 0, pitch: -85, dist: 40, target: new pc.Vec3(0, 0, 0) },
      side:     { yaw: 90, pitch: -10, dist: 30, target: new pc.Vec3(0, 1, 0) },
      fore:     { yaw: 0, pitch: -15, dist: 25, target: new pc.Vec3(14, 1, 0) },
      aft:      { yaw: 180, pitch: -15, dist: 25, target: new pc.Vec3(-14, 1, 0) }
    };

    // ─── SIMULATION STATE ───
    var PHASES = [
      { name: 'Initial Survey', dur: 20, desc: 'Empty vessel baseline captured. All stations calibrating.' },
      { name: 'Pre-Load Assessment', dur: 15, desc: 'Baseline confirmed. Loading authorized. Parameters locked.' },
      { name: 'Active Loading', dur: 60, desc: 'Real-time draft monitoring. Cargo mass climbing. Waterline rising.' },
      { name: 'Cargo Verification', dur: 20, desc: 'Values plateau. Trim analysis. Load distribution verified.' },
      { name: 'Post-Load Assessment', dur: 20, desc: 'Final readings locked. GM computed. Stability confirmed.' },
      { name: 'Final Survey & Report', dur: 15, desc: 'Sequence complete. Draft survey generated and logged.' }
    ];
    var TOTAL_DUR = 150; // sum of all phase durations
    var simState = 'IDLE';
    var simElapsed = 0;
    var simSpeed = 1;

    function getProgress() { return Math.min(simElapsed / TOTAL_DUR, 1); }
    function getCurrentPhase() {
      var t = 0;
      for (var i = 0; i < PHASES.length; i++) {
        t += PHASES[i].dur;
        if (simElapsed < t) return i;
      }
      return 5;
    }
    function randVar(v) { return v + (Math.random() - 0.5) * 0.02; }

    // Station draft values
    var baseVals = { FP: 3.20, FS: 3.18, MP: 3.24, MS: 3.22, AP: 3.28, AS: 3.26 };
    var loadedVals = { FP: 9.82, FS: 9.78, MP: 9.88, MS: 9.84, AP: 9.92, AS: 9.88 };

    function getStationVal(name) {
      var p = getProgress();
      return randVar(baseVals[name] + (loadedVals[name] - baseVals[name]) * p);
    }

    // ─── UI UPDATE ───
    function updateUI() {
      var p = getProgress();
      var phase = getCurrentPhase();

      // Status
      var dot = document.getElementById('sim-status-dot');
      var lbl = document.getElementById('sim-status-label');
      if (dot && lbl) {
        dot.className = 'status-dot ' + { IDLE: 'idle', RUNNING: 'running', PAUSED: 'paused', COMPLETE: 'complete' }[simState];
        lbl.textContent = { IDLE: 'SYSTEM READY', RUNNING: 'SEQUENCE ACTIVE', PAUSED: 'SEQUENCE PAUSED', COMPLETE: 'SURVEY COMPLETE' }[simState];
        lbl.style.color = simState === 'COMPLETE' ? '#06B6D4' : '#94A3B8';
      }

      // Buttons
      var btnStart = document.getElementById('btn-start');
      var btnPause = document.getElementById('btn-pause');
      var btnResume = document.getElementById('btn-resume');
      var btnReset = document.getElementById('btn-reset');
      var btnRestart = document.getElementById('btn-restart');
      if (btnStart) btnStart.style.display = simState === 'IDLE' ? '' : 'none';
      if (btnPause) btnPause.style.display = simState === 'RUNNING' ? '' : 'none';
      if (btnResume) btnResume.style.display = simState === 'PAUSED' ? '' : 'none';
      if (btnReset) btnReset.style.display = simState !== 'IDLE' ? '' : 'none';
      if (btnRestart) btnRestart.style.display = simState === 'COMPLETE' ? '' : 'none';

      // Station cards
      var cardNames = ['fp', 'mp', 'ap'];
      var stationMap = { fp: 'FP', mp: 'MP', ap: 'AP' };
      cardNames.forEach(function (cn) {
        var el = document.getElementById('val-' + cn);
        if (el) {
          if (simState === 'IDLE') {
            el.textContent = '--';
          } else {
            el.textContent = getStationVal(stationMap[cn]).toFixed(2) + ' ft';
          }
        }
      });

      // Telemetry
      function setTel(id, val) { var e = document.getElementById(id); if (e) e.textContent = val; }
      if (simState === 'IDLE') {
        setTel('tel-cargo', '0.0 T');
        setTel('tel-disp', '1,000.0 T');
        setTel('tel-load', '0.0%');
        setTel('tel-trim', '0.00 ft');
        setTel('tel-heel', '0.00\u00b0');
        setTel('tel-gm', '4.82 ft');
        setTel('tel-free', '5.50 ft');
        setTel('tel-time', '00:00');
      } else {
        var cargoMass = (1482.6 * p).toFixed(1);
        var disp = (1000 + 1482.6 * p).toFixed(1);
        var mins = Math.floor(simElapsed / 60);
        var secs = Math.floor(simElapsed % 60);
        setTel('tel-cargo', cargoMass + ' T');
        setTel('tel-disp', disp + ' T');
        setTel('tel-load', (p * 100).toFixed(1) + '%');
        setTel('tel-trim', randVar(0.08).toFixed(2) + ' ft');
        setTel('tel-heel', randVar(0.01).toFixed(2) + '\u00b0');
        setTel('tel-gm', randVar(4.82).toFixed(2) + ' ft');
        setTel('tel-free', (5.5 - 3.2 * p).toFixed(2) + ' ft');
        setTel('tel-time', String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0'));
      }

      // Phase bar
      for (var i = 0; i < 6; i++) {
        var pdot = document.getElementById('phase-dot-' + i);
        var plbl = document.getElementById('phase-lbl-' + i);
        if (!pdot || !plbl) continue;
        var isDone = i < phase || simState === 'COMPLETE';
        var isActive = i === phase && simState !== 'COMPLETE' && simState !== 'IDLE';
        pdot.style.borderColor = isDone ? '#06B6D4' : isActive ? '#7C3AED' : '#1E293B';
        pdot.style.background = isDone ? '#06B6D4' : isActive ? 'rgba(124,58,237,0.2)' : 'transparent';
        pdot.querySelector('span').style.color = isDone ? '#080C18' : isActive ? '#7C3AED' : '#64748B';
        plbl.textContent = isDone ? 'DONE' : isActive ? 'ACTIVE' : 'PENDING';
        plbl.style.color = isDone ? '#06B6D4' : isActive ? '#7C3AED' : '#64748B';
      }
      var pdesc = document.getElementById('phase-desc');
      if (pdesc && simState !== 'IDLE') {
        pdesc.textContent = 'Phase ' + (phase + 1) + ': ' + PHASES[Math.min(phase, 5)].name + ' \u2014 ' + PHASES[Math.min(phase, 5)].desc;
      } else if (pdesc) {
        pdesc.textContent = '';
      }

      // Completion summary
      var compEl = document.getElementById('sim-complete');
      if (compEl) compEl.style.display = simState === 'COMPLETE' ? '' : 'none';

      // Narration
      var narrEl = document.getElementById('sim-narration');
      var narrText = document.getElementById('narration-text');
      if (narrEl && narrText) {
        if (simState === 'RUNNING') {
          narrEl.style.display = '';
          narrText.textContent = PHASES[Math.min(phase, 5)].desc;
        } else {
          narrEl.style.display = 'none';
        }
      }
    }

    // ─── 3D SCENE UPDATE ───
    function updateScene() {
      var p = getProgress();

      // Barge sinks as cargo loads (hull moves down)
      var sinkAmount = p * 1.5; // max 1.5 units of sink
      hull.setLocalPosition(0, -sinkAmount, 0);
      deck.setLocalPosition(0, 1.6 - sinkAmount, 0);
      railL.setLocalPosition(0, 2.0 - sinkAmount, 3.85);
      railR.setLocalPosition(0, 2.0 - sinkAmount, -3.85);
      bow.setLocalPosition(16, 0.2 - sinkAmount, 0);

      // Cargo grows
      var cargoHeight = Math.max(0.01, p * 2.5);
      cargo.setLocalScale(20, cargoHeight, 5);
      cargo.setLocalPosition(0, 1.6 - sinkAmount + cargoHeight / 2, 0);

      // Station markers follow deck
      stationDefs.forEach(function (sd) {
        var marker = stationEntities[sd.name];
        marker.setLocalPosition(sd.x, 1.8 - sinkAmount, sd.z);
      });

      // Active station highlight
      if (simState === 'RUNNING') {
        var activeIdx = Math.floor((simElapsed * 1.5) % 6);
        var activeStation = stationDefs[activeIdx].name;
        stationDefs.forEach(function (sd) {
          stationEntities[sd.name].render.material = (sd.name === activeStation) ? matMarkerActive : matMarker;
        });
      } else {
        stationDefs.forEach(function (sd) {
          stationEntities[sd.name].render.material = matMarker;
        });
      }
    }

    // ─── MAIN UPDATE LOOP ───
    var lastTime = 0;
    app.on('update', function (dt) {
      if (simState === 'RUNNING') {
        simElapsed = Math.min(simElapsed + dt * simSpeed, TOTAL_DUR);
        if (simElapsed >= TOTAL_DUR) {
          simState = 'COMPLETE';
        }
        updateScene();
      }
      updateUI();
    });

    // ─── BUTTON HANDLERS ───
    document.getElementById('btn-start').addEventListener('click', function () {
      simState = 'RUNNING';
    });
    document.getElementById('btn-pause').addEventListener('click', function () {
      simState = 'PAUSED';
    });
    document.getElementById('btn-resume').addEventListener('click', function () {
      simState = 'RUNNING';
    });
    document.getElementById('btn-reset').addEventListener('click', function () {
      simState = 'IDLE';
      simElapsed = 0;
      updateScene();
    });
    document.getElementById('btn-restart').addEventListener('click', function () {
      simElapsed = 0;
      simState = 'RUNNING';
    });

    // ─── CAMERA BUTTON HANDLERS ───
    document.querySelectorAll('.cam-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var view = btn.getAttribute('data-cam');
        var preset = cameraPresets[view];
        if (!preset) return;

        orbitScript.setView(preset.yaw, preset.pitch, preset.dist, preset.target);

        // Update active button styles
        document.querySelectorAll('.cam-btn').forEach(function (b) {
          b.style.background = 'transparent';
          b.style.color = '#64748B';
          b.style.borderColor = '#1E293B';
          b.classList.remove('active');
        });
        btn.style.background = 'rgba(124,58,237,0.15)';
        btn.style.color = '#7C3AED';
        btn.style.borderColor = '#7C3AED';
        btn.classList.add('active');
      });
    });

    // ─── INITIAL STATE ───
    updateScene();
    updateUI();
  });
})();
