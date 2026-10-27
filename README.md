# 🚀 Aerospace Wind Tunnel & Telemetry Platform

An enterprise-grade, scientifically authentic wind tunnel simulation, real-time telemetry processing, and aerodynamic data visualization platform with complete **Role-Based Access Control (RBAC)** authentication, persistent SQLite database storage, and Three.js 3D flow visualization.

---

## 🌟 Key Highlights & Features

### 1. 🛡️ Complete Authentication & Role-Based Access Control (RBAC)
- **4 Clearance Tiers**:
  1. **👑 Flight Test Director (`admin`)**: Supreme administrative authority over all facilities, personnel management, clearance role delegation, custom model deletion, dataset purges, and security audit logs.
  2. **⚡ Senior Aerodynamicist (`engineer`)**: Design and register custom aerospace models, execute automated live multi-Mach sweeps, upload/import datasets, and curate test runs.
  3. **🎮 Wind Tunnel Operator (`operator`)**: Direct control over tunnel fan RPM, cryogenic nitrogen cooling circuits, active test article mounting, and manual Emergency Facility SCRAM.
  4. **👁️ Research Analyst / Cadet (`viewer`)**: Read-only observer clearance for 3D flow exploration, scientific polar inspection, and data export.
- **⚡ 1-Click Fast Role Switcher**: Instant switching between all 4 roles directly in the top telemetry ticker bar for seamless evaluation.
- **🔐 JWT Authentication & Security**: Secure token issuance, bcrypt password hashing, and endpoint authorization middleware.
- **📜 Live Security Audit Trail**: Real-time event logging capturing logons, role delegations, facility parameters, sweeps, and emergency scram shutdowns.

### 2. 🗄️ MongoDB Database Storage & Management (MongoDB v9.0 + Mongoose ODM)
- **Primary Database Engine**: **MongoDB** (`mongodb://127.0.0.1:27017/aerospace`) with Mongoose ODM schemas.
- **Dedicated Collections**:
  - `users`: User profiles, bcrypt-hashed passwords, callsing, clearance tiers.
  - `facilities`: Wind tunnel specifications, drive motor RPM, cryogenic status.
  - `models`: Standard reference & custom CAD airfoil models with geometric coordinates.
  - `test_runs`: Ingested and live aerodynamic test run records ($C_L, C_D, C_m, L/D, q_\infty$).
  - `audit_logs`: Security audit logs and emergency facility SCRAM events.
- **Database Management Console**: Live collection document counters, real-time connection status monitoring, and 1-click baseline database reseed.
- **Resilient Fallback**: In-process SQLite engine (`server/data/aerospace.sqlite.db`) as secondary fallback mirror.

### 3. 🌀 3D Interactive Wind Tunnel Viewport (Three.js)
- Real-time 3D aerodynamic test chamber rendering airfoil models with dynamic Angle of Attack ($\alpha$).
- Animated particle flow streamlines, wake turbulence visualization, and boundary layer separation indicators.
- Interactive camera orbital controls (drag to orbit, pitch, and zoom).

### 4. 📊 Scientific Aerodynamic Analytics Suite (Chart.js)
- **Lift Curve**: $C_L$ vs. $\alpha$ with linear slope ($C_{L\alpha}$) and stall onset envelope.
- **Drag Polar**: $C_D$ vs. $C_L$ with minimum parasite drag ($C_{D0}$) and induced drag factor.
- **Aerodynamic Efficiency**: $L/D$ glide ratio vs. $\alpha$ with reticle for $(L/D)_{max}$.
- **Pitching Moment**: $C_m$ vs. $\alpha$ for static longitudinal stability ($dC_m/d\alpha < 0$).
- **Chordwise Pressure Distribution**: $C_p$ vs. $x/c$ upper and lower surface distributions with suction peaks.

### 5. 🚨 Facility Controls & Emergency SCRAM
- Dynamic fan motor RPM drive sliders with live power draw calculations.
- Active Cryogenic Nitrogen / Liquid Cooling loop toggles.
- Two-stage Emergency SCRAM procedure with klaxon alarm and instant motor shutdown.

### 6. 🔊 Web Audio Aerodynamic Synthesizer
- Synthesizer generating authentic tunnel flow rumble scaling with Mach and fan RPM.
- Audible high-frequency buzzer alert upon flow separation and deep stall.
- Two-tone emergency scram klaxon siren.

---

## 👥 Default Personnel Accounts

| Role | Title | Email | Password | Callsign | Clearance |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`admin`** | Flight Test Director | `director@aerospace.gov` | `director123` | `VORTEX-LEAD` | Level 5 (Top Secret) |
| **`engineer`** | Senior Aerodynamicist | `engineer@aerospace.gov` | `engineer123` | `MACH-CHIEF` | Level 4 (Secret) |
| **`operator`** | Wind Tunnel Operator | `operator@aerospace.gov` | `operator123` | `CHAMBER-ONE` | Level 3 (Confidential) |
| **`viewer`** | Research Analyst | `guest@aerospace.gov` | `viewer123` | `CADET-ALPHA` | Level 1 (Unclassified) |

*(Note: You can also click the quick-login pills at the top right of the navigation bar to switch between any of these accounts in 1 click).*

---

## 🛠️ Wind Tunnel Facilities

1. **National Subsonic Aeroacoustic Tunnel (`TUNNEL-SUB-01`)**: Mach 0.05 – 0.35, $2.1\text{m} \times 1.8\text{m} \times 4.5\text{m}$, active model: NACA 0012.
2. **High-Reynolds Transonic Facility (`TUNNEL-TRANS-02`)**: Mach 0.60 – 1.30, slotted walls with cryogenic nitrogen cooling, active model: NASA SC(2)-0714.
3. **Supersonic Blowdown Hypersonic Chamber (`TUNNEL-SUPER-03`)**: Mach 1.40 – 3.80, variable nozzle, active model: 65° Swept Delta Wing.

---

## 🚀 Running the Project

### Prerequisites
- Node.js v20+ or v22+ (v22 recommended for built-in SQLite engine)
- npm v10+

### Start Full Stack (Backend + Frontend)
```bash
# In the root directory:
npm run dev
```

Or start services individually:
```bash
# Start Backend Telemetry REST & Auth API (Port 5000)
npm run server

# Start Frontend React Client (Port 5173)
npm run client
```

Open your browser at: **`http://localhost:5173`**

---

## 📡 REST API Endpoints

### Authentication & Personnel
- `POST /api/auth/login`: Authenticate and receive JWT token
- `POST /api/auth/register`: Enlist new personnel with designated clearance
- `GET /api/auth/me`: Validate current session and retrieve clearance dossier
- `GET /api/auth/demo-accounts`: Retrieve demo profiles for fast-switching
- `POST /api/auth/logout`: Terminate session and record audit log

### Security Administration (Director Only)
- `GET /api/admin/users`: List all registered personnel
- `PATCH /api/admin/users/:id/role`: Delegate/update personnel clearance role
- `GET /api/admin/audit-logs`: Stream system security and operational audit logs

### Facilities Management
- `GET /api/facilities`: List all wind tunnel test sections
- `PATCH /api/facilities/:id`: Update fan RPM, status, and cooling (Operator/Director)
- `POST /api/facilities/:id/emergency-stop`: Trigger Emergency SCRAM (Operator/Director)

### Aerodynamic Models
- `GET /api/models`: List all test articles
- `POST /api/models`: Register custom airfoil/wing model (Engineer/Director)
- `DELETE /api/models/:id`: De-register model (Director only)

### Flight Test Runs
- `GET /api/runs`: Query and filter recorded test runs (search, regime, model, stallOnly)
- `POST /api/runs`: Record single test point into SQLite (Operator/Engineer/Director)
- `DELETE /api/runs/:runId`: Purge test run (Engineer/Director)
- `POST /api/upload-dataset`: Batch ingest aerodynamic flight dataset (Engineer/Director)
