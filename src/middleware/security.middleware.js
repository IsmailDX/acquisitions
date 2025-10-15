import aj from '#config/archjet.js';
import logger from '#config/logger.js';
import { slidingWindow } from '@arcjet/node';

const securityMiddleware = async (req, res, next) => {
  try {
    const role = req.user?.role || 'guest';

    let limit;
    let message;

    switch (role) {
      case 'admin':
        limit = 20; // High limit for admin users
        message = 'Admin request limit exceeded (20 per minute). Slow down!';
        break;
      case 'user':
        limit = 10; // Moderate limit for regular users
        message = 'User request limit exceeded (10 per minute). Please wait.';
        break;
      case 'guest':
        limit = 5; // Low limit for guests or unauthenticated users
        message = 'Guest request limit exceeded (5 per minute). Please wait.';
        break;
    }

    console.log('message', message);

    const client = aj.withRule(
      slidingWindow({
        mode: 'LIVE',
        interval: '1m',
        max: limit,
        name: `${role}-rate-limit`,
      })
    );

    const decision = await client.protect(req);

    if (decision.isDenied() && decision.reason.isBot()) {
      logger.warn('Bot request blocked', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
      });

      return res.status(403).json({
        error: 'Forbidden',
        message: 'Automated requests are not allowed',
      });
    }

    if (decision.isDenied() && decision.reason.isShield()) {
      logger.warn('Shield Blocked request', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        method: req.method,
      });

      return res.status(403).json({
        error: 'Forbidden',
        message: 'Request blocked by security rules',
      });
    }

    if (decision.isDenied() && decision.reason.isRateLimit()) {
      logger.warn('Rate limit exceeded', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path,
        method: req.method,
      });

      return res
        .status(403)
        .json({ error: 'Forbidden', message: 'Too many requests' });
    }

    next();
  } catch (error) {
    console.error('Arcjet middleware error:', error);
    res.status(500).json({
      error: 'Interval server error',
      message: 'Something went wrong with security middleware',
    });
  }
};

export default securityMiddleware;
