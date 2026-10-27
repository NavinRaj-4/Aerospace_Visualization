import express from 'express';
import cors from 'cors';
import { aeroDb } from './db/database.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { authenticateToken, optionalAuth, requireRole } from './middleware/auth.js';
import { calculateAerodynamics } from './data/aerospaceData.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '15mb' }));

// Mount Auth and Admin Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Health / Status & Database Information
app.get('/api/health', async (req, res) => {
  const users = await aeroDb.getAllUsers();
  const facilities = await aeroDb.getAllFacilities();
  const runs = await aeroDb.getAllRuns();
  const models = await aeroDb.getAllModels();
  const dbStats = await aeroDb.getDatabaseStats();

  res.json({
    status: 'ONLINE',
    service: 'Aerospace Wind Tunnel REST Telemetry & Auth Engine',
    timestamp: new Date().toISOString(),
    totalTestRuns: runs.length,
    activeFacilities: facilities.length,
    registeredModels: models.length,
    activePersonnel: users.length,
    databaseEngine: dbStats.engine || 'MongoDB Server v9.0 (Mongoose ODM)',
    databaseStatus: dbStats
  });
});

// Database Management & Storage Status
app.get('/api/database/status', async (req, res) => {
  const stats = await aeroDb.getDatabaseStats();
  res.json({
    success: true,
    data: stats
  });
});

// Wind Tunnel Facilities
app.get('/api/facilities', async (req, res) => {
  const facilities = await aeroDb.getAllFacilities();
  res.json({
    success: true,
    total: facilities.length,
    data: facilities
  });
});

app.get('/api/facilities/:id', async (req, res) => {
  const fac = await aeroDb.getFacilityById(req.params.id);
  if (!fac) {
    return res.status(404).json({ success: false, message: 'Facility not found' });
  }
  res.json({ success: true, data: fac });
});

// Update Facility Telemetry / Controls (Operator or Admin clearance)
app.patch('/api/facilities/:id', authenticateToken, requireRole('operator', 'admin'), async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const updated = await aeroDb.updateFacility(id, updates);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Facility not found' });
  }

  await aeroDb.addAuditLog({
    userId: req.user.id,
    userName: req.user.name,
    userRole: req.user.role,
    action: 'FACILITY_PARAM_UPDATE',
    severity: 'INFO',
    details: `Operator ${req.user.name} adjusted parameters for ${updated.name} (Fan: ${updated.fanRpm} RPM, Status: ${updated.status}).`
  });

  res.json({
    success: true,
    message: `Facility ${updated.name} parameters updated in MongoDB.`,
    data: updated
  });
});

// Emergency Facility SCRAM / Safe Shutdown (Operator or Admin)
app.post('/api/facilities/:id/emergency-stop', authenticateToken, requireRole('operator', 'admin'), async (req, res) => {
  const { id } = req.params;
  const { reason = 'Manual Emergency Scram Triggered by Operator' } = req.body;

  const fac = await aeroDb.getFacilityById(id);
  if (!fac) {
    return res.status(404).json({ success: false, message: 'Facility not found' });
  }

  const updated = await aeroDb.updateFacility(id, {
    status: 'EMERGENCY_SHUTDOWN',
    fanRpm: 0,
    powerDrawKw: 15,
    coolingCircuit: 'Emergency Purge Active'
  });

  await aeroDb.addAuditLog({
    userId: req.user.id,
    userName: req.user.name,
    userRole: req.user.role,
    action: 'EMERGENCY_SCRAM',
    severity: 'CRITICAL',
    details: `CRITICAL: Facility ${fac.name} [${fac.id}] emergency scram triggered by ${req.user.name} (${req.user.callsign}). Reason: ${reason}. Drive motor tripped, nitrogen purge active.`
  });

  res.json({
    success: true,
    message: `[CRITICAL ALERT] Emergency Scram triggered for ${fac.name}. Motor speed dropped to 0 RPM.`,
    data: updated
  });
});

// Aerospace Models
app.get('/api/models', async (req, res) => {
  const models = await aeroDb.getAllModels();
  res.json({
    success: true,
    total: models.length,
    data: models
  });
});

app.get('/api/models/:id', async (req, res) => {
  const model = await aeroDb.getModelById(req.params.id);
  if (!model) {
    return res.status(404).json({ success: false, message: 'Aerospace model not found' });
  }
  res.json({
    success: true,
    data: model
  });
});

// Register New Aerospace Model (Engineer or Admin clearance)
app.post('/api/models', authenticateToken, requireRole('engineer', 'admin'), async (req, res) => {
  const modelData = req.body;
  if (!modelData || !modelData.name || !modelData.regime) {
    return res.status(400).json({ success: false, message: 'Model name and aerodynamic regime are required' });
  }

  const modelId = modelData.id || `custom_${modelData.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now().toString().slice(-4)}`;
  
  // Default airfoil coordinates if none provided
  const foilCoordinates = modelData.foilCoordinates && modelData.foilCoordinates.length > 0 
    ? modelData.foilCoordinates 
    : [
        { x: 1.000, yt: 0.0015 },
        { x: 0.900, yt: 0.0200 },
        { x: 0.700, yt: 0.0520 },
        { x: 0.500, yt: 0.0710 },
        { x: 0.300, yt: 0.0750 },
        { x: 0.150, yt: 0.0550 },
        { x: 0.050, yt: 0.0280 },
        { x: 0.000, yt: 0.0000 }
      ];

  const newModel = await aeroDb.createModel({
    ...modelData,
    id: modelId,
    foilCoordinates,
    created_by: req.user.name
  });

  await aeroDb.addAuditLog({
    userId: req.user.id,
    userName: req.user.name,
    userRole: req.user.role,
    action: 'MODEL_CREATED',
    severity: 'INFO',
    details: `Aerodynamicist ${req.user.name} registered new test article [${newModel.name}] (${newModel.code}) into MongoDB.`
  });

  res.status(201).json({
    success: true,
    message: `Aerospace model '${newModel.name}' registered successfully into MongoDB.`,
    data: newModel
  });
});

// Delete Aerospace Model (Admin only)
app.delete('/api/models/:id', authenticateToken, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const model = await aeroDb.getModelById(id);
  if (!model) {
    return res.status(404).json({ success: false, message: 'Model not found' });
  }

  await aeroDb.deleteModel(id);

  await aeroDb.addAuditLog({
    userId: req.user.id,
    userName: req.user.name,
    userRole: req.user.role,
    action: 'MODEL_DELETED',
    severity: 'WARN',
    details: `Admin ${req.user.name} deleted model [${model.name}] (${id}) from MongoDB.`
  });

  res.json({
    success: true,
    message: `Model ${model.name} removed from registry.`
  });
});

// Test Runs - Search, Filter, Query
app.get('/api/runs', async (req, res) => {
  const runs = await aeroDb.getAllRuns(req.query);
  res.json({
    success: true,
    total: runs.length,
    data: runs
  });
});

app.get('/api/runs/:runId', async (req, res) => {
  const run = await aeroDb.getRunById(req.params.runId);
  if (!run) {
    return res.status(404).json({ success: false, message: 'Test run record not found' });
  }
  res.json({ success: true, data: run });
});

// Add New Test Run (Operator, Engineer, or Admin clearance)
app.post('/api/runs', authenticateToken, requireRole('operator', 'engineer', 'admin'), async (req, res) => {
  const runData = req.body;
  if (!runData || !runData.modelId || runData.aoa === undefined) {
    return res.status(400).json({ success: false, message: 'Invalid run telemetry payload' });
  }

  const model = (await aeroDb.getModelById(runData.modelId)) || (await aeroDb.getAllModels())[0];
  const computed = calculateAerodynamics(runData.modelId, Number(runData.aoa), runData.mach ? Number(runData.mach) : null);

  const newRun = {
    runId: runData.runId || `RUN-${model.regime.slice(0, 3).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    modelId: model.id,
    modelName: model.name,
    facilityId: model.facilityId || 'TUNNEL-SUB-01',
    regime: model.regime,
    mach: computed.mach,
    reynolds: runData.reynolds || model.reynoldsNumberValue,
    dynamicPressureKpa: computed.qInf,
    aoa: computed.aoa,
    cl: runData.cl !== undefined ? Number(runData.cl) : computed.cl,
    cd: runData.cd !== undefined ? Number(runData.cd) : computed.cd,
    cm: runData.cm !== undefined ? Number(runData.cm) : computed.cm,
    ld: computed.ld,
    status: computed.stall === 'LAMINAR_ATTACHED' ? 'COMPLETED' : computed.stall,
    stallFlag: computed.stall !== 'LAMINAR_ATTACHED',
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    testedBy: req.user ? `${req.user.name} (${req.user.callsign})` : (runData.testedBy || 'Aero-Suite Operator'),
    turbulencePct: runData.turbulencePct || 0.10,
    notes: runData.notes || `Test point logged under ${model.regime} flow`
  };

  const created = await aeroDb.createRun(newRun);

  await aeroDb.addAuditLog({
    userId: req.user.id,
    userName: req.user.name,
    userRole: req.user.role,
    action: 'TEST_RUN_LOGGED',
    severity: 'INFO',
    details: `${req.user.name} logged test run ${newRun.runId} for model ${newRun.modelName} into MongoDB.`
  });

  res.status(201).json({
    success: true,
    message: 'Test run recorded successfully into MongoDB flight database',
    data: created
  });
});

// Delete Test Run (Engineer or Admin clearance)
app.delete('/api/runs/:runId', authenticateToken, requireRole('engineer', 'admin'), async (req, res) => {
  const { runId } = req.params;
  const existing = await aeroDb.getRunById(runId);
  if (!existing) {
    return res.status(404).json({ success: false, message: 'Test run record not found' });
  }

  await aeroDb.deleteRun(runId);

  await aeroDb.addAuditLog({
    userId: req.user.id,
    userName: req.user.name,
    userRole: req.user.role,
    action: 'TEST_RUN_DELETED',
    severity: 'WARN',
    details: `${req.user.name} deleted flight test record [${runId}] for model ${existing.modelName} from MongoDB.`
  });

  res.json({
    success: true,
    message: `Test run ${runId} purged from MongoDB.`
  });
});

// Real-time Dynamic Aerodynamic Computation Point
app.get('/api/telemetry/live-point', (req, res) => {
  const { modelId = 'naca0012', aoa = 0, mach } = req.query;
  const result = calculateAerodynamics(
    modelId,
    parseFloat(aoa) || 0,
    mach ? parseFloat(mach) : null
  );

  res.json({
    success: true,
    data: result
  });
});

// Full AoA Sweep generation
app.get('/api/telemetry/sweep', (req, res) => {
  const { modelId = 'naca0012', startAoA = -4, endAoA = 20, step = 0.5 } = req.query;
  const sweepPoints = [];
  const start = parseFloat(startAoA);
  const end = parseFloat(endAoA);
  const inc = parseFloat(step);

  for (let a = start; a <= end + 0.001; a += inc) {
    sweepPoints.push(calculateAerodynamics(modelId, a));
  }

  res.json({
    success: true,
    modelId,
    pointsCount: sweepPoints.length,
    data: sweepPoints
  });
});

// Upload and parse user-provided aerodynamic dataset in MongoDB (Engineer or Admin)
app.post('/api/upload-dataset', authenticateToken, requireRole('engineer', 'admin'), async (req, res) => {
  const { runs } = req.body;
  if (!Array.isArray(runs) || runs.length === 0) {
    return res.status(400).json({ success: false, message: 'Array of runs expected' });
  }

  const validatedRuns = runs.map((r, i) => {
    const aoa = parseFloat(r.aoa || r.AoA || r.AOA || 0);
    const mach = parseFloat(r.mach || r.Mach || 0.15);
    const modelId = r.modelId || 'naca0012';
    const computed = calculateAerodynamics(modelId, aoa, mach);

    return {
      runId: r.runId || `IMPORT-${Date.now().toString().slice(-6)}-${i + 1}`,
      modelId: modelId,
      modelName: r.modelName || (modelId === 'naca0012' ? 'NACA 0012' : modelId === 'supercritical_sc2' ? 'NASA SC(2)-0714' : '65° Delta Wing'),
      facilityId: r.facilityId || 'TUNNEL-SUB-01',
      regime: r.regime || (mach < 0.7 ? 'Subsonic' : mach < 1.2 ? 'Transonic' : 'Supersonic'),
      mach: mach,
      reynolds: parseFloat(r.reynolds || r.Re || 3000000),
      dynamicPressureKpa: parseFloat(r.dynamicPressureKpa || r.qInf || computed.qInf),
      aoa: aoa,
      cl: parseFloat(r.cl || r.CL || computed.cl),
      cd: parseFloat(r.cd || r.CD || computed.cd),
      cm: parseFloat(r.cm || r.CM || computed.cm),
      ld: parseFloat(r.ld || r.LD || computed.ld),
      status: 'IMPORTED_VALIDATED',
      stallFlag: computed.stall !== 'LAMINAR_ATTACHED',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      testedBy: req.user ? `${req.user.name} (Ingested)` : (r.testedBy || 'Dataset Importer'),
      turbulencePct: 0.10,
      notes: 'Batch ingested dataset file'
    };
  });

  const inserted = await aeroDb.createRunsBatch(validatedRuns);

  await aeroDb.addAuditLog({
    userId: req.user.id,
    userName: req.user.name,
    userRole: req.user.role,
    action: 'DATASET_INGESTION',
    severity: 'INFO',
    details: `${req.user.name} imported batch aerodynamic dataset of ${validatedRuns.length} flight records into MongoDB.`
  });

  res.json({
    success: true,
    message: `Successfully ingested and persisted ${validatedRuns.length} aerodynamic test runs into MongoDB.`,
    importedCount: validatedRuns.length,
    data: inserted
  });
});

app.listen(PORT, () => {
  console.log(`[AERO-SERVER] Wind Tunnel Telemetry REST & Auth API active on port ${PORT}`);
  console.log(`[AERO-SERVER] Mode: MONGODB DATABASE STORAGE (mongodb://127.0.0.1:27017/aerospace)`);
  console.log(`[AERO-SERVER] Authentication & RBAC Enabled: Admin, Engineer, Operator, Viewer`);
});
