import express from 'express';
import bcrypt from 'bcryptjs';
import { aeroDb } from '../db/database.js';
import { generateToken, authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Preset Demo Accounts for Quick Login
export const DEMO_ACCOUNTS = [
  {
    role: 'admin',
    name: 'Dr. Elena Vance',
    title: 'Flight Test Director',
    callsign: 'VORTEX-LEAD',
    email: 'director@aerospace.gov',
    password: 'director123',
    department: 'Flight Test Directorate',
    badge: 'CLEARANCE LEVEL 5 [DIRECTOR]',
    permissions: [
      'Full administrative control over all wind tunnels',
      'Manage personnel, clearances, and role assignments',
      'Create, calibrate, and delete aerospace models',
      'Execute high-speed multi-Mach telemetry sweeps',
      'Emergency Facility Scram / Cryo Dump control',
      'Inspect and purge complete flight test run datasets',
      'Access real-time system security audit logs',
      'Inspect and manage MongoDB collections'
    ]
  },
  {
    role: 'engineer',
    name: 'Marcus Thorne',
    title: 'Senior Aerodynamicist',
    callsign: 'MACH-CHIEF',
    email: 'engineer@aerospace.gov',
    password: 'engineer123',
    department: 'Aero Calibration Division',
    badge: 'CLEARANCE LEVEL 4 [ENGINEER]',
    permissions: [
      'Execute live wind tunnel telemetry sweeps',
      'Upload and validate aerodynamic flight datasets',
      'Design and register new aerospace test models',
      'Calibrate angle of attack & Mach envelopes',
      'Export scientific CSV / JSON telemetry packages',
      'Delete and curate test run data records'
    ]
  },
  {
    role: 'operator',
    name: 'Sarah Jenkins',
    title: 'Wind Tunnel Operator',
    callsign: 'CHAMBER-ONE',
    email: 'operator@aerospace.gov',
    password: 'operator123',
    department: 'Tunnel Operations Control',
    badge: 'CLEARANCE LEVEL 3 [OPERATOR]',
    permissions: [
      'Active control of test section Fan RPM and drive motor',
      'Trigger Emergency Facility Scram / Nitrogen Purge',
      'Switch active aerodynamic models on test stings',
      'Toggle cryogenic cooling circuit and thermal stabilization',
      'Log live aerodynamic test data points into database'
    ]
  },
  {
    role: 'viewer',
    name: 'Cadet Alex Chen',
    title: 'Research Analyst',
    callsign: 'CADET-ALPHA',
    email: 'guest@aerospace.gov',
    password: 'viewer123',
    department: 'Aerospace Academy & Research',
    badge: 'CLEARANCE LEVEL 1 [VIEWER]',
    permissions: [
      'Interactive 3D wind tunnel flow visualization',
      'Inspect aerodynamic polar and pressure distribution charts',
      'Search and filter public flight test datasets',
      'Monitor real-time facility telemetry and Mach counters',
      'Read-only observation clearance'
    ]
  }
];

// List demo profiles for seamless quick-switch
router.get('/demo-accounts', (req, res) => {
  const safeAccounts = DEMO_ACCOUNTS.map(a => ({
    role: a.role,
    name: a.name,
    title: a.title,
    callsign: a.callsign,
    email: a.email,
    department: a.department,
    badge: a.badge,
    permissions: a.permissions
  }));

  res.json({
    success: true,
    data: safeAccounts
  });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  const user = await aeroDb.getUserByEmail(email);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials: Personnel account not recognized'
    });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials: Authorization key mismatch'
    });
  }

  await aeroDb.updateUserLastLogin(user.id);

  await aeroDb.addAuditLog({
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    action: 'USER_LOGIN',
    severity: 'INFO',
    details: `Personnel ${user.name} (${user.callsign}) authenticated successfully with [${user.role.toUpperCase()}] clearance.`
  });

  const token = generateToken(user);
  const { password: _, ...safeUser } = user;

  res.json({
    success: true,
    message: `Welcome back, ${user.name}`,
    token,
    user: safeUser
  });
});

// Register
router.post('/register', async (req, res) => {
  const { email, password, name, role = 'viewer', callsign, department } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and password are required'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }

  const existing = await aeroDb.getUserByEmail(email);
  if (existing) {
    return res.status(409).json({
      success: false,
      message: 'An aerospace personnel account with this email already exists'
    });
  }

  const validRoles = ['admin', 'engineer', 'operator', 'viewer'];
  const userRole = validRoles.includes(role) ? role : 'viewer';

  const newId = `USR-${Date.now().toString().slice(-6)}`;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = await aeroDb.createUser({
    id: newId,
    email,
    password: hashedPassword,
    name,
    role: userRole,
    callsign: callsign || `CALL-${newId.slice(-3)}`,
    department: department || 'Aerodynamic Testing & Analysis'
  });

  await aeroDb.addAuditLog({
    userId: newUser.id,
    userName: newUser.name,
    userRole: newUser.role,
    action: 'USER_REGISTER',
    severity: 'INFO',
    details: `New personnel registered: ${newUser.name} with clearance [${newUser.role.toUpperCase()}].`
  });

  const token = generateToken(newUser);

  res.status(201).json({
    success: true,
    message: 'Personnel profile registered and clearance token issued.',
    token,
    user: newUser
  });
});

// Get current profile
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// Logout
router.post('/logout', optionalAuth, async (req, res) => {
  if (req.user) {
    await aeroDb.addAuditLog({
      userId: req.user.id,
      userName: req.user.name,
      userRole: req.user.role,
      action: 'USER_LOGOUT',
      severity: 'INFO',
      details: `Personnel ${req.user.name} logged out.`
    });
  }
  res.json({
    success: true,
    message: 'Clearance session terminated successfully.'
  });
});

export default router;
