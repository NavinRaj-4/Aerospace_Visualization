import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AeroApi } from '../../services/api';
import { audioEngine } from '../../services/audioEngine';
import { 
  Database, 
  Search, 
  Filter, 
  Download, 
  Upload, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpDown, 
  Trash2, 
  Layers, 
  Info, 
  X, 
  Award, 
  ShieldAlert, 
  Compass, 
  Flame 
} from 'lucide-react';
import ExportTelemetryModal from './ExportTelemetryModal';
import UploadRunModal from './UploadRunModal';

export default function DatasetInspector({ 
  runs, 
  onUploadRuns, 
  onDeleteRun,
  selectedModel 
}) {
  const { user, can } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedRegime, setSelectedRegime] = useState('ALL');
  const [selectedModelFilter, setSelectedModelFilter] = useState('ALL');
  const [stallOnly, setStallOnly] = useState(false);
  const [sortField, setSortField] = useState('timestamp');
  const [sortDir, setSortDir] = useState('desc');

  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedRunDossier, setSelectedRunDossier] = useState(null);
  const [deletingRunId, setDeletingRunId] = useState(null);
  const [alertNotice, setAlertNotice] = useState('');

  // Filter and Sort Runs
  const filteredRuns = useMemo(() => {
    let result = [...runs];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(r => 
        r.runId.toLowerCase().includes(q) ||
        r.modelName.toLowerCase().includes(q) ||
        (r.testedBy && r.testedBy.toLowerCase().includes(q))
      );
    }

    if (selectedRegime !== 'ALL') {
      result = result.filter(r => r.regime.toUpperCase() === selectedRegime.toUpperCase());
    }

    if (selectedModelFilter !== 'ALL') {
      result = result.filter(r => r.modelId === selectedModelFilter);
    }

    if (stallOnly) {
      result = result.filter(r => r.stallFlag === true);
    }

    // Sort
    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string') {
        return sortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortDir === 'asc' ? (valA || 0) - (valB || 0) : (valB || 0) - (valA || 0);
    });

    return result;
  }, [runs, search, selectedRegime, selectedModelFilter, stallOnly, sortField, sortDir]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const handleDeleteRun = async (runId) => {
    if (!can('DELETE_RUN')) {
      setAlertNotice('Clearance Denied: Senior Aerodynamicist or Flight Director clearance required to delete test runs.');
      setTimeout(() => setAlertNotice(''), 5000);
      return;
    }

    try {
      await AeroApi.deleteTestRun(runId);
      if (onDeleteRun) onDeleteRun(runId);
      audioEngine.playClick();
      setDeletingRunId(null);
      setAlertNotice(`Test run [${runId}] successfully purged from SQLite flight database.`);
      setTimeout(() => setAlertNotice(''), 4000);
    } catch (err) {
      setAlertNotice(`Delete failed: ${err.message}`);
    }
  };

  // KPIs
  const totalRuns = runs.length;
  const stallEventsCount = runs.filter(r => r.stallFlag).length;
  const avgLd = totalRuns > 0 ? (runs.reduce((sum, r) => sum + (r.ld || 0), 0) / totalRuns).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      {/* Top Telemetry KPI Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="aero-card p-4">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Total Recorded Runs</div>
          <div className="text-2xl font-bold font-mono text-cyan-300 mt-1">{totalRuns}</div>
          <div className="text-[10px] font-mono text-slate-500 mt-1">Persistent SQLite Flight Database</div>
        </div>

        <div className="aero-card p-4">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Attached Flow Tests</div>
          <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{totalRuns - stallEventsCount}</div>
          <div className="text-[10px] font-mono text-emerald-400/80 mt-1">Laminar / Boundary Attached</div>
        </div>

        <div className="aero-card p-4">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Stall &amp; Buffet Warnings</div>
          <div className="text-2xl font-bold font-mono text-rose-400 mt-1">{stallEventsCount}</div>
          <div className="text-[10px] font-mono text-rose-400/80 mt-1">Flow Separation Excursions</div>
        </div>

        <div className="aero-card p-4">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Average Glide L/D</div>
          <div className="text-2xl font-bold font-mono text-slate-100 mt-1">{avgLd}</div>
          <div className="text-[10px] font-mono text-slate-400 mt-1">Dataset Mean Efficiency</div>
        </div>
      </div>

      {alertNotice && (
        <div className="p-3 rounded-xl bg-slate-900 border border-cyan-500/50 text-cyan-200 font-mono text-xs flex items-center justify-between animate-fade-in shadow-cyan-glow">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>{alertNotice}</span>
          </div>
          <button onClick={() => setAlertNotice('')} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Main Table Container */}
      <div className="aero-card p-5 space-y-4">
        {/* Toolbar: Search, Filters, and Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Run ID, model, or investigator..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                if (!can('UPLOAD_DATASET')) {
                  setAlertNotice('Clearance Denied: Senior Aerodynamicist or Flight Director clearance required to upload datasets.');
                  setTimeout(() => setAlertNotice(''), 5000);
                  return;
                }
                setIsUploadOpen(true);
              }}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 text-xs font-mono transition-all hover:shadow-cyan-glow"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Run Data</span>
            </button>

            <button
              onClick={() => setIsExportOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-200 border border-cyan-500/50 text-xs font-mono transition-all hover:shadow-cyan-glow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Telemetry</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 flex items-center space-x-1 mr-1">
              <Filter className="w-3 h-3 text-cyan-400" />
              <span>Regime:</span>
            </span>
            {['ALL', 'Subsonic', 'Transonic', 'Supersonic'].map((regime) => (
              <button
                key={regime}
                onClick={() => setSelectedRegime(regime)}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  selectedRegime === regime
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40 shadow-cyan-glow'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {regime}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setStallOnly(!stallOnly)}
              className={`px-2.5 py-1 rounded-md border flex items-center space-x-1.5 transition-all ${
                stallOnly
                  ? 'bg-rose-950 text-rose-300 border-rose-500/50 shadow-red-glow'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
              }`}
            >
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              <span>Stall Events Only</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/50">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/90 text-slate-400 text-[11px] uppercase border-b border-slate-800 select-none">
              <tr>
                <th onClick={() => toggleSort('runId')} className="p-3 cursor-pointer hover:text-cyan-400">
                  <div className="flex items-center space-x-1">
                    <span>Run ID</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th onClick={() => toggleSort('modelName')} className="p-3 cursor-pointer hover:text-cyan-400">
                  <div className="flex items-center space-x-1">
                    <span>Model / Body</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th onClick={() => toggleSort('regime')} className="p-3 cursor-pointer hover:text-cyan-400">
                  <div className="flex items-center space-x-1">
                    <span>Regime</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th onClick={() => toggleSort('mach')} className="p-3 cursor-pointer hover:text-cyan-400 text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <span>Mach</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th onClick={() => toggleSort('aoa')} className="p-3 cursor-pointer hover:text-cyan-400 text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <span>AoA (α)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th onClick={() => toggleSort('cl')} className="p-3 cursor-pointer hover:text-cyan-400 text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <span>CL</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th onClick={() => toggleSort('cd')} className="p-3 cursor-pointer hover:text-cyan-400 text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <span>CD</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th onClick={() => toggleSort('cm')} className="p-3 cursor-pointer hover:text-cyan-400 text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <span>CM</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th onClick={() => toggleSort('ld')} className="p-3 cursor-pointer hover:text-cyan-400 text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <span>L/D</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredRuns.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-slate-500 font-mono">
                    No flight test records matching query criteria.
                  </td>
                </tr>
              ) : (
                filteredRuns.map((r, i) => (
                  <tr 
                    key={r.runId || i} 
                    className="hover:bg-slate-900/60 transition-colors cursor-pointer group"
                  >
                    <td 
                      onClick={() => setSelectedRunDossier(r)}
                      className="p-3 font-bold text-cyan-300 group-hover:underline flex items-center space-x-1.5"
                    >
                      <span>{r.runId}</span>
                    </td>
                    <td onClick={() => setSelectedRunDossier(r)} className="p-3 text-slate-100 font-medium">
                      {r.modelName}
                    </td>
                    <td onClick={() => setSelectedRunDossier(r)} className="p-3">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                        r.regime === 'Subsonic' ? 'badge-cyan' : r.regime === 'Transonic' ? 'badge-emerald' : 'badge-amber'
                      }`}>
                        {r.regime}
                      </span>
                    </td>
                    <td onClick={() => setSelectedRunDossier(r)} className="p-3 text-right font-bold text-slate-200">
                      {r.mach ? r.mach.toFixed(2) : '0.15'}
                    </td>
                    <td onClick={() => setSelectedRunDossier(r)} className="p-3 text-right font-bold text-cyan-400">
                      {r.aoa !== undefined ? r.aoa.toFixed(1) : '0.0'}°
                    </td>
                    <td onClick={() => setSelectedRunDossier(r)} className="p-3 text-right font-bold text-emerald-400">
                      {r.cl !== undefined ? r.cl.toFixed(3) : '0.000'}
                    </td>
                    <td onClick={() => setSelectedRunDossier(r)} className="p-3 text-right text-amber-300">
                      {r.cd !== undefined ? r.cd.toFixed(4) : '0.0000'}
                    </td>
                    <td onClick={() => setSelectedRunDossier(r)} className="p-3 text-right text-violet-300">
                      {r.cm !== undefined ? r.cm.toFixed(3) : '0.000'}
                    </td>
                    <td onClick={() => setSelectedRunDossier(r)} className="p-3 text-right font-bold text-cyan-200">
                      {r.ld ? r.ld.toFixed(1) : '--'}
                    </td>
                    <td onClick={() => setSelectedRunDossier(r)} className="p-3 text-center">
                      {r.stallFlag ? (
                        <span className="badge-red px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center space-x-1">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          <span>{r.status || 'STALL'}</span>
                        </span>
                      ) : (
                        <span className="badge-emerald px-2 py-0.5 rounded text-[10px] inline-flex items-center space-x-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>ATTACHED</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {deletingRunId === r.runId ? (
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => handleDeleteRun(r.runId)}
                            className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold"
                          >
                            Purge
                          </button>
                          <button
                            onClick={() => setDeletingRunId(null)}
                            className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setSelectedRunDossier(r)}
                            title="Inspect Run Dossier"
                            className="text-slate-400 hover:text-cyan-400 p-1 rounded hover:bg-slate-800"
                          >
                            <Info className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingRunId(r.runId)}
                            title="Delete Run Record (Engineer/Director)"
                            className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-slate-800"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2">
          <span>Showing {filteredRuns.length} of {runs.length} test run records</span>
          <span className="text-slate-500">Persistent SQLite Aerodynamic Telemetry Engine</span>
        </div>
      </div>

      {/* Run Dossier Modal */}
      {selectedRunDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-xl bg-slate-900 border border-cyan-500/40 rounded-2xl shadow-2xl p-6 aero-hud-bar space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold font-mono text-white">
                    FLIGHT TEST RUN CERTIFICATE
                  </h4>
                  <span className="text-xs font-mono text-cyan-300">{selectedRunDossier.runId}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedRunDossier(null)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 block">Aerospace Model:</span>
                <span className="text-slate-200 font-bold">{selectedRunDossier.modelName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Facility ID:</span>
                <span className="text-cyan-300 font-bold">{selectedRunDossier.facilityId}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Flow Regime & Mach:</span>
                <span className="text-slate-200">{selectedRunDossier.regime} (Mach {selectedRunDossier.mach?.toFixed(2)})</span>
              </div>
              <div>
                <span className="text-slate-500 block">Dynamic Pressure (q∞):</span>
                <span className="text-amber-300 font-bold">{selectedRunDossier.dynamicPressureKpa?.toFixed(2)} kPa</span>
              </div>
              <div>
                <span className="text-slate-500 block">Angle of Attack (α):</span>
                <span className="text-cyan-300 font-bold">{selectedRunDossier.aoa?.toFixed(1)}°</span>
              </div>
              <div>
                <span className="text-slate-500 block">Glide Ratio (L/D):</span>
                <span className="text-emerald-400 font-bold">{selectedRunDossier.ld?.toFixed(1)}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Lift Coefficient (C_L):</span>
                <span className="text-emerald-300 font-bold">{selectedRunDossier.cl?.toFixed(3)}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Drag Coefficient (C_D):</span>
                <span className="text-rose-300 font-bold">{selectedRunDossier.cd?.toFixed(4)}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Investigator / Tested By:</span>
                <span className="text-slate-300">{selectedRunDossier.testedBy}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Timestamp:</span>
                <span className="text-slate-400">{selectedRunDossier.timestamp}</span>
              </div>
            </div>

            {selectedRunDossier.notes && (
              <div className="text-xs font-mono text-slate-400 bg-slate-950/40 p-3 rounded-lg border border-slate-800">
                <span className="text-cyan-400 font-bold">Calibration Notes: </span>
                {selectedRunDossier.notes}
              </div>
            )}

            <div className="pt-2 flex justify-between items-center">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                selectedRunDossier.stallFlag ? 'badge-red' : 'badge-emerald'
              }`}>
                {selectedRunDossier.stallFlag ? 'FLOW SEPARATED / STALL BUFFET' : 'LAMINAR ATTACHED FLOW'}
              </span>
              <button
                onClick={() => setSelectedRunDossier(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono"
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ExportTelemetryModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        runs={filteredRuns}
        selectedModel={selectedModel}
      />

      <UploadRunModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={onUploadRuns}
      />
    </div>
  );
}
