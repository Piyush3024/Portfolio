import Redis from "ioredis"
import dotenv from "dotenv"

dotenv.config()

let redis;

try {
  // Try to connect to Redis if URL is provided
  if (process.env.UPSTACH_REDIS_URL) {
    redis = new Redis(process.env.UPSTACH_REDIS_URL);
    console.log("Redis connection established");
  } else {
    console.log("No Redis URL provided, using fallback");
    // Create a mock Redis implementation
    redis = {
      set: async () => true,
      get: async () => null,
      del: async () => true,
      // Add other methods as needed
    };
  }
} catch (error) {
  console.error("Redis connection error:", error.message);
  // Fallback to mock implementation
  redis = {
    set: async () => true,
    get: async () => null,
    del: async () => true,
    // Add other methods as needed
  };
}

export { redis };
