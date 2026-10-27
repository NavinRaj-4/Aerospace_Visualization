import matplotlib.pyplot as plt
import numpy as np
import os

os.makedirs('ppt_assets', exist_ok=True)

# Set global style
plt.rcParams['font.sans-serif'] = 'DejaVu Sans'
plt.rcParams['axes.edgecolor'] = '#334155'
plt.rcParams['axes.linewidth'] = 1.2
plt.rcParams['grid.color'] = '#1E293B'
plt.rcParams['grid.linestyle'] = '--'
plt.rcParams['grid.alpha'] = 0.7

# 1. Lift Curve (CL vs Alpha)
fig, ax = plt.subplots(figsize=(5.5, 3.8), dpi=300)
fig.patch.set_facecolor('#0B1320')
ax.set_facecolor('#0F172A')

alpha_naca = np.array([-4, -2, 0, 2, 4, 6, 8, 10, 12, 14, 15, 15.5, 16, 17, 18, 20])
cl_naca = np.array([-0.432, -0.216, 0.0, 0.218, 0.435, 0.652, 0.865, 1.074, 1.272, 1.458, 1.545, 1.58, 1.485, 1.28, 1.15, 0.98])

alpha_sc2 = np.array([-4, -2, 0, 2, 4, 6, 8, 10, 12, 13, 14, 15, 16, 18, 20])
cl_sc2 = np.array([-0.12, 0.15, 0.42, 0.68, 0.94, 1.18, 1.39, 1.56, 1.68, 1.71, 1.62, 1.42, 1.24, 0.98, 0.82])

ax.plot(alpha_naca, cl_naca, 'o-', color='#06B6D4', lw=2.5, markersize=5, label='NACA 0012 (M=0.15)')
ax.plot(alpha_sc2, cl_sc2, 's--', color='#38BDF8', lw=2.2, markersize=4.5, label='NASA SC(2)-0714 (M=0.73)')

# Highlight stall
ax.axvline(15.5, color='#F43F5E', linestyle=':', alpha=0.8)
ax.annotate(r'$C_{L,max} = 1.58$' + '\n(Stall @ 15.5°)', xy=(15.5, 1.58), xytext=(9.5, 1.62),
            color='#F43F5E', fontsize=8.5, fontweight='bold',
            arrowprops=dict(facecolor='#F43F5E', shrink=0.08, width=1.5, headwidth=5))

ax.set_title(r'Lift Coefficient ($C_L$) vs Angle of Attack ($\alpha$)', fontsize=11, fontweight='bold', color='#F8FAFC', pad=8)
ax.set_xlabel(r'Angle of Attack $\alpha$ (deg)', fontsize=9.5, color='#94A3B8')
ax.set_ylabel(r'Lift Coefficient $C_L$', fontsize=9.5, color='#94A3B8')
ax.tick_params(colors='#94A3B8', labelsize=8.5)
ax.grid(True)
ax.legend(facecolor='#1E293B', edgecolor='#334155', fontsize=8, labelcolor='#F8FAFC', loc='lower right')

plt.tight_layout()
plt.savefig('ppt_assets/chart_lift_curve.png', dpi=300, facecolor=fig.get_facecolor())
plt.close()

# 2. Drag Polar (CL vs CD)
fig, ax = plt.subplots(figsize=(5.5, 3.8), dpi=300)
fig.patch.set_facecolor('#0B1320')
ax.set_facecolor('#0F172A')

cd_naca = np.array([0.0092, 0.0081, 0.0078, 0.0081, 0.0093, 0.0114, 0.0146, 0.0192, 0.0258, 0.0358, 0.0435, 0.0492, 0.076, 0.124, 0.168, 0.235])
cd_sc2 = np.array([0.0125, 0.0102, 0.0098, 0.0105, 0.0122, 0.0151, 0.0195, 0.0262, 0.0365, 0.0450, 0.0720, 0.1150, 0.1550, 0.2200, 0.2850])

ax.plot(cd_naca, cl_naca, 'o-', color='#10B981', lw=2.5, markersize=5, label=r'NACA 0012 ($C_{D0}=0.0078$)')
ax.plot(cd_sc2, cl_sc2, 's--', color='#34D399', lw=2.2, markersize=4.5, label=r'NASA SC(2)-0714 ($C_{D0}=0.0098$)')

ax.annotate('Drag Bucket\n(Min Drag)', xy=(0.0078, 0.0), xytext=(0.05, -0.25),
            color='#10B981', fontsize=8.5, fontweight='bold',
            arrowprops=dict(facecolor='#10B981', shrink=0.08, width=1.5, headwidth=5))

ax.annotate('Post-Stall Drag Rise', xy=(0.168, 1.15), xytext=(0.11, 0.7),
            color='#F59E0B', fontsize=8.5, fontweight='bold',
            arrowprops=dict(facecolor='#F59E0B', shrink=0.08, width=1.5, headwidth=5))

ax.set_title(r'Drag Polar: Lift ($C_L$) vs Drag ($C_D$)', fontsize=11, fontweight='bold', color='#F8FAFC', pad=8)
ax.set_xlabel(r'Drag Coefficient $C_D$', fontsize=9.5, color='#94A3B8')
ax.set_ylabel(r'Lift Coefficient $C_L$', fontsize=9.5, color='#94A3B8')
ax.tick_params(colors='#94A3B8', labelsize=8.5)
ax.grid(True)
ax.legend(facecolor='#1E293B', edgecolor='#334155', fontsize=8, labelcolor='#F8FAFC', loc='upper left')

plt.tight_layout()
plt.savefig('ppt_assets/chart_drag_polar.png', dpi=300, facecolor=fig.get_facecolor())
plt.close()

# 3. Pressure Distribution (Cp vs x/c)
fig, ax = plt.subplots(figsize=(5.5, 3.8), dpi=300)
fig.patch.set_facecolor('#0B1320')
ax.set_facecolor('#0F172A')

xc = np.array([0.00, 0.02, 0.05, 0.10, 0.20, 0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90, 1.00])
cp_upper = np.array([0.95, -2.15, -1.65, -1.25, -0.88, -0.65, -0.46, -0.32, -0.18, -0.05, 0.08, 0.15, 0.18])
cp_lower = np.array([0.95, -0.12, 0.15, 0.28, 0.32, 0.28, 0.22, 0.15, 0.10, 0.06, 0.08, 0.12, 0.16])

ax.plot(xc, cp_upper, 'o-', color='#38BDF8', lw=2.5, markersize=5, label=r'Upper Suction ($C_p < 0$)')
ax.plot(xc, cp_lower, 's-', color='#FB923C', lw=2.5, markersize=5, label=r'Lower Pressure ($C_p > 0$)')
ax.fill_between(xc, cp_upper, cp_lower, color='#0284C7', alpha=0.18, label=r'Lift Integral $\oint C_p d(x/c)$')

ax.invert_yaxis()
ax.axhline(0, color='#64748B', linestyle=':', lw=1)

ax.set_title(r'Chordwise $C_p$ vs $x/c$ (NACA 0012, $\alpha=4^\circ$)', fontsize=11, fontweight='bold', color='#F8FAFC', pad=8)
ax.set_xlabel(r'Normalized Chord Station $x/c$', fontsize=9.5, color='#94A3B8')
ax.set_ylabel(r'Pressure Coefficient $-C_p$ (Suction $\uparrow$)', fontsize=9.5, color='#94A3B8')
ax.tick_params(colors='#94A3B8', labelsize=8.5)
ax.grid(True)
ax.legend(facecolor='#1E293B', edgecolor='#334155', fontsize=8, labelcolor='#F8FAFC', loc='upper right')

plt.tight_layout()
plt.savefig('ppt_assets/chart_pressure_cp.png', dpi=300, facecolor=fig.get_facecolor())
plt.close()

# 4. Aerodynamic Efficiency (L/D vs Alpha)
fig, ax = plt.subplots(figsize=(5.5, 3.8), dpi=300)
fig.patch.set_facecolor('#0B1320')
ax.set_facecolor('#0F172A')

ld_naca = cl_naca / cd_naca
ld_sc2 = cl_sc2 / cd_sc2

ax.plot(alpha_naca, ld_naca, 'o-', color='#A855F7', lw=2.5, markersize=5, label=r'NACA 0012 (Max $L/D=59.2$ @ 8°)')
ax.plot(alpha_sc2, ld_sc2, 's--', color='#C084FC', lw=2.2, markersize=4.5, label=r'NASA SC(2)-0714 (Max $L/D=78.4$ @ 6°)')

ax.axhline(0, color='#64748B', linestyle=':', lw=1)
ax.annotate(r'$(L/D)_{max} = 78.4$', xy=(6.0, 78.4), xytext=(8.5, 65.0),
            color='#C084FC', fontsize=8.5, fontweight='bold',
            arrowprops=dict(facecolor='#C084FC', shrink=0.08, width=1.5, headwidth=5))

ax.set_title(r'Aerodynamic Efficiency ($L/D$) vs Angle of Attack ($\alpha$)', fontsize=11, fontweight='bold', color='#F8FAFC', pad=8)
ax.set_xlabel(r'Angle of Attack $\alpha$ (deg)', fontsize=9.5, color='#94A3B8')
ax.set_ylabel(r'Lift-to-Drag Ratio $L/D$', fontsize=9.5, color='#94A3B8')
ax.tick_params(colors='#94A3B8', labelsize=8.5)
ax.grid(True)
ax.legend(facecolor='#1E293B', edgecolor='#334155', fontsize=8, labelcolor='#F8FAFC', loc='upper right')

plt.tight_layout()
plt.savefig('ppt_assets/chart_efficiency_ld.png', dpi=300, facecolor=fig.get_facecolor())
plt.close()

print("All 4 aerodynamic charts generated successfully!")
