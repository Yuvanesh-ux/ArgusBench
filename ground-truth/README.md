# Ground Truth (Expected Findings) – TaskFlow

This folder contains the canonical expected findings for the TaskFlow (web app) benchmark. It is the single source of truth scanners will be evaluated against after we inject vulnerabilities into the clean base.

## Contents
- `vulnerability-schema.json`: JSON Schema defining the required fields for every finding
- `web-app-vulnerabilities.todo.json`: Planned catalog (status: planned). After injections, we will resolve commit SHAs, line numbers, and exact code hashes

## Usage
- Before injection: keep entries in `status: "planned"` with `planned_file`, `placement_hint`, `planned_code`
- After injection: update entries to `status: "final"`, fill `commit`, `startLine`, `endLine`, exact `code`, and compute `code_sha256`

## Notes
- Scanners should ignore this folder; see `.semgrepignore`
- Do not place secrets here; keep only metadata and exact vulnerable snippets necessary for ground-truth
