import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    const { success } = await ratelimit.limit(
      "my-rate-limit" // Use IP address for rate limiting
    );

    if (!success) {
      return res.status(429).json({ error: 'Too many requests' });
    }

    next();
  } catch (error) {
    console.error('Rate limiter error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export default rateLimiter;