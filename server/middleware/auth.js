import jwt from 'jsonwebtoken';
import { aeroDb } from '../db/database.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'AERO_SUITE_TELEMETRY_SUPER_SECURE_KEY_2025';

export function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      callsign: user.callsign,
      department: user.department
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access Denied: Authentication token required'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await aeroDb.getUserById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid session: Personnel record not found'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Session Expired or Invalid Clearance Token'
    });
  }
}

export async function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await aeroDb.getUserById(decoded.id);
      if (user) {
        req.user = user;
      }
    } catch (e) {
      // Ignore token error for optional auth
    }
  }
  next();
}

/**
 * Role-Based Access Control (RBAC)
 * Hierarchy: admin > engineer / operator > viewer
 */
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required for this telemetry operation'
      });
    }

    // Admins always have access to all system functions
    if (req.user.role === 'admin') {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Clearance Denied: Requires [${allowedRoles.join(' or ').toUpperCase()}] clearance. Your role: [${req.user.role.toUpperCase()}]`
      });
    }

    next();
  };
}
