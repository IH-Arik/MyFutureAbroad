import re

with open('seed.sql', 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

with open('find_statements.txt', 'w', encoding='utf-8') as out_f:
    for idx, line in enumerate(lines):
        if re.search(r'\b(delete|update)\b', line, re.IGNORECASE):
            out_f.write(f"Line {idx+1}: {line.strip()}\n")
print("Done writing to find_statements.txt")
