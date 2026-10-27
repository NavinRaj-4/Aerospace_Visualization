import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Sparkles, Database } from 'lucide-react';

export default function UploadRunModal({ isOpen, onClose, onUploadSuccess }) {
  const [dragActive, setDragActive] = useState(false);
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [parseError, setParseError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const sampleCSV = `Run_ID,Model_Code,Mach,Re,AoA,CL,CD,CM,Lead_Investigator
RUN-EXP-TEST-001,naca0012,0.15,3000000,0.0,0.000,0.0078,0.000,Dr. User Aerodynamicist
RUN-EXP-TEST-002,naca0012,0.15,3000000,4.0,0.435,0.0093,-0.002,Dr. User Aerodynamicist
RUN-EXP-TEST-003,naca0012,0.15,3000000,8.0,0.865,0.0146,-0.004,Dr. User Aerodynamicist
RUN-EXP-TEST-004,naca0012,0.15,3000000,12.0,1.272,0.0258,-0.008,Dr. User Aerodynamicist
RUN-EXP-TEST-005,naca0012,0.15,3000000,16.0,1.485,0.0760,-0.045,Dr. User Aerodynamicist`;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    setFileName(file.name);
    setParseError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      setFileContent(text);
      parseContent(text, file.name);
    };
    reader.readAsText(file);
  };

  const loadSample = () => {
    setFileName('sample_windtunnel_sweep.csv');
    setFileContent(sampleCSV);
    parseContent(sampleCSV, 'sample_windtunnel_sweep.csv');
  };

  const parseContent = (text, name) => {
    try {
      setParseError(null);
      const isJson = name.endsWith('.json') || text.trim().startsWith('{') || text.trim().startsWith('[');

      if (isJson) {
        const json = JSON.parse(text);
        const runsArray = Array.isArray(json) ? json : (json.testRuns || json.runs || [json]);
        if (!runsArray || runsArray.length === 0) {
          throw new Error('No test run records found in JSON payload');
        }
        setParsedData(runsArray);
      } else {
        // CSV Parsing
        const lines = text.trim().split(/\r?\n/).filter(l => l.trim() && !l.startsWith('#'));
        if (lines.length < 2) {
          throw new Error('CSV must contain a header row and at least one data row');
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, '').toLowerCase());
        const runs = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
          const runObj = {};
          headers.forEach((h, idx) => {
            const val = values[idx];
            if (h.includes('run_id') || h === 'runid') runObj.runId = val;
            else if (h.includes('model') || h === 'code') runObj.modelId = val;
            else if (h.includes('aoa') || h === 'alpha') runObj.aoa = parseFloat(val);
            else if (h === 'cl' || h.includes('lift')) runObj.cl = parseFloat(val);
            else if (h === 'cd' || h.includes('drag')) runObj.cd = parseFloat(val);
            else if (h === 'cm' || h.includes('moment')) runObj.cm = parseFloat(val);
            else if (h === 'mach') runObj.mach = parseFloat(val);
            else if (h.includes('reynolds') || h === 're') runObj.reynolds = parseFloat(val);
            else if (h.includes('investigator') || h.includes('testedby')) runObj.testedBy = val;
          });

          // Defaults
          runObj.modelId = runObj.modelId || 'naca0012';
          runObj.aoa = runObj.aoa !== undefined ? runObj.aoa : 0;
          runs.push(runObj);
        }

        setParsedData(runs);
      }
    } catch (err) {
      setParseError(err.message || 'Failed to parse aerodynamic file structure');
      setParsedData(null);
    }
  };

  const handleConfirmUpload = async () => {
    if (!parsedData || parsedData.length === 0) return;
    setIsProcessing(true);
    try {
      await onUploadSuccess(parsedData);
      onClose();
    } catch (e) {
      setParseError('Error saving uploaded runs to store');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl aero-card bg-slate-900 border border-cyan-500/50 shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="reticle-corner-tl" />
        <div className="reticle-corner-tr" />
        <div className="reticle-corner-bl" />
        <div className="reticle-corner-br" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-mono text-white uppercase tracking-wider">
                Upload Wind Tunnel Flight Test Data
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Parse custom CSV / JSON aerodynamic sweeps into in-memory store
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

        {/* Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
            dragActive
              ? 'border-cyan-400 bg-cyan-950/40 shadow-cyan-glow'
              : 'border-slate-700 bg-slate-950/50 hover:border-slate-500'
          }`}
        >
          <UploadCloud className="w-10 h-10 mx-auto text-cyan-400/80 mb-2 animate-pulse" />
          <div className="text-sm font-mono font-bold text-slate-200">
            Drag &amp; Drop Telemetry File (CSV or JSON)
          </div>
          <div className="text-xs font-mono text-slate-400 mt-1">
            Supports AoA, CL, CD, CM, Mach, and Reynolds headers
          </div>

          <div className="mt-4 flex items-center justify-center space-x-3">
            <label className="cursor-pointer px-4 py-2 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 text-xs font-mono font-semibold transition-all">
              <span>Browse File</span>
              <input
                type="file"
                accept=".csv,.json,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <button
              onClick={loadSample}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono border border-slate-600 flex items-center space-x-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Load Sample CSV</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {parseError && (
          <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs font-mono flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
            <span>{parseError}</span>
          </div>
        )}

        {/* Parsed Preview Table */}
        {parsedData && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400 font-bold flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Validated {parsedData.length} Test Records Ready for Ingestion</span>
              </span>
              <span className="text-slate-400">{fileName}</span>
            </div>

            <div className="bg-slate-950 rounded-lg border border-slate-800 overflow-x-auto max-h-48 text-xs font-mono">
              <table className="w-full text-left">
                <thead className="bg-slate-900/80 text-slate-400 text-[10px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-2">Run ID</th>
                    <th className="p-2">Model</th>
                    <th className="p-2">AoA</th>
                    <th className="p-2">CL</th>
                    <th className="p-2">CD</th>
                    <th className="p-2">Mach</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {parsedData.slice(0, 5).map((r, i) => (
                    <tr key={i} className="hover:bg-slate-900/40">
                      <td className="p-2 text-cyan-300">{r.runId || `RUN-IMP-${i + 1}`}</td>
                      <td className="p-2">{r.modelId || 'naca0012'}</td>
                      <td className="p-2">{r.aoa !== undefined ? `${r.aoa}°` : '0°'}</td>
                      <td className="p-2 text-emerald-400">{r.cl !== undefined ? r.cl : '--'}</td>
                      <td className="p-2 text-amber-400">{r.cd !== undefined ? r.cd : '--'}</td>
                      <td className="p-2">{r.mach || 0.15}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {parsedData.length > 5 && (
                <div className="p-2 text-[10px] text-slate-500 text-center border-t border-slate-800">
                  + {parsedData.length - 5} more records parsed
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-mono text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmUpload}
            disabled={!parsedData || isProcessing}
            className={`px-5 py-2 rounded-lg text-xs font-mono font-bold flex items-center space-x-2 transition-all ${
              parsedData && !isProcessing
                ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-glow'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>{isProcessing ? 'Ingesting...' : `Ingest ${parsedData ? parsedData.length : 0} Runs`}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
