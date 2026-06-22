# fix_seed_v2.ps1
# Splits seed.sql into chunks by file SIZE (max 80KB each)
# This ensures Supabase SQL editor can handle them

$seedFile = "seed.sql"
$outputDir = "seed_chunks"
$maxChunkSizeBytes = 80 * 1024  # 80KB per chunk

Write-Host "Reading seed.sql..."
$content = Get-Content -Path $seedFile -Raw -Encoding UTF8

# Fix Windows line endings
$content = $content -replace "`r`n", "`n"
$content = $content -replace "`r", "`n"

# Split on statement boundaries (semicolon + blank line + "insert" or end of file)
# Use regex to find each complete SQL statement
$stmtPattern = [regex]'(?is)(?:insert\s+into\s+\w+.*?;|update\s+\w+.*?;|truncate.*?;)'

# Instead, split by ";`n" to get individual statements
# But we need to be careful about semicolons inside string values
# Simple approach: split on lines that start with "insert into" or "update "
# and end with ";" on a line by itself

# Read all lines
$lines = $content -split "`n"
$statements = @()
$currentStmt = @()
$inStatement = $false

foreach ($line in $lines) {
    $trimLine = $line.Trim()
    
    # Check if this is the start of a new statement
    if ($trimLine -match '^(insert\s+into|update\s+\w+\s+set|truncate|alter\s+table|--)\s' -and -not $inStatement) {
        $inStatement = $true
        $currentStmt = @($line)
    } elseif ($inStatement) {
        $currentStmt += $line
        # Check if the line ends with semicolon (potentially end of statement)
        if ($trimLine -eq ';' -or $trimLine.EndsWith(');') -or ($trimLine -eq 'do nothing;') -or $trimLine.EndsWith('do nothing;')) {
            $stmt = $currentStmt -join "`n"
            $statements += $stmt
            $currentStmt = @()
            $inStatement = $false
        }
    } elseif ($trimLine -ne '' -and -not $inStatement) {
        # standalone comment lines
        if ($trimLine.StartsWith('--')) {
            $statements += $line
        }
    }
}

# Add any remaining statement
if ($currentStmt.Count -gt 0) {
    $statements += $currentStmt -join "`n"
}

Write-Host "Found $($statements.Count) statements/blocks"

# Create output directory
if (Test-Path $outputDir) {
    Remove-Item -Recurse -Force $outputDir
}
New-Item -ItemType Directory -Path $outputDir | Out-Null

# Write disable RLS file
$rls_disable = @"
-- Run this FIRST in Supabase SQL Editor
-- Temporarily disable RLS for data seeding
ALTER TABLE IF EXISTS countries DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS visas DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS resources DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS services DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS service_categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS service_countries DISABLE ROW LEVEL SECURITY;

-- Clear existing data to avoid conflicts
TRUNCATE TABLE visas RESTART IDENTITY CASCADE;
TRUNCATE TABLE countries RESTART IDENTITY CASCADE;
"@
Set-Content -Path "$outputDir\00_STEP1_disable_rls_and_clear.sql" -Value $rls_disable -Encoding UTF8
Write-Host "Created: 00_STEP1_disable_rls_and_clear.sql"

# Write re-enable RLS file
$rls_enable = @"
-- Run this LAST in Supabase SQL Editor
-- Re-enable RLS after seeding
ALTER TABLE IF EXISTS countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS visas ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS services ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS service_countries ENABLE ROW LEVEL SECURITY;
"@
Set-Content -Path "$outputDir\99_FINAL_enable_rls.sql" -Value $rls_enable -Encoding UTF8
Write-Host "Created: 99_FINAL_enable_rls.sql"

# Group statements into size-limited chunks
$chunkIndex = 1
$currentChunkLines = @()
$currentSize = 0

foreach ($stmt in $statements) {
    $stmtBytes = [System.Text.Encoding]::UTF8.GetByteCount($stmt + "`n`n")
    
    # If adding this statement would exceed the limit, save current chunk
    if ($currentSize + $stmtBytes -gt $maxChunkSizeBytes -and $currentChunkLines.Count -gt 0) {
        $fileName = "$outputDir\STEP{0:D2}_chunk.sql" -f ($chunkIndex + 1)
        $chunkContent = $currentChunkLines -join "`n`n"
        Set-Content -Path $fileName -Value $chunkContent -Encoding UTF8
        $fileSizeKB = [math]::Round($stmtBytes / 1024, 1)
        $chunkSizeKB = [math]::Round($currentSize / 1024, 1)
        Write-Host "Created: $fileName ($($currentChunkLines.Count) stmts, ~$($chunkSizeKB)KB)"
        $currentChunkLines = @()
        $currentSize = 0
        $chunkIndex++
    }
    
    $currentChunkLines += $stmt
    $currentSize += $stmtBytes
}

# Write remaining
if ($currentChunkLines.Count -gt 0) {
    $fileName = "$outputDir\STEP{0:D2}_chunk.sql" -f ($chunkIndex + 1)
    $chunkContent = $currentChunkLines -join "`n`n"
    Set-Content -Path $fileName -Value $chunkContent -Encoding UTF8
    $chunkSizeKB = [math]::Round($currentSize / 1024, 1)
    Write-Host "Created: $fileName ($($currentChunkLines.Count) stmts, ~$($chunkSizeKB)KB)"
    $chunkIndex++
}

# Also copy the seed_extra_info.sql to the folder  
if (Test-Path "seed_extra_info.sql") {
    $extra = Get-Content -Path "seed_extra_info.sql" -Raw -Encoding UTF8
    $extra = $extra -replace "`r`n", "`n"
    $stepNum = $chunkIndex + 1
    Set-Content -Path "$outputDir\STEP{0:D2}_extra_info.sql" -f $stepNum -Value $extra -Encoding UTF8
    Write-Host "Created: STEP${stepNum}_extra_info.sql (country extra info)"
}

Write-Host ""
Write-Host "======================================="
Write-Host "DONE! Created $chunkIndex data chunks."
Write-Host ""
Write-Host "HOW TO IMPORT INTO SUPABASE:"
Write-Host "1. Go to: Supabase Dashboard -> SQL Editor"
Write-Host "2. Click 'New Query'"
Write-Host "3. Run each file IN ORDER:"
Write-Host "   - 00_STEP1_disable_rls_and_clear.sql  (FIRST)"
foreach ($i in 2..($chunkIndex+1)) {
    Write-Host "   - STEP{0:D2}_chunk.sql" -f $i
}
Write-Host "   - 99_FINAL_enable_rls.sql  (LAST)"
Write-Host "======================================="
