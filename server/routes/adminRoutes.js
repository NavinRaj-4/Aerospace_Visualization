import express from 'express';
import { aeroDb } from '../db/database.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All routes here require authentication and Admin role
router.use(authenticateToken);
router.use(requireRole('admin'));

// List all personnel
router.get('/users', async (req, res) => {
  const users = await aeroDb.getAllUsers();
  res.json({
    success: true,
    total: users.length,
    data: users
  });
});

// Update personnel clearance role
router.patch('/users/:id/role', async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const validRoles = ['admin', 'engineer', 'operator', 'viewer'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({
      success: false,
      message: `Invalid role. Must be one of: ${validRoles.join(', ')}`
    });
  }

  const targetUser = await aeroDb.getUserById(id);
  if (!targetUser) {
    return res.status(404).json({
      success: false,
      message: 'Personnel record not found'
    });
  }

  const updatedUser = await aeroDb.updateUserRole(id, role);

  await aeroDb.addAuditLog({
    userId: req.user.id,
    userName: req.user.name,
    userRole: req.user.role,
    action: 'ROLE_MODIFIED',
    severity: 'WARN',
    details: `Admin ${req.user.name} modified clearance of ${targetUser.name} from [${targetUser.role.toUpperCase()}] to [${role.toUpperCase()}].`
  });

  res.json({
    success: true,
    message: `Updated clearance for ${updatedUser.name} to ${role.toUpperCase()}`,
    data: updatedUser
  });
});

// Get Wind Tunnel System Audit Logs
router.get('/audit-logs', async (req, res) => {
  const limit = parseInt(req.query.limit) || 100;
  const logs = await aeroDb.getAuditLogs(limit);
  res.json({
    success: true,
    total: logs.length,
    data: logs
  });
});

// Database Management & Storage Status (MongoDB)
router.get('/database-status', async (req, res) => {
  const stats = await aeroDb.getDatabaseStats();
  res.json({
    success: true,
    data: stats
  });
});

// Seed/Reseed MongoDB Collections
router.post('/database-seed', async (req, res) => {
  const result = await aeroDb.reseedDatabase();
  await aeroDb.addAuditLog({
    userId: req.user.id,
    userName: req.user.name,
    userRole: req.user.role,
    action: 'DATABASE_RESEEDED',
    severity: 'WARN',
    details: `Flight Test Director ${req.user.name} reseeded MongoDB collections with baseline aerodynamic telemetry.`
  });

  res.json({
    success: true,
    message: 'MongoDB collections successfully refreshed and reseeded with baseline aerospace datasets.',
    data: result
  });
});

export default router;
