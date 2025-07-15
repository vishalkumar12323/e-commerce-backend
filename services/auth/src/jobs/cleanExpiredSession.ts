import dotenv from "dotenv";
import { prisma } from "../lib/db-client.js";

dotenv.config({ quiet: true });

async function cleanExpiredSessions() {
  try {
    const result = await prisma.session.deleteMany({
      where: {
        is_valid: true,
        expires_at: {
          lt: new Date(),
        },
      },
    });

    console.log(`[CLEAN-UP] Deleted ${result.count} expired sessions.`);
  } catch (error) {
    console.error("[CLEAN-UP ERROR]", error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanExpiredSessions();
