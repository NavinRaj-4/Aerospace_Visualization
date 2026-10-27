import React, { useState } from 'react';
import { Download, FileText, FileCode, Check, X, ShieldCheck } from 'lucide-react';

export default function ExportTelemetryModal({ isOpen, onClose, runs, selectedModel }) {
  const [exportFormat, setExportFormat] = useState('csv'); // 'csv' or 'json'
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateCSV = () => {
    const headers = [
      'Run_ID',
      'Model_Code',
      'Model_Name',
      'Regime',
      'Mach_Number',
      'Reynolds_Number',
      'Dynamic_Pressure_kPa',
      'Angle_of_Attack_deg',
      'Lift_Coefficient_CL',
      'Drag_Coefficient_CD',
      'Pitch_Moment_CM',
      'Lift_to_Drag_Ratio',
      'Stall_Flag',
      'Facility_ID',
      'Timestamp',
      'Lead_Investigator'
    ];

    const rows = runs.map(r => [
      r.runId,
      r.modelId,
      `"${r.modelName}"`,
      r.regime,
      r.mach,
      r.reynolds,
      r.dynamicPressureKpa,
      r.aoa,
      r.cl,
      r.cd,
      r.cm,
      r.ld,
      r.stallFlag ? 'STALL_DETECTED' : 'ATTACHED_FLOW',
      r.facilityId || 'TUNNEL-01',
      `"${r.timestamp}"`,
      `"${r.testedBy || 'Aerospace Staff'}"`
    ]);

    let output = '';
    if (includeMetadata) {
      output += `# AERO-SUITE TELEMETRY EXPORT\n`;
      output += `# Generation Time: ${new Date().toISOString()}\n`;
      output += `# Total Test Runs: ${runs.length}\n`;
      output += `# Export Mode: In-Memory Wind Tunnel Store\n`;
    }
    output += [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    return output;
  };

  const generateJSON = () => {
    const payload = {
      exportMetadata: {
        platform: 'AERO-SUITE Aerospace Wind Tunnel Telemetry',
        version: '2.4',
        timestamp: new Date().toISOString(),
        totalRecords: runs.length,
        selectedModel: selectedModel ? selectedModel.name : 'ALL'
      },
      testRuns: runs
    };
    return JSON.stringify(payload, null, 2);
  };

  const handleDownload = () => {
    let content, mimeType, filename;
    if (exportFormat === 'csv') {
      content = generateCSV();
      mimeType = 'text/csv;charset=utf-8;';
      filename = `Aerospace_WindTunnel_Runs_${Date.now()}.csv`;
    } else {
      content = generateJSON();
      mimeType = 'application/json;charset=utf-8;';
      filename = `Aerospace_WindTunnel_Runs_${Date.now()}.json`;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg aero-card bg-slate-900 border border-cyan-500/50 shadow-2xl p-6 space-y-5">
        <div className="reticle-corner-tl" />
        <div className="reticle-corner-tr" />
        <div className="reticle-corner-bl" />
        <div className="reticle-corner-br" />

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-mono text-white uppercase tracking-wider">
                Export Aerodynamic Telemetry
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Download formatted dataset of {runs.length} test records
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selectors */}
        <div className="space-y-3">
          <label className="text-xs font-mono text-slate-300 block uppercase tracking-wider">
            Select Output Format
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setExportFormat('csv')}
              className={`p-3 rounded-lg border text-left flex items-start space-x-3 transition-all ${
                exportFormat === 'csv'
                  ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 shadow-cyan-glow'
                  : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <FileText className="w-5 h-5 mt-0.5 text-cyan-400" />
              <div>
                <div className="font-mono text-sm font-bold">CSV Spreadsheet</div>
                <div className="text-[11px] font-mono text-slate-400">Comma-separated tabular data for MATLAB / Excel</div>
              </div>
            </button>

            <button
              onClick={() => setExportFormat('json')}
              className={`p-3 rounded-lg border text-left flex items-start space-x-3 transition-all ${
                exportFormat === 'json'
                  ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 shadow-cyan-glow'
                  : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <FileCode className="w-5 h-5 mt-0.5 text-cyan-400" />
              <div>
                <div className="font-mono text-sm font-bold">JSON Data Object</div>
                <div className="text-[11px] font-mono text-slate-400">Structured telemetry array with metadata</div>
              </div>
            </button>
          </div>
        </div>

        {/* Options */}
        <div className="flex items-center space-x-2 pt-2 text-xs font-mono text-slate-300">
          <input
            type="checkbox"
            id="includeMeta"
            checked={includeMetadata}
            onChange={(e) => setIncludeMetadata(e.target.checked)}
            className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
          />
          <label htmlFor="includeMeta">Include Wind Tunnel Facility &amp; Mach metadata headers</label>
        </div>

        {/* Preview Snippet */}
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-400 overflow-x-auto max-h-28">
          <div className="text-cyan-400 text-[10px] uppercase mb-1">Payload Preview</div>
          <pre>
            {exportFormat === 'csv' ? generateCSV().split('\n').slice(0, 4).join('\n') + '\n...' : generateJSON().slice(0, 180) + '...'}
          </pre>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-mono text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            className="px-5 py-2 rounded-lg text-xs font-mono font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-glow flex items-center space-x-2 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download {exportFormat.toUpperCase()}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
