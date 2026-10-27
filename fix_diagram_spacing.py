import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Circle, Polygon, Arc
import numpy as np

os.makedirs('report_assets', exist_ok=True)

# -----------------------------------------------------------------------------
# 1. FIGURE 4.1: SYSTEM ARCHITECTURE (PAGE 12) - FIXED SPACING & TYPOGRAPHY
# -----------------------------------------------------------------------------
def generate_architecture_diagram():
    # Larger canvas with ample breathing room so text never overlaps
    fig, ax = plt.subplots(figsize=(10.0, 7.2), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')
    fig.patch.set_facecolor('white')

    # Main Header
    ax.text(50, 97.5, 'Aerospace Wind Tunnel Platform -- System Architecture',
            fontsize=13, fontweight='bold', ha='center', va='center', color='#0F172A')
    ax.text(50, 94.8, 'Modular MERN & Micro-Physics Engine with Real-Time Telemetry and MongoDB Persistence',
            fontsize=9, fontstyle='italic', ha='center', va='center', color='#475569')

    # ---------------------------------------------------------
    # Layer 1: Presentation Layer
    # ---------------------------------------------------------
    l1 = FancyBboxPatch((3, 72), 94, 20, boxstyle="round,pad=0.5", fc='#F0F9FF', ec='#0284C7', lw=1.5)
    ax.add_patch(l1)
    ax.text(5, 89.5, '1. PRESENTATION LAYER (React 18 + Vite SPA)',
            fontsize=9.5, fontweight='bold', va='center', color='#0369A1')

    # Card 1.1
    b1_1 = FancyBboxPatch((5, 73.5), 28, 14, boxstyle="round,pad=0.4", fc='#FFFFFF', ec='#38BDF8', lw=1.2)
    ax.add_patch(b1_1)
    ax.text(19, 85.5, 'Mission Control Dashboard', fontsize=8.5, fontweight='bold', ha='center', va='center', color='#0C4A6E')
    txt_1_1 = "• Live AoA, Mach & Re Gauges\n• Dynamic AoA Sweep Controller\n• Real-Time Stream Status & SCRAM"
    ax.text(6.5, 82.5, txt_1_1, fontsize=7.2, va='top', ha='left', color='#334155', linespacing=1.4)

    # Card 1.2
    b1_2 = FancyBboxPatch((36, 73.5), 28, 14, boxstyle="round,pad=0.4", fc='#FFFFFF', ec='#38BDF8', lw=1.2)
    ax.add_patch(b1_2)
    ax.text(50, 85.5, 'Three.js 3D Wind Tunnel Viewport', fontsize=8.5, fontweight='bold', ha='center', va='center', color='#0C4A6E')
    txt_1_2 = "• Dynamic NACA Airfoil Mesh\n• Particle Rake & Streamlines\n• Flow Separation & Stall Shader"
    ax.text(37.5, 82.5, txt_1_2, fontsize=7.2, va='top', ha='left', color='#334155', linespacing=1.4)

    # Card 1.3
    b1_3 = FancyBboxPatch((67, 73.5), 28, 14, boxstyle="round,pad=0.4", fc='#FFFFFF', ec='#38BDF8', lw=1.2)
    ax.add_patch(b1_3)
    ax.text(81, 85.5, 'Aerodynamics Analytics Suite', fontsize=8.5, fontweight='bold', ha='center', va='center', color='#0C4A6E')
    txt_1_3 = "• Polar Charts (CL vs AoA, Drag, L/D)\n• Pressure Distribution (Cp chord)\n• PDF Dossier & CSV Run Exporter"
    ax.text(68.5, 82.5, txt_1_3, fontsize=7.2, va='top', ha='left', color='#334155', linespacing=1.4)

    # Comm link 1 -> 2
    ax.annotate('', xy=(50, 68), xytext=(50, 72),
                arrowprops=dict(arrowstyle="<->", color="#0284C7", lw=1.8))
    ax.text(50, 70, 'REST API (HTTP) / WebSocket Telemetry Events',
            fontsize=7.2, color='#0284C7', fontweight='bold', ha='center', va='center',
            bbox=dict(boxstyle="square,pad=0.1", fc="white", ec="none"))

    # ---------------------------------------------------------
    # Layer 2: Backend API & Middleware Pipeline
    # ---------------------------------------------------------
    l2 = FancyBboxPatch((3, 47), 94, 20, boxstyle="round,pad=0.5", fc='#F8FAFC', ec='#475569', lw=1.5)
    ax.add_patch(l2)
    ax.text(5, 64.5, '2. BACKEND API & MIDDLEWARE PIPELINE (Node.js & Express 4)',
            fontsize=9.5, fontweight='bold', va='center', color='#1E293B')

    b2_1 = FancyBboxPatch((5, 48.5), 28, 14, boxstyle="round,pad=0.4", fc='#FFFFFF', ec='#94A3B8', lw=1.2)
    ax.add_patch(b2_1)
    ax.text(19, 60.5, 'Security & Auth Guards', fontsize=8.5, fontweight='bold', ha='center', va='center', color='#0F172A')
    txt_2_1 = "• JWT Bearer Token Middleware\n• 4-Tier RBAC Access Control\n• Bcrypt Salt Password Hashes\n• Rate-Limiting Protection"
    ax.text(6.5, 57.5, txt_2_1, fontsize=7.0, va='top', ha='left', color='#334155', linespacing=1.35)

    b2_2 = FancyBboxPatch((36, 48.5), 28, 14, boxstyle="round,pad=0.4", fc='#FFFFFF', ec='#94A3B8', lw=1.2)
    ax.add_patch(b2_2)
    ax.text(50, 60.5, 'REST API Route Controllers', fontsize=8.5, fontweight='bold', ha='center', va='center', color='#0F172A')
    txt_2_2 = "• /api/auth (Login, Register)\n• /api/runs (Telemetry & Runs)\n• /api/models (Airfoil Profiles)\n• /api/facility (Sensors & SCRAM)"
    ax.text(37.5, 57.5, txt_2_2, fontsize=7.0, va='top', ha='left', color='#334155', linespacing=1.35)

    b2_3 = FancyBboxPatch((67, 48.5), 28, 14, boxstyle="round,pad=0.4", fc='#FFFFFF', ec='#94A3B8', lw=1.2)
    ax.add_patch(b2_3)
    ax.text(81, 60.5, 'Data Pipeline & Export Engine', fontsize=8.5, fontweight='bold', ha='center', va='center', color='#0F172A')
    txt_2_3 = "• CSV & JSON Stream Serializers\n• PDF Dossier Certificate Generator\n• CORS & Sanitization Middleware\n• Centralized Error Trapping"
    ax.text(68.5, 57.5, txt_2_3, fontsize=7.0, va='top', ha='left', color='#334155', linespacing=1.35)

    # Comm link 2 -> 3
    ax.annotate('', xy=(50, 43), xytext=(50, 47),
                arrowprops=dict(arrowstyle="<->", color="#475569", lw=1.8))
    ax.text(50, 45, 'In-Process Micro-Physics Execution Engine',
            fontsize=7.2, color='#475569', fontweight='bold', ha='center', va='center',
            bbox=dict(boxstyle="square,pad=0.1", fc="white", ec="none"))

    # ---------------------------------------------------------
    # Layer 3: Aerodynamics Calculation & Telemetry Engine
    # ---------------------------------------------------------
    l3 = FancyBboxPatch((3, 22), 94, 20, boxstyle="round,pad=0.5", fc='#FEF3C7', ec='#D97706', lw=1.5)
    ax.add_patch(l3)
    ax.text(5, 39.5, '3. AERODYNAMICS CALCULATION & TELEMETRY ENGINE (Node.js)',
            fontsize=9.5, fontweight='bold', va='center', color='#B45309')

    b3_1 = FancyBboxPatch((5, 23.5), 28, 14, boxstyle="round,pad=0.4", fc='#FFFFFF', ec='#FBBF24', lw=1.2)
    ax.add_patch(b3_1)
    ax.text(19, 35.5, 'Aerodynamic Polar Engine', fontsize=8.5, fontweight='bold', ha='center', va='center', color='#92400E')
    txt_3_1 = "• Thin-Airfoil Theory & Camber\n• Dynamic Stall (alpha > alpha_stall)\n• Induced & Profile Drag Polar (CD)\n• Moment Coeff (Cm,ac & Center-P)"
    ax.text(6.5, 32.5, txt_3_1, fontsize=7.0, va='top', ha='left', color='#78350F', linespacing=1.35)

    b3_2 = FancyBboxPatch((36, 23.5), 28, 14, boxstyle="round,pad=0.4", fc='#FFFFFF', ec='#FBBF24', lw=1.2)
    ax.add_patch(b3_2)
    ax.text(50, 35.5, 'Pressure Distribution (Cp)', fontsize=8.5, fontweight='bold', ha='center', va='center', color='#92400E')
    txt_3_2 = "• 20-Point Chord Discrete Model\n• Suction Peak / Stagnation Point\n• Dynamic Pressure Q = 0.5*rho*V^2\n• Atmospheric ISA Model Correction"
    ax.text(37.5, 32.5, txt_3_2, fontsize=7.0, va='top', ha='left', color='#78350F', linespacing=1.35)

    b3_3 = FancyBboxPatch((67, 23.5), 28, 14, boxstyle="round,pad=0.4", fc='#FFFFFF', ec='#FBBF24', lw=1.2)
    ax.add_patch(b3_3)
    ax.text(81, 35.5, 'Automated AoA Sweep Engine', fontsize=8.5, fontweight='bold', ha='center', va='center', color='#92400E')
    txt_3_3 = "• Discrete Stepper (-10 deg to +25 deg)\n• 10Hz High-Speed Data Sampling\n• Sensor Calibration Matrix\n• Real-Time Run Time-Series Buffer"
    ax.text(68.5, 32.5, txt_3_3, fontsize=7.0, va='top', ha='left', color='#78350F', linespacing=1.35)

    # Comm link 3 -> 4
    ax.annotate('', xy=(50, 18), xytext=(50, 22),
                arrowprops=dict(arrowstyle="<->", color="#D97706", lw=1.8))
    ax.text(50, 20, 'Mongoose ODM Schema Validation & Compound Queries',
            fontsize=7.2, color='#D97706', fontweight='bold', ha='center', va='center',
            bbox=dict(boxstyle="square,pad=0.1", fc="white", ec="none"))

    # ---------------------------------------------------------
    # Layer 4: Persistence Layer (MongoDB)
    # ---------------------------------------------------------
    l4 = FancyBboxPatch((3, 2), 94, 15, boxstyle="round,pad=0.5", fc='#F0FDF4', ec='#16A34A', lw=1.5)
    ax.add_patch(l4)
    ax.text(5, 14.5, '4. PERSISTENCE & DATA STORAGE LAYER (MongoDB Community v9.0)',
            fontsize=9.5, fontweight='bold', va='center', color='#15803D')

    b4_1 = FancyBboxPatch((5, 3.5), 21.5, 9.5, boxstyle="round,pad=0.3", fc='#FFFFFF', ec='#86EFAC', lw=1)
    ax.add_patch(b4_1)
    ax.text(15.75, 11.2, 'Users Collection', fontsize=7.8, fontweight='bold', ha='center', va='center', color='#166534')
    ax.text(6.5, 9.2, '• Credentials & Roles\n• Access Tokens\n• Audit Timestamps', fontsize=6.8, va='top', ha='left', color='#334155', linespacing=1.3)

    b4_2 = FancyBboxPatch((28.5, 3.5), 21.5, 9.5, boxstyle="round,pad=0.3", fc='#FFFFFF', ec='#86EFAC', lw=1)
    ax.add_patch(b4_2)
    ax.text(39.25, 11.2, 'Airfoil Models', fontsize=7.8, fontweight='bold', ha='center', va='center', color='#166534')
    ax.text(30.0, 9.2, '• NACA Coordinates\n• Chord & Span Specs\n• Theoretical Polars', fontsize=6.8, va='top', ha='left', color='#334155', linespacing=1.3)

    b4_3 = FancyBboxPatch((52, 3.5), 21.5, 9.5, boxstyle="round,pad=0.3", fc='#FFFFFF', ec='#86EFAC', lw=1)
    ax.add_patch(b4_3)
    ax.text(62.75, 11.2, 'Test Runs Collection', fontsize=7.8, fontweight='bold', ha='center', va='center', color='#166534')
    ax.text(53.5, 9.2, '• High-Rate Time-Series\n• AoA Sweep Swept Data\n• Force & Moment Logs', fontsize=6.8, va='top', ha='left', color='#334155', linespacing=1.3)

    b4_4 = FancyBboxPatch((75.5, 3.5), 20.5, 9.5, boxstyle="round,pad=0.3", fc='#FFFFFF', ec='#86EFAC', lw=1)
    ax.add_patch(b4_4)
    ax.text(85.75, 11.2, 'Facility Calibration', fontsize=7.8, fontweight='bold', ha='center', va='center', color='#166534')
    ax.text(77.0, 9.2, '• Pitot-Static Zero-Offsets\n• Balance Tare Offsets\n• SCRAM Safety Logs', fontsize=6.8, va='top', ha='left', color='#334155', linespacing=1.3)

    plt.tight_layout()
    plt.savefig('report_assets/fig_4_1_architecture.png', dpi=300, facecolor='white', bbox_inches='tight')
    plt.close()
    print("Re-generated fig_4_1_architecture.png with clean typography and spacing.")


# -----------------------------------------------------------------------------
# 2. FIGURE 4.2: UML CLASS DIAGRAM (PAGE 14) - FIXED SPACING & TYPOGRAPHY
# -----------------------------------------------------------------------------
def generate_class_diagram():
    # Larger canvas with separated boxes and explicit line placement
    fig, ax = plt.subplots(figsize=(10.0, 7.2), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')
    fig.patch.set_facecolor('white')

    ax.text(50, 97.5, 'Aerospace Wind Tunnel Platform -- UML Class Diagram',
            fontsize=13, fontweight='bold', ha='center', va='center', color='#0F172A')
    ax.text(50, 94.8, 'Structural Data Model & Domain Entities with Attributes, Methods, and Mongoose Associations',
            fontsize=9, fontstyle='italic', ha='center', va='center', color='#475569')

    # Row 1 Classes (Top: y=50 to 91)
    # Class 1: User
    c1 = FancyBboxPatch((3, 50), 28, 41, boxstyle="round,pad=0.3", fc='#EFF6FF', ec='#2563EB', lw=1.5)
    ax.add_patch(c1)
    # Header bar
    h1 = FancyBboxPatch((3, 85), 28, 6, boxstyle="round,pad=0.2", fc='#2563EB', ec='none')
    ax.add_patch(h1)
    ax.text(17, 88, 'User', fontsize=9.5, fontweight='bold', ha='center', va='center', color='white')

    u_attrs = "- _id: ObjectId\n- name: String\n- email: String (unique)\n- password: String (hash)\n- role: Enum(Director, Aero,\n         Operator, Observer)\n- facilityAccess: [String]\n- isActive: Boolean\n- createdAt: Date"
    ax.text(4.5, 83.5, u_attrs, fontsize=6.8, fontfamily='monospace', va='top', ha='left', color='#1E293B', linespacing=1.35)

    ax.plot([3.5, 30.5], [64, 64], color='#93C5FD', lw=1)

    u_methods = "+ registerUser(): Token\n+ loginUser(): Token\n+ matchPassword(): Boolean\n+ hasPermission(): Boolean"
    ax.text(4.5, 62.5, u_methods, fontsize=6.8, fontfamily='monospace', va='top', ha='left', color='#1E293B', linespacing=1.35)

    # Class 2: AirfoilModel
    c2 = FancyBboxPatch((36, 50), 28, 41, boxstyle="round,pad=0.3", fc='#F0FDF4', ec='#16A34A', lw=1.5)
    ax.add_patch(c2)
    h2 = FancyBboxPatch((36, 85), 28, 6, boxstyle="round,pad=0.2", fc='#16A34A', ec='none')
    ax.add_patch(h2)
    ax.text(50, 88, 'AirfoilModel', fontsize=9.5, fontweight='bold', ha='center', va='center', color='white')

    m_attrs = "- _id: ObjectId\n- designation: String\n- family: Enum(NACA4, 5, Super)\n- chordLength: Number (m)\n- wingSpan: Number (m)\n- camberMax: Number (%c)\n- thicknessRatio: Number (%c)\n- coordinates: [{x, y}]"
    ax.text(37.5, 83.5, m_attrs, fontsize=6.8, fontfamily='monospace', va='top', ha='left', color='#1E293B', linespacing=1.35)

    ax.plot([36.5, 63.5], [64, 64], color='#86EFAC', lw=1)

    m_methods = "+ computePolars(aoa, Re): Obj\n+ computeCpDistribution(): Arr\n+ checkStallCondition(): Bool\n+ exportGeometryDXF(): Buffer"
    ax.text(37.5, 62.5, m_methods, fontsize=6.8, fontfamily='monospace', va='top', ha='left', color='#1E293B', linespacing=1.35)

    # Class 3: TestRun
    c3 = FancyBboxPatch((69, 50), 28, 41, boxstyle="round,pad=0.3", fc='#FFFBEB', ec='#D97706', lw=1.5)
    ax.add_patch(c3)
    h3 = FancyBboxPatch((69, 85), 28, 6, boxstyle="round,pad=0.2", fc='#D97706', ec='none')
    ax.add_patch(h3)
    ax.text(83, 88, 'TestRun', fontsize=9.5, fontweight='bold', ha='center', va='center', color='white')

    r_attrs = "- _id: ObjectId\n- runId: String (unique)\n- engineerId: ObjectId (User)\n- modelId: ObjectId (Airfoil)\n- windSpeed: Number (m/s)\n- machNumber: Number\n- reynoldsNumber: Number\n- sweepStatus: Enum"
    ax.text(70.5, 83.5, r_attrs, fontsize=6.8, fontfamily='monospace', va='top', ha='left', color='#1E293B', linespacing=1.35)

    ax.plot([69.5, 96.5], [64, 64], color='#FDE68A', lw=1)

    r_methods = "+ startTelemetryStream(): void\n+ executeAoaSweep(): Data\n+ calculateAeroCoeffs(): Obj\n+ triggerEmergencySCRAM(): void"
    ax.text(70.5, 62.5, r_methods, fontsize=6.8, fontfamily='monospace', va='top', ha='left', color='#1E293B', linespacing=1.35)

    # Associations
    ax.annotate('', xy=(69, 73), xytext=(31, 73), arrowprops=dict(arrowstyle="->", color="#475569", lw=1.5))
    ax.text(33.5, 74.5, 'executes 1..*', fontsize=7, color='#1E40AF', fontweight='bold')

    ax.annotate('', xy=(69, 68), xytext=(64, 68), arrowprops=dict(arrowstyle="->", color="#475569", lw=1.5))
    ax.text(64.5, 69.5, 'evaluates', fontsize=7, color='#166534', fontweight='bold')

    # Row 2 Classes (Bottom: y=3 to 44)
    # Class 4: TelemetryPoint
    c4 = FancyBboxPatch((3, 3), 28, 41, boxstyle="round,pad=0.3", fc='#FDF2F8', ec='#DB2777', lw=1.5)
    ax.add_patch(c4)
    h4 = FancyBboxPatch((3, 38), 28, 6, boxstyle="round,pad=0.2", fc='#DB2777', ec='none')
    ax.add_patch(h4)
    ax.text(17, 41, 'TelemetryPoint', fontsize=9.5, fontweight='bold', ha='center', va='center', color='white')

    t_attrs = "- _id: ObjectId\n- runId: ObjectId (TestRun)\n- timestamp: Number (ms)\n- aoaDeg: Number\n- liftForce: Number (N)\n- dragForce: Number (N)\n- pitchingMoment: Number (Nm)\n- cL, cD, cM, lOverD: Number"
    ax.text(4.5, 36.5, t_attrs, fontsize=6.8, fontfamily='monospace', va='top', ha='left', color='#1E293B', linespacing=1.35)

    ax.plot([3.5, 30.5], [17, 17], color='#FBCFE8', lw=1)

    t_methods = "+ normalizeForces(): void\n+ checkBalanceSafety(): Bool\n+ computeLocalVorticity(): Num"
    ax.text(4.5, 15.5, t_methods, fontsize=6.8, fontfamily='monospace', va='top', ha='left', color='#1E293B', linespacing=1.35)

    # Class 5: PressureTapArray
    c5 = FancyBboxPatch((36, 3), 28, 41, boxstyle="round,pad=0.3", fc='#FAF5FF', ec='#9333EA', lw=1.5)
    ax.add_patch(c5)
    h5 = FancyBboxPatch((36, 38), 28, 6, boxstyle="round,pad=0.2", fc='#9333EA', ec='none')
    ax.add_patch(h5)
    ax.text(50, 41, 'PressureTapArray', fontsize=9.5, fontweight='bold', ha='center', va='center', color='white')

    p_attrs = "- _id: ObjectId\n- runId: ObjectId (TestRun)\n- tapCount: Number (20)\n- chordPositions: [Number]\n- upperSurfaceCp: [Number]\n- lowerSurfaceCp: [Number]\n- netPressureLift: Number"
    ax.text(37.5, 36.5, p_attrs, fontsize=6.8, fontfamily='monospace', va='top', ha='left', color='#1E293B', linespacing=1.35)

    ax.plot([36.5, 63.5], [17, 17], color='#E9D5FF', lw=1)

    p_methods = "+ integratePressure(): Num\n+ locateSuctionPeak(): Obj\n+ detectSeparation(): Bool"
    ax.text(37.5, 15.5, p_methods, fontsize=6.8, fontfamily='monospace', va='top', ha='left', color='#1E293B', linespacing=1.35)

    # Class 6: FacilityCalibration
    c6 = FancyBboxPatch((69, 3), 28, 41, boxstyle="round,pad=0.3", fc='#F1F5F9', ec='#475569', lw=1.5)
    ax.add_patch(c6)
    h6 = FancyBboxPatch((69, 38), 28, 6, boxstyle="round,pad=0.2", fc='#475569', ec='none')
    ax.add_patch(h6)
    ax.text(83, 41, 'FacilityCalibration', fontsize=9.5, fontweight='bold', ha='center', va='center', color='white')

    f_attrs = "- _id: ObjectId\n- tunnelSection: String\n- barometricPressure: Number\n- ambientTemperature: Number\n- airDensityRho: Number\n- balanceZeroOffset: [Number]\n- scramActive: Boolean"
    ax.text(70.5, 36.5, f_attrs, fontsize=6.8, fontfamily='monospace', va='top', ha='left', color='#1E293B', linespacing=1.35)

    ax.plot([69.5, 96.5], [17, 17], color='#CBD5E1', lw=1)

    f_methods = "+ applyTareZeroing(): void\n+ calculateDynamicQ(): Number\n+ auditFacilitySafety(): Obj"
    ax.text(70.5, 15.5, f_methods, fontsize=6.8, fontfamily='monospace', va='top', ha='left', color='#1E293B', linespacing=1.35)

    # Connections between TestRun and Sub-entities
    ax.annotate('', xy=(17, 44), xytext=(75, 50),
                arrowprops=dict(arrowstyle="->", color="#DB2777", lw=1.4, linestyle='--'))
    ax.text(32, 47, 'streams 1..* telemetry points', fontsize=6.8, color='#DB2777', fontweight='bold')

    ax.annotate('', xy=(50, 44), xytext=(81, 50),
                arrowprops=dict(arrowstyle="->", color="#9333EA", lw=1.4, linestyle='--'))
    ax.text(56, 45.5, 'samples 20 Cp taps', fontsize=6.8, color='#9333EA', fontweight='bold')

    ax.annotate('', xy=(83, 44), xytext=(83, 50),
                arrowprops=dict(arrowstyle="->", color="#475569", lw=1.4, linestyle='--'))
    ax.text(84, 46.5, 'calibrates', fontsize=6.8, color='#475569', fontweight='bold')

    plt.tight_layout()
    plt.savefig('report_assets/fig_4_2_class_diagram.png', dpi=300, facecolor='white', bbox_inches='tight')
    plt.close()
    print("Re-generated fig_4_2_class_diagram.png with clean typography and spacing.")


# -----------------------------------------------------------------------------
# 3. FIGURE 7: FACILITY CONTROL & EMERGENCY SCRAM (PAGE 37) - FIXED SPACING
# -----------------------------------------------------------------------------
def generate_facility_diagram():
    fig, ax = plt.subplots(figsize=(10.0, 6.2), dpi=300)
    fig.patch.set_facecolor('#070D18')
    ax.set_facecolor('#0B132B')
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Top Header
    hbar = FancyBboxPatch((3, 89), 94, 9, boxstyle="round,pad=0.3", fc='#0F172A', ec='#EF4444', lw=1.5)
    ax.add_patch(hbar)
    ax.text(6, 94.5, 'WIND TUNNEL FACILITY HARNESS & SCRAM SAFETY CONSOLE',
            color='#F87171', fontsize=9.5, fontweight='bold', va='center')
    ax.text(94, 94.5, 'STATUS: ENERVO-ARMED | INTERLOCK OK',
            color='#10B981', fontsize=8.0, fontfamily='monospace', ha='right', va='center')

    # 3 Status Indicator Panels (Middle: y=48 to 86)
    sec1 = FancyBboxPatch((3, 48), 29.5, 38, boxstyle="round,pad=0.4", fc='#0F172A', ec='#10B981', lw=1.4)
    ax.add_patch(sec1)
    ax.text(17.75, 81.5, 'COMPRESSOR / DRIVE FAN', color='#10B981', fontsize=8.5, fontweight='bold', ha='center', va='center')
    txt_s1 = "• Fan RPM: 1,840 RPM\n• Motor Power: 45.2 kW\n• Vibration: 0.12 mm/s\n• Bearing Temp: 42.1 °C\n• Settling Screens: CLEAN\n• Status: RUNNING LAMINAR"
    ax.text(5.5, 76.5, txt_s1, color='#F8FAFC', fontsize=7.2, fontfamily='monospace', va='top', ha='left', linespacing=1.4)

    sec2 = FancyBboxPatch((35.25, 48), 29.5, 38, boxstyle="round,pad=0.4", fc='#0F172A', ec='#38BDF8', lw=1.4)
    ax.add_patch(sec2)
    ax.text(50, 81.5, 'FORCE BALANCE LOAD CELLS', color='#38BDF8', fontsize=8.5, fontweight='bold', ha='center', va='center')
    txt_s2 = "• Lift Cell (L): 242.6 N\n• Drag Cell (D): 4.12 N\n• Pitching (M): -1.82 Nm\n• Tare Zero: CALIBRATED\n• Strain Bridge: BALANCED\n• Safety Margin: 82% NOMINAL"
    ax.text(37.5, 76.5, txt_s2, color='#F8FAFC', fontsize=7.2, fontfamily='monospace', va='top', ha='left', linespacing=1.4)

    sec3 = FancyBboxPatch((67.5, 48), 29.5, 38, boxstyle="round,pad=0.4", fc='#0F172A', ec='#F59E0B', lw=1.4)
    ax.add_patch(sec3)
    ax.text(82.25, 81.5, 'PITOT SENSOR CALIBRATION', color='#F59E0B', fontsize=8.5, fontweight='bold', ha='center', va='center')
    txt_s3 = "• Dynamic q: 1,240 Pa\n• Static P_inf: 101,325 Pa\n• Velocity: 45.0 m/s\n• Mach Number: 0.13\n• Ambient Temp: 288.15 K\n• Density rho: 1.225 kg/m3"
    ax.text(69.5, 76.5, txt_s3, color='#F8FAFC', fontsize=7.2, fontfamily='monospace', va='top', ha='left', linespacing=1.4)

    # Bottom Area: SCRAM Safety Command (y=4 to 44)
    scram_box = FancyBboxPatch((3, 4), 94, 40, boxstyle="round,pad=0.5", fc='#1E1B4B', ec='#DC2626', lw=1.8)
    ax.add_patch(scram_box)

    ax.text(50, 38.5, 'SAFETY INTERLOCK COMMAND & SYSTEM ABORT PROTOCOL',
            color='#F87171', fontsize=9.0, fontweight='bold', ha='center', va='center')
    ax.text(50, 33.5, 'Instantly shuts down drive motor, closes pneumatic test section gates, and logs emergency incident to MongoDB audit trail.',
            color='#CBD5E1', fontsize=7.2, ha='center', va='center')

    # Big Center SCRAM Button
    scram_btn = FancyBboxPatch((32, 9), 36, 18, boxstyle="round,pad=0.4", fc='#DC2626', ec='#FCA5A5', lw=2.5)
    ax.add_patch(scram_btn)
    ax.text(50, 19.5, 'EMERGENCY SCRAM', color='white', fontsize=12, fontweight='bold', ha='center', va='center')
    ax.text(50, 14.0, '[CLICK TO ABORT RUN]', color='#FEE2E2', fontsize=7.2, fontfamily='monospace', ha='center', va='center')

    plt.tight_layout()
    plt.savefig('report_assets/fig_7_facility.png', dpi=300, facecolor=fig.get_facecolor(), bbox_inches='tight')
    plt.close()
    print("Re-generated fig_7_facility.png with clean typography and spacing.")


# -----------------------------------------------------------------------------
# 4. FIGURE 8: ADMINISTRATIVE SECURITY & MONGODB DATABASE (PAGE 38) - FIXED SPACING
# -----------------------------------------------------------------------------
def generate_admin_diagram():
    fig, ax = plt.subplots(figsize=(10.0, 6.2), dpi=300)
    fig.patch.set_facecolor('#070D18')
    ax.set_facecolor('#0B132B')
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Header
    hbar = FancyBboxPatch((3, 89), 94, 9, boxstyle="round,pad=0.3", fc='#0F172A', ec='#A855F7', lw=1.5)
    ax.add_patch(hbar)
    ax.text(6, 94.5, 'ADMINISTRATIVE CONTROL PANEL & MONGODB DATABASE MANAGEMENT',
            color='#C084FC', fontsize=9.5, fontweight='bold', va='center')
    ax.text(94, 94.5, 'MONGODB v9.0 | PORT 27017 | STATUS: HEALTHY',
            color='#10B981', fontsize=8.0, fontfamily='monospace', ha='right', va='center')

    # 4 Metric Cards (y=67 to 86)
    db_metrics = [
        ('TOTAL TEST RUNS', '156 Runs', '#06B6D4'),
        ('DATABASE FOOTPRINT', '4.2 MB', '#10B981'),
        ('ACTIVE SESSIONS', '3 Connected', '#F59E0B'),
        ('CLUSTER ENGINE', 'WiredTiger v9.0', '#A855F7')
    ]
    for i, (title, val, col) in enumerate(db_metrics):
        bx = FancyBboxPatch((3 + i*24, 68), 22, 18, boxstyle="round,pad=0.3", fc='#0F172A', ec=col, lw=1.4)
        ax.add_patch(bx)
        ax.text(3 + i*24 + 11, 80.5, title, color='#94A3B8', fontsize=7.0, fontweight='bold', ha='center', va='center')
        ax.text(3 + i*24 + 11, 74.0, val, color='#F8FAFC', fontsize=10.0, fontweight='bold', ha='center', va='center')

    # Lower Table Box (y=4 to 64)
    tbox = FancyBboxPatch((3, 4), 94, 60, boxstyle="round,pad=0.5", fc='#0F172A', ec='#1E293B', lw=1.4)
    ax.add_patch(tbox)
    ax.text(6, 59.5, 'DATABASE COLLECTIONS & REINDEXING CONSOLE', color='#38BDF8', fontsize=8.8, fontweight='bold', va='center')

    # Table Header Row
    ax.plot([5, 95], [55, 55], color='#334155', lw=1)
    ax.text(7, 56.5, 'COLLECTION NAME', color='#94A3B8', fontsize=7.2, fontweight='bold', va='bottom')
    ax.text(32, 56.5, 'DOCUMENT COUNT', color='#94A3B8', fontsize=7.2, fontweight='bold', va='bottom')
    ax.text(54, 56.5, 'INDEX DEFINITIONS', color='#94A3B8', fontsize=7.2, fontweight='bold', va='bottom')
    ax.text(82, 56.5, 'HEALTH & REPLICATION', color='#94A3B8', fontsize=7.2, fontweight='bold', va='bottom')

    collections = [
        ('users', '4 Personnel Records', 'email_1 (unique), role_1', 'HEALTHY (0 lag)', '#10B981'),
        ('testruns', '156 Test Run Dossiers', 'runId_1 (unique), createdAt_-1', 'HEALTHY (0 lag)', '#10B981'),
        ('airfoilmodels', '4 NACA Airfoil Profiles', 'designation_1 (unique)', 'HEALTHY (0 lag)', '#10B981'),
        ('facilitylogs', '24 SCRAM / Calibration Logs', 'timestamp_-1, tunnelSection_1', 'HEALTHY (0 lag)', '#10B981')
    ]

    for i, (cname, ccount, cidx, cstat, scol) in enumerate(collections):
        y_pos = 48.0 - i * 7.5
        ax.text(7, y_pos, cname, color='#38BDF8', fontsize=7.2, fontfamily='monospace', va='center')
        ax.text(32, y_pos, ccount, color='#F8FAFC', fontsize=7.2, va='center')
        ax.text(54, y_pos, cidx, color='#CBD5E1', fontsize=6.8, fontfamily='monospace', va='center')
        ax.text(82, y_pos, cstat, color=scol, fontsize=7.2, fontweight='bold', va='center')

    # Action Buttons at Bottom (y=7 to 15)
    ax.plot([5, 95], [17, 17], color='#334155', lw=1)

    b1 = FancyBboxPatch((7, 7.5), 26, 7.5, boxstyle="round,pad=0.2", fc='#0284C7', ec='none')
    ax.add_patch(b1)
    ax.text(20, 11.25, 'TRIGGER BACKUP DUMP', color='white', fontsize=7.2, fontweight='bold', ha='center', va='center')

    b2 = FancyBboxPatch((37, 7.5), 26, 7.5, boxstyle="round,pad=0.2", fc='#15803D', ec='none')
    ax.add_patch(b2)
    ax.text(50, 11.25, 'REBUILD B-TREE INDEXES', color='white', fontsize=7.2, fontweight='bold', ha='center', va='center')

    b3 = FancyBboxPatch((67, 7.5), 26, 7.5, boxstyle="round,pad=0.2", fc='#B91C1C', ec='none')
    ax.add_patch(b3)
    ax.text(80, 11.25, 'PURGE AUDIT LOGS', color='white', fontsize=7.2, fontweight='bold', ha='center', va='center')

    plt.tight_layout()
    plt.savefig('report_assets/fig_8_admin.png', dpi=300, facecolor=fig.get_facecolor(), bbox_inches='tight')
    plt.close()
    print("Re-generated fig_8_admin.png with clean typography and spacing.")


if __name__ == '__main__':
    generate_architecture_diagram()
    generate_class_diagram()
    generate_facility_diagram()
    generate_admin_diagram()
    print("All diagrams on pages 12, 14, 37, 38 have been re-rendered cleanly!")
