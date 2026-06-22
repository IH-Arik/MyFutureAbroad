# fix_seed.ps1
# Splits seed.sql into smaller chunks for Supabase SQL editor import
# Also creates a bypass_rls wrapper and fixes line endings

$seedFile = "seed.sql"
$outputDir = "seed_chunks"

Write-Host "Reading seed.sql..."
$content = Get-Content -Path $seedFile -Raw -Encoding UTF8

# Fix Windows line endings
$content = $content -replace "`r`n", "`n"
$content = $content -replace "`r", "`n"

# Split on each INSERT statement (either "insert into" or "INSERT INTO")
# Strategy: split the content into individual statements by ";`n`ninsert"
$statements = $content -split "(?i)(?<=;)\s*\n(?=insert)"

Write-Host "Found $($statements.Count) statements"

# Create output directory
if (Test-Path $outputDir) {
    Remove-Item -Recurse -Force $outputDir
}
New-Item -ItemType Directory -Path $outputDir | Out-Null

# Group by 50 statements per chunk
$chunkSize = 50
$chunkIndex = 1
$currentChunk = @()
$rls_header = @"
-- Temporarily disable RLS for seeding
-- Run this FIRST before any chunks
ALTER TABLE countries DISABLE ROW LEVEL SECURITY;
ALTER TABLE visas DISABLE ROW LEVEL SECURITY;
ALTER TABLE resources DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE service_countries DISABLE ROW LEVEL SECURITY;
"@

$rls_footer = @"
-- Re-enable RLS after seeding
-- Run this LAST after all chunks
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE visas ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_countries ENABLE ROW LEVEL SECURITY;
"@

# Save RLS disable script
Set-Content -Path "$outputDir\00_disable_rls.sql" -Value $rls_header -Encoding UTF8
Write-Host "Created: $outputDir\00_disable_rls.sql"

# Save RLS re-enable script
Set-Content -Path "$outputDir\99_enable_rls.sql" -Value $rls_footer -Encoding UTF8
Write-Host "Created: $outputDir\99_enable_rls.sql"

foreach ($stmt in $statements) {
    $trimmed = $stmt.Trim()
    if ($trimmed -eq "") { continue }
    
    # Ensure statement ends with semicolon
    if (-not $trimmed.EndsWith(";")) {
        $trimmed = $trimmed + ";"
    }
    
    $currentChunk += $trimmed
    
    if ($currentChunk.Count -ge $chunkSize) {
        $fileName = "$outputDir\chunk_{0:D2}.sql" -f $chunkIndex
        $chunkContent = $currentChunk -join "`n`n"
        Set-Content -Path $fileName -Value $chunkContent -Encoding UTF8
        Write-Host "Created: $fileName ($($currentChunk.Count) statements)"
        $currentChunk = @()
        $chunkIndex++
    }
}

# Write remaining statements
if ($currentChunk.Count -gt 0) {
    $fileName = "$outputDir\chunk_{0:D2}.sql" -f $chunkIndex
    $chunkContent = $currentChunk -join "`n`n"
    Set-Content -Path $fileName -Value $chunkContent -Encoding UTF8
    Write-Host "Created: $fileName ($($currentChunk.Count) statements)"
}

Write-Host ""
Write-Host "===================================="
Write-Host "DONE! Created $($chunkIndex) chunk files."
Write-Host ""
Write-Host "Instructions:"
Write-Host "1. Go to Supabase Dashboard -> SQL Editor"
Write-Host "2. Run: 00_disable_rls.sql  (disables RLS)"
Write-Host "3. Run each chunk_XX.sql in order"
Write-Host "4. Run: 99_enable_rls.sql   (re-enables RLS)"
Write-Host "===================================="
