import { mongoDb } from './mongoDatabase.js';
import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import {
  AEROSPACE_FACILITIES,
  AEROSPACE_MODELS,
  INITIAL_TEST_RUNS
} from '../data/aerospaceData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'aerospace.sqlite.db');

export class UnifiedDatabaseManager {
  constructor() {
    this.sqliteDb = new DatabaseSync(DB_PATH);
    this.isMongoActive = false;
    this.initSqliteSchema();
    this.initMongo();
  }

  async initMongo() {
    try {
      const ok = await mongoDb.connect();
      this.isMongoActive = ok;
      if (ok) {
        console.log('[AERO-DB] Primary storage active: MONGODB (mongodb://127.0.0.1:27017/aerospace)');
      } else {
        console.log('[AERO-DB] MongoDB standby, using SQLite backup store.');
      }
    } catch (e) {
      console.warn('[AERO-DB] MongoDB init warning:', e.message);
      this.isMongoActive = false;
    }
  }

  initSqliteSchema() {
    this.sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        callsign TEXT,
        department TEXT,
        created_at TEXT NOT NULL,
        last_login TEXT
      );

      CREATE TABLE IF NOT EXISTS facilities (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        regime TEXT NOT NULL,
        status TEXT NOT NULL,
        machRange TEXT,
        testSectionSize TEXT,
        maxDynamicPressure TEXT,
        turbulenceIntensity TEXT,
        fanRpm INTEGER,
        activeTemperature TEXT,
        stagnationPressure TEXT,
        currentModelId TEXT,
        coolingCircuit TEXT,
        powerDrawKw INTEGER
      );

      CREATE TABLE IF NOT EXISTS models (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        code TEXT NOT NULL,
        regime TEXT NOT NULL,
        reynoldsNumber TEXT,
        reynoldsNumberValue REAL,
        machNumber REAL,
        chord REAL,
        span REAL,
        aspectRatio REAL,
        thicknessRatio TEXT,
        stallAngle REAL,
        clMax REAL,
        clAlpha REAL,
        cd0 REAL,
        cm0 REAL,
        maxLOverD REAL,
        description TEXT,
        flowCharacteristics TEXT,
        facilityId TEXT,
        meshType TEXT,
        foilCoordinates TEXT,
        isCustom INTEGER DEFAULT 0,
        created_by TEXT
      );

      CREATE TABLE IF NOT EXISTS test_runs (
        runId TEXT PRIMARY KEY,
        modelId TEXT NOT NULL,
        modelName TEXT NOT NULL,
        facilityId TEXT,
        regime TEXT,
        mach REAL,
        reynolds REAL,
        dynamicPressureKpa REAL,
        aoa REAL,
        cl REAL,
        cd REAL,
        cm REAL,
        ld REAL,
        status TEXT,
        stallFlag INTEGER,
        timestamp TEXT,
        testedBy TEXT,
        turbulencePct REAL,
        notes TEXT
      );

      CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        userId TEXT,
        userName TEXT,
        userRole TEXT,
        action TEXT NOT NULL,
        severity TEXT DEFAULT 'INFO',
        details TEXT
      );
    `);

    // Seed SQLite baseline if empty
    const count = this.sqliteDb.prepare('SELECT COUNT(*) as c FROM users').get().c;
    if (count === 0) {
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

      const insUser = this.sqliteDb.prepare(`
        INSERT INTO users (id, email, password, name, role, callsign, department, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const u of defaultUsers) {
        insUser.run(u.id, u.email, u.password, u.name, u.role, u.callsign, u.department, u.created_at);
      }
    }
  }

  // --- STATS & HEALTH ---
  async getDatabaseStats() {
    if (this.isMongoActive && mongoDb.isConnected) {
      return await mongoDb.getDatabaseStats();
    }
    return {
      connected: false,
      engine: 'SQLite Fallback Engine',
      uri: 'node:sqlite (in-process)',
      collections: {
        users: this.sqliteDb.prepare('SELECT COUNT(*) as c FROM users').get().c,
        facilities: this.sqliteDb.prepare('SELECT COUNT(*) as c FROM facilities').get().c,
        models: this.sqliteDb.prepare('SELECT COUNT(*) as c FROM models').get().c,
        testRuns: this.sqliteDb.prepare('SELECT COUNT(*) as c FROM test_runs').get().c,
        auditLogs: this.sqliteDb.prepare('SELECT COUNT(*) as c FROM audit_logs').get().c
      }
    };
  }

  async reseedDatabase() {
    if (this.isMongoActive && mongoDb.isConnected) {
      await mongoDb.seedInitialData();
      return await mongoDb.getDatabaseStats();
    }
    return await this.getDatabaseStats();
  }

  // --- USER METHODS ---
  async getUserByEmail(email) {
    if (this.isMongoActive && mongoDb.isConnected) {
      return await mongoDb.getUserByEmail(email);
    }
    return this.sqliteDb.prepare('SELECT * FROM users WHERE LOWER(email) = LOWER(?)').get(email);
  }

  async getUserById(id) {
    if (this.isMongoActive && mongoDb.isConnected) {
      return await mongoDb.getUserById(id);
    }
    const row = this.sqliteDb.prepare('SELECT * FROM users WHERE id = ?').get(id);
    if (!row) return null;
    const { password, ...safeUser } = row;
    return safeUser;
  }

  async getAllUsers() {
    if (this.isMongoActive && mongoDb.isConnected) {
      return await mongoDb.getAllUsers();
    }
    return this.sqliteDb.prepare('SELECT id, email, name, role, callsign, department, created_at, last_login FROM users ORDER BY created_at ASC').all();
  }

  async createUser({ id, email, password, name, role, callsign, department }) {
    if (this.isMongoActive && mongoDb.isConnected) {
      return await mongoDb.createUser({ id, email, password, name, role, callsign, department });
    }
    const createdAt = new Date().toISOString();
    this.sqliteDb.prepare(`
      INSERT INTO users (id, email, password, name, role, callsign, department, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, email.toLowerCase(), password, name, role, callsign || 'AERO-PILOT', department || 'Aerodynamic Research', createdAt);
    return await this.getUserById(id);
  }

  async updateUserLastLogin(id) {
    if (this.isMongoActive && mongoDb.isConnected) {
      return await mongoDb.updateUserLastLogin(id);
    }
    this.sqliteDb.prepare('UPDATE users SET last_login = ? WHERE id = ?').run(new Date().toISOString(), id);
  }

  async updateUserRole(id, role) {
    if (this.isMongoActive && mongoDb.isConnected) {
      return await mongoDb.updateUserRole(id, role);
    }
    this.sqliteDb.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, id);
    return await this.getUserById(id);
  }

  // --- FACILITY METHODS ---
  async getAllFacilities() {
    if (this.isMongoActive && mongoDb.isConnected) {
      return await mongoDb.getAllFacilities();
    }
    return this.sqliteDb.prepare('SELECT * FROM facilities ORDER BY id ASC').all();
  }

  async getFacilityById(id) {
    if (this.isMongoActive && mongoDb.isConnected) {
      return await mongoDb.getFacilityById(id);
    }
    return this.sqliteDb.prepare('SELECT * FROM facilities WHERE id = ?').get(id);
  }

  async updateFacility(id, updates) {
    if (this.isMongoActive && mongoDb.isConnected) {
      return await mongoDb.updateFacility(id, updates);
    }
    const existing = await this.getFacilityById(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    this.sqliteDb.prepare(`
      UPDATE facilities SET
        status = ?, fanRpm = ?, activeTemperature = ?,
        stagnationPressure = ?, currentModelId = ?,
        coolingCircuit = ?, powerDrawKw = ?
      WHERE id = ?
    `).run(
      updated.status, updated.fanRpm, updated.activeTemperature,
      updated.stagnationPressure, updated.currentModelId,
      updated.coolingCircuit, updated.powerDrawKw, id
    );
    return await this.getFacilityById(id);
  }

  // --- MODEL METHODS ---
  async getAllModels() {
    if (this.isMongoActive && mongoDb.isConnected) {
      return await mongoDb.getAllModels();
    }
    const rows = this.sqliteDb.prepare('SELECT * FROM models ORDER BY id ASC').all();
    return rows.map(m => ({
      ...m,
      isCustom: Boolean(m.isCustom),
      foilCoordinates: m.foilCoordinates ? JSON.parse(m.foilCoordinates) : []
    }));
  }

  async getModelById(id) {
    if (this.isMongoActive && mongoDb.isConnected) {
      return await mongoDb.getModelById(id);
    }
    const m = this.sqliteDb.prepare('SELECT * FROM models WHERE id = ?').get(id);
    if (!m) return null;
    return {
      ...m,
      isCustom: Boolean(m.isCustom),
      foilCoordinates: m.foilCoordinates ? JSON.parse(m.foilCoordinates) : []
    };
  }

  async createModel(model) {
    if (this.isMongoActive && mongoDb.isConnected) {
      return await mongoDb.createModel(model);
    }
    const insert = this.sqliteDb.prepare(`
      INSERT INTO models (
        id, name, code, regime, reynoldsNumber, reynoldsNumberValue, machNumber,
        chord, span, aspectRatio, thicknessRatio, stallAngle, clMax, clAlpha,
        cd0, cm0, maxLOverD, description, flowCharacteristics, facilityId,
        meshType, foilCoordinates, isCustom, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insert.run(
      model.id, model.name, model.code || model.id.toUpperCase(), model.regime || 'Subsonic',
      model.reynoldsNumber || '3.0 × 10⁶', model.reynoldsNumberValue || 3000000, model.machNumber || 0.15,
      model.chord || 0.3, model.span || 0.9, model.aspectRatio || 3.0, model.thicknessRatio || '12%',
      model.stallAngle || 15.0, model.clMax || 1.5, model.clAlpha || 0.11, model.cd0 || 0.008,
      model.cm0 || 0.0, model.maxLOverD || 65.0, model.description || '', model.flowCharacteristics || '',
      model.facilityId || 'TUNNEL-SUB-01', model.meshType || 'airfoil_symmetric',
      JSON.stringify(model.foilCoordinates || []), 1, model.created_by || 'AERODYNAMICIST'
    );
    return await this.getModelById(model.id);
  }

  async deleteModel(id) {
    if (this.isMongoActive && mongoDb.isConnected) {
      return await mongoDb.deleteModel(id);
    }
    const model = await this.getModelById(id);
    if (!model) return false;
    this.sqliteDb.prepare('DELETE FROM models WHERE id = ?').run(id);
    return true;
  }

  // --- RUN METHODS ---
  async getAllRuns(filters = {}) {
    if (this.isMongoActive && mongoDb.isConnected) {
      return await mongoDb.getAllRuns(filters);
    }
    let query = 'SELECT * FROM test_runs WHERE 1=1';
    const params = [];
    if (filters.search) {
      query += ' AND (LOWER(runId) LIKE ? OR LOWER(modelName) LIKE ? OR LOWER(testedBy) LIKE ?)';
      const s = `%${filters.search.toLowerCase()}%`;
      params.push(s, s, s);
    }
    if (filters.regime && filters.regime !== 'ALL') {
      query += ' AND UPPER(regime) = ?';
      params.push(filters.regime.toUpperCase());
    }
    if (filters.modelId && filters.modelId !== 'ALL') {
      query += ' AND modelId = ?';
      params.push(filters.modelId);
    }
    if (filters.stallOnly === 'true' || filters.stallOnly === true) {
      query += ' AND stallFlag = 1';
    }
    query += ' ORDER BY timestamp DESC';
    const rows = this.sqliteDb.prepare(query).all(...params);
    return rows.map(r => ({ ...r, stallFlag: Boolean(r.stallFlag) }));
  }

  async getRunById(runId) {
    if (this.isMongoActive && mongoDb.isConnected) {
      return await mongoDb.getRunById(runId);
    }
    const row = this.sqliteDb.prepare('SELECT * FROM test_runs WHERE runId = ?').get(runId);
    if (!row) return null;
    return { ...row, stallFlag: Boolean(row.stallFlag) };
  }

  async createRun(run) {
    if (this.isMongoActive && mongoDb.isConnected) {
      return await mongoDb.createRun(run);
    }
    const insert = this.sqliteDb.prepare(`
      INSERT OR REPLACE INTO test_runs (
        runId, modelId, modelName, facilityId, regime, mach, reynolds,
        dynamicPressureKpa, aoa, cl, cd, cm, ld, status, stallFlag,
        timestamp, testedBy, turbulencePct, notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insert.run(
      run.runId, run.modelId, run.modelName, run.facilityId, run.regime,
      run.mach, run.reynolds, run.dynamicPressureKpa, run.aoa,
      run.cl, run.cd, run.cm, run.ld, run.status,
      run.stallFlag ? 1 : 0, run.timestamp, run.testedBy,
      run.turbulencePct || 0.10, run.notes || ''
    );
    return await this.getRunById(run.runId);
  }

  async createRunsBatch(runs) {
    if (this.isMongoActive && mongoDb.isConnected) {
      return await mongoDb.createRunsBatch(runs);
    }
    const results = [];
    for (const r of runs) {
      results.push(await this.createRun(r));
    }
    return results;
  }

  async deleteRun(runId) {
    if (this.isMongoActive && mongoDb.isConnected) {
      return await mongoDb.deleteRun(runId);
    }
    const existing = await this.getRunById(runId);
    if (!existing) return false;
    this.sqliteDb.prepare('DELETE FROM test_runs WHERE runId = ?').run(runId);
    return true;
  }

  // --- AUDIT LOG METHODS ---
  async addAuditLog({ userId, userName, userRole, action, severity = 'INFO', details }) {
    if (this.isMongoActive && mongoDb.isConnected) {
      return await mongoDb.addAuditLog({ userId, userName, userRole, action, severity, details });
    }
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    this.sqliteDb.prepare(`
      INSERT INTO audit_logs (timestamp, userId, userName, userRole, action, severity, details)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(timestamp, userId || 'SYSTEM', userName || 'Autonomous Agent', userRole || 'system', action, severity, details || '');
  }

  async getAuditLogs(limit = 100) {
    if (this.isMongoActive && mongoDb.isConnected) {
      return await mongoDb.getAuditLogs(limit);
    }
    return this.sqliteDb.prepare('SELECT * FROM audit_logs ORDER BY id DESC LIMIT ?').all(limit);
  }
}

export const aeroDb = new UnifiedDatabaseManager();
