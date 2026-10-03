import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import {
  Sun,
  Play,
  MapPin,
  Zap,
  Droplets,
  ShieldCheck,
  Box,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn } from '../motion/MotionSystem';
import { useTheme } from '../../context/ThemeContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { ReliableImage } from '../common/ReliableImage';

interface SolarPumpSceneProps {
  onEnterDemo: () => void;
  onWatchDemo?: () => void;
}

export type WeatherState = 'clear' | 'cloudy' | 'rain' | 'heavy_rain';
export type CameraPreset = 'hero' | 'overview' | 'pump' | 'irrigation';
export type DisplayMode = 'cinematic' | 'threejs';

const WEATHER_CONFIGS: Record<WeatherState, {
  label: string;
  sunIntensity: number;
  ambientIntensity: number;
  fogDensityDark: number;
  fogDensityLight: number;
  skyColorDark: number;
  skyColorLight: number;
  irradiance: number;
  temperature: number;
  rainfall: number;
  pumpSpeed: number;
  waterFlow: number;
  generationKw: number;
}> = {
  clear: {
    label: 'Clear Sunlight',
    sunIntensity: 2.8,
    ambientIntensity: 0.7,
    fogDensityDark: 0.015,
    fogDensityLight: 0.012,
    skyColorDark: 0x070c16,
    skyColorLight: 0xddeef8,
    irradiance: 5.85,
    temperature: 29.4,
    rainfall: 0,
    pumpSpeed: 1.0,
    waterFlow: 1.0,
    generationKw: 3.2,
  },
  cloudy: {
    label: 'Partly Cloudy',
    sunIntensity: 1.4,
    ambientIntensity: 0.55,
    fogDensityDark: 0.025,
    fogDensityLight: 0.02,
    skyColorDark: 0x09101d,
    skyColorLight: 0xc8dce8,
    irradiance: 3.92,
    temperature: 26.8,
    rainfall: 0,
    pumpSpeed: 0.72,
    waterFlow: 0.75,
    generationKw: 2.3,
  },
  rain: {
    label: 'Moderate Rain',
    sunIntensity: 0.7,
    ambientIntensity: 0.4,
    fogDensityDark: 0.04,
    fogDensityLight: 0.035,
    skyColorDark: 0x080e18,
    skyColorLight: 0xb5cad6,
    irradiance: 2.15,
    temperature: 23.5,
    rainfall: 14.2,
    pumpSpeed: 0.4,
    waterFlow: 0.45,
    generationKw: 1.2,
  },
  heavy_rain: {
    label: 'Heavy Monsoon Rain',
    sunIntensity: 0.35,
    ambientIntensity: 0.3,
    fogDensityDark: 0.06,
    fogDensityLight: 0.05,
    skyColorDark: 0x050912,
    skyColorLight: 0x9fb4c2,
    irradiance: 1.1,
    temperature: 21.8,
    rainfall: 46.5,
    pumpSpeed: 0.15,
    waterFlow: 0.2,
    generationKw: 0.4,
  },
};

export const SolarPumpScene: React.FC<SolarPumpSceneProps> = ({ onEnterDemo, onWatchDemo }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const { metrics } = usePortfolio();
  const isLight = theme === 'light';

  const [displayMode] = useState<DisplayMode>('cinematic');
  const [isTransitioningToTwin] = useState<boolean>(false);
  const [weatherState, setWeatherState] = useState<WeatherState>('clear');
  const [cameraPreset] = useState<CameraPreset>('hero');

  const heroImageSrc = useMemo(() => {
    if (weatherState === 'rain' || weatherState === 'heavy_rain') {
      return '/assets/hero_rainy.jpg';
    }
    if (weatherState === 'cloudy') {
      return '/assets/hero_cloudy.jpg';
    }
    return isLight ? '/assets/hero_light.jpg' : '/assets/hero_dark.jpg';
  }, [weatherState, isLight]);

  const weatherConfig = useMemo(() => WEATHER_CONFIGS[weatherState], [weatherState]);
  const weatherRef = useRef<WeatherState>(weatherState);
  const themeRef = useRef<string>(theme);
  const targetCameraPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 4.8, 13.5));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.2, 0));

  useEffect(() => {
    weatherRef.current = weatherState;
  }, [weatherState]);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  // Set camera target positions based on preset
  useEffect(() => {
    if (cameraPreset === 'hero') {
      targetCameraPos.current.set(0, 4.5, 13);
      targetLookAt.current.set(0, 1.2, 0);
    } else if (cameraPreset === 'pump') {
      targetCameraPos.current.set(2.2, 2.0, 4.5);
      targetLookAt.current.set(0.6, 1.2, 0);
    } else if (cameraPreset === 'irrigation') {
      targetCameraPos.current.set(-4.5, 3.0, 6.0);
      targetLookAt.current.set(0, 0.5, 3.0);
    } else if (cameraPreset === 'overview') {
      targetCameraPos.current.set(10.0, 10.0, 16.0);
      targetLookAt.current.set(0, 0, 0);
    }
  }, [cameraPreset]);

  useEffect(() => {
    if (!containerRef.current) return;

    let renderer: THREE.WebGLRenderer;
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // ─── SCENE SETUP ───
    scene = new THREE.Scene();
    const initialSky = isLight ? 0xddeef8 : 0x070c16;
    scene.background = new THREE.Color(initialSky);
    scene.fog = new THREE.FogExp2(initialSky, isLight ? 0.012 : 0.016);

    camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.copy(targetCameraPos.current);

    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isLight ? 1.05 : 1.25;

    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // ─── LIGHTING SETUP ───
    const ambientLight = new THREE.AmbientLight(
      isLight ? 0xf0ede4 : 0x7c94b2,
      isLight ? 0.9 : 0.65
    );
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(
      isLight ? 0xfff7e6 : 0xfde047,
      isLight ? 2.8 : 2.4
    );
    sunLight.position.set(14, 20, 11);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 60;
    sunLight.shadow.camera.left = -16;
    sunLight.shadow.camera.right = 16;
    sunLight.shadow.camera.top = 16;
    sunLight.shadow.camera.bottom = -16;
    sunLight.shadow.bias = -0.0002;
    scene.add(sunLight);

    const skyFillLight = new THREE.DirectionalLight(
      isLight ? 0x93c5fd : 0x0ea5e9,
      isLight ? 0.4 : 0.35
    );
    skyFillLight.position.set(-12, 10, -6);
    scene.add(skyFillLight);

    // Soft warm ground bounce
    const groundBounce = new THREE.PointLight(
      isLight ? 0xedd6b4 : 0x10b981,
      isLight ? 0.5 : 0.6,
      25
    );
    groundBounce.position.set(2, 2.5, 4);
    scene.add(groundBounce);

    // ─── LAYERED AGRICULTURAL TERRAIN ───
    const terrainGeo = new THREE.PlaneGeometry(64, 64, 80, 80);
    const posAttr = terrainGeo.attributes.position;
    const vertex = new THREE.Vector3();
    const colors: number[] = [];

    // Soil & vegetation palette
    const darkGrass = new THREE.Color(0x1a2e1b);
    const lightGrass = new THREE.Color(0x3e6833);
    const darkLoam = new THREE.Color(0x1f1913);
    const lightLoam = new THREE.Color(0x524332);
    const darkCanal = new THREE.Color(0x0e171b);
    const lightCanal = new THREE.Color(0x384a44);

    for (let i = 0; i < posAttr.count; i++) {
      vertex.fromBufferAttribute(posAttr, i);

      // Rolling undulating landscape with agricultural terraces
      const distFromPump = Math.sqrt(vertex.x * vertex.x + vertex.y * vertex.y);
      const isNearPump = distFromPump < 4.5;

      // Canal depression at x in range [-0.6, 2.2] and y > -1
      const inCanal = vertex.x > -0.2 && vertex.x < 1.8 && vertex.y > 0 && vertex.y < 16;

      let elevation =
        Math.sin(vertex.x * 0.12) * Math.cos(vertex.y * 0.12) * 0.45 +
        Math.sin(vertex.x * 0.35 + vertex.y * 0.25) * 0.15;

      if (isNearPump) {
        elevation *= 0.2; // Flat foundation pad for solar pump
      } else if (inCanal) {
        elevation = -0.32; // Carved water trench
      }

      posAttr.setZ(i, elevation);

      // Vertex color blending based on zone and theme
      const col = new THREE.Color();
      if (inCanal) {
        col.copy(isLight ? lightCanal : darkCanal);
      } else if (vertex.y > 1 && vertex.y < 15 && vertex.x < -1) {
        // Crop field section
        col.copy(isLight ? lightLoam : darkLoam);
      } else {
        // Pasture / field
        col.copy(isLight ? lightGrass : darkGrass);
      }
      colors.push(col.r, col.g, col.b);
    }

    terrainGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: isLight ? 0.88 : 0.94,
      metalness: 0.05,
      flatShading: false,
    });

    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.rotation.x = -Math.PI / 2;
    terrainMesh.position.y = -0.05;
    terrainMesh.receiveShadow = true;
    scene.add(terrainMesh);

    // ─── AGRICULTURAL CROP ROWS ───
    const cropsGroup = new THREE.Group();
    const cropMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0x2e6f28 : 0x224a1b,
      roughness: 0.75,
      metalness: 0.05,
    });

    // 8 distinct rows aligned leading towards the water channel
    for (let row = 0; row < 9; row++) {
      const rowZ = 2.5 + row * 1.1;
      for (let col = 0; col < 14; col++) {
        const colX = -10.5 + col * 0.72;
        const cropHeight = 0.32 + Math.sin(col * 0.4 + row * 0.6) * 0.12;

        // Leafy crop stalk
        const stalkGeo = new THREE.CylinderGeometry(0.04, 0.08, cropHeight, 6);
        const stalk = new THREE.Mesh(stalkGeo, cropMat);
        stalk.position.set(colX, cropHeight / 2, rowZ);
        stalk.castShadow = true;
        cropsGroup.add(stalk);

        // Crop leaf head
        const headGeo = new THREE.DodecahedronGeometry(0.16 + Math.random() * 0.06, 0);
        const head = new THREE.Mesh(headGeo, cropMat);
        head.position.set(colX, cropHeight, rowZ);
        head.scale.set(1.1, 0.8, 1.1);
        head.castShadow = true;
        cropsGroup.add(head);
      }
    }
    scene.add(cropsGroup);

    // ─── FIVE PROCEDURAL TREE FAMILIES ───
    const foliageMatPrimary = new THREE.MeshStandardMaterial({
      color: isLight ? 0x245620 : 0x163814,
      roughness: 0.8,
    });
    const foliageMatAccent = new THREE.MeshStandardMaterial({
      color: isLight ? 0x367c2e : 0x234d1e,
      roughness: 0.75,
    });
    const foliageMatSage = new THREE.MeshStandardMaterial({
      color: isLight ? 0x4a7a44 : 0x2a4427,
      roughness: 0.85,
    });
    const trunkMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0x4e3825 : 0x332314,
      roughness: 0.9,
    });

    const treesGroup = new THREE.Group();

    // TYPE A: Broad Agricultural Tree (Multi-tiered canopy)
    const createBroadTree = (x: number, z: number, scale = 1) => {
      const group = new THREE.Group();
      const trunkH = 2.4 * scale;
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18 * scale, 0.28 * scale, trunkH, 8),
        trunkMat
      );
      trunk.position.y = trunkH / 2;
      trunk.castShadow = true;
      group.add(trunk);

      // Spreading layered canopy
      const layers = [
        { y: trunkH * 0.85, r: 1.4 * scale, mat: foliageMatPrimary, ox: 0, oz: 0 },
        { y: trunkH * 1.1, r: 1.1 * scale, mat: foliageMatAccent, ox: 0.3 * scale, oz: -0.2 * scale },
        { y: trunkH * 1.05, r: 1.2 * scale, mat: foliageMatSage, ox: -0.35 * scale, oz: 0.25 * scale },
        { y: trunkH * 1.35, r: 0.85 * scale, mat: foliageMatAccent, ox: 0.05 * scale, oz: 0.05 * scale },
      ];
      layers.forEach(({ y, r, mat, ox, oz }) => {
        const sphere = new THREE.Mesh(new THREE.DodecahedronGeometry(r, 1), mat);
        sphere.position.set(ox, y, oz);
        sphere.scale.set(1.2, 0.85, 1.15);
        sphere.castShadow = true;
        group.add(sphere);
      });
      group.position.set(x, 0, z);
      return group;
    };

    // TYPE B: Tall Slender Tree (Poplar / Cypress style)
    const createTallTree = (x: number, z: number, scale = 1) => {
      const group = new THREE.Group();
      const trunkH = 3.6 * scale;
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1 * scale, 0.18 * scale, trunkH, 6),
        trunkMat
      );
      trunk.position.y = trunkH / 2;
      trunk.castShadow = true;
      group.add(trunk);

      // Tiered tapering foliage
      const cones = [
        { y: trunkH * 0.6, r: 0.7 * scale, h: 2.0 * scale },
        { y: trunkH * 0.95, r: 0.55 * scale, h: 2.2 * scale },
        { y: trunkH * 1.25, r: 0.35 * scale, h: 1.8 * scale },
      ];
      cones.forEach(({ y, r, h }, idx) => {
        const cone = new THREE.Mesh(
          new THREE.ConeGeometry(r, h, 7),
          idx % 2 === 0 ? foliageMatPrimary : foliageMatAccent
        );
        cone.position.y = y;
        cone.castShadow = true;
        group.add(cone);
      });
      group.position.set(x, 0, z);
      return group;
    };

    // TYPE C: Dense Leafy Tree (Cloud-like clustered volume)
    const createDenseLeafyTree = (x: number, z: number, scale = 1) => {
      const group = new THREE.Group();
      const trunkH = 1.8 * scale;
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15 * scale, 0.22 * scale, trunkH, 7),
        trunkMat
      );
      trunk.position.y = trunkH / 2;
      trunk.castShadow = true;
      group.add(trunk);

      // Cloud clusters
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const rad = 0.55 * scale;
        const clump = new THREE.Mesh(
          new THREE.DodecahedronGeometry(0.85 * scale, 1),
          i % 2 === 0 ? foliageMatSage : foliageMatPrimary
        );
        clump.position.set(
          Math.cos(angle) * rad,
          trunkH + 0.6 * scale + (i % 2) * 0.35 * scale,
          Math.sin(angle) * rad
        );
        clump.castShadow = true;
        group.add(clump);
      }
      group.position.set(x, 0, z);
      return group;
    };

    // TYPE D: Small Orchard Tree
    const createOrchardTree = (x: number, z: number, scale = 1) => {
      const group = new THREE.Group();
      const trunkH = 1.3 * scale;
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12 * scale, 0.16 * scale, trunkH, 6),
        trunkMat
      );
      trunk.position.y = trunkH / 2;
      trunk.castShadow = true;
      group.add(trunk);

      const crown = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.95 * scale, 1),
        foliageMatAccent
      );
      crown.position.y = trunkH + 0.5 * scale;
      crown.scale.set(1.3, 0.8, 1.2);
      crown.castShadow = true;
      group.add(crown);
      group.position.set(x, 0, z);
      return group;
    };

    // TYPE E: Young Sapling
    const createSapling = (x: number, z: number, scale = 1) => {
      const group = new THREE.Group();
      const trunkH = 1.1 * scale;
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04 * scale, 0.06 * scale, trunkH, 5),
        trunkMat
      );
      trunk.position.y = trunkH / 2;
      group.add(trunk);

      const foliage = new THREE.Mesh(
        new THREE.SphereGeometry(0.4 * scale, 6, 6),
        foliageMatAccent
      );
      foliage.position.y = trunkH + 0.2 * scale;
      foliage.castShadow = true;
      group.add(foliage);
      group.position.set(x, 0, z);
      return group;
    };

    // Add diverse tree placements across foreground, midground and background
    treesGroup.add(createBroadTree(-11, -8, 1.25));
    treesGroup.add(createBroadTree(10, -7, 1.15));
    treesGroup.add(createBroadTree(-13, 3, 1.1));
    treesGroup.add(createTallTree(-8, -12, 1.2));
    treesGroup.add(createTallTree(-6, -14, 1.35));
    treesGroup.add(createTallTree(8, -11, 1.3));
    treesGroup.add(createTallTree(12, -9, 1.1));
    treesGroup.add(createDenseLeafyTree(11, 2, 1.1));
    treesGroup.add(createDenseLeafyTree(-10, 10, 0.95));
    treesGroup.add(createDenseLeafyTree(9, 8, 1.05));
    treesGroup.add(createOrchardTree(6, -3, 0.9));
    treesGroup.add(createOrchardTree(5, -6, 0.85));
    treesGroup.add(createOrchardTree(7, -5, 0.95));
    treesGroup.add(createSapling(-3.5, 1.5, 0.8));
    treesGroup.add(createSapling(3.2, 1.8, 0.9));

    scene.add(treesGroup);

    // ─── HERO OBJECT: SOLAR IRRIGATION PUMP RIG ───
    const heroGroup = new THREE.Group();

    // 1. Dual Aluminum Mounting Posts & Foundation
    const mountMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0x64748b : 0x718096,
      metalness: 0.8,
      roughness: 0.25,
    });

    const postLeft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.08, 2.3, 12),
      mountMat
    );
    postLeft.position.set(-1.1, 1.15, 0);
    postLeft.castShadow = true;
    heroGroup.add(postLeft);

    const postRight = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.08, 2.3, 12),
      mountMat
    );
    postRight.position.set(1.1, 1.15, 0);
    postRight.castShadow = true;
    heroGroup.add(postRight);

    // Concrete footings
    const footingMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0x94a3b8 : 0x475569,
      roughness: 0.9,
    });
    const footingL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.25, 0.4), footingMat);
    footingL.position.set(-1.1, 0.1, 0);
    footingL.castShadow = true;
    heroGroup.add(footingL);

    const footingR = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.25, 0.4), footingMat);
    footingR.position.set(1.1, 0.1, 0);
    footingR.castShadow = true;
    heroGroup.add(footingR);

    // Cross brace frame
    const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.08, 0.08), mountMat);
    crossBeam.position.set(0, 2.25, 0);
    crossBeam.rotation.x = Math.PI / 7;
    crossBeam.castShadow = true;
    heroGroup.add(crossBeam);

    // 2. Solar PV Panel Array
    const panelFrameMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0x334155 : 0x1e293b,
      metalness: 0.9,
      roughness: 0.15,
    });

    const panelFrame = new THREE.Mesh(
      new THREE.BoxGeometry(3.5, 0.06, 2.1),
      panelFrameMat
    );
    panelFrame.position.set(0, 2.4, 0);
    panelFrame.rotation.x = Math.PI / 7;
    panelFrame.castShadow = true;
    heroGroup.add(panelFrame);

    // Solar Cell Face (Deep blue high-reflectivity monocrystalline surface)
    const solarCellMat = new THREE.MeshPhysicalMaterial({
      color: isLight ? 0x0369a1 : 0x0c4a6e,
      metalness: 0.95,
      roughness: 0.08,
      reflectivity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });

    // Create 4 distinct solar panels inside the frame
    for (let px = -1; px <= 1; px += 2) {
      for (let pz = -1; pz <= 1; pz += 2) {
        const cell = new THREE.Mesh(
          new THREE.PlaneGeometry(1.6, 0.95),
          solarCellMat
        );
        cell.position.set(px * 0.84, 2.45, pz * 0.5 + 0.1);
        cell.rotation.x = Math.PI / 7;
        heroGroup.add(cell);
      }
    }

    // 3. MPPT Solar Controller / Inverter Box
    const controllerMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0x22c55e : 0x10b981,
      metalness: 0.4,
      roughness: 0.3,
    });
    const controllerBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 0.72, 0.28),
      controllerMat
    );
    controllerBox.position.set(1.15, 1.25, 0.15);
    controllerBox.castShadow = true;
    heroGroup.add(controllerBox);

    // Status LED indicator
    const ledMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
    const ledMesh = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), ledMat);
    ledMesh.position.set(1.15, 1.5, 0.31);
    heroGroup.add(ledMesh);

    // 4. Submersible Pump Wellhead & Discharge Assembly
    const pumpHousingMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0x475569 : 0x334155,
      metalness: 0.85,
      roughness: 0.2,
    });

    // Wellhead concrete ring
    const wellhead = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.6, 0.4, 16),
      footingMat
    );
    wellhead.position.set(0.8, 0.2, 1.6);
    wellhead.castShadow = true;
    heroGroup.add(wellhead);

    // Centrifugal pump unit on top of wellhead
    const pumpMotor = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.22, 0.5, 16),
      pumpHousingMat
    );
    pumpMotor.position.set(0.8, 0.65, 1.6);
    pumpMotor.castShadow = true;
    heroGroup.add(pumpMotor);

    // Discharge pipe leading into irrigation channel
    const pipeMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0x0284c7 : 0x0369a1,
      metalness: 0.6,
      roughness: 0.3,
    });
    const dischargePipe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 1.8, 12),
      pipeMat
    );
    dischargePipe.position.set(0.8, 0.65, 2.5);
    dischargePipe.rotation.x = Math.PI / 2;
    dischargePipe.castShadow = true;
    heroGroup.add(dischargePipe);

    // 90 degree elbow pipe down to water channel
    const elbowPipe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.55, 12),
      pipeMat
    );
    elbowPipe.position.set(0.8, 0.35, 3.4);
    heroGroup.add(elbowPipe);

    scene.add(heroGroup);

    // ─── WATER CANAL & FLOWING WATER SYSTEM ───
    const canalWaterGeo = new THREE.PlaneGeometry(1.6, 16, 24, 64);
    const canalWaterMat = new THREE.MeshPhysicalMaterial({
      color: isLight ? 0x38bdf8 : 0x0284c7,
      transmission: 0.6,
      opacity: 0.85,
      transparent: true,
      roughness: 0.1,
      metalness: 0.2,
      reflectivity: 0.8,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const canalWaterMesh = new THREE.Mesh(canalWaterGeo, canalWaterMat);
    canalWaterMesh.rotation.x = -Math.PI / 2;
    canalWaterMesh.position.set(0.8, -0.08, 8.0);
    scene.add(canalWaterMesh);

    // Water discharge splash particles
    const splashCount = 45;
    const splashGeo = new THREE.BufferGeometry();
    const splashPositions = new Float32Array(splashCount * 3);
    const splashVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < splashCount; i++) {
      splashPositions[i * 3] = 0.8 + (Math.random() - 0.5) * 0.2;
      splashPositions[i * 3 + 1] = 0.05 + Math.random() * 0.3;
      splashPositions[i * 3 + 2] = 3.4 + (Math.random() - 0.5) * 0.2;
      splashVelocities.push({
        x: (Math.random() - 0.5) * 0.04,
        y: 0.03 + Math.random() * 0.04,
        z: 0.04 + Math.random() * 0.05,
      });
    }
    splashGeo.setAttribute('position', new THREE.BufferAttribute(splashPositions, 3));
    const splashMat = new THREE.PointsMaterial({
      color: isLight ? 0xbae6fd : 0x38bdf8,
      size: 0.09,
      transparent: true,
      opacity: 0.8,
    });
    const splashParticles = new THREE.Points(splashGeo, splashMat);
    scene.add(splashParticles);

    // ─── SOLAR ENERGY FLOW PARTICLES (Sun -> Panels -> Controller -> Pump) ───
    const energyParticleCount = 60;
    const energyGeo = new THREE.BufferGeometry();
    const energyPositions = new Float32Array(energyParticleCount * 3);

    // Array of waypoints along the energy path:
    // [0] Sun (14, 18, 10)
    // [1] Panels (0, 2.4, 0)
    // [2] Controller (1.15, 1.25, 0.15)
    // [3] Pump (0.8, 0.65, 1.6)
    // [4] Water Outlet (0.8, 0.1, 3.4)
    const energyWaypoints = [
      new THREE.Vector3(12, 16, 9),
      new THREE.Vector3(0, 2.45, 0.2),
      new THREE.Vector3(1.15, 1.25, 0.15),
      new THREE.Vector3(0.8, 0.65, 1.6),
      new THREE.Vector3(0.8, 0.05, 3.5),
    ];

    const energyProgress: number[] = [];
    for (let i = 0; i < energyParticleCount; i++) {
      energyProgress.push(i / energyParticleCount);
      energyPositions[i * 3] = 0;
      energyPositions[i * 3 + 1] = 0;
      energyPositions[i * 3 + 2] = 0;
    }

    energyGeo.setAttribute('position', new THREE.BufferAttribute(energyPositions, 3));
    const energyMat = new THREE.PointsMaterial({
      color: isLight ? 0xf59e0b : 0x34d399,
      size: 0.14,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const energyParticles = new THREE.Points(energyGeo, energyMat);
    scene.add(energyParticles);

    // ─── 3D PROCEDURAL CLOUDS ───
    const cloudsGroup = new THREE.Group();
    const cloudMat = new THREE.MeshStandardMaterial({
      color: isLight ? 0xffffff : 0x64748b,
      roughness: 0.95,
      transparent: true,
      opacity: isLight ? 0.8 : 0.45,
    });

    for (let c = 0; c < 8; c++) {
      const cloudCluster = new THREE.Group();
      const cx = -18 + c * 5.5 + (Math.random() - 0.5) * 3;
      const cy = 14 + Math.random() * 3;
      const cz = -10 + (Math.random() - 0.5) * 8;

      for (let s = 0; s < 5; s++) {
        const puff = new THREE.Mesh(
          new THREE.DodecahedronGeometry(1.2 + Math.random() * 0.8, 1),
          cloudMat
        );
        puff.position.set(
          (Math.random() - 0.5) * 2.2,
          (Math.random() - 0.5) * 0.6,
          (Math.random() - 0.5) * 1.5
        );
        puff.scale.set(1.4, 0.7, 1.2);
        cloudCluster.add(puff);
      }
      cloudCluster.position.set(cx, cy, cz);
      cloudsGroup.add(cloudCluster);
    }
    scene.add(cloudsGroup);

    // ─── DEPTH-AWARE RAIN PARTICLE SYSTEM ───
    const rainCount = 1200;
    const rainGeo = new THREE.BufferGeometry();
    const rainPositions = new Float32Array(rainCount * 3);

    for (let i = 0; i < rainCount; i++) {
      rainPositions[i * 3] = (Math.random() - 0.5) * 32;
      rainPositions[i * 3 + 1] = Math.random() * 18;
      rainPositions[i * 3 + 2] = (Math.random() - 0.5) * 32;
    }

    rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
    const rainMat = new THREE.PointsMaterial({
      color: isLight ? 0x93c5fd : 0x67e8f9,
      size: 0.08,
      transparent: true,
      opacity: 0.0, // Driven dynamically by weather
    });
    const rainParticles = new THREE.Points(rainGeo, rainMat);
    scene.add(rainParticles);

    // ─── RESIZE HANDLER ───
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ─── ANIMATION RENDER LOOP ───
    const currentLookAt = new THREE.Vector3(0, 1.2, 0);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      const activeWeather = WEATHER_CONFIGS[weatherRef.current];
      const activeIsLight = themeRef.current === 'light';

      // Smooth camera interpolation towards target preset
      camera.position.lerp(targetCameraPos.current, 0.04);
      currentLookAt.lerp(targetLookAt.current, 0.04);
      camera.lookAt(currentLookAt);

      // Light & Sky dynamic adjustments
      const targetSkyColor = activeIsLight
        ? activeWeather.skyColorLight
        : activeWeather.skyColorDark;
      const targetFogDensity = activeIsLight
        ? activeWeather.fogDensityLight
        : activeWeather.fogDensityDark;

      scene.background = new THREE.Color(targetSkyColor);
      scene.fog = new THREE.FogExp2(targetSkyColor, targetFogDensity);

      sunLight.intensity = THREE.MathUtils.lerp(
        sunLight.intensity,
        activeWeather.sunIntensity * (activeIsLight ? 1.0 : 0.85),
        0.05
      );
      ambientLight.intensity = THREE.MathUtils.lerp(
        ambientLight.intensity,
        activeWeather.ambientIntensity * (activeIsLight ? 1.0 : 0.8),
        0.05
      );

      // Drift clouds across the sky
      cloudsGroup.children.forEach((cloudCluster, idx) => {
        cloudCluster.position.x += 0.35 * delta;
        if (cloudCluster.position.x > 20) {
          cloudCluster.position.x = -22 - idx * 2;
        }
      });

      // Crop row subtle wind movement
      const windAngle = Math.sin(time * 2.2) * 0.05 * (weatherRef.current === 'heavy_rain' ? 2.5 : 1.0);
      cropsGroup.children.forEach((crop, idx) => {
        if (idx % 2 === 0) {
          crop.rotation.z = windAngle + Math.sin(time * 3 + idx) * 0.02;
        }
      });

      // Flowing water ripple displacement
      const canalPositions = canalWaterGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < canalPositions.length; i += 3) {
        const vx = canalPositions[i];
        const vy = canalPositions[i + 1];
        canalPositions[i + 2] =
          Math.sin(vy * 3.5 - time * 6.0 * activeWeather.waterFlow) * 0.035 * activeWeather.waterFlow +
          Math.cos(vx * 4.0 + time * 4.0) * 0.015;
      }
      canalWaterGeo.attributes.position.needsUpdate = true;

      // Animate water discharge splash
      if (activeWeather.waterFlow > 0.1) {
        const splashPosArr = splashGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < splashCount; i++) {
          splashPosArr[i * 3] += splashVelocities[i].x;
          splashPosArr[i * 3 + 1] += splashVelocities[i].y;
          splashPosArr[i * 3 + 2] += splashVelocities[i].z;
          splashVelocities[i].y -= 0.003; // gravity

          if (splashPosArr[i * 3 + 1] < -0.05) {
            splashPosArr[i * 3] = 0.8 + (Math.random() - 0.5) * 0.15;
            splashPosArr[i * 3 + 1] = 0.08 + Math.random() * 0.2;
            splashPosArr[i * 3 + 2] = 3.4 + (Math.random() - 0.5) * 0.15;
            splashVelocities[i].y = 0.025 + Math.random() * 0.04;
          }
        }
        splashGeo.attributes.position.needsUpdate = true;
        splashParticles.visible = true;
      } else {
        splashParticles.visible = false;
      }

      // Energy particles animation along waypoints
      const energyPosArr = energyGeo.attributes.position.array as Float32Array;
      const speed = 0.22 * activeWeather.pumpSpeed;
      for (let i = 0; i < energyParticleCount; i++) {
        energyProgress[i] = (energyProgress[i] + speed * delta) % 1.0;
        const p = energyProgress[i];

        // Segment along waypoints: 0->1, 1->2, 2->3, 3->4
        const segCount = energyWaypoints.length - 1;
        const scaledP = p * segCount;
        const segIdx = Math.min(Math.floor(scaledP), segCount - 1);
        const segFrac = scaledP - segIdx;

        const pA = energyWaypoints[segIdx];
        const pB = energyWaypoints[segIdx + 1];

        energyPosArr[i * 3] = THREE.MathUtils.lerp(pA.x, pB.x, segFrac);
        energyPosArr[i * 3 + 1] = THREE.MathUtils.lerp(pA.y, pB.y, segFrac);
        energyPosArr[i * 3 + 2] = THREE.MathUtils.lerp(pA.z, pB.z, segFrac);
      }
      energyGeo.attributes.position.needsUpdate = true;

      // Depth-aware rain update
      const targetRainOpacity =
        weatherRef.current === 'heavy_rain' ? 0.85 : weatherRef.current === 'rain' ? 0.6 : 0.0;
      rainMat.opacity = THREE.MathUtils.lerp(rainMat.opacity, targetRainOpacity, 0.05);

      if (rainMat.opacity > 0.01) {
        const rainPosArr = rainGeo.attributes.position.array as Float32Array;
        const fallSpeed = weatherRef.current === 'heavy_rain' ? 18.0 : 12.0;
        for (let i = 0; i < rainCount; i++) {
          rainPosArr[i * 3 + 1] -= fallSpeed * delta;
          rainPosArr[i * 3] += 1.2 * delta; // slight wind slant
          if (rainPosArr[i * 3 + 1] < 0) {
            rainPosArr[i * 3 + 1] = 18;
            rainPosArr[i * 3] = (Math.random() - 0.5) * 32;
            rainPosArr[i * 3 + 2] = (Math.random() - 0.5) * 32;
          }
        }
        rainGeo.attributes.position.needsUpdate = true;
      }

      // Controller LED pulsing
      ledMat.color.setHex(activeWeather.generationKw > 1.0 ? 0x22c55e : 0xf59e0b);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, [isLight]);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden select-none">
      {/* 1. Cinematic Background Layer: Photograph of the Real Rural Asset */}
      {displayMode === 'cinematic' ? (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <ReliableImage
            src={heroImageSrc}
            alt="Rural Climate Asset Trust Real-World Asset Landscape"
            className={`w-full h-full object-cover object-center transition-all duration-700 ease-out ${
              isTransitioningToTwin ? 'scale-110 filter brightness-110 contrast-105' : 'scale-100'
            }`}
            containerClassName="w-full h-full"
            badgeLabel={`FIELD CONDITION: ${weatherState === 'rain' ? 'RAINY' : weatherState.toUpperCase()}`}
            fallbackTitle="Solar Irrigation Pump • Darrang, Assam"
            fallbackSubtitle="5HP Shakti Submersible • Active Ground Telemetry"
            fallbackSrc={isLight ? '/assets/hero_light.jpg' : '/assets/hero_dark.jpg'}
          />
          {/* Subtle gradient scrim on left for readable editorial typography */}
          <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
            isLight
              ? 'bg-gradient-to-r from-[#faf8f2]/95 via-[#faf8f2]/40 to-transparent w-full md:w-[60%]'
              : 'bg-gradient-to-r from-[#090e17]/95 via-[#090e17]/40 to-transparent w-full md:w-[60%]'
          }`} />

          {/* Botanical leaf watermark in light mode as seen in reference image */}
          {isLight && (
            <svg
              className="absolute bottom-6 left-6 w-36 h-36 opacity-25 pointer-events-none text-emerald-800"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.8"
            >
              <path d="M12 2C6.5 2 2 6.5 2 12c5.5 0 10 4.5 10 10 5.5 0 10-4.5 10-10 0-5.5-4.5-10-10-10z" />
              <path d="M12 2c0 10 10 10 10 10" />
              <path d="M2 12c10 0 10 10 10 10" />
            </svg>
          )}

          {/* Transition Scanning Overlay: Active when transitioning Photograph -> 3D Twin */}
          <AnimatePresence>
            {isTransitioningToTwin && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center"
              >
                {/* Environmental Laser Sweep */}
                <motion.div
                  initial={{ top: '-10%' }}
                  animate={{ top: '110%' }}
                  transition={{ duration: 1.1, ease: 'easeInOut' }}
                  className="absolute inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_24px_rgba(52,211,153,0.8)]"
                />

                {/* Technical Bounding Box over Pump & Solar Panels */}
                <motion.div
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="absolute right-[12%] top-[38%] w-80 h-64 border-2 border-emerald-400/80 rounded-2xl bg-emerald-500/10 backdrop-blur-[2px] shadow-[0_0_30px_rgba(16,185,129,0.25)] flex flex-col justify-between p-3 text-emerald-300 font-mono text-xs"
                >
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="flex items-center gap-1.5 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                      <Box className="w-3 h-3 text-emerald-400" />
                      DEMARCATING REAL ASSET SOL-ASSAM-00214
                    </span>
                    <span className="text-[10px] text-emerald-300">EXTRACTING 3D TWIN</span>
                  </div>

                  <div className="text-center py-2 space-y-1">
                    <div className="text-xs font-bold text-white tracking-wider">
                      CONVERTING PHYSICAL EVIDENCE → DIGITAL TWIN
                    </div>
                    <div className="text-[10px] text-emerald-200">
                      GPS Lock: 26.4710° N, 92.0320° E • 4.8 kWp PV Array
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] bg-slate-950/70 p-1.5 rounded">
                    <span>CANAL FLOW: 180 L/MIN</span>
                    <span className="text-emerald-400 font-bold">MATCH CONFIRMED</span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hero Photographic Intelligence Overlays (Subtle, Extracted Information) */}
          <div className="absolute top-[48%] right-[22%] z-20 pointer-events-none hidden md:block">
            <FadeIn delay={0.3}>
              <div className={`px-3 py-1.5 rounded-xl border backdrop-blur-md text-[11px] font-mono flex items-center gap-2 shadow-lg transition ${
                isLight
                  ? 'bg-white/90 text-[#1b7340] border-[#d4ccbf]'
                  : 'bg-[#090e17]/85 text-emerald-400 border-emerald-500/30'
              }`}>
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                <span>GPS VERIFIED • 26.4710° N, 92.0320° E (28m offset)</span>
              </div>
            </FadeIn>
          </div>
        </div>
      ) : (
        /* 2. Three.js WebGL Interactive Twin Container: Digital Representation of Same Asset */
        <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />
      )}

      {/* Floating Hero Branding & Editorial Typography (Left Column) */}
      <div className="absolute top-10 left-8 md:top-14 md:left-16 z-20 max-w-xl pointer-events-none">
        <FadeIn delay={0.05}>
          {/* Editorial Headline */}
          <h1 className={`text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.06] font-serif tracking-tight drop-shadow-sm ${
            isLight ? 'text-[#18221b]' : 'text-white'
          }`}>
            Rural<br />
            Climate<br />
            Asset Trust
          </h1>

          {/* Subtitle & Supporting Text */}
          <div className="mt-4 space-y-2">
            <p className={`text-base sm:text-lg font-semibold leading-snug ${
              isLight ? 'text-[#18221b]' : 'text-emerald-400'
            }`}>
              Making rural climate finance more verifiable.
            </p>
            <p className={`text-xs sm:text-sm font-normal leading-relaxed max-w-md ${
              isLight ? 'text-[#3c4a40]' : 'text-slate-300'
            }`}>
              An asset verification and decision-support platform for rural climate finance — combining evidence, geolocation, climate context and performance signals to prioritize verification and inspection.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="mt-7 flex flex-wrap items-center gap-3.5 pointer-events-auto">
            <motion.button
              onClick={onEnterDemo}
              className={`px-7 py-3 rounded-full font-semibold text-xs sm:text-sm transition shadow-lg flex items-center gap-2 uppercase tracking-wider font-mono ${
                isLight
                  ? 'bg-[#1b7340] hover:bg-[#145a32] text-white shadow-emerald-950/15'
                  : 'bg-[#10b981] hover:bg-[#059669] text-slate-950 font-bold shadow-emerald-950/40'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Explore The Platform</span>
            </motion.button>

            <motion.button
              onClick={() => {
                if (onWatchDemo) onWatchDemo();
                else onEnterDemo();
              }}
              className={`px-6 py-3 rounded-full font-semibold text-xs sm:text-sm transition backdrop-blur-md border flex items-center gap-2 uppercase tracking-wider font-mono ${
                isLight
                  ? 'bg-white/85 hover:bg-white text-[#18221b] border-[#d8d0c2] shadow-sm'
                  : 'bg-slate-900/70 hover:bg-slate-900/90 text-white border-white/20 shadow-md'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Pitch Mode</span>
            </motion.button>
          </div>
        </FadeIn>
      </div>

      {/* Environmental Cause → Effect Flow Intelligence Strip (Top Center) */}
      <div className="absolute top-4 inset-x-0 z-20 flex justify-center pointer-events-none hidden xl:flex">
        <FadeIn delay={0.2}>
          <div className={`px-4 py-2 rounded-full border text-[11px] font-mono flex items-center gap-3 shadow-lg backdrop-blur-md ${
            isLight
              ? 'bg-white/90 border-[#e3dcd0] text-slate-700'
              : 'bg-[#090e17]/85 border-white/10 text-slate-300'
          }`}>
            {weatherState === 'clear' && (
              <>
                <span className="flex items-center gap-1 text-amber-500 font-semibold">
                  <Sun className="w-3.5 h-3.5" /> SUN (840 W/m²)
                </span>
                <span className="text-slate-400">→</span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Zap className="w-3.5 h-3.5" /> PV ARRAY (3.2 kWp)
                </span>
                <span className="text-slate-400">→</span>
                <span className="flex items-center gap-1 text-sky-600 dark:text-sky-400 font-semibold">
                  <Activity className="w-3.5 h-3.5" /> ENERGY (5.8 kWh)
                </span>
                <span className="text-slate-400">→</span>
                <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-semibold">
                  <Droplets className="w-3.5 h-3.5" /> CANAL (180 L/min)
                </span>
                <span className="text-slate-400">→</span>
                <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED (88%)
                </span>
              </>
            )}
            {weatherState === 'cloudy' && (
              <>
                <span className="flex items-center gap-1 text-sky-500 dark:text-sky-400 font-semibold">
                  ☁ OVERCAST (520 W/m²)
                </span>
                <span className="text-slate-400">→</span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Zap className="w-3.5 h-3.5" /> PV ARRAY (2.2 kWp)
                </span>
                <span className="text-slate-400">→</span>
                <span className="flex items-center gap-1 text-sky-600 dark:text-sky-400 font-semibold">
                  <Activity className="w-3.5 h-3.5" /> EXPECTED (3.9 kWh)
                </span>
                <span className="text-slate-400">→</span>
                <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-semibold">
                  <Droplets className="w-3.5 h-3.5" /> CANAL (135 L/min)
                </span>
                <span className="text-slate-400">→</span>
                <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" /> CLIMATE-MATCHED (88%)
                </span>
              </>
            )}
            {(weatherState === 'rain' || weatherState === 'heavy_rain') && (
              <>
                <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-semibold">
                  🌧 MONSOON RAIN (280 W/m²)
                </span>
                <span className="text-slate-400">→</span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                  <Zap className="w-3.5 h-3.5" /> PV ARRAY (1.1 kWp)
                </span>
                <span className="text-slate-400">→</span>
                <span className="flex items-center gap-1 text-sky-600 dark:text-sky-400 font-semibold">
                  <Activity className="w-3.5 h-3.5" /> EXPECTED (2.1 kWh)
                </span>
                <span className="text-slate-400">→</span>
                <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400 font-semibold">
                  <Droplets className="w-3.5 h-3.5" /> CANAL (NATURAL RAIN)
                </span>
                <span className="text-slate-400">→</span>
                <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" /> WEATHER ALIGNED (NO FAULT)
                </span>
              </>
            )}
          </div>
        </FadeIn>
      </div>

      {/* Bottom Horizontal Metrics Ribbon: STRICT SEMANTIC CONSISTENCY */}
      <div className="absolute bottom-8 left-8 md:left-16 z-20 pointer-events-auto">
        <FadeIn delay={0.15}>
          <div className={`flex items-center gap-6 sm:gap-9 py-3.5 px-6 rounded-2xl border backdrop-blur-md shadow-xl ${
            isLight
              ? 'bg-white/90 border-[#e3dcd0] text-[#18221b]'
              : 'bg-[#0b1320]/80 border-white/10 text-white'
          }`}>
            {/* 1. Assets Monitored */}
            <div>
              <div className="text-2xl font-bold font-mono text-[#10b981] [data-theme=light]:text-[#1b7340]">
                {metrics.totalAssets.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 [data-theme=light]:text-[#5b685f]">
                Assets Monitored
              </div>
            </div>

            <div className="h-8 w-px bg-slate-300/40 dark:bg-white/15" />

            {/* 2. High Confidence */}
            <div>
              <div className="text-2xl font-bold font-mono text-[#10b981] [data-theme=light]:text-[#1b7340]">
                {metrics.highConfidence.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 [data-theme=light]:text-[#5b685f]">
                High Confidence
              </div>
            </div>

            <div className="h-8 w-px bg-slate-300/40 dark:bg-white/15" />

            {/* 3. Require Review */}
            <div>
              <div className="text-2xl font-bold font-mono text-[#f59e0b] [data-theme=light]:text-[#d97706]">
                {metrics.requireReview.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 [data-theme=light]:text-[#5b685f]">
                Require Review
              </div>
            </div>

            <div className="h-8 w-px bg-slate-300/40 dark:bg-white/15" />

            {/* 4. Anomalies Flagged */}
            <div>
              <div className="text-2xl font-bold font-mono text-rose-500 [data-theme=light]:text-rose-600">
                {metrics.anomaliesFlagged.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 [data-theme=light]:text-[#5b685f]">
                Anomalies Flagged
              </div>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Floating Weather & Solar Output Card + Field Conditions (Top Right) */}
      <div className="absolute top-10 right-8 md:right-16 z-20 pointer-events-auto space-y-2.5">
        {/* Subtle & Premium FIELD CONDITIONS Selector */}
        <FadeIn delay={0.15}>
          <div className={`p-1.5 rounded-2xl border backdrop-blur-md shadow-xl flex items-center justify-between gap-1 text-[11px] font-mono ${
            isLight
              ? 'bg-white/95 border-[#e2dcce] text-[#18221b]'
              : 'bg-[#0b1320]/90 border-white/10 text-white'
          }`}>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 text-slate-500 dark:text-slate-400">
              FIELD CONDITIONS
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setWeatherState('clear')}
                className={`px-2.5 py-1 rounded-xl font-bold transition flex items-center gap-1 ${
                  weatherState === 'clear'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Observe asset under direct clear sunlight"
              >
                <span>☀ CLEAR</span>
              </button>
              <button
                type="button"
                onClick={() => setWeatherState('cloudy')}
                className={`px-2.5 py-1 rounded-xl font-bold transition flex items-center gap-1 ${
                  weatherState === 'cloudy'
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Observe asset under diffuse overcast cloud cover"
              >
                <span>☁ CLOUDY</span>
              </button>
              <button
                type="button"
                onClick={() => setWeatherState('rain')}
                className={`px-2.5 py-1 rounded-xl font-bold transition flex items-center gap-1 ${
                  weatherState === 'rain' || weatherState === 'heavy_rain'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Observe asset under monsoon rain conditions"
              >
                <span>🌧 RAINY</span>
              </button>
            </div>
          </div>
        </FadeIn>

        {/* Telemetry Card */}
        <FadeIn delay={0.2}>
          <div className={`w-72 p-4 rounded-2xl border shadow-2xl backdrop-blur-md text-xs space-y-3 ${
            isLight
              ? 'bg-white/95 border-[#e2dcce] text-[#18221b]'
              : 'bg-[#0b1320]/85 border-white/10 text-white'
          }`}>
            {/* Weather status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {weatherState === 'clear' ? (
                  <Sun className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '30s' }} />
                ) : weatherState === 'cloudy' ? (
                  <span className="text-base leading-none">☁</span>
                ) : (
                  <span className="text-base leading-none">🌧</span>
                )}
                <span className="font-semibold text-xs">
                  {weatherState === 'clear'
                    ? (isLight ? 'Sunny • Clear Sky' : 'Clear Sunlight')
                    : weatherState === 'cloudy'
                    ? 'Overcast Cloud Cover'
                    : 'Monsoon Rain Conditions'}
                </span>
              </div>
              <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                {weatherConfig.temperature.toFixed(0)}°C
              </span>
            </div>

            {/* Solar Output Section */}
            <div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                Expected Operating Baseline
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">
                  {weatherConfig.irradiance.toFixed(1)} kWh/m²
                </span>
                <span className={`text-[10px] font-mono font-bold ${
                  weatherState === 'clear'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : weatherState === 'cloudy'
                    ? 'text-sky-600 dark:text-sky-400'
                    : 'text-teal-600 dark:text-teal-400'
                }`}>
                  {weatherState === 'clear'
                    ? 'High Irradiance'
                    : weatherState === 'cloudy'
                    ? 'Diffuse Light'
                    : 'Rainy Baseline'}
                </span>
              </div>

              {/* 7-Bar Miniature Chart */}
              <div className="flex items-end gap-1.5 h-7 mt-2">
                {(weatherState === 'clear'
                  ? [45, 58, 72, 85, 95, 62, 88]
                  : weatherState === 'cloudy'
                  ? [38, 48, 55, 62, 65, 50, 60]
                  : [25, 30, 35, 40, 38, 28, 34]
                ).map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t transition-all duration-300"
                    style={{
                      height: `${h}%`,
                      backgroundColor: i === 6
                        ? (isLight ? '#1b7340' : '#10b981')
                        : (isLight ? '#a8d5b8' : '#064e3b')
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Context Explanation */}
            <div className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              {weatherState === 'clear' && 'Direct sunlight supports full 3.2 kWp array output. Reported harvest matches modeled potential.'}
              {weatherState === 'cloudy' && 'Overcast cloud cover moderates expected solar harvest. Lower generation aligns with atmospheric model.'}
              {(weatherState === 'rain' || weatherState === 'heavy_rain') && 'Monsoon rain model anticipates lower kWh harvest; reduced output does not imply asset defect or failure.'}
            </div>

            {/* Asset Status Footer */}
            <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Decision Status</span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Climate-Matched
              </span>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Floating Asset Location Badge (Over Pump Mid/Bottom Right - Matching Reference Image) */}
      <div className="absolute top-[68%] right-8 md:right-28 z-20 pointer-events-auto hidden sm:block">
        <FadeIn delay={0.25}>
          <div className={`p-3.5 rounded-2xl border shadow-2xl backdrop-blur-md text-xs space-y-0.5 ${
            isLight
              ? 'bg-white/95 border-[#e2dcce] text-[#18221b]'
              : 'bg-[#0b1320]/85 border-white/10 text-white'
          }`}>
            <div className="font-bold text-slate-900 dark:text-white">Solar Irrigation Pump</div>
            <div className="text-[11px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
              ID SOL-ASSAM-00214 • Real-World Asset
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">
              Mangaldai, Assam • 5 HP Submersible
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Refined subtle telemetry strip only (Mode & Weather Control Bar removed to simplify landing hero) */}
    </div>
  );
};
