import { Router, Request, Response } from "express";

const router = Router();
const BASE = "https://globaltaxcalculator.net/api";

router.get("/countries", async (_req: Request, res: Response) => {
  try {
    const r = await fetch(`${BASE}/countries`);
    const data = await r.json();
    res.json(data);
  } catch {
    res.status(502).json({ error: "Failed to fetch countries" });
  }
});

router.post("/calculate", async (req: Request, res: Response) => {
  try {
    const { amount, currency, countries } = req.body as { amount: number; currency: string; countries?: string[] };
    const r = await fetch(`${BASE}/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, currency }),
    });
    const data = await r.json() as Array<{ countryCode: string }>;
    const filtered = countries?.length ? data.filter((d) => countries.includes(d.countryCode)) : data;
    res.json(filtered);
  } catch {
    res.status(502).json({ error: "Failed to calculate tax" });
  }
});

export default router;
