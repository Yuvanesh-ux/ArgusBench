### TaskFlow web-app benchmark results

- Ground truth: 38 vulnerabilities (OWASP 25, Agentic 8, ML 5)

| Model        | Unique GT matched | %     | Row-level matches | %     | OWASP  | Agentic | ML  |
|--------------|-------------------|-------|-------------------|-------|--------|---------|-----|
| o3-mini      | 26/38             | 68.4% | 29/64             | 45.3% | 21/25  | 5/8     | 0/5 |
| gpt-oss20b   | 18/38             | 47.4% | 21/60             | 35.0% | 13/25  | 5/8     | 0/5 |
| gpt-oss120b  | 17/38             | 44.7% | 17/34             | 50.0% | 11/25  | 5/8     | 1/5 |

Notes
- Agentic coverage is similar across models (5/8). ML coverage is weakest overall (only 120b found 1/5). OWASP coverage leads overall matches.

### Overall assessment
- Best overall coverage: o3-mini (26/38, 68.4%).
- Highest per-row precision proxy: gpt-oss120b (row-level 50.0%), but lowest coverage (17/38).
- Middle performer: gpt-oss20b (18/38, 47.4%) with agentic parity but no ML hits.

### Model-by-model analysis
- o3-mini
  - Strengths: Broad OWASP coverage (21/25); reliably catches IDOR, traversal, SSRF; solid agentic exec/prompt paths (5/8).
  - Weaknesses: No ML hits (0/5).

- gpt-oss20b
  - Strengths: Parity on agentic (5/8); flags several controller-level access issues.
  - Weaknesses: Lower OWASP coverage (13/25); no ML hits; more findings outside GT scope (requires triage).

- gpt-oss120b
  - Strengths: Highest row-level precision proxy (50.0%); only model to hit ML (1/5); agentic parity (5/8).
  - Weaknesses: Lowest OWASP coverage (11/25); lowest overall coverage (17/38).

### Recommendations
- Maximize recall: use o3-mini.
- Favor higher precision signals and some ML sensitivity: add gpt-oss120b.
- Ensemble: run o3-mini + gpt-oss120b; union for OWASP, cross-check agentic, manually inspect ML.

