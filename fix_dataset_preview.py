import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np

# Re-generate ui_dataset_preview.png with generous spacing so text never overlaps
fig, ax = plt.subplots(figsize=(10.0, 6.2), dpi=300)
fig.patch.set_facecolor('#070D18')
ax.set_facecolor('#0B132B')

ax.text(-4.8, 2.45, 'AERODYNAMIC DATASET INSPECTOR & TELEMETRY LOGS', color='#06B6D4', fontsize=10, fontweight='bold')
ax.text(-4.8, 2.15, 'Filter by: Model [All] | Regime [Subsonic] | Status [All] | Search: "RUN-SUB"', color='#94A3B8', fontsize=7.5)

# Table Box
tbl_box = patches.FancyBboxPatch((-4.9, -2.4), 9.8, 4.4, boxstyle="round,pad=0.06", fc="#0F172A", ec="#1E293B", lw=1.4)
ax.add_patch(tbl_box)

headers = ['RUN ID', 'AIRFOIL MODEL', 'MACH', 'AoA (deg)', 'CL', 'CD', 'CM', 'L/D', 'STATUS']
col_x = [-4.6, -2.9, -1.4, -0.6, 0.2, 1.0, 1.8, 2.6, 3.6]

for h, x in zip(headers, col_x):
    ax.text(x, 1.7, h, color='#00A896', fontsize=7.2, fontweight='bold', va='center')
ax.axhline(1.5, color='#334155', lw=1.2)

rows = [
    ['RUN-SUB-2026-101', 'NACA 0012', '0.15', '0.0 deg', '0.000', '0.0078', '0.000', '0.0', 'COMPLETED'],
    ['RUN-SUB-2026-102', 'NACA 0012', '0.15', '+4.0 deg', '0.435', '0.0093', '-0.002', '46.8', 'COMPLETED'],
    ['RUN-SUB-2026-103', 'NACA 0012', '0.15', '+8.0 deg', '0.865', '0.0146', '-0.004', '59.2', 'COMPLETED'],
    ['RUN-SUB-2026-104', 'NACA 0012', '0.15', '+15.5 deg', '1.580', '0.0492', '-0.017', '32.1', 'STALL_ONSET'],
    ['RUN-SUB-2026-105', 'NACA 0012', '0.15', '+18.0 deg', '1.150', '0.1680', '-0.115', '6.8', 'STALL_SEPARATED'],
    ['RUN-TRANS-2026-201', 'SC(2)-0714', '0.73', '+6.0 deg', '1.180', '0.0151', '-0.098', '78.4', 'COMPLETED'],
    ['UPLOAD-RUN-2026-01', 'NACA 2412', '0.15', '+10.0 deg', '1.074', '0.0192', '-0.006', '55.9', 'IMPORTED_VALID']
]

for r_idx, row in enumerate(rows):
    y = 1.2 - r_idx * 0.48
    status_col = '#10B981' if 'COMPLETED' in row[-1] or 'IMPORTED' in row[-1] else '#F43F5E' if 'STALL' in row[-1] else '#38BDF8'
    for c_idx, (val, x) in enumerate(zip(row, col_x)):
        c_col = status_col if c_idx == len(row)-1 else '#F8FAFC' if c_idx == 0 else '#CBD5E1'
        ax.text(x, y, val, color=c_col, fontsize=6.8, fontfamily='monospace' if c_idx in [0, 2, 3, 4, 5, 6, 7] else 'sans-serif', va='center')
    if r_idx < len(rows) - 1:
        ax.axhline(y - 0.22, color='#1E293B', lw=0.6)

ax.set_xlim(-5.0, 5.0)
ax.set_ylim(-2.5, 2.7)
ax.axis('off')
ax.set_title('Dataset Inspector: Flight Telemetry Records & Search Filter Table', fontsize=10, fontweight='bold', color='#F8FAFC', pad=8)

plt.tight_layout()
plt.savefig('ppt_assets/ui_dataset_preview.png', dpi=300, facecolor=fig.get_facecolor(), bbox_inches='tight')
plt.close()
print("Re-generated ppt_assets/ui_dataset_preview.png with clean typography.")
