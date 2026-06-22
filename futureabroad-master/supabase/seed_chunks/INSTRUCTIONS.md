# Database Setup Instructions

## Run these files IN ORDER in Supabase SQL Editor

Go to: **app.supabase.com → Your Project → SQL Editor → New query**
Paste each file's content → Click **Run** → Wait for success → repeat.

---

| Step | File | What it does |
|------|------|--------------|
| **1** | `STEP00_create_schema.sql` | Creates ALL tables (countries, visas, services, etc.) |
| **2** | `STEP02_chunk.sql` | Inserts all **countries** data |
| **3** | `STEP03_chunk.sql` | Inserts **visas** part 1 |
| **4** | `STEP04_chunk.sql` | Inserts **visas** part 2 |
| **5** | `STEP05_chunk.sql` | Citizenship requirements data |
| **6** | `STEP06_chunk.sql` | Tax advice data |
| **7** | `99_FINAL_enable_rls.sql` | Re-enables Row Level Security |

---

## After seeding, verify it worked

Run this in SQL Editor:
```sql
SELECT COUNT(*) FROM countries;
SELECT id, name FROM countries ORDER BY id LIMIT 10;
```

You should see 28+ countries. Then test your app at:
- http://localhost:5173/countries/1  (first country)
- http://localhost:5173/countries/2  (second country)
