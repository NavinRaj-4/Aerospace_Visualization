import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Wind, 
  RotateCcw, 
  Sliders, 
  Eye, 
  Flame, 
  Sparkles, 
  AlertTriangle, 
  Maximize2,
  Minimize2,
  Layers,
  Compass
} from 'lucide-react';

export default function WindTunnelCanvas({
  selectedModel,
  aoa = 4.0,
  setAoa,
  mach = 0.15,
  setMach,
  currentTelemetry
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const airfoilGroupRef = useRef(null);
  const particlesRef = useRef(null);
  const animFrameId = useRef(null);

  // Viewport Settings
  const [showStreamlines, setShowStreamlines] = useState(true);
  const [showSmokeTubes, setShowSmokeTubes] = useState(true);
  const [showPressureHeatmap, setShowPressureHeatmap] = useState(true);
  const [flowSpeedMultiplier, setFlowSpeedMultiplier] = useState(1.0);
  const [isOrbiting, setIsOrbiting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Mouse interaction state for camera orbit
  const mouseState = useRef({
    isDragging: false,
    prevX: 0,
    prevY: 0,
    rotationX: 0.25,
    rotationY: -0.65,
    distance: 8.5
  });

  const isStall = currentTelemetry && currentTelemetry.stall !== 'LAMINAR_ATTACHED';

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x060a12);
    scene.fog = new THREE.FogExp2(0x060a12, 0.035);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    cameraRef.current = camera;
    updateCameraPosition();

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x00f0ff, 1.8);
    keyLight.position.set(5, 8, 5);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x8b5cf6, 1.2);
    rimLight.position.set(-5, -4, -5);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0x06b6d4, 1.5, 20);
    fillLight.position.set(0, 3, 0);
    scene.add(fillLight);

    // 5. Build Wind Tunnel Chamber Enclosure
    buildTunnelChamber(scene);

    // 6. Build Suspended Airfoil / Wing Model
    buildAirfoilModel(scene, selectedModel);

    // 7. Build Animated Streamlines Particle System
    buildParticleSystem(scene);

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Update particle stream flow
      updateParticles(time, delta);

      // Smooth camera position update
      updateCameraPosition();

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameId.current);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update Airfoil Angle of Attack (Rotation around Z-axis)
  useEffect(() => {
    if (airfoilGroupRef.current) {
      // In Three.js: pitch around Z axis (or X axis depending on orientation)
      // Positive AoA pitches leading edge UP / trailing edge DOWN (-Z rotation)
      const targetRad = -(aoa * Math.PI) / 180;
      airfoilGroupRef.current.rotation.z = targetRad;
    }
  }, [aoa]);

  // Re-build Airfoil Model when selected model changes
  useEffect(() => {
    if (sceneRef.current && selectedModel) {
      buildAirfoilModel(sceneRef.current, selectedModel);
    }
  }, [selectedModel]);

  // Camera Orbit Math
  const updateCameraPosition = () => {
    if (!cameraRef.current) return;
    const { rotationX, rotationY, distance } = mouseState.current;
    const x = distance * Math.sin(rotationY) * Math.cos(rotationX);
    const y = distance * Math.sin(rotationX);
    const z = distance * Math.cos(rotationY) * Math.cos(rotationX);
    cameraRef.current.position.set(x, y, z);
    cameraRef.current.lookAt(0, 0, 0);
  };

  // Mouse Orbit Event Handlers
  const handleMouseDown = (e) => {
    mouseState.current.isDragging = true;
    mouseState.current.prevX = e.clientX;
    mouseState.current.prevY = e.clientY;
    setIsOrbiting(true);
  };

  const handleMouseMove = (e) => {
    if (!mouseState.current.isDragging) return;
    const deltaX = e.clientX - mouseState.current.prevX;
    const deltaY = e.clientY - mouseState.current.prevY;
    mouseState.current.prevX = e.clientX;
    mouseState.current.prevY = e.clientY;

    mouseState.current.rotationY += deltaX * 0.008;
    mouseState.current.rotationX = Math.max(-1.2, Math.min(1.2, mouseState.current.rotationX + deltaY * 0.008));
  };

  const handleMouseUp = () => {
    mouseState.current.isDragging = false;
    setIsOrbiting(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    mouseState.current.distance = Math.max(3.5, Math.min(15.0, mouseState.current.distance + e.deltaY * 0.008));
  };

  const resetCamera = () => {
    mouseState.current.rotationX = 0.25;
    mouseState.current.rotationY = -0.65;
    mouseState.current.distance = 8.5;
  };

  // Helper: Build Wind Tunnel Chamber
  const buildTunnelChamber = (scene) => {
    // Chamber Box Frame
    const boxGeo = new THREE.BoxGeometry(10, 4.5, 4.5);
    const boxEdges = new THREE.EdgesGeometry(boxGeo);
    const frameMat = new THREE.LineBasicMaterial({ color: 0x1e293b, transparent: true, opacity: 0.6 });
    const chamberFrame = new THREE.LineSegments(boxEdges, frameMat);
    scene.add(chamberFrame);

    // Honeycomb Inlet Grid at upstream X = -5
    const gridHelper = new THREE.GridHelper(4.4, 20, 0x06b6d4, 0x1e293b);
    gridHelper.position.set(-5, 0, 0);
    gridHelper.rotation.z = Math.PI / 2;
    scene.add(gridHelper);

    // Transparent Glass Inspection Wall (Floor & Ceiling)
    const glassFloorGeo = new THREE.PlaneGeometry(10, 4.5);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      transparent: true,
      opacity: 0.15,
      roughness: 0.1,
      metalness: 0.1,
      clearcoat: 1.0,
      side: THREE.DoubleSide
    });
    const glassFloor = new THREE.Mesh(glassFloorGeo, glassMat);
    glassFloor.rotation.x = Math.PI / 2;
    glassFloor.position.y = -2.25;
    scene.add(glassFloor);

    // Mounting Strut / Sting Mechanism in center holding model
    const strutGeo = new THREE.CylinderGeometry(0.04, 0.06, 2.2, 16);
    const strutMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.2 });
    const strutBottom = new THREE.Mesh(strutGeo, strutMat);
    strutBottom.position.set(0, -1.15, 0);
    scene.add(strutBottom);
  };

  // Helper: Build 3D Extruded Airfoil Model
  const buildAirfoilModel = (scene, model) => {
    // Remove previous model if exists
    if (airfoilGroupRef.current) {
      scene.remove(airfoilGroupRef.current);
    }

    const group = new THREE.Group();
    airfoilGroupRef.current = group;

    const shape = new THREE.Shape();
    const chordLength = 2.4; // 3D units

    if (model.id === 'delta_wing_65') {
      // 3D Swept Delta Wing
      const deltaGeo = new THREE.BufferGeometry();
      // Vertices of sharp delta wing: Apex at (+1.2, 0, 0), Left Tip at (-1.2, 0, -1.2), Right Tip at (-1.2, 0, 1.2), Central Ridge at (0, 0.12, 0)
      const vertices = new Float32Array([
        // Top Left Face
        1.2, 0.0, 0.0,
        0.0, 0.08, 0.0,
        -1.2, 0.0, -1.1,

        // Top Right Face
        1.2, 0.0, 0.0,
        -1.2, 0.0, 1.1,
        0.0, 0.08, 0.0,

        // Top Aft Left
        0.0, 0.08, 0.0,
        -1.2, 0.0, 0.0,
        -1.2, 0.0, -1.1,

        // Top Aft Right
        0.0, 0.08, 0.0,
        -1.2, 0.0, 1.1,
        -1.2, 0.0, 0.0,

        // Bottom Flat Face Left
        1.2, -0.02, 0.0,
        -1.2, -0.02, -1.1,
        -1.2, -0.02, 0.0,

        // Bottom Flat Face Right
        1.2, -0.02, 0.0,
        -1.2, -0.02, 0.0,
        -1.2, -0.02, 1.1
      ]);

      deltaGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      deltaGeo.computeVertexNormals();

      const deltaMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.85,
        roughness: 0.25,
        wireframe: false,
        side: THREE.DoubleSide
      });

      const deltaMesh = new THREE.Mesh(deltaGeo, deltaMat);
      deltaMesh.castShadow = true;
      deltaMesh.receiveShadow = true;
      group.add(deltaMesh);

      // Glowing wingtip sensors
      const tipGeo = new THREE.SphereGeometry(0.04, 8, 8);
      const tipMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
      const tip1 = new THREE.Mesh(tipGeo, tipMat);
      tip1.position.set(-1.2, 0, -1.1);
      const tip2 = new THREE.Mesh(tipGeo, tipMat);
      tip2.position.set(-1.2, 0, 1.1);
      group.add(tip1, tip2);

    } else {
      // Airfoil Profile (NACA 0012 or Supercritical SC2)
      // Build 2D airfoil curve
      const points = [];
      const numPoints = 40;
      const isCambered = model.id === 'supercritical_sc2';
      const tMax = isCambered ? 0.14 : 0.12;

      // Upper Surface: x from 1.0 to 0.0
      for (let i = numPoints; i >= 0; i--) {
        const x = i / numPoints;
        // NACA thickness equation approx
        const yt = 5 * tMax * (0.2969 * Math.sqrt(Math.max(0, x)) - 0.1260 * x - 0.3516 * x * x + 0.2843 * x * x * x - 0.1015 * x * x * x * x);
        const yc = isCambered ? (x < 0.6 ? 0.04 * (1 - Math.pow((x - 0.6) / 0.6, 2)) : -0.02 * Math.sin((x - 0.6) * 7.8)) : 0;
        const xPos = (0.5 - x) * chordLength;
        const yPos = (yc + yt) * chordLength * 0.8;
        if (i === numPoints) shape.moveTo(xPos, yPos);
        else shape.lineTo(xPos, yPos);
      }

      // Lower Surface: x from 0.0 to 1.0
      for (let i = 0; i <= numPoints; i++) {
        const x = i / numPoints;
        const yt = 5 * tMax * (0.2969 * Math.sqrt(Math.max(0, x)) - 0.1260 * x - 0.3516 * x * x + 0.2843 * x * x * x - 0.1015 * x * x * x * x);
        const yc = isCambered ? (x < 0.6 ? 0.04 * (1 - Math.pow((x - 0.6) / 0.6, 2)) : -0.02 * Math.sin((x - 0.6) * 7.8)) : 0;
        const xPos = (0.5 - x) * chordLength;
        const yPos = (yc - yt) * chordLength * 0.8;
        shape.lineTo(xPos, yPos);
      }

      const extrudeSettings = {
        steps: 1,
        depth: 2.2,
        bevelEnabled: true,
        bevelThickness: 0.04,
        bevelSize: 0.04,
        bevelSegments: 4
      };

      const airfoilGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      airfoilGeo.center();

      const foilMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.85,
        roughness: 0.25,
        clearcoat: 0.6,
        clearcoatRoughness: 0.1
      });

      const foilMesh = new THREE.Mesh(airfoilGeo, foilMat);
      foilMesh.castShadow = true;
      foilMesh.receiveShadow = true;
      group.add(foilMesh);

      // Pitch angle calibration ring
      const ringGeo = new THREE.RingGeometry(0.15, 0.18, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, side: THREE.DoubleSide });
      const pivotRing = new THREE.Mesh(ringGeo, ringMat);
      pivotRing.position.set(0, 0, 1.15);
      group.add(pivotRing);
    }

    // Set initial pitch rotation
    group.rotation.z = -(aoa * Math.PI) / 180;
    scene.add(group);
  };

  // Helper: Build Animated Particle Flow Streamlines
  const buildParticleSystem = (scene) => {
    const particleCount = 2800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount);
    const baseOffsets = new Float32Array(particleCount * 2); // [y0, z0]

    const colorCyan = new THREE.Color(0x06b6d4);
    const colorBlue = new THREE.Color(0x3b82f6);

    for (let i = 0; i < particleCount; i++) {
      // Distribute from upstream X = -5 to downstream X = +5
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 3.8;
      const z = (Math.random() - 0.5) * 3.6;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      baseOffsets[i * 2] = y;
      baseOffsets[i * 2 + 1] = z;

      velocities[i] = 2.5 + Math.random() * 1.5;

      colors[i * 3] = colorCyan.r;
      colors[i * 3 + 1] = colorCyan.g;
      colors[i * 3 + 2] = colorCyan.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('baseOffset', new THREE.BufferAttribute(baseOffsets, 2));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 1));

    // Particle Texture / Shader material
    const particleMat = new THREE.PointsMaterial({
      size: 0.075,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, particleMat);
    particlesRef.current = particles;
    scene.add(particles);
  };

  // Update Particles Every Frame (Simulating Aerodynamic Flow Deflection & Stall Vortex)
  const updateParticles = (time, delta) => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array;
    const colors = particlesRef.current.geometry.attributes.color.array;
    const baseOffsets = particlesRef.current.geometry.attributes.baseOffset.array;
    const velocities = particlesRef.current.geometry.attributes.velocity.array;
    const count = positions.length / 3;

    const aoaRad = (aoa * Math.PI) / 180;
    const isModelStalled = aoa >= (selectedModel?.stallAngle || 15);
    const speedFactor = (mach * 18.0 + 3.0) * flowSpeedMultiplier;

    const colorBlue = new THREE.Color(0x2563eb);
    const colorCyan = new THREE.Color(0x06b6d4);
    const colorAmber = new THREE.Color(0xf59e0b);
    const colorRed = new THREE.Color(0xef4444);

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      let x = positions[idx];
      let y0 = baseOffsets[i * 2];
      let z0 = baseOffsets[i * 2 + 1];
      const v = velocities[i] * speedFactor;

      // Move particle forward in X direction (Left to Right)
      x += v * delta;
      if (x > 5.0) {
        x = -5.0;
      }
      positions[idx] = x;

      // Aerodynamic Streamline Deflection Field around airfoil located at X in [-1.2, +1.2]
      const distToAirfoil = Math.sqrt(x * x + y0 * y0);
      const isOverWing = x > -1.2 && x < 1.4 && Math.abs(z0) < 1.2;

      let y = y0;
      let targetColor = colorCyan;

      if (distToAirfoil < 2.2 && Math.abs(z0) < 1.3) {
        // Upper surface vs Lower surface
        if (y0 >= 0) {
          // Upper surface: Suction curvature deflection
          const deflection = Math.sin(Math.max(0, (x + 1.2) / 2.4) * Math.PI) * 0.45 * Math.sin(aoaRad * 1.5 + 0.1);
          y = y0 + deflection;

          if (isModelStalled && x > 0.0) {
            // Flow Separation & Turbulent Stall Wake Vortices!
            const vortexFreq = time * 12.0 + i;
            const vortexTurbulence = Math.sin(vortexFreq) * (0.2 + (aoa - selectedModel.stallAngle) * 0.06);
            y += vortexTurbulence;
            // Shift color to crimson red for stall separation
            targetColor = colorRed;
          } else {
            // Accelerated high suction velocity -> Amber / Bright Cyan
            targetColor = colorAmber;
          }
        } else {
          // Lower surface: High pressure stagnation deflection downward
          const compression = -Math.sin(Math.max(0, (x + 1.2) / 2.4) * Math.PI) * 0.35 * Math.sin(aoaRad + 0.05);
          y = y0 + compression;
          targetColor = colorBlue;
        }
      }

      positions[idx + 1] = y;

      // Lerp colors
      colors[idx] = targetColor.r;
      colors[idx + 1] = targetColor.g;
      colors[idx + 2] = targetColor.b;
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    particlesRef.current.geometry.attributes.color.needsUpdate = true;
  };

  return (
    <div className={`relative aero-card overflow-hidden flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-aero-950' : 'h-[620px]'}`}>
      {/* Reticles */}
      <div className="reticle-corner-tl" />
      <div className="reticle-corner-tr" />
      <div className="reticle-corner-bl" />
      <div className="reticle-corner-br" />

      {/* Top HUD Overlay Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center space-x-2 pointer-events-auto">
          <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-cyan-500/40 shadow-cyan-glow flex items-center space-x-2 text-xs font-mono">
            <Wind className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-white font-bold tracking-wider">3D WIND TUNNEL CHAMBER</span>
            <span className="text-slate-500">|</span>
            <span className="text-cyan-300 font-bold">{selectedModel?.name}</span>
          </div>

          {isStall && (
            <div className="badge-red px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center space-x-1.5 shadow-red-glow">
              <AlertTriangle className="w-4 h-4 animate-bounce" />
              <span>AERODYNAMIC STALL // FLOW SEPARATION ACTIVE</span>
            </div>
          )}
        </div>

        {/* Viewport Control Badges */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          <button
            onClick={resetCamera}
            title="Reset Camera Angle"
            className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-700 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Viewport"}
            className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-700 transition-all"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Mount */}
      <div
        ref={mountRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        className="w-full flex-1 cursor-grab active:cursor-grabbing select-none"
      />

      {/* Floating Telemetry HUD Overlay (Bottom-Left) */}
      <div className="absolute bottom-20 left-4 z-10 pointer-events-none hidden sm:block">
        <div className="bg-slate-950/85 backdrop-blur-md p-3 rounded-lg border border-slate-800 text-xs font-mono space-y-1.5 shadow-2xl">
          <div className="text-[10px] text-cyan-400 uppercase tracking-widest border-b border-slate-800 pb-1">
            Real-Time Aerodynamic Coefficients
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-slate-300">
            <div>CL: <strong className="text-cyan-300">{currentTelemetry?.cl?.toFixed(3) || '0.435'}</strong></div>
            <div>CD: <strong className="text-amber-300">{currentTelemetry?.cd?.toFixed(4) || '0.0093'}</strong></div>
            <div>CM: <strong className="text-violet-300">{currentTelemetry?.cm?.toFixed(3) || '-0.002'}</strong></div>
            <div>L/D: <strong className="text-emerald-300">{currentTelemetry?.ld?.toFixed(1) || '46.8'}</strong></div>
            <div>q∞: <strong className="text-slate-100">{currentTelemetry?.qInf?.toFixed(2) || '1.62'} kPa</strong></div>
            <div>Velocity: <strong className="text-slate-100">{currentTelemetry?.velocity?.toFixed(1) || '51.0'} m/s</strong></div>
          </div>
        </div>
      </div>

      {/* Floating Interactive Control Dock (Bottom Center / Full Width) */}
      <div className="bg-slate-950/95 border-t border-slate-800/90 px-4 py-3 z-10 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Pitch Angle AoA Slider (-5° to +25°) */}
          <div className="flex items-center space-x-3 w-full md:w-auto flex-1 max-w-md">
            <div className="flex items-center space-x-1.5 text-xs font-mono text-slate-300 whitespace-nowrap min-w-[120px]">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Pitch Angle (α):</span>
            </div>
            <input
              type="range"
              min="-5"
              max="25"
              step="0.5"
              value={aoa}
              onChange={(e) => setAoa(parseFloat(e.target.value))}
              className="flex-1 aero-slider"
            />
            <span className={`text-sm font-mono font-bold min-w-[50px] text-right ${isStall ? 'text-rose-400 animate-pulse' : 'text-cyan-300'}`}>
              {aoa.toFixed(1)}°
            </span>
          </div>

          {/* Mach / Airspeed Slider */}
          <div className="flex items-center space-x-3 w-full md:w-auto flex-1 max-w-xs">
            <div className="flex items-center space-x-1.5 text-xs font-mono text-slate-300 whitespace-nowrap min-w-[100px]">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Speed (Mach):</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="2.2"
              step="0.05"
              value={mach}
              onChange={(e) => setMach && setMach(parseFloat(e.target.value))}
              className="flex-1 aero-slider"
            />
            <span className="text-sm font-mono font-bold text-amber-300 min-w-[45px] text-right">
              M {mach.toFixed(2)}
            </span>
          </div>

          {/* Quick Flow Speed Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setAoa(0)}
              className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[11px] font-mono text-slate-300 border border-slate-700 hover:border-cyan-500/40 transition-all"
            >
              0° Level
            </button>
            <button
              onClick={() => setAoa(8)}
              className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-[11px] font-mono text-cyan-300 border border-slate-700 hover:border-cyan-500/40 transition-all"
            >
              8° High Lift
            </button>
            <button
              onClick={() => setAoa(selectedModel?.stallAngle || 15.5)}
              className="px-2.5 py-1 rounded bg-rose-950/60 hover:bg-rose-900/60 text-[11px] font-mono text-rose-300 border border-rose-500/40 transition-all"
            >
              Stall Critical ({selectedModel?.stallAngle || 15.5}°)
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
