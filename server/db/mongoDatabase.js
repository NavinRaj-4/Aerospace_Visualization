import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {
  AEROSPACE_FACILITIES,
  AEROSPACE_MODELS,
  INITIAL_TEST_RUNS
} from '../data/aerospaceData.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aerospace';

// --- SCHEMAS ---
const userSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'engineer', 'operator', 'viewer'], default: 'viewer' },
  callsign: { type: String, default: 'AERO-PILOT' },
  department: { type: String, default: 'Aerodynamics Research' },
  created_at: { type: String, default: () => new Date().toISOString() },
  last_login: { type: String, default: null }
}, { timestamps: true });

const facilitySchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  regime: { type: String, required: true },
  status: { type: String, default: 'ACTIVE' },
  machRange: String,
  testSectionSize: String,
  maxDynamicPressure: String,
  turbulenceIntensity: String,
  fanRpm: { type: Number, default: 0 },
  activeTemperature: String,
  stagnationPressure: String,
  currentModelId: String,
  coolingCircuit: String,
  powerDrawKw: { type: Number, default: 600 }
}, { timestamps: true });

const modelSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  regime: { type: String, required: true },
  reynoldsNumber: String,
  reynoldsNumberValue: Number,
  machNumber: Number,
  chord: Number,
  span: Number,
  aspectRatio: Number,
  thicknessRatio: String,
  stallAngle: Number,
  clMax: Number,
  clAlpha: Number,
  cd0: Number,
  cm0: Number,
  maxLOverD: Number,
  description: String,
  flowCharacteristics: String,
  facilityId: String,
  meshType: String,
  foilCoordinates: [
    {
      x: Number,
      yt: Number
    }
  ],
  isCustom: { type: Boolean, default: false },
  created_by: { type: String, default: 'SYSTEM_REFERENCE' }
}, { timestamps: true });

const testRunSchema = new mongoose.Schema({
  runId: { type: String, unique: true, required: true },
  modelId: { type: String, required: true },
  modelName: { type: String, required: true },
  facilityId: String,
  regime: String,
  mach: Number,
  reynolds: Number,
  dynamicPressureKpa: Number,
  aoa: Number,
  cl: Number,
  cd: Number,
  cm: Number,
  ld: Number,
  status: String,
  stallFlag: { type: Boolean, default: false },
  timestamp: String,
  testedBy: String,
  turbulencePct: { type: Number, default: 0.10 },
  notes: String
}, { timestamps: true });

const auditLogSchema = new mongoose.Schema({
  timestamp: { type: String, default: () => new Date().toISOString().replace('T', ' ').slice(0, 19) },
  userId: String,
  userName: String,
  userRole: String,
  action: { type: String, required: true },
  severity: { type: String, enum: ['INFO', 'WARN', 'CRITICAL'], default: 'INFO' },
  details: String
}, { timestamps: true });

export const UserModel = mongoose.model('User', userSchema);
export const FacilityModel = mongoose.model('Facility', facilitySchema);
export const AerospaceModel = mongoose.model('Model', modelSchema);
export const TestRunModel = mongoose.model('TestRun', testRunSchema);
export const AuditLogModel = mongoose.model('AuditLog', auditLogSchema);

export class MongoDatabaseService {
  constructor() {
    this.isConnected = false;
    this.uri = MONGODB_URI;
  }

  async connect() {
    try {
      mongoose.set('strictQuery', false);
      await mongoose.connect(this.uri, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000
      });
      this.isConnected = true;
      console.log(`[MONGODB] Connected successfully to ${this.uri}`);
      await this.seedInitialData();
      return true;
    } catch (err) {
      console.warn(`[MONGODB] Connection to ${this.uri} failed: ${err.message}`);
      this.isConnected = false;
      return false;
    }
  }

  async seedInitialData() {
    try {
      // 1. Seed Users if empty
      const userCount = await UserModel.countDocuments();
      if (userCount === 0) {
        console.log('[MONGODB] Seeding default personnel accounts into MongoDB...');
        const defaultUsers = [
          {
            id: 'USR-DIR-001',
            email: 'director@aerospace.gov',
            password: bcrypt.hashSync('director123', 10),
            name: 'Dr. Elena Vance',
            role: 'admin',
            callsign: 'VORTEX-LEAD',
            department: 'Flight Test Directorate',
            created_at: new Date().toISOString()
          },
          {
            id: 'USR-ENG-002',
            email: 'engineer@aerospace.gov',
            password: bcrypt.hashSync('engineer123', 10),
            name: 'Marcus Thorne',
            role: 'engineer',
            callsign: 'MACH-CHIEF',
            department: 'Aero Calibration Division',
            created_at: new Date().toISOString()
          },
          {
            id: 'USR-OPS-003',
            email: 'operator@aerospace.gov',
            password: bcrypt.hashSync('operator123', 10),
            name: 'Sarah Jenkins',
            role: 'operator',
            callsign: 'CHAMBER-ONE',
            department: 'Tunnel Operations Control',
            created_at: new Date().toISOString()
          },
          {
            id: 'USR-VIEW-004',
            email: 'guest@aerospace.gov',
            password: bcrypt.hashSync('viewer123', 10),
            name: 'Cadet Alex Chen',
            role: 'viewer',
            callsign: 'CADET-ALPHA',
            department: 'Aerospace Academy & Research',
            created_at: new Date().toISOString()
          }
        ];
        await UserModel.insertMany(defaultUsers);
      }

      // 2. Seed Facilities if empty
      const facCount = await FacilityModel.countDocuments();
      if (facCount === 0) {
        console.log('[MONGODB] Seeding wind tunnel test facilities into MongoDB...');
        await FacilityModel.insertMany(AEROSPACE_FACILITIES);
      }

      // 3. Seed Models if empty
      const modelCount = await AerospaceModel.countDocuments();
      if (modelCount === 0) {
        console.log('[MONGODB] Seeding aerodynamic test models into MongoDB...');
        await AerospaceModel.insertMany(AEROSPACE_MODELS);
      }

      // 4. Seed Test Runs if empty
      const runCount = await TestRunModel.countDocuments();
      if (runCount === 0) {
        console.log('[MONGODB] Seeding flight test runs into MongoDB...');
        await TestRunModel.insertMany(INITIAL_TEST_RUNS);
      }

      // 5. Seed Audit Logs if empty
      const auditCount = await AuditLogModel.countDocuments();
      if (auditCount === 0) {
        await this.addAuditLog({
          userId: 'USR-DIR-001',
          userName: 'Dr. Elena Vance',
          userRole: 'admin',
          action: 'MONGODB_INITIALIZED',
          severity: 'INFO',
          details: `Aerospace Platform connected to MongoDB (v9.0.4) on database 'aerospace'. Collections primed.`
        });
      }
    } catch (e) {
      console.error('[MONGODB] Error seeding data:', e.message);
    }
  }

  // --- STATS & HEALTH ---
  async getDatabaseStats() {
    if (!this.isConnected) {
      return { connected: false, uri: this.uri };
    }

    const [users, facilities, models, runs, logs] = await Promise.all([
      UserModel.countDocuments(),
      FacilityModel.countDocuments(),
      AerospaceModel.countDocuments(),
      TestRunModel.countDocuments(),
      AuditLogModel.countDocuments()
    ]);

    return {
      connected: true,
      engine: 'MongoDB Server v9.0 (Mongoose ODM)',
      uri: this.uri,
      databaseName: mongoose.connection.name || 'aerospace',
      collections: {
        users,
        facilities,
        models,
        testRuns: runs,
        auditLogs: logs
      }
    };
  }

  // --- USER METHODS ---
  async getUserByEmail(email) {
    return await UserModel.findOne({ email: email.toLowerCase() }).lean();
  }

  async getUserById(id) {
    const user = await UserModel.findOne({ id }).select('-password').lean();
    return user;
  }

  async getAllUsers() {
    return await UserModel.find().select('-password').sort({ created_at: 1 }).lean();
  }

  async createUser({ id, email, password, name, role, callsign, department }) {
    const newUser = new UserModel({
      id,
      email: email.toLowerCase(),
      password,
      name,
      role: role || 'viewer',
      callsign: callsign || 'AERO-PILOT',
      department: department || 'Aerodynamic Testing & Analysis',
      created_at: new Date().toISOString()
    });
    await newUser.save();
    return await this.getUserById(id);
  }

  async updateUserLastLogin(id) {
    await UserModel.updateOne({ id }, { last_login: new Date().toISOString() });
  }

  async updateUserRole(id, role) {
    await UserModel.updateOne({ id }, { role });
    return await this.getUserById(id);
  }

  // --- FACILITY METHODS ---
  async getAllFacilities() {
    return await FacilityModel.find().sort({ id: 1 }).lean();
  }

  async getFacilityById(id) {
    return await FacilityModel.findOne({ id }).lean();
  }

  async updateFacility(id, updates) {
    await FacilityModel.updateOne({ id }, { $set: updates });
    return await this.getFacilityById(id);
  }

  // --- MODEL METHODS ---
  async getAllModels() {
    return await AerospaceModel.find().sort({ id: 1 }).lean();
  }

  async getModelById(id) {
    return await AerospaceModel.findOne({ id }).lean();
  }

  async createModel(modelData) {
    const newModel = new AerospaceModel({
      ...modelData,
      isCustom: true
    });
    await newModel.save();
    return await this.getModelById(modelData.id);
  }

  async deleteModel(id) {
    const res = await AerospaceModel.deleteOne({ id });
    return res.deletedCount > 0;
  }

  // --- TEST RUN METHODS ---
  async getAllRuns(filters = {}) {
    const query = {};

    if (filters.search) {
      const s = filters.search;
      query.$or = [
        { runId: { $regex: s, $options: 'i' } },
        { modelName: { $regex: s, $options: 'i' } },
        { testedBy: { $regex: s, $options: 'i' } }
      ];
    }

    if (filters.regime && filters.regime !== 'ALL') {
      query.regime = { $regex: new RegExp(`^${filters.regime}$`, 'i') };
    }

    if (filters.modelId && filters.modelId !== 'ALL') {
      query.modelId = filters.modelId;
    }

    if (filters.stallOnly === 'true' || filters.stallOnly === true) {
      query.stallFlag = true;
    }

    return await TestRunModel.find(query).sort({ timestamp: -1 }).lean();
  }

  async getRunById(runId) {
    return await TestRunModel.findOne({ runId }).lean();
  }

  async createRun(runData) {
    await TestRunModel.findOneAndUpdate(
      { runId: runData.runId },
      { $set: runData },
      { upsert: true, new: true }
    );
    return await this.getRunById(runData.runId);
  }

  async createRunsBatch(runsArray) {
    const results = [];
    for (const r of runsArray) {
      const saved = await this.createRun(r);
      results.push(saved);
    }
    return results;
  }

  async deleteRun(runId) {
    const res = await TestRunModel.deleteOne({ runId });
    return res.deletedCount > 0;
  }

  // --- AUDIT LOG METHODS ---
  async addAuditLog({ userId, userName, userRole, action, severity = 'INFO', details }) {
    try {
      const log = new AuditLogModel({
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        userId: userId || 'SYSTEM',
        userName: userName || 'Autonomous Agent',
        userRole: userRole || 'system',
        action,
        severity,
        details: details || ''
      });
      await log.save();
    } catch (e) {
      console.warn('[MONGODB] Audit log save error:', e.message);
    }
  }

  async getAuditLogs(limit = 100) {
    return await AuditLogModel.find().sort({ createdAt: -1, _id: -1 }).limit(limit).lean();
  }
}

export const mongoDb = new MongoDatabaseService();
