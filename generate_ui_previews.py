import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np

# 1. UI Preview 1: 3D Wind Tunnel Canvas Simulation
fig, ax = plt.subplots(figsize=(6.4, 4.2), dpi=300)
fig.patch.set_facecolor('#070D18')
ax.set_facecolor('#0B132B')

# Wind Tunnel Walls
ax.axhline(2.2, color='#334155', lw=3, linestyle='-')
ax.axhline(-2.2, color='#334155', lw=3, linestyle='-')
ax.text(-4.8, 2.35, 'TOP WIND TUNNEL WALL (SOLID BOUNDARY)', color='#64748B', fontsize=6.5, fontfamily='monospace')
ax.text(-4.8, -2.45, 'BOTTOM WIND TUNNEL WALL (TEST SECTION FLOOR)', color='#64748B', fontsize=6.5, fontfamily='monospace')

# Streamlines (Curving over airfoil at AoA = 8 deg)
aoa_rad = np.radians(8.0)
x_stream = np.linspace(-5, 5, 200)

for y0 in np.linspace(-1.8, 1.8, 15):
    # Potential flow deflection + wake turbulence
    r = np.sqrt(x_stream**2 + y0**2)
    deflection = 0.55 * np.sin(aoa_rad) / (1 + (x_stream + 0.5)**2 + (y0*2)**2)
    y_stream = y0 + deflection
    
    # After trailing edge (x > 1.2), add wake turbulence if in stall zone
    if abs(y0) < 0.45:
        wake = 0.12 * np.sin(10 * x_stream) * (x_stream > 1.2) * (x_stream - 1.2)
        y_stream += wake
        col = '#F43F5E' if y0 > 0 else '#38BDF8'
        alpha = 0.6
    else:
        col = '#06B6D4'
        alpha = 0.45
    ax.plot(x_stream, y_stream, color=col, lw=1.2, alpha=alpha)

# Smoke Injector Particles (points)
np.random.seed(42)
px = np.random.uniform(-4.8, 4.8, 250)
py = np.random.uniform(-1.7, 1.7, 250)
ax.scatter(px, py, color='#E0F2FE', s=np.random.uniform(2, 8, 250), alpha=0.5, edgecolors='none')

# Airfoil geometry (NACA 0012 rotated by 8 deg)
chord = 2.8
t = np.linspace(0, 1, 100)
yt = 5 * 0.12 * (0.2969*np.sqrt(t) - 0.1260*t - 0.3516*t**2 + 0.2843*t**3 - 0.1015*t**4) * chord
x_foil = (t - 0.25) * chord
x_upper = x_foil * np.cos(aoa_rad) + yt * np.sin(aoa_rad)
y_upper = -x_foil * np.sin(aoa_rad) + yt * np.cos(aoa_rad)
x_lower = x_foil * np.cos(aoa_rad) - yt * np.sin(aoa_rad)
y_lower = -x_foil * np.sin(aoa_rad) - yt * np.cos(aoa_rad)

foil_x = np.concatenate([x_upper, x_lower[::-1]])
foil_y = np.concatenate([y_upper, y_lower[::-1]])
ax.fill(foil_x, foil_y, color='#0284C7', alpha=0.9, ec='#38BDF8', lw=2, label='NACA 0012 Airfoil Model (α = 8.0°)')

# Overlay telemetry HUD
hud_box = patches.FancyBboxPatch((-4.7, 1.2), 2.7, 0.85, boxstyle="round,pad=0.08", fc="#0F172A", ec="#00A896", lw=1.5, alpha=0.9)
ax.add_patch(hud_box)
ax.text(-4.55, 1.75, 'LIVE FLOW TELEMETRY', color='#00A896', fontsize=7, fontweight='bold', fontfamily='monospace')
ax.text(-4.55, 1.55, 'AoA: +8.0° | Mach: 0.15', color='#F8FAFC', fontsize=6.5, fontfamily='monospace')
ax.text(-4.55, 1.35, 'CL: 0.865 | CD: 0.0146 | L/D: 59.2', color='#38BDF8', fontsize=6.5, fontfamily='monospace')

ax.set_xlim(-5.0, 5.0)
ax.set_ylim(-2.6, 2.6)
ax.axis('off')
ax.set_title('3D Interactive Wind Tunnel Flow Simulator & Smoke Rake', fontsize=9.5, fontweight='bold', color='#F8FAFC', pad=6)

plt.tight_layout()
plt.savefig('ppt_assets/ui_windtunnel_preview.png', dpi=300, facecolor=fig.get_facecolor())
plt.close()


# 2. UI Preview 2: Mission Overview & Dashboard
fig, ax = plt.subplots(figsize=(6.4, 4.2), dpi=300)
fig.patch.set_facecolor('#070D18')
ax.set_facecolor('#0B132B')

# Top Header Bar
hdr = patches.Rectangle((-5, 2.1), 10, 0.7, fc='#0F172A', ec='#1E293B', lw=1.5)
ax.add_patch(hdr)
ax.text(-4.7, 2.45, 'AEROSUITE TELEMETRY PLATFORM', color='#06B6D4', fontsize=9, fontweight='bold')
ax.text(1.2, 2.45, 'STATUS: ONLINE | IN-MEMORY ENGINE', color='#10B981', fontsize=7.5, fontfamily='monospace')

# 4 Stat Cards
stat_titles = ['TOTAL TEST RUNS', 'ACTIVE FACILITIES', 'PEAK LIFT (CL)', 'MAX EFFICIENCY']
stat_vals = ['156 RUNS', '3 TUNNELS', '1.71 CL', '78.4 L/D']
stat_colors = ['#06B6D4', '#10B981', '#F59E0B', '#A855F7']

for i in range(4):
    bx = patches.FancyBboxPatch((-4.7 + i*2.4, 1.1), 2.2, 0.8, boxstyle="round,pad=0.05", fc="#0F172A", ec=stat_colors[i], lw=1.2)
    ax.add_patch(bx)
    ax.text(-4.55 + i*2.4, 1.62, stat_titles[i], color='#94A3B8', fontsize=5.8, fontweight='bold')
    ax.text(-4.55 + i*2.4, 1.28, stat_vals[i], color='#F8FAFC', fontsize=9, fontweight='bold')

# Left Panel: Model Specs & AoA Pitch Control
p1 = patches.FancyBboxPatch((-4.7, -2.2), 4.6, 3.1, boxstyle="round,pad=0.06", fc="#0F172A", ec="#1E293B", lw=1.2)
ax.add_patch(p1)
ax.text(-4.5, 0.65, 'ACTIVE AEROSPACE MODEL BLUEPRINT', color='#00A896', fontsize=7.5, fontweight='bold')
ax.text(-4.5, 0.35, '• Model: NACA 0012 Symmetric Airfoil', color='#F8FAFC', fontsize=7)
ax.text(-4.5, 0.10, '• Regime: Subsonic (Mach 0.05 - 0.35)', color='#94A3B8', fontsize=6.8)
ax.text(-4.5, -0.15, '• Reynolds Number: 3,000,000 (3.0 × 10⁶)', color='#94A3B8', fontsize=6.8)
ax.text(-4.5, -0.40, '• Chord / Span: 0.305m / 0.914m (AR = 3.0)', color='#94A3B8', fontsize=6.8)
ax.text(-4.5, -0.65, '• Stall Critical Angle: α = 15.5° (Abrupt stall)', color='#F43F5E', fontsize=6.8, fontweight='bold')

# AoA Pitch Slider indicator
slider_box = patches.FancyBboxPatch((-4.5, -1.9), 4.2, 0.9, boxstyle="round,pad=0.04", fc="#1E293B", ec="#06B6D4", lw=1)
ax.add_patch(slider_box)
ax.text(-4.3, -1.3, 'Interactive Angle of Attack (AoA): +4.0°', color='#38BDF8', fontsize=7, fontweight='bold')
ax.plot([-4.3, -0.5], [-1.6, -1.6], color='#475569', lw=4, solid_capstyle='round')
ax.plot([-4.3, -2.6], [-1.6, -1.6], color='#06B6D4', lw=4, solid_capstyle='round')
ax.scatter([-2.6], [-1.6], color='#F8FAFC', s=60, zorder=5)

# Right Panel: Multi-Regime Wind Tunnel Facilities
p2 = patches.FancyBboxPatch((0.2, -2.2), 4.6, 3.1, boxstyle="round,pad=0.06", fc="#0F172A", ec="#1E293B", lw=1.2)
ax.add_patch(p2)
ax.text(0.4, 0.65, 'WIND TUNNEL FACILITY STATUS MATRIX', color='#00A896', fontsize=7.5, fontweight='bold')
ax.text(0.4, 0.35, '1. Subsonic Aeroacoustic: ACTIVE (1420 RPM, 3.85 kPa)', color='#10B981', fontsize=6.8)
ax.text(0.4, 0.05, '2. Continuous Transonic: STANDBY (2850 RPM, 36.2 kPa)', color='#F59E0B', fontsize=6.8)
ax.text(0.4, -0.25, '3. Supersonic Blowdown: READY (M=1.4-3.8, 84.6 kPa)', color='#38BDF8', fontsize=6.8)
ax.text(0.4, -0.7, 'Telemetry Data Engine: In-Memory Fast-Query Mode', color='#94A3B8', fontsize=6.8)
ax.text(0.4, -1.0, 'Live Audio Synthesizer: Web Audio Harmonic Engine', color='#A855F7', fontsize=6.8)

ax.set_xlim(-5.0, 5.0)
ax.set_ylim(-2.5, 2.9)
ax.axis('off')
ax.set_title('Mission Overview: KPI Telemetry, Blueprint & Facility Grid', fontsize=9.5, fontweight='bold', color='#F8FAFC', pad=6)

plt.tight_layout()
plt.savefig('ppt_assets/ui_dashboard_preview.png', dpi=300, facecolor=fig.get_facecolor())
plt.close()


# 3. UI Preview 3: Live AoA Sweep & Dataset Inspector Table
fig, ax = plt.subplots(figsize=(6.4, 4.2), dpi=300)
fig.patch.set_facecolor('#070D18')
ax.set_facecolor('#0B132B')

# Table Header
ax.text(-4.8, 2.4, 'AERODYNAMIC DATASET INSPECTOR & TELEMETRY LOGS', color='#06B6D4', fontsize=8.5, fontweight='bold')
ax.text(-4.8, 2.1, 'Filter by: Model [All] | Regime [All] | Stall Only [Off] | Search: "RUN-SUB"', color='#94A3B8', fontsize=6.8)

# Table Box
tbl_box = patches.FancyBboxPatch((-4.9, -2.3), 9.8, 4.2, boxstyle="round,pad=0.06", fc="#0F172A", ec="#1E293B", lw=1.2)
ax.add_patch(tbl_box)

headers = ['RUN ID', 'MODEL', 'MACH', 'AoA (°)', 'CL', 'CD', 'CM', 'L/D', 'STATUS']
col_x = [-4.6, -3.2, -1.8, -1.0, -0.2, 0.6, 1.4, 2.2, 3.3]

for h, x in zip(headers, col_x):
    ax.text(x, 1.6, h, color='#00A896', fontsize=6.5, fontweight='bold')
ax.axhline(1.45, color='#334155', lw=1)

rows = [
    ['RUN-SUB-2026-101', 'NACA 0012', '0.15', '0.0°', '0.000', '0.0078', '0.000', '0.0', 'COMPLETED'],
    ['RUN-SUB-2026-102', 'NACA 0012', '0.15', '+4.0°', '0.435', '0.0093', '-0.002', '46.8', 'COMPLETED'],
    ['RUN-SUB-2026-103', 'NACA 0012', '0.15', '+8.0°', '0.865', '0.0146', '-0.004', '59.2', 'COMPLETED'],
    ['RUN-SUB-2026-104', 'NACA 0012', '0.15', '+15.5°', '1.580', '0.0492', '-0.017', '32.1', 'STALL_ONSET'],
    ['RUN-SUB-2026-105', 'NACA 0012', '0.15', '+18.0°', '1.150', '0.1680', '-0.115', '6.8', 'STALL_SEPARATED'],
    ['RUN-TRANS-2026-201', 'SC(2)-0714', '0.73', '+6.0°', '1.180', '0.0151', '-0.098', '78.4', 'COMPLETED'],
    ['RUN-SUPER-2026-301', '65° Delta', '1.80', '+16.0°', '0.940', '0.1420', '-0.048', '6.6', 'VORTEX_LIFT'],
    ['UPLOAD-RUN-2026-01', 'NACA 0012', '0.15', '+10.0°', '1.074', '0.0192', '-0.006', '55.9', 'IMPORTED_VALID']
]

for r_idx, row in enumerate(rows):
    y = 1.15 - r_idx * 0.42
    status_col = '#10B981' if 'COMPLETED' in row[-1] or 'IMPORTED' in row[-1] else '#F43F5E' if 'STALL' in row[-1] else '#38BDF8'
    for c_idx, (val, x) in enumerate(zip(row, col_x)):
        c_col = status_col if c_idx == len(row)-1 else '#F8FAFC' if c_idx == 0 else '#CBD5E1'
        ax.text(x, y, val, color=c_col, fontsize=6.2, fontfamily='monospace' if c_idx in [0, 2, 3, 4, 5, 6, 7] else 'sans-serif')
    if r_idx < len(rows) - 1:
        ax.axhline(y - 0.12, color='#1E293B', lw=0.6)

ax.set_xlim(-5.0, 5.0)
ax.set_ylim(-2.5, 2.7)
ax.axis('off')
ax.set_title('Dataset Inspector: Flight Telemetry Records & Search Filter Table', fontsize=9.5, fontweight='bold', color='#F8FAFC', pad=6)

plt.tight_layout()
plt.savefig('ppt_assets/ui_dataset_preview.png', dpi=300, facecolor=fig.get_facecolor())
plt.close()

# 4. UI Preview 4: Aerodynamics Analytics Multi-Polar Suite
fig, ax = plt.subplots(figsize=(6.4, 4.2), dpi=300)
fig.patch.set_facecolor('#070D18')
ax.set_facecolor('#0B132B')

p_main = patches.FancyBboxPatch((-4.9, -2.3), 9.8, 4.7, boxstyle="round,pad=0.06", fc="#0F172A", ec="#1E293B", lw=1.2)
ax.add_patch(p_main)

ax.text(-4.6, 2.1, 'AERODYNAMIC POLAR & STABILITY ANALYTICS SUITE', color='#00A896', fontsize=8.5, fontweight='bold')
ax.text(-4.6, 1.8, '5 Synchronized Aerospace Plots for Comprehensive Hydrodynamic/Aerodynamic Characterization', color='#94A3B8', fontsize=6.5)

# 4 mini cards
quad_titles = ['1. Lift vs Angle of Attack (CL-α)', '2. Drag Polar (CL vs CD)', '3. Section Pressure Loop (Cp-x/c)', '4. Pitch Moment Stability (CM-α)']
quad_desc = [
    '• Slope: a0 = 2π / sqrt(1 - M^2)\n• Stall Onset @ α = 15.5°\n• Linear regime up to α = 12°',
    '• CD = CD0 + k * CL^2\n• Parasitic CD0 = 0.0078\n• Wave drag rise @ Transonic',
    '• Suction peak Cp = -5.45\n• Trailing edge recovery\n• Section lift integral',
    '• dCM/dα < 0 (Stable trim)\n• Aerodynamic center @ 25% c\n• Neutral point margin'
]

for i in range(4):
    qx = -4.5 + (i % 2) * 4.6
    qy = 0.45 - (i // 2) * 1.35
    qbox = patches.FancyBboxPatch((qx, qy), 4.3, 1.15, boxstyle="round,pad=0.04", fc="#1E293B", ec="#028090", lw=1)
    ax.add_patch(qbox)
    ax.text(qx + 0.15, qy + 0.88, quad_titles[i], color='#38BDF8', fontsize=7, fontweight='bold')
    ax.text(qx + 0.15, qy + 0.25, quad_desc[i], color='#CBD5E1', fontsize=6.0)

ax.set_xlim(-5.0, 5.0)
ax.set_ylim(-2.5, 2.7)
ax.axis('off')
ax.set_title('Analytics Suite: Lift, Drag, Pressure Distribution & Longitudinal Stability', fontsize=9.5, fontweight='bold', color='#F8FAFC', pad=6)

plt.tight_layout()
plt.savefig('ppt_assets/ui_analytics_suite.png', dpi=300, facecolor=fig.get_facecolor())
plt.close()

print("All 4 UI previews generated successfully!")
