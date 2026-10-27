import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Circle, Polygon, Arc
import numpy as np

os.makedirs('report_assets', exist_ok=True)

# -----------------------------------------------------------------------------
# 1. COLLEGE LOGO: Easwari Engineering College Seal
# -----------------------------------------------------------------------------
def generate_college_logo():
    fig, ax = plt.subplots(figsize=(4, 4), dpi=300)
    ax.set_xlim(-5, 5)
    ax.set_ylim(-5, 5)
    ax.axis('off')
    fig.patch.set_facecolor('white')

    # Outer double circle
    c_out1 = Circle((0, 0), 4.8, color='#0D3B66', fill=False, lw=3.5)
    c_out2 = Circle((0, 0), 4.6, color='#0D3B66', fill=False, lw=1.2)
    c_in1 = Circle((0, 0), 3.2, color='#0D3B66', fill=False, lw=1.5)
    c_in2 = Circle((0, 0), 3.0, color='#0D3B66', fill=False, lw=2.5)
    ax.add_patch(c_out1)
    ax.add_patch(c_out2)
    ax.add_patch(c_in1)
    ax.add_patch(c_in2)

    # Curved text approximation: EASWARI ENGINEERING COLLEGE at top
    ax.text(0, 3.8, 'EASWARI ENGINEERING COLLEGE', color='#0D3B66', fontsize=9.5,
            fontweight='bold', fontfamily='serif', ha='center', va='center')
    ax.text(0, -3.9, 'AUTONOMOUS', color='#0D3B66', fontsize=8,
            fontweight='bold', fontfamily='serif', ha='center', va='center')

    # Center background shield
    shield_box = patches.Rectangle((-1.8, -1.8), 3.6, 3.6, fc='#025955', ec='#F4D35E', lw=2.5)
    ax.add_patch(shield_box)

    # SRM Gold Emblem in center
    srm_box = patches.Rectangle((-1.2, -1.4), 2.4, 1.0, fc='#EE964B', ec='#F4D35E', lw=1.5)
    ax.add_patch(srm_box)
    ax.text(0, -0.9, 'SRM', color='white', fontsize=14, fontweight='bold', ha='center', va='center', fontfamily='sans-serif')

    # Temple Gopuram icon stylized above SRM
    gopuram = Polygon([(-0.8, -0.3), (0.8, -0.3), (0.6, 1.2), (0, 1.7), (-0.6, 1.2)],
                      fc='#F4D35E', ec='#C77DFF', lw=1.5)
    ax.add_patch(gopuram)
    # Swastik / Sacred symbol
    ax.text(0, 0.4, '卐', color='#990000', fontsize=18, ha='center', va='center')

    # Laurel Wreath / Leaves around center shield
    angles = np.linspace(np.pi*0.7, np.pi*0.3, 7)
    for a in angles:
        lx = 2.4 * np.cos(a)
        ly = 2.4 * np.sin(a)
        leaf = Circle((lx, ly), 0.2, color='#2D6A4F')
        ax.add_patch(leaf)
    for a in np.linspace(-np.pi*0.7, -np.pi*0.3, 7):
        lx = 2.4 * np.cos(a)
        ly = 2.4 * np.sin(a)
        leaf = Circle((lx, ly), 0.2, color='#2D6A4F')
        ax.add_patch(leaf)

    # Ribbon at bottom of shield: "EDUCATE AND EXCEL"
    ribbon = FancyBboxPatch((-2.4, -2.5), 4.8, 0.7, boxstyle="round,pad=0.1",
                            fc='#F4D35E', ec='#0D3B66', lw=1.5)
    ax.add_patch(ribbon)
    ax.text(0, -2.15, 'EDUCATE AND EXCEL', color='#0D3B66', fontsize=7.5,
            fontweight='bold', fontfamily='serif', ha='center', va='center')

    plt.tight_layout()
    plt.savefig('report_assets/college_logo.png', dpi=300, facecolor='white', bbox_inches='tight')
    plt.close()
    print("Generated college_logo.png")

# -----------------------------------------------------------------------------
# 2. FIGURE 4.1: SYSTEM ARCHITECTURE DIAGRAM
# -----------------------------------------------------------------------------
def generate_architecture_diagram():
    fig, ax = plt.subplots(figsize=(8.5, 6.0), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')
    fig.patch.set_facecolor('white')

    # Header Title
    ax.text(50, 97, 'Aerospace Wind Tunnel Platform -- System Architecture',
            fontsize=12, fontweight='bold', ha='center', color='#0F172A')
    ax.text(50, 94, 'Modular MERN & Micro-Physics Engine with Real-Time Telemetry and MongoDB Persistence',
            fontsize=8.5, fontstyle='italic', ha='center', color='#475569')

    # Layer 1: Presentation Layer
    l1 = FancyBboxPatch((4, 73), 92, 18, boxstyle="round,pad=0.5", fc='#F0F9FF', ec='#0284C7', lw=1.5)
    ax.add_patch(l1)
    ax.text(6, 88.5, '1. PRESENTATION LAYER (React 18 + Vite SPA)', fontsize=8.5, fontweight='bold', color='#0369A1')
    
    # 3 sub-boxes in Layer 1
    b1_1 = FancyBboxPatch((6, 75), 28, 11, boxstyle="round,pad=0.3", fc='#FFFFFF', ec='#38BDF8', lw=1)
    ax.add_patch(b1_1)
    ax.text(20, 83.5, 'Mission Control Dashboard', fontsize=7.5, fontweight='bold', ha='center', color='#0C4A6E')
    ax.text(20, 80.5, '• Live AoA / Mach / Reynolds Gauges\n• Dynamic AoA Sweep Controller\n• Real-Time Stream Status & SCRAM',
            fontsize=6, ha='center', color='#334155')

    b1_2 = FancyBboxPatch((36, 75), 28, 11, boxstyle="round,pad=0.3", fc='#FFFFFF', ec='#38BDF8', lw=1)
    ax.add_patch(b1_2)
    ax.text(50, 83.5, 'Three.js 3D Wind Tunnel Viewport', fontsize=7.5, fontweight='bold', ha='center', color='#0C4A6E')
    ax.text(50, 80.5, '• Dynamic NACA Airfoil Mesh\n• Particle Rake & Streamlines\n• Flow Separation & Stall Shader',
            fontsize=6, ha='center', color='#334155')

    b1_3 = FancyBboxPatch((66, 75), 28, 11, boxstyle="round,pad=0.3", fc='#FFFFFF', ec='#38BDF8', lw=1)
    ax.add_patch(b1_3)
    ax.text(80, 83.5, 'Aerodynamics Analytics Suite', fontsize=7.5, fontweight='bold', ha='center', color='#0C4A6E')
    ax.text(80, 80.5, '• Polar Charts (CL vs alpha, Drag, L/D)\n• Pressure Distribution (Cp chord)\n• PDF Dossier & CSV Run Exporter',
            fontsize=6, ha='center', color='#334155')

    # Communication Arrows
    ax.annotate('', xy=(50, 69), xytext=(50, 73), arrowprops=dict(arrowstyle="<->", color="#0284C7", lw=1.5))
    ax.text(52, 70.5, 'REST API (HTTP) / WebSocket Events (Engine Sync)', fontsize=6.5, color='#0284C7', fontweight='bold')

    # Layer 2: Backend API & Middleware Pipeline
    l2 = FancyBboxPatch((4, 49), 92, 19, boxstyle="round,pad=0.5", fc='#F8FAFC', ec='#475569', lw=1.5)
    ax.add_patch(l2)
    ax.text(6, 65.5, '2. BACKEND API & MIDDLEWARE PIPELINE (Node.js & Express 4)', fontsize=8.5, fontweight='bold', color='#1E293B')

    b2_1 = FancyBboxPatch((6, 51), 28, 12.5, boxstyle="round,pad=0.3", fc='#FFFFFF', ec='#94A3B8', lw=1)
    ax.add_patch(b2_1)
    ax.text(20, 60.5, 'Security & Auth Guards', fontsize=7.5, fontweight='bold', ha='center', color='#0F172A')
    ax.text(20, 56.5, '• JWT Bearer Token Middleware\n• 4-Tier RBAC Access Control\n• Bcrypt Salt Password Hashes\n• Helmet & Rate-Limiting Protection',
            fontsize=5.8, ha='center', color='#334155')

    b2_2 = FancyBboxPatch((36, 51), 28, 12.5, boxstyle="round,pad=0.3", fc='#FFFFFF', ec='#94A3B8', lw=1)
    ax.add_patch(b2_2)
    ax.text(50, 60.5, 'REST API Route Controllers', fontsize=7.5, fontweight='bold', ha='center', color='#0F172A')
    ax.text(50, 56.5, '• /api/auth (Login, Register, Session)\n• /api/runs (Telemetry & Test Runs)\n• /api/models (Airfoil Profiles)\n• /api/facility (Sensors & SCRAM)',
            fontsize=5.8, ha='center', color='#334155')

    b2_3 = FancyBboxPatch((66, 51), 28, 12.5, boxstyle="round,pad=0.3", fc='#FFFFFF', ec='#94A3B8', lw=1)
    ax.add_patch(b2_3)
    ax.text(80, 60.5, 'Data Pipeline & Export Engine', fontsize=7.5, fontweight='bold', ha='center', color='#0F172A')
    ax.text(80, 56.5, '• CSV & JSON Stream Serializers\n• PDF Dossier Certificate Generator\n• CORS & Request Sanitization\n• Unified Error Handler Pipeline',
            fontsize=5.8, ha='center', color='#334155')

    # Communication Arrows
    ax.annotate('', xy=(50, 45), xytext=(50, 49), arrowprops=dict(arrowstyle="<->", color="#475569", lw=1.5))

    # Layer 3: Business Logic & Aerodynamics Computation Engine
    l3 = FancyBboxPatch((4, 25), 92, 19, boxstyle="round,pad=0.5", fc='#FEF3C7', ec='#D97706', lw=1.5)
    ax.add_patch(l3)
    ax.text(6, 41.5, '3. AERODYNAMICS CALCULATION & TELEMETRY ENGINE (Node.js Micro-Physics Engine)',
            fontsize=8.5, fontweight='bold', color='#B45309')

    b3_1 = FancyBboxPatch((6, 27), 28, 12.5, boxstyle="round,pad=0.3", fc='#FFFFFF', ec='#FBBF24', lw=1)
    ax.add_patch(b3_1)
    ax.text(20, 36.5, 'Aerodynamic Polar Engine', fontsize=7.5, fontweight='bold', ha='center', color='#92400E')
    ax.text(20, 32.5, '• Thin-Airfoil Theory & Camber\n• Dynamic Stall (alpha > alpha_stall)\n• Induced & Profile Drag Polar (CD)\n• Moment Coeff (Cm,ac & Center-P)',
            fontsize=5.8, ha='center', color='#78350F')

    b3_2 = FancyBboxPatch((36, 27), 28, 12.5, boxstyle="round,pad=0.3", fc='#FFFFFF', ec='#FBBF24', lw=1)
    ax.add_patch(b3_2)
    ax.text(50, 36.5, 'Pressure Distribution (Cp)', fontsize=7.5, fontweight='bold', ha='center', color='#92400E')
    ax.text(50, 32.5, '• 20-Point Chord Discrete Model\n• Suction Peak / Stagnation Point\n• Dynamic Pressure Q = 0.5*rho*V^2\n• Atmospheric ISA Model Correction',
            fontsize=5.8, ha='center', color='#78350F')

    b3_3 = FancyBboxPatch((66, 27), 28, 12.5, boxstyle="round,pad=0.3", fc='#FFFFFF', ec='#FBBF24', lw=1)
    ax.add_patch(b3_3)
    ax.text(80, 36.5, 'Automated AoA Sweep Engine', fontsize=7.5, fontweight='bold', ha='center', color='#92400E')
    ax.text(80, 32.5, '• Discrete Stepper (-10 deg to +25 deg)\n• 10Hz High-Speed Data Sampling\n• Sensor Calibration Matrix\n• Real-Time Run Time-Series Buffer',
            fontsize=5.8, ha='center', color='#78350F')

    # Communication Arrows
    ax.annotate('', xy=(50, 21), xytext=(50, 25), arrowprops=dict(arrowstyle="<->", color="#D97706", lw=1.5))

    # Layer 4: Persistence Layer (MongoDB)
    l4 = FancyBboxPatch((4, 3), 92, 17, boxstyle="round,pad=0.5", fc='#F0FDF4', ec='#16A34A', lw=1.5)
    ax.add_patch(l4)
    ax.text(6, 17.5, '4. PERSISTENCE & DATA STORAGE LAYER (MongoDB Community v9.0 via Mongoose ODM)',
            fontsize=8.5, fontweight='bold', color='#15803D')

    b4_1 = FancyBboxPatch((6, 5), 20.5, 10.5, boxstyle="round,pad=0.3", fc='#FFFFFF', ec='#86EFAC', lw=1)
    ax.add_patch(b4_1)
    ax.text(16.2, 12.5, 'Users Collection', fontsize=7, fontweight='bold', ha='center', color='#166534')
    ax.text(16.2, 8.5, '• Credentials & Roles\n• Access Tokens\n• Audit Timestamps', fontsize=5.8, ha='center', color='#334155')

    b4_2 = FancyBboxPatch((28.5, 5), 20.5, 10.5, boxstyle="round,pad=0.3", fc='#FFFFFF', ec='#86EFAC', lw=1)
    ax.add_patch(b4_2)
    ax.text(38.7, 12.5, 'Airfoil Models', fontsize=7, fontweight='bold', ha='center', color='#166534')
    ax.text(38.7, 8.5, '• NACA Coordinates\n• Chord & Span Specs\n• Theoretical Polars', fontsize=5.8, ha='center', color='#334155')

    b4_3 = FancyBboxPatch((51, 5), 20.5, 10.5, boxstyle="round,pad=0.3", fc='#FFFFFF', ec='#86EFAC', lw=1)
    ax.add_patch(b4_3)
    ax.text(61.2, 12.5, 'Test Runs Collection', fontsize=7, fontweight='bold', ha='center', color='#166534')
    ax.text(61.2, 8.5, '• High-Rate Time-Series\n• AoA Sweep Swept Data\n• Force & Moment Logs', fontsize=5.8, ha='center', color='#334155')

    b4_4 = FancyBboxPatch((73.5, 5), 20.5, 10.5, boxstyle="round,pad=0.3", fc='#FFFFFF', ec='#86EFAC', lw=1)
    ax.add_patch(b4_4)
    ax.text(83.7, 12.5, 'Facility Calibration', fontsize=7, fontweight='bold', ha='center', color='#166534')
    ax.text(83.7, 8.5, '• Pitot-Static Sensor Offsets\n• Balance Zero-Offsets\n• System SCRAM Records', fontsize=5.8, ha='center', color='#334155')

    plt.tight_layout()
    plt.savefig('report_assets/fig_4_1_architecture.png', dpi=300, facecolor='white', bbox_inches='tight')
    plt.close()
    print("Generated fig_4_1_architecture.png")

# -----------------------------------------------------------------------------
# 3. FIGURE 4.2: UML CLASS DIAGRAM
# -----------------------------------------------------------------------------
def generate_class_diagram():
    fig, ax = plt.subplots(figsize=(8.5, 5.8), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')
    fig.patch.set_facecolor('white')

    ax.text(50, 97, 'Aerospace Wind Tunnel Platform -- UML Class Diagram',
            fontsize=12, fontweight='bold', ha='center', color='#0F172A')
    ax.text(50, 94, 'Structural Data Model & Domain Entities with Attributes, Methods, and Mongoose Associations',
            fontsize=8.5, fontstyle='italic', ha='center', color='#475569')

    # Class 1: User
    c1 = FancyBboxPatch((4, 52), 28, 38, boxstyle="round,pad=0.3", fc='#EFF6FF', ec='#2563EB', lw=1.5)
    ax.add_patch(c1)
    ax.text(18, 86.5, 'User', fontsize=8.5, fontweight='bold', ha='center', color='#1E40AF')
    ax.text(5, 83.5, '------------------------------------', fontsize=6, color='#93C5FD')
    ax.text(5.5, 71, '- _id: ObjectId\n- name: String\n- email: String (unique)\n- password: String (hash)\n- role: Enum(Director, Aero,\n         Operator, Observer)\n- facilityAccess: [String]\n- createdAt: Date',
            fontsize=6.2, fontfamily='monospace', color='#1E293B')
    ax.text(5, 67, '------------------------------------', fontsize=6, color='#93C5FD')
    ax.text(5.5, 56, '+ registerUser(): Token\n+ loginUser(): Token\n+ matchPassword(): Boolean\n+ hasPermission(tier): Boolean',
            fontsize=6.2, fontfamily='monospace', color='#1E293B')

    # Class 2: AirfoilModel
    c2 = FancyBboxPatch((36, 52), 28, 38, boxstyle="round,pad=0.3", fc='#F0FDF4', ec='#16A34A', lw=1.5)
    ax.add_patch(c2)
    ax.text(50, 86.5, 'AirfoilModel', fontsize=8.5, fontweight='bold', ha='center', color='#166534')
    ax.text(37, 83.5, '------------------------------------', fontsize=6, color='#86EFAC')
    ax.text(37.5, 71, '- _id: ObjectId\n- designation: String\n- family: Enum(NACA4, 5, Super)\n- chordLength: Number (m)\n- wingSpan: Number (m)\n- camberMax: Number (%c)\n- thicknessRatio: Number (%c)\n- coordinates: [{x, y}]',
            fontsize=6.2, fontfamily='monospace', color='#1E293B')
    ax.text(37, 67, '------------------------------------', fontsize=6, color='#86EFAC')
    ax.text(37.5, 56, '+ computePolars(aoa, Re): Object\n+ computeCpDistribution(aoa): Array\n+ checkStallCondition(aoa): Boolean\n+ exportGeometryDXF(): Buffer',
            fontsize=6.2, fontfamily='monospace', color='#1E293B')

    # Class 3: TestRun
    c3 = FancyBboxPatch((68, 52), 28, 38, boxstyle="round,pad=0.3", fc='#FFFBEB', ec='#D97706', lw=1.5)
    ax.add_patch(c3)
    ax.text(82, 86.5, 'TestRun', fontsize=8.5, fontweight='bold', ha='center', color='#92400E')
    ax.text(69, 83.5, '------------------------------------', fontsize=6, color='#FDE68A')
    ax.text(69.5, 71, '- _id: ObjectId\n- runId: String (unique)\n- engineerId: ObjectId (User)\n- modelId: ObjectId (Airfoil)\n- windSpeed: Number (m/s)\n- machNumber: Number\n- reynoldsNumber: Number\n- sweepStatus: Enum',
            fontsize=6.2, fontfamily='monospace', color='#1E293B')
    ax.text(69, 67, '------------------------------------', fontsize=6, color='#FDE68A')
    ax.text(69.5, 56, '+ startTelemetryStream(): void\n+ executeAoaSweep(min, max): Data\n+ calculateAeroCoefficients(): Obj\n+ triggerEmergencySCRAM(): void',
            fontsize=6.2, fontfamily='monospace', color='#1E293B')

    # Associations (Class 1 -> Class 3, Class 2 -> Class 3)
    ax.annotate('', xy=(68, 71), xytext=(32, 71), arrowprops=dict(arrowstyle="->", color="#475569", lw=1.2))
    ax.text(33, 73, 'creates 1..*', fontsize=6.5, color='#475569')

    ax.annotate('', xy=(68, 65), xytext=(64, 65), arrowprops=dict(arrowstyle="->", color="#475569", lw=1.2))
    ax.text(64.5, 67, 'evaluates', fontsize=6.5, color='#475569')

    # Class 4: TelemetryPoint
    c4 = FancyBboxPatch((4, 6), 28, 38, boxstyle="round,pad=0.3", fc='#FDF2F8', ec='#DB2777', lw=1.5)
    ax.add_patch(c4)
    ax.text(18, 40.5, 'TelemetryPoint', fontsize=8.5, fontweight='bold', ha='center', color='#9D174D')
    ax.text(5, 37.5, '------------------------------------', fontsize=6, color='#FBCFE8')
    ax.text(5.5, 25, '- _id: ObjectId\n- runId: ObjectId (TestRun)\n- timestamp: Number (ms)\n- aoaDeg: Number\n- liftForce: Number (N)\n- dragForce: Number (N)\n- pitchingMoment: Number (Nm)\n- cL, cD, cM, lOverD: Number',
            fontsize=6.2, fontfamily='monospace', color='#1E293B')
    ax.text(5, 21, '------------------------------------', fontsize=6, color='#FBCFE8')
    ax.text(5.5, 11, '+ normalizeForces(qInf, S): void\n+ checkBalanceSafetyLimits(): Bool\n+ computeLocalVorticity(): Number',
            fontsize=6.2, fontfamily='monospace', color='#1E293B')

    # Class 5: PressureTapArray
    c5 = FancyBboxPatch((36, 6), 28, 38, boxstyle="round,pad=0.3", fc='#FAF5FF', ec='#9333EA', lw=1.5)
    ax.add_patch(c5)
    ax.text(50, 40.5, 'PressureTapArray', fontsize=8.5, fontweight='bold', ha='center', color='#6B21A8')
    ax.text(37, 37.5, '------------------------------------', fontsize=6, color='#E9D5FF')
    ax.text(37.5, 25, '- _id: ObjectId\n- runId: ObjectId (TestRun)\n- tapCount: Number (20)\n- chordPositions: [Number]\n- upperSurfaceCp: [Number]\n- lowerSurfaceCp: [Number]\n- netPressureLift: Number',
            fontsize=6.2, fontfamily='monospace', color='#1E293B')
    ax.text(37, 21, '------------------------------------', fontsize=6, color='#E9D5FF')
    ax.text(37.5, 11, '+ integrateSurfacePressure(): Num\n+ locateSuctionPeak(): Object\n+ detectBoundarySeparation(): Bool',
            fontsize=6.2, fontfamily='monospace', color='#1E293B')

    # Class 6: FacilityCalibration
    c6 = FancyBboxPatch((68, 6), 28, 38, boxstyle="round,pad=0.3", fc='#F1F5F9', ec='#475569', lw=1.5)
    ax.add_patch(c6)
    ax.text(82, 40.5, 'FacilityCalibration', fontsize=8.5, fontweight='bold', ha='center', color='#1E293B')
    ax.text(69, 37.5, '------------------------------------', fontsize=6, color='#CBD5E1')
    ax.text(69.5, 25, '- _id: ObjectId\n- tunnelSection: String\n- barometricPressure: Number\n- ambientTemperature: Number\n- airDensityRho: Number (kg/m3)\n- balanceZeroOffset: [Number]\n- scramActive: Boolean',
            fontsize=6.2, fontfamily='monospace', color='#1E293B')
    ax.text(69, 21, '------------------------------------', fontsize=6, color='#CBD5E1')
    ax.text(69.5, 11, '+ applyTareZeroing(): void\n+ calculateDynamicQ(V): Number\n+ auditFacilitySafetyStatus(): Obj',
            fontsize=6.2, fontfamily='monospace', color='#1E293B')

    # Vertical connections from TestRun to TelemetryPoint & PressureTapArray
    ax.annotate('', xy=(18, 44), xytext=(72, 52), arrowprops=dict(arrowstyle="->", color="#9D174D", lw=1.2, linestyle='--'))
    ax.text(35, 46, 'records 1..* telemetry points', fontsize=6, color='#9D174D')

    ax.annotate('', xy=(50, 44), xytext=(78, 52), arrowprops=dict(arrowstyle="->", color="#6B21A8", lw=1.2, linestyle='--'))
    ax.text(62, 46, 'samples Cp', fontsize=6, color='#6B21A8')

    plt.tight_layout()
    plt.savefig('report_assets/fig_4_2_class_diagram.png', dpi=300, facecolor='white', bbox_inches='tight')
    plt.close()
    print("Generated fig_4_2_class_diagram.png")

# -----------------------------------------------------------------------------
# 4. FIGURE 4.3: UML SEQUENCE DIAGRAM
# -----------------------------------------------------------------------------
def generate_sequence_diagram():
    fig, ax = plt.subplots(figsize=(8.5, 5.8), dpi=300)
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')
    fig.patch.set_facecolor('white')

    ax.text(50, 97, 'Aerospace Wind Tunnel Platform -- UML Sequence Diagram',
            fontsize=12, fontweight='bold', ha='center', color='#0F172A')
    ax.text(50, 94, 'End-to-End Workflow: Test Configuration -> Live Sweep -> Real-Time Telemetry -> MongoDB Persistence',
            fontsize=8.5, fontstyle='italic', ha='center', color='#475569')

    # Lifeline Participants
    actors = [
        ('Flight Engineer', 10, '#2563EB'),
        ('React UI / 3D Client', 26, '#0284C7'),
        ('Express API', 42, '#64748B'),
        ('Aerodynamics Engine', 58, '#D97706'),
        ('Telemetry Stream', 74, '#0D9488'),
        ('MongoDB Store', 90, '#16A34A')
    ]

    for name, x, col in actors:
        # Header box
        bx = FancyBboxPatch((x-7, 85), 14, 6, boxstyle="round,pad=0.2", fc=col, ec='none')
        ax.add_patch(bx)
        ax.text(x, 88, name, color='white', fontsize=6.8, fontweight='bold', ha='center', va='center')
        # Vertical lifeline
        ax.plot([x, x], [8, 85], color='#CBD5E1', lw=1.2, linestyle='--')

    # Step Sequence (y from 80 down to 12)
    steps = [
        (80, 10, 26, '1. Select Airfoil (NACA 0012) & set Mach 0.15', True),
        (74, 26, 42, '2. POST /api/runs/create (Bearer JWT)', True),
        (68, 42, 90, '3. Initialize TestRun record in MongoDB', True),
        (62, 26, 42, '4. Start AoA Sweep (-5° to +20°, step 1°)', True),
        (56, 42, 58, '5. Trigger Physics Calculation Matrix', True),
        (50, 58, 58, '6. Compute CL, CD, Cm & 20-tap Cp array', False),
        (44, 58, 74, '7. Push real-time telemetry frame (10Hz)', True),
        (38, 74, 26, '8. Stream active AoA, CL, and forces to HUD', True),
        (32, 26, 26, '9. Update Three.js 3D streamlines & stall shader', False),
        (26, 42, 90, '10. Bulk upsert telemetry points & polars', True),
        (20, 10, 26, '11. Inspect performance curves & click Export PDF', True),
        (14, 26, 42, '12. GET /api/runs/:id/export -> Generate Dossier', True)
    ]

    for y, x1, x2, msg, is_arrow in steps:
        if is_arrow:
            ax.annotate('', xy=(x2, y), xytext=(x1, y),
                        arrowprops=dict(arrowstyle="->", color="#1E293B", lw=1.2))
            mid = (x1 + x2) / 2
            ax.text(mid, y + 1.2, msg, fontsize=6.2, ha='center', color='#0F172A', fontweight='bold')
        else:
            # Self-call
            ax.annotate('', xy=(x1, y-2), xytext=(x1, y+2),
                        arrowprops=dict(arrowstyle="->", color="#D97706", lw=1.2,
                                        connectionstyle="arc3,rad=-0.8"))
            ax.text(x1 + 6, y, msg, fontsize=6.2, ha='left', va='center', color='#B45309')

    plt.tight_layout()
    plt.savefig('report_assets/fig_4_3_sequence_diagram.png', dpi=300, facecolor='white', bbox_inches='tight')
    plt.close()
    print("Generated fig_4_3_sequence_diagram.png")

# -----------------------------------------------------------------------------
# 5. UI SCREENSHOTS (FIGURES 1 TO 8)
# -----------------------------------------------------------------------------
def generate_ui_screenshots():
    # Figure 1: User Login and Security Authentication Interface
    fig, ax = plt.subplots(figsize=(6.4, 4.0), dpi=300)
    fig.patch.set_facecolor('#070D18')
    ax.set_facecolor('#0B132B')
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Center Modal Card
    card = FancyBboxPatch((25, 12), 50, 76, boxstyle="round,pad=0.5", fc='#0F172A', ec='#38BDF8', lw=1.8)
    ax.add_patch(card)
    ax.text(50, 81, 'AEROSUITE FLIGHT DYNAMICS', color='#38BDF8', fontsize=11, fontweight='bold', ha='center')
    ax.text(50, 76.5, 'SECURE FACILITY AUTHENTICATION', color='#94A3B8', fontsize=7.5, fontfamily='monospace', ha='center')

    # 4 Quick Role Buttons
    roles = [('DIRECTOR', 30, '#EF4444'), ('SENIOR AERO', 43, '#3B82F6'), ('OPERATOR', 57, '#10B981'), ('OBSERVER', 70, '#A855F7')]
    for rname, rx, rcol in roles:
        rb = FancyBboxPatch((rx-5, 69), 10, 4.5, boxstyle="round,pad=0.2", fc=rcol, ec='none')
        ax.add_patch(rb)
        ax.text(rx, 71.2, rname, color='white', fontsize=5.2, fontweight='bold', ha='center', va='center')

    # Input Fields
    ax.text(30, 64, 'Email / Personnel ID', color='#CBD5E1', fontsize=7, fontweight='bold')
    f1 = FancyBboxPatch((30, 56), 40, 5.5, boxstyle="round,pad=0.2", fc='#1E293B', ec='#475569', lw=1)
    ax.add_patch(f1)
    ax.text(32, 59, 'director@aerospace.internal', color='#38BDF8', fontsize=6.8, fontfamily='monospace')

    ax.text(30, 50, 'Cryptographic Security Key / Password', color='#CBD5E1', fontsize=7, fontweight='bold')
    f2 = FancyBboxPatch((30, 42), 40, 5.5, boxstyle="round,pad=0.2", fc='#1E293B', ec='#475569', lw=1)
    ax.add_patch(f2)
    ax.text(32, 45, '••••••••••••••••••••••••', color='#94A3B8', fontsize=7)

    # Login Button
    btn = FancyBboxPatch((30, 29), 40, 7, boxstyle="round,pad=0.2", fc='#0284C7', ec='#38BDF8', lw=1.5)
    ax.add_patch(btn)
    ax.text(50, 32.5, 'AUTHENTICATE & ENTER FACILITY', color='white', fontsize=7.5, fontweight='bold', ha='center', va='center')

    # Status notice
    ax.text(50, 20, '256-Bit JWT Encryption | Bcrypt Hashes | Role-Enforced RBAC',
            color='#10B981', fontsize=6, ha='center', fontfamily='monospace')

    plt.tight_layout()
    plt.savefig('report_assets/fig_1_login.png', dpi=300, facecolor=fig.get_facecolor(), bbox_inches='tight')
    plt.close()
    print("Generated fig_1_login.png")

    # Figure 5: Dynamic Angle of Attack Automated Sweep Interface
    fig, ax = plt.subplots(figsize=(6.4, 4.0), dpi=300)
    fig.patch.set_facecolor('#070D18')
    ax.set_facecolor('#0B132B')
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Top Bar
    hbar = FancyBboxPatch((4, 88), 92, 8, boxstyle="round,pad=0.3", fc='#0F172A', ec='#38BDF8', lw=1.2)
    ax.add_patch(hbar)
    ax.text(7, 92, 'AUTOMATED ANGLE OF ATTACK (AoA) SWEEP CONTROLLER', color='#38BDF8', fontsize=8.5, fontweight='bold')
    ax.text(75, 92, 'SWEEP ENGINE: ACTIVE (10 Hz)', color='#10B981', fontsize=7, fontfamily='monospace')

    # Left Control Box
    cbox = FancyBboxPatch((4, 12), 42, 72, boxstyle="round,pad=0.4", fc='#0F172A', ec='#1E293B', lw=1.2)
    ax.add_patch(cbox)
    ax.text(8, 79, 'SWEEP CONFIGURATION PARAMETERS', color='#F59E0B', fontsize=7.5, fontweight='bold')

    params = [
        ('Active Airfoil Model', 'NACA 0012 Symmetric'),
        ('Starting Pitch Angle (α_min)', '-5.0 deg'),
        ('Termination Angle (α_max)', '+20.0 deg'),
        ('Discrete Pitch Step (Δα)', '1.0 deg / step'),
        ('Dwell Sampling Interval', '200 ms / point'),
        ('Tunnel Freestream Velocity', '45.0 m/s (Mach 0.13)'),
        ('Ambient Air Density (ρ)', '1.225 kg/m³ (ISA STD)'),
        ('Reynolds Number (Re)', '1.20 x 10⁶')
    ]
    for i, (k, v) in enumerate(params):
        ax.text(8, 71 - i*7, f'• {k}:', color='#94A3B8', fontsize=6.2)
        ax.text(26, 71 - i*7, v, color='#F8FAFC', fontsize=6.2, fontfamily='monospace', fontweight='bold')

    # Right Live Sweep Curve Preview
    rbox = FancyBboxPatch((49, 12), 47, 72, boxstyle="round,pad=0.4", fc='#0F172A', ec='#1E293B', lw=1.2)
    ax.add_patch(rbox)
    ax.text(52, 79, 'LIVE POLAR TRACE: LIFT COEFFICIENT (CL vs α)', color='#38BDF8', fontsize=7.5, fontweight='bold')

    # Mini plot inside
    sweep_aoa = np.linspace(-5, 20, 26)
    sweep_cl = 2 * np.pi * np.radians(sweep_aoa)
    # add stall above 14 deg
    stall_idx = sweep_aoa > 13
    sweep_cl[stall_idx] = 1.35 * np.cos(np.radians(sweep_aoa[stall_idx] - 13) * 3)

    # Coordinates transform for mini plot
    px = 53 + (sweep_aoa + 5) / 25 * 40
    py = 22 + (sweep_cl + 0.6) / 2.3 * 48
    ax.plot(px, py, color='#38BDF8', lw=2)
    ax.scatter(px, py, color='#F59E0B', s=14, zorder=5)

    # Current sweep point cursor
    curr_x, curr_y = px[13], py[13] # at 8 deg
    ax.scatter([curr_x], [curr_y], color='#EF4444', s=60, edgecolors='white', lw=1.5, zorder=10)
    ax.text(curr_x + 2, curr_y - 2, 'CURRENT: α = +8.0°\nCL = 0.865', color='#EF4444', fontsize=6, fontweight='bold')

    plt.tight_layout()
    plt.savefig('report_assets/fig_5_sweep.png', dpi=300, facecolor=fig.get_facecolor(), bbox_inches='tight')
    plt.close()
    print("Generated fig_5_sweep.png")

    # Figure 7: Facility Control & Emergency SCRAM Interface
    fig, ax = plt.subplots(figsize=(6.4, 4.0), dpi=300)
    fig.patch.set_facecolor('#070D18')
    ax.set_facecolor('#0B132B')
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Header
    hbar = FancyBboxPatch((4, 88), 92, 8, boxstyle="round,pad=0.3", fc='#0F172A', ec='#EF4444', lw=1.2)
    ax.add_patch(hbar)
    ax.text(7, 92, 'WIND TUNNEL FACILITY HARNESS & SCRAM SAFETY CONSOLE', color='#F87171', fontsize=8.5, fontweight='bold')
    ax.text(72, 92, 'INTERLOCK: ENERVO-ARMED', color='#10B981', fontsize=7, fontfamily='monospace')

    # 3 Status Indicator Panels
    sec1 = FancyBboxPatch((4, 52), 29, 32, boxstyle="round,pad=0.3", fc='#0F172A', ec='#10B981', lw=1.2)
    ax.add_patch(sec1)
    ax.text(18.5, 79, 'COMPRESSOR / DRIVE FAN', color='#10B981', fontsize=7, fontweight='bold', ha='center')
    ax.text(18.5, 72, 'RPM: 1,840 RPM\nPower: 45.2 kW\nVibration: 0.12 mm/s\nBearing Temp: 42.1 °C',
            color='#F8FAFC', fontsize=6.2, fontfamily='monospace', ha='center')

    sec2 = FancyBboxPatch((35.5, 52), 29, 32, boxstyle="round,pad=0.3", fc='#0F172A', ec='#38BDF8', lw=1.2)
    ax.add_patch(sec2)
    ax.text(50, 79, 'FORCE BALANCE LOAD CELLS', color='#38BDF8', fontsize=7, fontweight='bold', ha='center')
    ax.text(50, 72, 'Lift Cell: 242.6 N\nDrag Cell: 4.12 N\nPitching Cell: -1.82 Nm\nTare Status: CALIBRATED',
            color='#F8FAFC', fontsize=6.2, fontfamily='monospace', ha='center')

    sec3 = FancyBboxPatch((67, 52), 29, 32, boxstyle="round,pad=0.3", fc='#0F172A', ec='#F59E0B', lw=1.2)
    ax.add_patch(sec3)
    ax.text(81.5, 79, 'PITOT SENSOR CALIBRATION', color='#F59E0B', fontsize=7, fontweight='bold', ha='center')
    ax.text(81.5, 72, 'Dynamic q: 1,240 Pa\nStatic P: 101,325 Pa\nTest Speed: 45.0 m/s\nSettling Chamber: LAMINAR',
            color='#F8FAFC', fontsize=6.2, fontfamily='monospace', ha='center')

    # Emergency SCRAM Button Area
    scram_box = FancyBboxPatch((4, 12), 92, 36, boxstyle="round,pad=0.4", fc='#1E1B4B', ec='#DC2626', lw=1.8)
    ax.add_patch(scram_box)

    scram_btn = FancyBboxPatch((34, 16), 32, 14, boxstyle="round,pad=0.4", fc='#DC2626', ec='#FCA5A5', lw=2)
    ax.add_patch(scram_btn)
    ax.text(50, 23, 'EMERGENCY SCRAM', color='white', fontsize=10, fontweight='bold', ha='center', va='center')

    ax.text(50, 41, 'SAFETY INTERLOCK COMMAND & SYSTEM ABORT PROTOCOL', color='#F87171', fontsize=7.5, fontweight='bold', ha='center')
    ax.text(50, 34, 'Instantly shuts down drive fan, closes pneumatic test section gates, and logs emergency event to MongoDB audit trail.',
            color='#CBD5E1', fontsize=6.2, ha='center')

    plt.tight_layout()
    plt.savefig('report_assets/fig_7_facility.png', dpi=300, facecolor=fig.get_facecolor(), bbox_inches='tight')
    plt.close()
    print("Generated fig_7_facility.png")

    # Figure 8: Administrative Security & MongoDB Data Management Console
    fig, ax = plt.subplots(figsize=(6.4, 4.0), dpi=300)
    fig.patch.set_facecolor('#070D18')
    ax.set_facecolor('#0B132B')
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.axis('off')

    # Top Header
    hbar = FancyBboxPatch((4, 88), 92, 8, boxstyle="round,pad=0.3", fc='#0F172A', ec='#A855F7', lw=1.2)
    ax.add_patch(hbar)
    ax.text(7, 92, 'ADMINISTRATIVE CONTROL PANEL & MONGODB DATABASE MANAGEMENT', color='#C084FC', fontsize=8.5, fontweight='bold')
    ax.text(72, 92, 'MONGODB v9.0 | AUTH: SECURE', color='#10B981', fontsize=7, fontfamily='monospace')

    # 4 Database Metric Cards
    db_metrics = [
        ('TOTAL TEST RUNS', '156 Runs', '#06B6D4'),
        ('DATABASE SIZE', '4.2 MB', '#10B981'),
        ('ACTIVE SESSIONS', '3 Connected', '#F59E0B'),
        ('MONGODB STATUS', 'Healthy (27017)', '#A855F7')
    ]
    for i, (title, val, col) in enumerate(db_metrics):
        card = FancyBboxPatch((4 + i*23.5, 68), 21.5, 16, boxstyle="round,pad=0.3", fc='#0F172A', ec=col, lw=1.2)
        ax.add_patch(card)
        ax.text(4 + i*23.5 + 10.7, 78.5, title, color='#94A3B8', fontsize=5.8, fontweight='bold', ha='center')
        ax.text(4 + i*23.5 + 10.7, 72.5, val, color='#F8FAFC', fontsize=8.5, fontweight='bold', ha='center')

    # DB Maintenance Table / Actions
    tbox = FancyBboxPatch((4, 12), 92, 52, boxstyle="round,pad=0.4", fc='#0F172A', ec='#1E293B', lw=1.2)
    ax.add_patch(tbox)
    ax.text(7, 58, 'DATABASE COLLECTIONS & REINDEXING CONSOLE', color='#38BDF8', fontsize=7.5, fontweight='bold')

    collections = [
        ('users', '4 Records', 'Indexed (email_1)', 'Healthy', '#10B981'),
        ('testruns', '156 Records', 'Indexed (runId_1, createdAt_-1)', 'Healthy', '#10B981'),
        ('airfoilmodels', '3 Records', 'Indexed (designation_1)', 'Healthy', '#10B981'),
        ('facilitylogs', '24 Records', 'Indexed (timestamp_-1)', 'Healthy', '#10B981')
    ]

    ax.text(8, 51, 'COLLECTION NAME', color='#94A3B8', fontsize=6, fontweight='bold')
    ax.text(32, 51, 'DOCUMENT COUNT', color='#94A3B8', fontsize=6, fontweight='bold')
    ax.text(54, 51, 'INDEX DEFINITIONS', color='#94A3B8', fontsize=6, fontweight='bold')
    ax.text(82, 51, 'REPLICATION STATUS', color='#94A3B8', fontsize=6, fontweight='bold')

    for i, (cname, ccount, cidx, cstat, scol) in enumerate(collections):
        y_pos = 43 - i*7
        ax.text(8, y_pos, cname, color='#F8FAFC', fontsize=6.2, fontfamily='monospace')
        ax.text(32, y_pos, ccount, color='#CBD5E1', fontsize=6.2)
        ax.text(54, y_pos, cidx, color='#94A3B8', fontsize=5.8, fontfamily='monospace')
        ax.text(82, y_pos, cstat, color=scol, fontsize=6.2, fontweight='bold')

    # Action Buttons at bottom
    b1 = FancyBboxPatch((8, 15), 24, 6, boxstyle="round,pad=0.2", fc='#0284C7', ec='none')
    ax.add_patch(b1)
    ax.text(20, 18, 'TRIGGER BACKUP DUMP', color='white', fontsize=6, fontweight='bold', ha='center', va='center')

    b2 = FancyBboxPatch((36, 15), 24, 6, boxstyle="round,pad=0.2", fc='#15803D', ec='none')
    ax.add_patch(b2)
    ax.text(48, 18, 'REBUILD B-TREE INDEXES', color='white', fontsize=6, fontweight='bold', ha='center', va='center')

    b3 = FancyBboxPatch((64, 15), 28, 6, boxstyle="round,pad=0.2", fc='#B91C1C', ec='none')
    ax.add_patch(b3)
    ax.text(78, 18, 'PURGE EXPIRED TELEMETRY', color='white', fontsize=6, fontweight='bold', ha='center', va='center')

    plt.tight_layout()
    plt.savefig('report_assets/fig_8_admin.png', dpi=300, facecolor=fig.get_facecolor(), bbox_inches='tight')
    plt.close()
    print("Generated fig_8_admin.png")

if __name__ == '__main__':
    generate_college_logo()
    generate_architecture_diagram()
    generate_class_diagram()
    generate_sequence_diagram()
    generate_ui_screenshots()
    print("All diagrams and screenshots successfully generated!")
