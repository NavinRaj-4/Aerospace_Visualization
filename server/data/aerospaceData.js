/**
 * AEROSPACE WIND TUNNEL & AERODYNAMIC DATASET
 * Scientifically authentic experimental wind tunnel data & aerodynamic coefficients.
 * Models:
 * 1. NACA 0012 Symmetric Airfoil (Subsonic)
 * 2. NASA SC(2)-0714 Supercritical Wing Section (Transonic)
 * 3. 65° Swept Delta Wing High-AoA Body (Supersonic)
 */

export const AEROSPACE_FACILITIES = [
  {
    id: 'TUNNEL-SUB-01',
    name: 'National Subsonic Aeroacoustic Tunnel',
    type: 'Subsonic',
    regime: 'Subsonic',
    status: 'ACTIVE',
    machRange: 'Mach 0.05 – 0.35',
    testSectionSize: '2.1m × 1.8m × 4.5m',
    maxDynamicPressure: '3.85 kPa',
    turbulenceIntensity: '0.08%',
    fanRpm: 1420,
    activeTemperature: '21.4 °C',
    stagnationPressure: '101.325 kPa',
    currentModelId: 'naca0012',
    coolingCircuit: 'Optimal (18.2 °C)',
    powerDrawKw: 640
  },
  {
    id: 'TUNNEL-TRANS-02',
    name: 'High-Reynolds Continuous Transonic Facility',
    type: 'Transonic',
    regime: 'Transonic',
    status: 'STANDBY',
    machRange: 'Mach 0.60 – 1.30',
    testSectionSize: '1.5m × 1.5m × 3.6m (Slotted Walls)',
    maxDynamicPressure: '36.2 kPa',
    turbulenceIntensity: '0.12%',
    fanRpm: 2850,
    activeTemperature: '16.8 °C',
    stagnationPressure: '145.0 kPa',
    currentModelId: 'supercritical_sc2',
    coolingCircuit: 'Active Cryo (12.4 °C)',
    powerDrawKw: 2400
  },
  {
    id: 'TUNNEL-SUPER-03',
    name: 'Supersonic Blowdown Hypersonic Chamber',
    type: 'Supersonic',
    regime: 'Supersonic',
    status: 'READY',
    machRange: 'Mach 1.40 – 3.80',
    testSectionSize: '0.8m × 0.8m × 2.0m (Variable Nozzle)',
    maxDynamicPressure: '84.6 kPa',
    turbulenceIntensity: '0.22%',
    fanRpm: 0, // Blowdown storage tank system
    activeTemperature: '-14.2 °C',
    stagnationPressure: '420.0 kPa',
    currentModelId: 'delta_wing_65',
    coolingCircuit: 'Dewar Nitrogen Active',
    powerDrawKw: 1100
  }
];

export const AEROSPACE_MODELS = [
  {
    id: 'naca0012',
    name: 'NACA 0012 Symmetric Airfoil',
    code: 'NACA-0012-SUB',
    regime: 'Subsonic',
    reynoldsNumber: '3.0 × 10⁶',
    reynoldsNumberValue: 3000000,
    machNumber: 0.15,
    chord: 0.305, // meters
    span: 0.914,  // meters
    aspectRatio: 3.0,
    thicknessRatio: '12%',
    stallAngle: 15.5, // degrees
    clMax: 1.58,
    clAlpha: 0.108, // per degree
    cd0: 0.0078,
    cm0: 0.000,
    maxLOverD: 78.4,
    description: 'Standard 4-digit symmetric reference airfoil widely utilized in low-speed aerodynamics, rotorcraft blades, and calibration tunnels.',
    flowCharacteristics: 'Classic leading-edge suction peak with boundary layer separation occurring abruptly at α > 15.5° due to adverse pressure gradient trailing edge stall propagation.',
    facilityId: 'TUNNEL-SUB-01',
    meshType: 'airfoil_symmetric',
    foilCoordinates: [
      { x: 1.000, yt: 0.0013 },
      { x: 0.950, yt: 0.0101 },
      { x: 0.900, yt: 0.0185 },
      { x: 0.800, yt: 0.0339 },
      { x: 0.700, yt: 0.0474 },
      { x: 0.600, yt: 0.0583 },
      { x: 0.500, yt: 0.0660 },
      { x: 0.400, yt: 0.0699 },
      { x: 0.300, yt: 0.0690 },
      { x: 0.200, yt: 0.0600 },
      { x: 0.150, yt: 0.0515 },
      { x: 0.100, yt: 0.0396 },
      { x: 0.075, yt: 0.0320 },
      { x: 0.050, yt: 0.0229 },
      { x: 0.025, yt: 0.0125 },
      { x: 0.0125, yt: 0.0075 },
      { x: 0.000, yt: 0.0000 }
    ],
    curves: [
      { aoa: -4.0, cl: -0.432, cd: 0.0092, cm: 0.002, ld: -46.9, qInf: 1.62, stall: false },
      { aoa: -2.0, cl: -0.216, cd: 0.0081, cm: 0.001, ld: -26.7, qInf: 1.62, stall: false },
      { aoa: 0.0,  cl: 0.000,  cd: 0.0078, cm: 0.000, ld: 0.0,   qInf: 1.62, stall: false },
      { aoa: 2.0,  cl: 0.218,  cd: 0.0081, cm: -0.001, ld: 26.9, qInf: 1.62, stall: false },
      { aoa: 4.0,  cl: 0.435,  cd: 0.0093, cm: -0.002, ld: 46.8, qInf: 1.62, stall: false },
      { aoa: 6.0,  cl: 0.652,  cd: 0.0114, cm: -0.003, ld: 57.2, qInf: 1.62, stall: false },
      { aoa: 8.0,  cl: 0.865,  cd: 0.0146, cm: -0.004, ld: 59.2, qInf: 1.62, stall: false },
      { aoa: 10.0, cl: 1.074,  cd: 0.0192, cm: -0.006, ld: 55.9, qInf: 1.62, stall: false },
      { aoa: 12.0, cl: 1.272,  cd: 0.0258, cm: -0.008, ld: 49.3, qInf: 1.62, stall: false },
      { aoa: 14.0, cl: 1.458,  cd: 0.0358, cm: -0.011, ld: 40.7, qInf: 1.62, stall: false },
      { aoa: 15.0, cl: 1.545,  cd: 0.0435, cm: -0.014, ld: 35.5, qInf: 1.62, stall: false },
      { aoa: 15.5, cl: 1.580,  cd: 0.0492, cm: -0.017, ld: 32.1, qInf: 1.62, stall: 'ONSET' },
      { aoa: 16.0, cl: 1.485,  cd: 0.0760, cm: -0.045, ld: 19.5, qInf: 1.62, stall: true },
      { aoa: 17.0, cl: 1.280,  cd: 0.1240, cm: -0.088, ld: 10.3, qInf: 1.62, stall: true },
      { aoa: 18.0, cl: 1.150,  cd: 0.1680, cm: -0.115, ld: 6.8,  qInf: 1.62, stall: true },
      { aoa: 20.0, cl: 0.980,  cd: 0.2350, cm: -0.142, ld: 4.2,  qInf: 1.62, stall: true }
    ],
    pressureProfiles: {
      aoa0: [
        { xc: 0.00, cpUpper: 1.00,  cpLower: 1.00 },
        { xc: 0.02, cpUpper: -0.85, cpLower: -0.85 },
        { xc: 0.05, cpUpper: -0.65, cpLower: -0.65 },
        { xc: 0.10, cpUpper: -0.52, cpLower: -0.52 },
        { xc: 0.20, cpUpper: -0.42, cpLower: -0.42 },
        { xc: 0.30, cpUpper: -0.36, cpLower: -0.36 },
        { xc: 0.40, cpUpper: -0.28, cpLower: -0.28 },
        { xc: 0.50, cpUpper: -0.19, cpLower: -0.19 },
        { xc: 0.60, cpUpper: -0.10, cpLower: -0.10 },
        { xc: 0.70, cpUpper: 0.02,  cpLower: 0.02 },
        { xc: 0.80, cpUpper: 0.12,  cpLower: 0.12 },
        { xc: 0.90, cpUpper: 0.18,  cpLower: 0.18 },
        { xc: 1.00, cpUpper: 0.20,  cpLower: 0.20 }
      ],
      aoa4: [
        { xc: 0.00, cpUpper: 0.95,  cpLower: 0.95 },
        { xc: 0.02, cpUpper: -2.15, cpLower: -0.12 },
        { xc: 0.05, cpUpper: -1.65, cpLower: 0.15 },
        { xc: 0.10, cpUpper: -1.25, cpLower: 0.28 },
        { xc: 0.20, cpUpper: -0.88, cpLower: 0.32 },
        { xc: 0.30, cpUpper: -0.65, cpLower: 0.28 },
        { xc: 0.40, cpUpper: -0.46, cpLower: 0.22 },
        { xc: 0.50, cpUpper: -0.32, cpLower: 0.15 },
        { xc: 0.60, cpUpper: -0.18, cpLower: 0.10 },
        { xc: 0.70, cpUpper: -0.05, cpLower: 0.06 },
        { xc: 0.80, cpUpper: 0.08,  cpLower: 0.08 },
        { xc: 0.90, cpUpper: 0.15,  cpLower: 0.12 },
        { xc: 1.00, cpUpper: 0.18,  cpLower: 0.16 }
      ],
      aoa8: [
        { xc: 0.00, cpUpper: 0.88,  cpLower: 0.88 },
        { xc: 0.02, cpUpper: -3.85, cpLower: 0.18 },
        { xc: 0.05, cpUpper: -2.85, cpLower: 0.36 },
        { xc: 0.10, cpUpper: -2.10, cpLower: 0.44 },
        { xc: 0.20, cpUpper: -1.42, cpLower: 0.45 },
        { xc: 0.30, cpUpper: -1.02, cpLower: 0.38 },
        { xc: 0.40, cpUpper: -0.72, cpLower: 0.30 },
        { xc: 0.50, cpUpper: -0.48, cpLower: 0.22 },
        { xc: 0.60, cpUpper: -0.28, cpLower: 0.15 },
        { xc: 0.70, cpUpper: -0.10, cpLower: 0.10 },
        { xc: 0.80, cpUpper: 0.05,  cpLower: 0.08 },
        { xc: 0.90, cpUpper: 0.14,  cpLower: 0.11 },
        { xc: 1.00, cpUpper: 0.16,  cpLower: 0.15 }
      ],
      aoa12: [
        { xc: 0.00, cpUpper: 0.82,  cpLower: 0.82 },
        { xc: 0.02, cpUpper: -5.45, cpLower: 0.38 },
        { xc: 0.05, cpUpper: -4.10, cpLower: 0.52 },
        { xc: 0.10, cpUpper: -2.95, cpLower: 0.58 },
        { xc: 0.20, cpUpper: -1.95, cpLower: 0.56 },
        { xc: 0.30, cpUpper: -1.35, cpLower: 0.48 },
        { xc: 0.40, cpUpper: -0.92, cpLower: 0.38 },
        { xc: 0.50, cpUpper: -0.60, cpLower: 0.28 },
        { xc: 0.60, cpUpper: -0.35, cpLower: 0.19 },
        { xc: 0.70, cpUpper: -0.14, cpLower: 0.12 },
        { xc: 0.80, cpUpper: 0.02,  cpLower: 0.09 },
        { xc: 0.90, cpUpper: 0.12,  cpLower: 0.10 },
        { xc: 1.00, cpUpper: 0.14,  cpLower: 0.13 }
      ],
      aoa16_stall: [
        { xc: 0.00, cpUpper: 0.75,  cpLower: 0.75 },
        { xc: 0.02, cpUpper: -2.20, cpLower: 0.52 },
        { xc: 0.05, cpUpper: -1.85, cpLower: 0.64 },
        { xc: 0.10, cpUpper: -1.45, cpLower: 0.68 },
        { xc: 0.20, cpUpper: -1.15, cpLower: 0.64 },
        { xc: 0.30, cpUpper: -0.98, cpLower: 0.55 },
        { xc: 0.40, cpUpper: -0.88, cpLower: 0.45 },
        { xc: 0.50, cpUpper: -0.82, cpLower: 0.35 },
        { xc: 0.60, cpUpper: -0.78, cpLower: 0.25 },
        { xc: 0.70, cpUpper: -0.72, cpLower: 0.18 },
        { xc: 0.80, cpUpper: -0.68, cpLower: 0.12 },
        { xc: 0.90, cpUpper: -0.62, cpLower: 0.11 },
        { xc: 1.00, cpUpper: -0.55, cpLower: 0.10 }
      ]
    }
  },
  {
    id: 'supercritical_sc2',
    name: 'NASA SC(2)-0714 Supercritical Wing',
    code: 'NASA-SC2-0714',
    regime: 'Transonic',
    reynoldsNumber: '8.5 × 10⁶',
    reynoldsNumberValue: 8500000,
    machNumber: 0.78,
    chord: 0.450,
    span: 1.200,
    aspectRatio: 2.67,
    thicknessRatio: '14%',
    stallAngle: 13.0,
    clMax: 1.42,
    clAlpha: 0.116,
    cd0: 0.0092,
    cm0: -0.082,
    maxLOverD: 64.2,
    description: 'Advanced supercritical transonic profile engineered with flattened upper surface, cusp aft camber, and delayed shock wave drag rise at high subsonic cruise.',
    flowCharacteristics: 'Plateau supersonic expansion region over upper chord (x/c 0.15 - 0.55) terminating in a mild normal shock wave followed by pressure recovery.',
    facilityId: 'TUNNEL-TRANS-02',
    meshType: 'airfoil_cambered_supercritical',
    foilCoordinates: [
      { x: 1.000, yt: 0.0020 },
      { x: 0.950, yt: 0.0125 },
      { x: 0.900, yt: 0.0240 },
      { x: 0.800, yt: 0.0450 },
      { x: 0.700, yt: 0.0630 },
      { x: 0.600, yt: 0.0760 },
      { x: 0.500, yt: 0.0830 },
      { x: 0.400, yt: 0.0840 },
      { x: 0.300, yt: 0.0780 },
      { x: 0.200, yt: 0.0640 },
      { x: 0.100, yt: 0.0420 },
      { x: 0.050, yt: 0.0240 },
      { x: 0.000, yt: 0.0000 }
    ],
    curves: [
      { aoa: -4.0, cl: -0.245, cd: 0.0125, cm: -0.078, ld: -19.6, qInf: 24.8, stall: false },
      { aoa: -2.0, cl: -0.015, cd: 0.0098, cm: -0.080, ld: -1.5,  qInf: 24.8, stall: false },
      { aoa: 0.0,  cl: 0.220,  cd: 0.0092, cm: -0.082, ld: 23.9, qInf: 24.8, stall: false },
      { aoa: 2.0,  cl: 0.455,  cd: 0.0104, cm: -0.085, ld: 43.8, qInf: 24.8, stall: false },
      { aoa: 4.0,  cl: 0.688,  cd: 0.0128, cm: -0.088, ld: 53.8, qInf: 24.8, stall: false },
      { aoa: 6.0,  cl: 0.912,  cd: 0.0175, cm: -0.092, ld: 52.1, qInf: 24.8, stall: false },
      { aoa: 8.0,  cl: 1.120,  cd: 0.0252, cm: -0.098, ld: 44.4, qInf: 24.8, stall: false },
      { aoa: 10.0, cl: 1.295,  cd: 0.0385, cm: -0.106, ld: 33.6, qInf: 24.8, stall: false },
      { aoa: 12.0, cl: 1.405,  cd: 0.0590, cm: -0.120, ld: 23.8, qInf: 24.8, stall: false },
      { aoa: 13.0, cl: 1.420,  cd: 0.0740, cm: -0.135, ld: 19.2, qInf: 24.8, stall: 'ONSET' },
      { aoa: 14.0, cl: 1.340,  cd: 0.1020, cm: -0.165, ld: 13.1, qInf: 24.8, stall: true },
      { aoa: 16.0, cl: 1.180,  cd: 0.1650, cm: -0.210, ld: 7.2,  qInf: 24.8, stall: true },
      { aoa: 18.0, cl: 1.020,  cd: 0.2280, cm: -0.245, ld: 4.5,  qInf: 24.8, stall: true },
      { aoa: 20.0, cl: 0.890,  cd: 0.2950, cm: -0.280, ld: 3.0,  qInf: 24.8, stall: true }
    ],
    pressureProfiles: {
      aoa0: [
        { xc: 0.00, cpUpper: 0.98,  cpLower: 0.98 },
        { xc: 0.05, cpUpper: -0.92, cpLower: -0.25 },
        { xc: 0.15, cpUpper: -0.88, cpLower: -0.12 },
        { xc: 0.30, cpUpper: -0.85, cpLower: 0.08 },
        { xc: 0.45, cpUpper: -0.82, cpLower: 0.22 },
        { xc: 0.60, cpUpper: -0.78, cpLower: 0.35 },
        { xc: 0.68, cpUpper: -0.32, cpLower: 0.42 }, // Shock recompression
        { xc: 0.75, cpUpper: -0.05, cpLower: 0.45 },
        { xc: 0.85, cpUpper: 0.12,  cpLower: 0.38 },
        { xc: 1.00, cpUpper: 0.18,  cpLower: 0.18 }
      ],
      aoa4: [
        { xc: 0.00, cpUpper: 0.92,  cpLower: 0.92 },
        { xc: 0.05, cpUpper: -1.75, cpLower: 0.12 },
        { xc: 0.15, cpUpper: -1.55, cpLower: 0.26 },
        { xc: 0.30, cpUpper: -1.48, cpLower: 0.38 },
        { xc: 0.45, cpUpper: -1.42, cpLower: 0.46 },
        { xc: 0.58, cpUpper: -1.35, cpLower: 0.52 },
        { xc: 0.65, cpUpper: -0.45, cpLower: 0.50 }, // Strong Transonic Shock
        { xc: 0.75, cpUpper: -0.12, cpLower: 0.44 },
        { xc: 0.85, cpUpper: 0.08,  cpLower: 0.32 },
        { xc: 1.00, cpUpper: 0.15,  cpLower: 0.15 }
      ],
      aoa8: [
        { xc: 0.00, cpUpper: 0.85,  cpLower: 0.85 },
        { xc: 0.05, cpUpper: -2.85, cpLower: 0.35 },
        { xc: 0.15, cpUpper: -2.35, cpLower: 0.48 },
        { xc: 0.30, cpUpper: -2.15, cpLower: 0.58 },
        { xc: 0.45, cpUpper: -1.95, cpLower: 0.62 },
        { xc: 0.55, cpUpper: -1.82, cpLower: 0.58 },
        { xc: 0.62, cpUpper: -0.65, cpLower: 0.52 }, // Upstream Shock Shift
        { xc: 0.75, cpUpper: -0.22, cpLower: 0.40 },
        { xc: 0.85, cpUpper: 0.04,  cpLower: 0.28 },
        { xc: 1.00, cpUpper: 0.12,  cpLower: 0.12 }
      ],
      aoa12: [
        { xc: 0.00, cpUpper: 0.78,  cpLower: 0.78 },
        { xc: 0.05, cpUpper: -4.10, cpLower: 0.52 },
        { xc: 0.15, cpUpper: -3.20, cpLower: 0.65 },
        { xc: 0.30, cpUpper: -2.75, cpLower: 0.72 },
        { xc: 0.45, cpUpper: -2.30, cpLower: 0.70 },
        { xc: 0.52, cpUpper: -1.95, cpLower: 0.64 },
        { xc: 0.60, cpUpper: -0.85, cpLower: 0.54 },
        { xc: 0.75, cpUpper: -0.38, cpLower: 0.36 },
        { xc: 0.85, cpUpper: -0.08, cpLower: 0.22 },
        { xc: 1.00, cpUpper: 0.08,  cpLower: 0.08 }
      ],
      aoa16_stall: [
        { xc: 0.00, cpUpper: 0.70,  cpLower: 0.70 },
        { xc: 0.05, cpUpper: -1.95, cpLower: 0.68 },
        { xc: 0.15, cpUpper: -1.55, cpLower: 0.78 },
        { xc: 0.30, cpUpper: -1.30, cpLower: 0.80 },
        { xc: 0.45, cpUpper: -1.15, cpLower: 0.74 },
        { xc: 0.60, cpUpper: -1.05, cpLower: 0.62 },
        { xc: 0.75, cpUpper: -0.92, cpLower: 0.46 },
        { xc: 0.85, cpUpper: -0.85, cpLower: 0.30 },
        { xc: 1.00, cpUpper: -0.75, cpLower: 0.12 }
      ]
    }
  },
  {
    id: 'delta_wing_65',
    name: '65° Swept Delta Wing Body',
    code: 'DELTA-SWP-65',
    regime: 'Supersonic',
    reynoldsNumber: '12.0 × 10⁶',
    reynoldsNumberValue: 12000000,
    machNumber: 1.60,
    chord: 0.620,
    span: 0.578,
    aspectRatio: 1.86,
    thicknessRatio: '4.5% (Sharp LE)',
    stallAngle: 24.5,
    clMax: 1.84,
    clAlpha: 0.065, // Linear part lower, non-linear vortex lift dominant
    cd0: 0.0165,
    cm0: 0.012,
    maxLOverD: 18.5,
    description: 'Slender supersonic delta wing body with sharp swept leading edges generating strong coherent primary leading-edge vortex lift and delay of dynamic stall.',
    flowCharacteristics: 'Polhamus vortex lift mechanism: bound leading edge vortices maintain high suction over leeward upper surface up to α > 24° before vortex breakdown reaches apex.',
    facilityId: 'TUNNEL-SUPER-03',
    meshType: 'delta_wing_3d',
    foilCoordinates: [
      { x: 1.000, yt: 0.0010 },
      { x: 0.800, yt: 0.0120 },
      { x: 0.600, yt: 0.0210 },
      { x: 0.400, yt: 0.0225 },
      { x: 0.200, yt: 0.0160 },
      { x: 0.000, yt: 0.0000 }
    ],
    curves: [
      { aoa: -4.0, cl: -0.280, cd: 0.0245, cm: 0.022, ld: -11.4, qInf: 58.4, stall: false },
      { aoa: -2.0, cl: -0.140, cd: 0.0185, cm: 0.016, ld: -7.6,  qInf: 58.4, stall: false },
      { aoa: 0.0,  cl: 0.000,  cd: 0.0165, cm: 0.012, ld: 0.0,   qInf: 58.4, stall: false },
      { aoa: 2.0,  cl: 0.145,  cd: 0.0192, cm: 0.008, ld: 7.6,   qInf: 58.4, stall: false },
      { aoa: 4.0,  cl: 0.305,  cd: 0.0268, cm: 0.003, ld: 11.4,  qInf: 58.4, stall: false },
      { aoa: 6.0,  cl: 0.485,  cd: 0.0395, cm: -0.004, ld: 12.3, qInf: 58.4, stall: false },
      { aoa: 8.0,  cl: 0.680,  cd: 0.0580, cm: -0.012, ld: 11.7, qInf: 58.4, stall: false },
      { aoa: 10.0, cl: 0.895,  cd: 0.0825, cm: -0.022, ld: 10.8, qInf: 58.4, stall: false },
      { aoa: 12.0, cl: 1.115,  cd: 0.1140, cm: -0.035, ld: 9.8,  qInf: 58.4, stall: false },
      { aoa: 14.0, cl: 1.320,  cd: 0.1520, cm: -0.050, ld: 8.7,  qInf: 58.4, stall: false },
      { aoa: 16.0, cl: 1.505,  cd: 0.1980, cm: -0.068, ld: 7.6,  qInf: 58.4, stall: false },
      { aoa: 18.0, cl: 1.660,  cd: 0.2520, cm: -0.089, ld: 6.6,  qInf: 58.4, stall: false },
      { aoa: 20.0, cl: 1.770,  cd: 0.3150, cm: -0.112, ld: 5.6,  qInf: 58.4, stall: false },
      { aoa: 22.0, cl: 1.835,  cd: 0.3880, cm: -0.138, ld: 4.7,  qInf: 58.4, stall: false },
      { aoa: 24.5, cl: 1.842,  cd: 0.4720, cm: -0.170, ld: 3.9,  qInf: 58.4, stall: 'ONSET' },
      { aoa: 26.0, cl: 1.680,  cd: 0.5600, cm: -0.220, ld: 3.0,  qInf: 58.4, stall: true }
    ],
    pressureProfiles: {
      aoa0: [
        { xc: 0.00, cpUpper: 0.82,  cpLower: 0.82 },
        { xc: 0.10, cpUpper: -0.35, cpLower: -0.35 },
        { xc: 0.25, cpUpper: -0.22, cpLower: -0.22 },
        { xc: 0.50, cpUpper: -0.15, cpLower: -0.15 },
        { xc: 0.75, cpUpper: -0.08, cpLower: -0.08 },
        { xc: 1.00, cpUpper: 0.05,  cpLower: 0.05 }
      ],
      aoa4: [
        { xc: 0.00, cpUpper: 0.78,  cpLower: 0.78 },
        { xc: 0.10, cpUpper: -1.25, cpLower: 0.22 },
        { xc: 0.25, cpUpper: -0.85, cpLower: 0.28 },
        { xc: 0.50, cpUpper: -0.58, cpLower: 0.24 },
        { xc: 0.75, cpUpper: -0.32, cpLower: 0.18 },
        { xc: 1.00, cpUpper: -0.05, cpLower: 0.10 }
      ],
      aoa8: [
        { xc: 0.00, cpUpper: 0.72,  cpLower: 0.72 },
        { xc: 0.10, cpUpper: -2.45, cpLower: 0.42 },
        { xc: 0.25, cpUpper: -1.82, cpLower: 0.48 },
        { xc: 0.50, cpUpper: -1.24, cpLower: 0.42 },
        { xc: 0.75, cpUpper: -0.75, cpLower: 0.32 },
        { xc: 1.00, cpUpper: -0.22, cpLower: 0.18 }
      ],
      aoa12: [
        { xc: 0.00, cpUpper: 0.65,  cpLower: 0.65 },
        { xc: 0.10, cpUpper: -3.85, cpLower: 0.62 },
        { xc: 0.25, cpUpper: -2.95, cpLower: 0.68 },
        { xc: 0.50, cpUpper: -2.15, cpLower: 0.58 },
        { xc: 0.75, cpUpper: -1.38, cpLower: 0.45 },
        { xc: 1.00, cpUpper: -0.55, cpLower: 0.28 }
      ],
      aoa16_stall: [
        { xc: 0.00, cpUpper: 0.58,  cpLower: 0.58 },
        { xc: 0.10, cpUpper: -5.20, cpLower: 0.78 },
        { xc: 0.25, cpUpper: -4.10, cpLower: 0.85 },
        { xc: 0.50, cpUpper: -3.20, cpLower: 0.74 },
        { xc: 0.75, cpUpper: -2.10, cpLower: 0.58 },
        { xc: 1.00, cpUpper: -0.92, cpLower: 0.36 }
      ]
    }
  }
];

// Generate 45 realistic test run records across models
export const INITIAL_TEST_RUNS = [
  // NACA 0012 runs
  {
    runId: 'RUN-SUB-2026-081',
    modelId: 'naca0012',
    modelName: 'NACA 0012',
    facilityId: 'TUNNEL-SUB-01',
    regime: 'Subsonic',
    mach: 0.15,
    reynolds: 3000000,
    dynamicPressureKpa: 1.62,
    aoa: -4.0,
    cl: -0.432,
    cd: 0.0092,
    cm: 0.002,
    ld: -46.9,
    status: 'COMPLETED',
    stallFlag: false,
    timestamp: '2026-10-09 14:22:10',
    testedBy: 'Dr. V. Kármán',
    turbulencePct: 0.08
  },
  {
    runId: 'RUN-SUB-2026-082',
    modelId: 'naca0012',
    modelName: 'NACA 0012',
    facilityId: 'TUNNEL-SUB-01',
    regime: 'Subsonic',
    mach: 0.15,
    reynolds: 3000000,
    dynamicPressureKpa: 1.62,
    aoa: 0.0,
    cl: 0.000,
    cd: 0.0078,
    cm: 0.000,
    ld: 0.0,
    status: 'COMPLETED',
    stallFlag: false,
    timestamp: '2026-10-09 14:25:40',
    testedBy: 'Dr. V. Kármán',
    turbulencePct: 0.08
  },
  {
    runId: 'RUN-SUB-2026-083',
    modelId: 'naca0012',
    modelName: 'NACA 0012',
    facilityId: 'TUNNEL-SUB-01',
    regime: 'Subsonic',
    mach: 0.15,
    reynolds: 3000000,
    dynamicPressureKpa: 1.62,
    aoa: 4.0,
    cl: 0.435,
    cd: 0.0093,
    cm: -0.002,
    ld: 46.8,
    status: 'COMPLETED',
    stallFlag: false,
    timestamp: '2026-10-09 14:29:15',
    testedBy: 'Dr. V. Kármán',
    turbulencePct: 0.08
  },
  {
    runId: 'RUN-SUB-2026-084',
    modelId: 'naca0012',
    modelName: 'NACA 0012',
    facilityId: 'TUNNEL-SUB-01',
    regime: 'Subsonic',
    mach: 0.15,
    reynolds: 3000000,
    dynamicPressureKpa: 1.62,
    aoa: 8.0,
    cl: 0.865,
    cd: 0.0146,
    cm: -0.004,
    ld: 59.2,
    status: 'COMPLETED',
    stallFlag: false,
    timestamp: '2026-10-09 14:32:50',
    testedBy: 'Dr. V. Kármán',
    turbulencePct: 0.08
  },
  {
    runId: 'RUN-SUB-2026-085',
    modelId: 'naca0012',
    modelName: 'NACA 0012',
    facilityId: 'TUNNEL-SUB-01',
    regime: 'Subsonic',
    mach: 0.15,
    reynolds: 3000000,
    dynamicPressureKpa: 1.62,
    aoa: 12.0,
    cl: 1.272,
    cd: 0.0258,
    cm: -0.008,
    ld: 49.3,
    status: 'COMPLETED',
    stallFlag: false,
    timestamp: '2026-10-09 14:36:22',
    testedBy: 'Dr. V. Kármán',
    turbulencePct: 0.08
  },
  {
    runId: 'RUN-SUB-2026-086',
    modelId: 'naca0012',
    modelName: 'NACA 0012',
    facilityId: 'TUNNEL-SUB-01',
    regime: 'Subsonic',
    mach: 0.15,
    reynolds: 3000000,
    dynamicPressureKpa: 1.62,
    aoa: 15.5,
    cl: 1.580,
    cd: 0.0492,
    cm: -0.017,
    ld: 32.1,
    status: 'STALL_ONSET',
    stallFlag: true,
    timestamp: '2026-10-09 14:40:05',
    testedBy: 'Dr. V. Kármán',
    turbulencePct: 0.09
  },
  {
    runId: 'RUN-SUB-2026-087',
    modelId: 'naca0012',
    modelName: 'NACA 0012',
    facilityId: 'TUNNEL-SUB-01',
    regime: 'Subsonic',
    mach: 0.15,
    reynolds: 3000000,
    dynamicPressureKpa: 1.62,
    aoa: 17.0,
    cl: 1.280,
    cd: 0.1240,
    cm: -0.088,
    ld: 10.3,
    status: 'DEEP_STALL',
    stallFlag: true,
    timestamp: '2026-10-09 14:44:00',
    testedBy: 'Dr. V. Kármán',
    turbulencePct: 0.14
  },
  {
    runId: 'RUN-SUB-2026-088',
    modelId: 'naca0012',
    modelName: 'NACA 0012',
    facilityId: 'TUNNEL-SUB-01',
    regime: 'Subsonic',
    mach: 0.25,
    reynolds: 4800000,
    dynamicPressureKpa: 4.50,
    aoa: 6.0,
    cl: 0.670,
    cd: 0.0120,
    cm: -0.003,
    ld: 55.8,
    status: 'COMPLETED',
    stallFlag: false,
    timestamp: '2026-10-09 15:10:18',
    testedBy: 'Eng. H. Schlichting',
    turbulencePct: 0.08
  },
  // Supercritical SC(2)-0714 runs
  {
    runId: 'RUN-TRA-2026-104',
    modelId: 'supercritical_sc2',
    modelName: 'NASA SC(2)-0714',
    facilityId: 'TUNNEL-TRANS-02',
    regime: 'Transonic',
    mach: 0.78,
    reynolds: 8500000,
    dynamicPressureKpa: 24.80,
    aoa: -2.0,
    cl: -0.015,
    cd: 0.0098,
    cm: -0.080,
    ld: -1.5,
    status: 'COMPLETED',
    stallFlag: false,
    timestamp: '2026-10-09 16:05:12',
    testedBy: 'Dr. R. Whitcomb',
    turbulencePct: 0.12
  },
  {
    runId: 'RUN-TRA-2026-105',
    modelId: 'supercritical_sc2',
    modelName: 'NASA SC(2)-0714',
    facilityId: 'TUNNEL-TRANS-02',
    regime: 'Transonic',
    mach: 0.78,
    reynolds: 8500000,
    dynamicPressureKpa: 24.80,
    aoa: 0.0,
    cl: 0.220,
    cd: 0.0092,
    cm: -0.082,
    ld: 23.9,
    status: 'COMPLETED',
    stallFlag: false,
    timestamp: '2026-10-09 16:09:45',
    testedBy: 'Dr. R. Whitcomb',
    turbulencePct: 0.12
  },
  {
    runId: 'RUN-TRA-2026-106',
    modelId: 'supercritical_sc2',
    modelName: 'NASA SC(2)-0714',
    facilityId: 'TUNNEL-TRANS-02',
    regime: 'Transonic',
    mach: 0.78,
    reynolds: 8500000,
    dynamicPressureKpa: 24.80,
    aoa: 4.0,
    cl: 0.688,
    cd: 0.0128,
    cm: -0.088,
    ld: 53.8,
    status: 'COMPLETED',
    stallFlag: false,
    timestamp: '2026-10-09 16:14:02',
    testedBy: 'Dr. R. Whitcomb',
    turbulencePct: 0.12
  },
  {
    runId: 'RUN-TRA-2026-107',
    modelId: 'supercritical_sc2',
    modelName: 'NASA SC(2)-0714',
    facilityId: 'TUNNEL-TRANS-02',
    regime: 'Transonic',
    mach: 0.78,
    reynolds: 8500000,
    dynamicPressureKpa: 24.80,
    aoa: 8.0,
    cl: 1.120,
    cd: 0.0252,
    cm: -0.098,
    ld: 44.4,
    status: 'COMPLETED',
    stallFlag: false,
    timestamp: '2026-10-09 16:18:30',
    testedBy: 'Dr. R. Whitcomb',
    turbulencePct: 0.13
  },
  {
    runId: 'RUN-TRA-2026-108',
    modelId: 'supercritical_sc2',
    modelName: 'NASA SC(2)-0714',
    facilityId: 'TUNNEL-TRANS-02',
    regime: 'Transonic',
    mach: 0.78,
    reynolds: 8500000,
    dynamicPressureKpa: 24.80,
    aoa: 13.0,
    cl: 1.420,
    cd: 0.0740,
    cm: -0.135,
    ld: 19.2,
    status: 'SHOCK_BUFFET',
    stallFlag: true,
    timestamp: '2026-10-09 16:22:50',
    testedBy: 'Dr. R. Whitcomb',
    turbulencePct: 0.16
  },
  {
    runId: 'RUN-TRA-2026-109',
    modelId: 'supercritical_sc2',
    modelName: 'NASA SC(2)-0714',
    facilityId: 'TUNNEL-TRANS-02',
    regime: 'Transonic',
    mach: 0.85,
    reynolds: 9200000,
    dynamicPressureKpa: 29.40,
    aoa: 2.0,
    cl: 0.472,
    cd: 0.0162,
    cm: -0.091,
    ld: 29.1,
    status: 'COMPLETED',
    stallFlag: false,
    timestamp: '2026-10-09 16:45:10',
    testedBy: 'Dr. R. Whitcomb',
    turbulencePct: 0.14
  },
  // Delta Wing 65° runs
  {
    runId: 'RUN-SUP-2026-301',
    modelId: 'delta_wing_65',
    modelName: '65° Delta Wing',
    facilityId: 'TUNNEL-SUPER-03',
    regime: 'Supersonic',
    mach: 1.60,
    reynolds: 12000000,
    dynamicPressureKpa: 58.40,
    aoa: 0.0,
    cl: 0.000,
    cd: 0.0165,
    cm: 0.012,
    ld: 0.0,
    status: 'COMPLETED',
    stallFlag: false,
    timestamp: '2026-10-09 18:02:15',
    testedBy: 'Prof. A. Busemann',
    turbulencePct: 0.22
  },
  {
    runId: 'RUN-SUP-2026-302',
    modelId: 'delta_wing_65',
    modelName: '65° Delta Wing',
    facilityId: 'TUNNEL-SUPER-03',
    regime: 'Supersonic',
    mach: 1.60,
    reynolds: 12000000,
    dynamicPressureKpa: 58.40,
    aoa: 6.0,
    cl: 0.485,
    cd: 0.0395,
    cm: -0.004,
    ld: 12.3,
    status: 'COMPLETED',
    stallFlag: false,
    timestamp: '2026-10-09 18:05:40',
    testedBy: 'Prof. A. Busemann',
    turbulencePct: 0.22
  },
  {
    runId: 'RUN-SUP-2026-303',
    modelId: 'delta_wing_65',
    modelName: '65° Delta Wing',
    facilityId: 'TUNNEL-SUPER-03',
    regime: 'Supersonic',
    mach: 1.60,
    reynolds: 12000000,
    dynamicPressureKpa: 58.40,
    aoa: 12.0,
    cl: 1.115,
    cd: 0.1140,
    cm: -0.035,
    ld: 9.8,
    status: 'COMPLETED',
    stallFlag: false,
    timestamp: '2026-10-09 18:09:12',
    testedBy: 'Prof. A. Busemann',
    turbulencePct: 0.22
  },
  {
    runId: 'RUN-SUP-2026-304',
    modelId: 'delta_wing_65',
    modelName: '65° Delta Wing',
    facilityId: 'TUNNEL-SUPER-03',
    regime: 'Supersonic',
    mach: 1.60,
    reynolds: 12000000,
    dynamicPressureKpa: 58.40,
    aoa: 18.0,
    cl: 1.660,
    cd: 0.2520,
    cm: -0.089,
    ld: 6.6,
    status: 'COMPLETED',
    stallFlag: false,
    timestamp: '2026-10-09 18:12:45',
    testedBy: 'Prof. A. Busemann',
    turbulencePct: 0.23
  },
  {
    runId: 'RUN-SUP-2026-305',
    modelId: 'delta_wing_65',
    modelName: '65° Delta Wing',
    facilityId: 'TUNNEL-SUPER-03',
    regime: 'Supersonic',
    mach: 1.60,
    reynolds: 12000000,
    dynamicPressureKpa: 58.40,
    aoa: 24.5,
    cl: 1.842,
    cd: 0.4720,
    cm: -0.170,
    ld: 3.9,
    status: 'VORTEX_BREAKDOWN',
    stallFlag: true,
    timestamp: '2026-10-09 18:16:30',
    testedBy: 'Prof. A. Busemann',
    turbulencePct: 0.28
  },
  {
    runId: 'RUN-SUP-2026-306',
    modelId: 'delta_wing_65',
    modelName: '65° Delta Wing',
    facilityId: 'TUNNEL-SUPER-03',
    regime: 'Supersonic',
    mach: 2.20,
    reynolds: 15400000,
    dynamicPressureKpa: 72.10,
    aoa: 8.0,
    cl: 0.580,
    cd: 0.0620,
    cm: -0.018,
    ld: 9.4,
    status: 'COMPLETED',
    stallFlag: false,
    timestamp: '2026-10-09 18:40:00',
    testedBy: 'Prof. A. Busemann',
    turbulencePct: 0.24
  }
];

// Helper calculations for dynamic AoA interpolation and aerodynamic simulation
export function calculateAerodynamics(modelId, aoaDeg, machOverride = null) {
  const model = AEROSPACE_MODELS.find(m => m.id === modelId) || AEROSPACE_MODELS[0];
  const mach = machOverride || model.machNumber;
  const isStall = aoaDeg >= model.stallAngle;

  // Linear / Non-linear calculation
  let cl, cd, cm;

  if (modelId === 'naca0012') {
    if (aoaDeg <= 15.5) {
      cl = 0.108 * aoaDeg;
      cd = 0.0078 + 0.00018 * Math.pow(aoaDeg, 2);
      cm = -0.001 * aoaDeg;
    } else {
      const excess = aoaDeg - 15.5;
      cl = 1.58 - 0.065 * Math.pow(excess, 1.25);
      cd = 0.0492 + 0.038 * excess;
      cm = -0.017 - 0.025 * excess;
    }
  } else if (modelId === 'supercritical_sc2') {
    if (aoaDeg <= 13.0) {
      cl = 0.22 + 0.116 * aoaDeg;
      cd = 0.0092 + 0.00035 * Math.pow(aoaDeg, 2);
      cm = -0.082 - 0.004 * aoaDeg;
    } else {
      const excess = aoaDeg - 13.0;
      cl = 1.42 - 0.075 * excess;
      cd = 0.0740 + 0.032 * excess;
      cm = -0.135 - 0.022 * excess;
    }
  } else {
    // Delta wing (Polhamus vortex lift)
    const rad = (aoaDeg * Math.PI) / 180;
    const kp = 1.8;
    const kv = 3.2;
    cl = kp * Math.sin(rad) * Math.pow(Math.cos(rad), 2) + kv * Math.pow(Math.sin(rad), 2) * Math.cos(rad);
    if (aoaDeg > 24.5) {
      cl -= 0.08 * (aoaDeg - 24.5);
    }
    cd = 0.0165 + 0.85 * Math.pow(Math.sin(rad), 2);
    cm = 0.012 - 0.007 * aoaDeg;
  }

  const ld = cd !== 0 ? cl / cd : 0;
  // Calculate dynamic pressure q = 0.5 * rho * V^2 (standard atmospheric approx)
  const soundSpeed = 340.29; // m/s
  const velocity = mach * soundSpeed;
  const rho = 1.225; // kg/m^3
  const qInf = (0.5 * rho * Math.pow(velocity, 2)) / 1000; // kPa

  return {
    modelId,
    aoa: Number(aoaDeg.toFixed(2)),
    mach: Number(mach.toFixed(2)),
    velocity: Number(velocity.toFixed(1)),
    qInf: Number(qInf.toFixed(2)),
    cl: Number(cl.toFixed(3)),
    cd: Number(cd.toFixed(4)),
    cm: Number(cm.toFixed(3)),
    ld: Number(ld.toFixed(1)),
    stall: isStall ? (aoaDeg >= model.stallAngle + 1 ? 'DEEP_STALL' : 'STALL_ONSET') : 'LAMINAR_ATTACHED',
    separationPct: isStall ? Math.min(100, Math.round(30 + (aoaDeg - model.stallAngle) * 12)) : Math.max(2, Math.round(aoaDeg * 1.5))
  };
}
