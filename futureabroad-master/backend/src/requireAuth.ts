import type { Request, Response, NextFunction } from "express";
import { supabase } from "./config.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["x-user-token"] as string | undefined;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  req.userId = user.id;
  next();
}
