# Country & Visa Seeding Pipeline

This directory contains the script and configuration for seeding country profiles and visa options into the Supabase database.

## Directory Structure

```text
supabase/
├── data/
│   └── countries/         # JSON files for each country (e.g., bh_bahrain.json)
└── scripts/
    ├── seed-countries.ts  # Seeding runner script
    └── README.md          # This file
```

## Setup & Prerequisites

Before running the seed script, ensure you have set up your environment variables. The script loads environment variables from the `backend/.env` file.

1. Ensure the following environment variables are present in `backend/.env`:
   ```env
   VITE_SUPABASE_URL=your-supabase-project-url
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
   > [!IMPORTANT]
   > The `SUPABASE_SERVICE_ROLE_KEY` is required because the seed script bypasses Row Level Security (RLS) policies to insert and update country and visa records. Keep this key secret.

2. Run the script from the `backend/` directory or run with `npx tsx` directly.

## Usage

You can run the script using `tsx` (TypeScript Execute).

### Dry Run (Preview changes)
To run the script and inspect what changes would be made without writing anything to the database:
```bash
npx tsx ../supabase/scripts/seed-countries.ts --dry-run
```

### Seed All Countries
To seed all JSON country profiles and visas:
```bash
npx tsx ../supabase/scripts/seed-countries.ts
```

### Seed a Specific Country
To seed only a specific country (e.g., Bahrain) by matching its slug/iso prefix:
```bash
npx tsx ../supabase/scripts/seed-countries.ts --country=bh
```
