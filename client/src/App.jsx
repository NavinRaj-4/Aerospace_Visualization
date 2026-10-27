import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Common/Header';
import MissionOverview from './components/Dashboard/MissionOverview';
import WindTunnelCanvas from './components/WindTunnel3D/WindTunnelCanvas';
import AnalyticsSuite from './components/Charts/AnalyticsSuite';
import DatasetInspector from './components/RunTable/DatasetInspector';
import LiveTunnelSweep from './components/LiveSweep/LiveTunnelSweep';
import AdminControlPanel from './components/Admin/AdminControlPanel';
import AuthModal from './components/Auth/AuthModal';
import UserProfileModal from './components/Auth/UserProfileModal';
import LoginPage from './components/Auth/LoginPage';
import CreateModelModal from './components/Common/CreateModelModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AeroApi } from './services/api';
import { audioEngine } from './services/audioEngine';
import { 
  AEROSPACE_MODELS, 
  AEROSPACE_FACILITIES, 
  INITIAL_TEST_RUNS, 
  calculateAerodynamics 
} from './mockData/aerospaceData';
import { ShieldCheck, Wind, Radio } from 'lucide-react';

function AppContent() {
  const { user, can, isLoginPageOpen, setIsLoginPageOpen, isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [models, setModels] = useState(AEROSPACE_MODELS);
  const [facilities, setFacilities] = useState(AEROSPACE_FACILITIES);
  const [testRuns, setTestRuns] = useState(INITIAL_TEST_RUNS);
  const [selectedModel, setSelectedModel] = useState(AEROSPACE_MODELS[0]);
  const [aoa, setAoa] = useState(4.0);
  const [mach, setMach] = useState(AEROSPACE_MODELS[0].machNumber);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [createModelOpen, setCreateModelOpen] = useState(false);

  // Load initial backend/store state from persistent database
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [facs, mods, runs] = await Promise.all([
          AeroApi.getFacilities(),
          AeroApi.getModels(),
          AeroApi.getTestRuns()
        ]);
        if (facs && facs.length > 0) setFacilities(facs);
        if (mods && mods.length > 0) {
          setModels(mods);
          setSelectedModel(mods[0]);
          setMach(mods[0].machNumber);
        }
        if (runs && runs.length > 0) setTestRuns(runs);
      } catch (err) {
        console.warn('[App] Local fallback active:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Update Mach when selected model changes
  const handleSelectModel = (model) => {
    setSelectedModel(model);
    setMach(model.machNumber);
  };

  // Instant Aerodynamic Telemetry computation whenever model, AoA, or Mach changes
  const currentTelemetry = useMemo(() => {
    if (!selectedModel) return null;
    return calculateAerodynamics(selectedModel.id, aoa, mach);
  }, [selectedModel, aoa, mach]);

  // Audio stall alarm trigger
  useEffect(() => {
    if (audioEnabled && currentTelemetry && currentTelemetry.stall !== 'LAMINAR_ATTACHED') {
      audioEngine.playStallWarning();
    }
  }, [audioEnabled, currentTelemetry?.stall]);

  // Add uploaded runs to state and API store
  const handleUploadRuns = async (uploadedRuns) => {
    try {
      const result = await AeroApi.uploadRuns(uploadedRuns);
      setTestRuns((prev) => [...result, ...prev]);
    } catch (err) {
      console.warn('[App] Upload fallback:', err);
    }
  };

  // Delete test run
  const handleDeleteRun = (runId) => {
    setTestRuns((prev) => prev.filter(r => r.runId !== runId));
  };

  // Update facility parameters in state
  const handleFacilityUpdated = (updatedFac) => {
    setFacilities((prev) => prev.map(f => f.id === updatedFac.id ? updatedFac : f));
  };

  // Register newly created model
  const handleModelCreated = (newModel) => {
    setModels((prev) => [newModel, ...prev]);
    setSelectedModel(newModel);
    setMach(newModel.machNumber);
    audioEngine.playClick();
  };

  // Save live sweep points
  const handleSaveSweepRuns = async (sweepPoints) => {
    const newRuns = sweepPoints.map((pt, i) => ({
      runId: `SWEEP-${selectedModel.regime.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}-${i + 1}`,
      modelId: selectedModel.id,
      modelName: selectedModel.name,
      facilityId: selectedModel.facilityId,
      regime: selectedModel.regime,
      mach: pt.mach,
      reynolds: selectedModel.reynoldsNumberValue,
      dynamicPressureKpa: pt.qInf,
      aoa: pt.aoa,
      cl: pt.cl,
      cd: pt.cd,
      cm: pt.cm,
      ld: pt.ld,
      status: pt.stall === 'LAMINAR_ATTACHED' ? 'COMPLETED' : pt.stall,
      stallFlag: pt.stall !== 'LAMINAR_ATTACHED',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      testedBy: user ? `${user.name} (${user.callsign})` : 'Automated Tunnel Sweep Engine',
      turbulencePct: 0.08,
      notes: `Sweep recorded across [${sweepPoints[0]?.aoa}° to ${sweepPoints[sweepPoints.length - 1]?.aoa}°]`
    }));

    for (const r of newRuns) {
      try {
        await AeroApi.addTestRun(r);
      } catch (e) {
        // Fallback
      }
    }
    setTestRuns((prev) => [...newRuns, ...prev]);
    audioEngine.playClick();
  };

  // If loading session
  if (authLoading) {
    return (
      <div className="min-h-screen bg-aero-950 flex flex-col items-center justify-center font-mono text-cyan-400">
        <div className="w-12 h-12 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4 shadow-cyan-glow" />
        <span className="text-xs uppercase tracking-widest animate-pulse">Initializing Aerospace Clearance Engine...</span>
      </div>
    );
  }

  // Dedicated Full-Screen Login Page
  if (isLoginPageOpen || !isAuthenticated) {
    return (
      <LoginPage onLoginSuccess={() => setIsLoginPageOpen(false)} />
    );
  }

  return (
    <div className="min-h-screen bg-aero-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Aerospace Mission Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedModel={selectedModel}
        setSelectedModel={handleSelectModel}
        models={models}
        currentTelemetry={currentTelemetry}
        audioEnabled={audioEnabled}
        setAudioEnabled={setAudioEnabled}
        onOpenCreateModel={() => setCreateModelOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <MissionOverview
            selectedModel={selectedModel}
            setSelectedModel={handleSelectModel}
            models={models}
            facilities={facilities}
            currentTelemetry={currentTelemetry}
            aoa={aoa}
            setAoa={setAoa}
            testRunsCount={testRuns.length}
            setActiveTab={setActiveTab}
            onFacilityUpdated={handleFacilityUpdated}
          />
        )}

        {activeTab === 'windtunnel' && (
          <div className="space-y-6">
            <WindTunnelCanvas
              selectedModel={selectedModel}
              aoa={aoa}
              setAoa={setAoa}
              mach={mach}
              setMach={setMach}
              currentTelemetry={currentTelemetry}
            />
          </div>
        )}

        {activeTab === 'analytics' && (
          <AnalyticsSuite
            selectedModel={selectedModel}
            models={models}
            currentTelemetry={currentTelemetry}
          />
        )}

        {activeTab === 'datasets' && (
          <DatasetInspector
            runs={testRuns}
            onUploadRuns={handleUploadRuns}
            onDeleteRun={handleDeleteRun}
            selectedModel={selectedModel}
          />
        )}

        {activeTab === 'sweep' && (
          <LiveTunnelSweep
            selectedModel={selectedModel}
            onSaveSweepRuns={handleSaveSweepRuns}
            audioEnabled={audioEnabled}
            setAudioEnabled={setAudioEnabled}
          />
        )}

        {activeTab === 'admin' && (
          <AdminControlPanel />
        )}
      </main>

      {/* Futuristic Bottom Status Strip */}
      <footer className="border-t border-slate-900 bg-aero-950/90 py-3 px-4 text-xs font-mono text-slate-500 text-center flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          <span>AERO-SUITE ENTERPRISE TELEMETRY ENGINE</span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400">Persistent SQLite Storage &amp; RBAC Clearance Guard</span>
        </div>
        <div className="mt-2 sm:mt-0 text-slate-400 flex items-center space-x-3">
          <span>Active Personnel: <strong className="text-cyan-300">{user?.name || 'Guest'}</strong> [{user?.role ? user.role.toUpperCase() : 'OBSERVER'}]</span>
          <span>•</span>
          <span>Subsonic / Transonic / Supersonic Wind Tunnel Calibration</span>
        </div>
      </footer>

      {/* Global Modals */}
      <AuthModal />
      <UserProfileModal />
      <CreateModelModal
        isOpen={createModelOpen}
        onClose={() => setCreateModelOpen(false)}
        onModelCreated={handleModelCreated}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
