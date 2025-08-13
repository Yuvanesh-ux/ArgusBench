# FinanceHub Scanner Comparison Analysis - Complete

## Executive Summary

This report compares the performance of three security scanners against FinanceHub, a comprehensive financial application security benchmark with **37 strategically placed vulnerabilities** across OWASP Top 10, ML Top 10, and Agentic AI Top 10 categories in a Spring Boot/Java application.

## Overall Performance Comparison

| Metric | b2_o3-mini | b2_gpt-oss-120b | b2_gptoss-20b | Winner |
|--------|------------|-----------------|---------------|--------|
| **Total Detection Rate** | **73%** (27/37) | 65% (24/37) | 68% (25/37) | 🏆 b2_o3-mini |
| **Total Findings** | 113 | 87 | 100 | 🏆 b2_gpt-oss-120b (most efficient) |
| **False Positive Rate** | 76% | **72%** | 75% | 🏆 b2_gpt-oss-120b |

## Category-by-Category Breakdown

### OWASP Top 10 (25 vulnerabilities)
| Category | b2_o3-mini | b2_gpt-oss-120b | b2_gptoss-20b | Winner |
|----------|------------|-----------------|---------------|--------|
| **Overall OWASP** | **88%** (22/25) | 72% (18/25) | 72% (18/25) | 🏆 b2_o3-mini |
| A01 - Access Control | **100%** (5/5) | 80% (4/5) | 80% (4/5) | 🏆 b2_o3-mini |
| A02 - Cryptographic | **100%** (4/4) | **100%** (4/4) | **100%** (4/4) | 🤝 Three-way tie |
| A03 - Injection | **100%** (5/5) | 80% (4/5) | **100%** (5/5) | 🏆 b2_o3-mini & b2_gptoss-20b |
| A04 - Insecure Design | 33% (1/3) | 0% (0/3) | 33% (1/3) | 🏆 b2_o3-mini & b2_gptoss-20b |
| A05 - Misconfiguration | **100%** (3/3) | 67% (2/3) | **100%** (3/3) | 🏆 b2_o3-mini & b2_gptoss-20b |
| A06 - Vulnerable Components | 0% (0/1) | 0% (0/1) | 0% (0/1) | 🤝 Three-way tie (none) |
| A07 - Authentication | **100%** (2/2) | **100%** (2/2) | **100%** (2/2) | 🤝 Three-way tie |
| A08 - Integrity Failures | 0% (0/1) | 0% (0/1) | 0% (0/1) | 🤝 Three-way tie (none) |
| A09 - Logging Failures | **100%** (1/1) | **100%** (1/1) | **100%** (1/1) | 🤝 Three-way tie |
| A10 - SSRF | **100%** (2/2) | **100%** (2/2) | **100%** (2/2) | 🤝 Three-way tie |

### ML Top 10 (7 vulnerabilities)
| Category | b2_o3-mini | b2_gpt-oss-120b | b2_gptoss-20b | Winner |
|----------|------------|-----------------|---------------|--------|
| **Overall ML** | **57%** (4/7) | 29% (2/7) | 43% (3/7) | 🏆 b2_o3-mini |
| ML-001 - Info Leakage | ✅ Detected | ❌ Missed | ❌ Missed | 🏆 b2_o3-mini |
| ML-002 - Unthrottled DoS | ❌ Missed | ❌ Missed | ❌ Missed | 🤝 All missed |
| ML-003 - Arbitrary Loading | ✅ Detected | ❌ Missed | ❌ Missed | 🏆 b2_o3-mini |
| ML-004 - Raw PII | ✅ Detected | ❌ Missed | ✅ Detected | 🏆 b2_o3-mini & b2_gptoss-20b |
| ML-005 - ScriptEngine RCE | ✅ Detected | ✅ Detected | ✅ Detected | 🤝 Three-way tie |
| ML-006 - Unauthorized Export | ❌ Missed | ❌ Missed | ❌ Missed | 🤝 All missed |
| ML-007 - Debug PII Exposure | ❌ Missed | ✅ Detected | ✅ Detected | 🏆 b2_gpt-oss-120b & b2_gptoss-20b |

### Agentic AI Top 10 (5 vulnerabilities)
| Category | b2_o3-mini | b2_gpt-oss-120b | b2_gptoss-20b | Winner |
|----------|------------|-----------------|---------------|--------|
| **Overall AI** | 60% (3/5) | **80%** (4/5) | **80%** (4/5) | 🏆 b2_gpt-oss-120b & b2_gptoss-20b |
| AG-001 - Secrets Leakage | ✅ Detected | ✅ Detected | ✅ Detected | 🤝 Three-way tie |
| AG-002 - Command Execution | ✅ Detected | ✅ Detected | ✅ Detected | 🤝 Three-way tie |
| AG-003 - Excessive Permissions | ❌ Missed | ❌ Missed | ❌ Missed | 🤝 All missed |
| AG-004 - Dynamic Loading | ✅ Detected | ✅ Detected | ✅ Detected | 🤝 Three-way tie |
| AG-005 - Auto-Approval | ❌ Missed | ✅ Detected | ✅ Detected | 🏆 b2_gpt-oss-120b & b2_gptoss-20b |

## Performance by Vulnerability Complexity

### Traditional Web Security (18 vulnerabilities)
| Scanner | Detection Rate | True Positives |
|---------|----------------|----------------|
| **b2_o3-mini** | **94%** (17/18) | 17 |
| **b2_gptoss-20b** | **89%** (16/18) | 16 |
| **b2_gpt-oss-120b** | 78% (14/18) | 14 |

### Configuration Issues (4 vulnerabilities)
| Scanner | Detection Rate | True Positives |
|---------|----------------|----------------|
| **b2_o3-mini** | **100%** (4/4) | 4 |
| **b2_gptoss-20b** | **100%** (4/4) | 4 |
| **b2_gpt-oss-120b** | 75% (3/4) | 3 |

### Business Logic Flaws (3 vulnerabilities)
| Scanner | Detection Rate | True Positives |
|---------|----------------|----------------|
| **b2_o3-mini** | **33%** (1/3) | 1 |
| **b2_gptoss-20b** | **33%** (1/3) | 1 |
| **b2_gpt-oss-120b** | 33% (1/3) | 1 |

### ML/AI Security (12 vulnerabilities)
| Scanner | Detection Rate | True Positives |
|---------|----------------|----------------|
| **b2_o3-mini** | **58%** (7/12) | 7 |
| **b2_gptoss-20b** | **58%** (7/12) | 7 |
| **b2_gpt-oss-120b** | 50% (6/12) | 6 |

## Detailed Performance Metrics

### b2_o3-mini Statistics
- **Total Findings**: 113
- **True Positives**: 27
- **False Positives**: 86
- **Detection Rate**: 73% (27/37)
- **False Positive Rate**: 76% (86/113)
- **Precision**: 24% (27/113)

### b2_gpt-oss-120b Statistics
- **Total Findings**: 87
- **True Positives**: 24
- **False Positives**: 63
- **Detection Rate**: 65% (24/37)
- **False Positive Rate**: 72% (63/87)
- **Precision**: 28% (24/87)

### b2_gptoss-20b Statistics
- **Total Findings**: 100
- **True Positives**: 25
- **False Positives**: 75
- **Detection Rate**: 68% (25/37)
- **False Positive Rate**: 75% (75/100)
- **Precision**: 25% (25/100)

## Critical Vulnerability Detection Analysis

### SQL Injection Detection
| Scanner | Status | Files Detected | Confidence |
|---------|--------|----------------|-----------|
| **b2_o3-mini** | ✅ Detected | Multiple injection points | HIGH |
| **b2_gpt-oss-120b** | ✅ Detected | LDAP/SQL injection | HIGH |
| **b2_gptoss-20b** | ✅ Detected | All injection types | HIGH |

### Command Injection Detection
| Scanner | Status | Files Detected | Confidence |
|---------|--------|----------------|-----------|
| **b2_o3-mini** | ✅ Detected | AI command execution | HIGH |
| **b2_gpt-oss-120b** | ✅ Detected | AI command execution | HIGH |
| **b2_gptoss-20b** | ✅ Detected | AI command execution | HIGH |

### Business Logic Vulnerabilities
| Scanner | Status | Auto-Approval Detection | Financial Bypass |
|---------|--------|-------------------------|------------------|
| **b2_o3-mini** | ❌ MISSED | Not detected | Partial |
| **b2_gpt-oss-120b** | ✅ Detected | Financial auto-approval | Strong |
| **b2_gptoss-20b** | ✅ Detected | Financial auto-approval | Strong |

### ML Model Security
| Scanner | Model Info Leakage | Model Loading | Script Execution |
|---------|-------------------|---------------|------------------|
| **b2_o3-mini** | ✅ Detected | ✅ Detected | ✅ Detected |
| **b2_gpt-oss-120b** | ❌ Missed | ❌ Missed | ✅ Detected |
| **b2_gptoss-20b** | ❌ Missed | ❌ Missed | ✅ Detected |

## Missed Vulnerabilities by Scanner

### Universal Misses (All Scanners)
- JAVA-A06-001: Vulnerable Spring Boot dependencies
- JAVA-A08-001: Missing file integrity validation
- JAVA-ML-002: Unthrottled ML prediction DoS
- JAVA-ML-006: Unauthorized model export
- JAVA-AG-003: Excessive AI tool permissions

### b2_o3-mini Unique Misses
- JAVA-AG-005: Auto-Approval Financial Actions
- JAVA-ML-007: Debug PII Exposure

### b2_gpt-oss-120b Unique Misses
- JAVA-A01-005: Cross-tenant file download IDOR
- JAVA-A04-002: Financial transaction validation bypass
- JAVA-A05-003: Debug endpoints exposure
- JAVA-ML-001: ML model info leakage
- JAVA-ML-003: Arbitrary model loading
- JAVA-ML-004: Raw PII in training data

### b2_gptoss-20b Unique Misses
- JAVA-A01-005: Cross-tenant file download IDOR
- JAVA-A04-002: Financial transaction validation bypass
- JAVA-ML-001: ML model info leakage
- JAVA-ML-003: Arbitrary model loading

## Severity Distribution by Scanner

### b2_o3-mini Severity Distribution
| Severity | Count | Percentage |
|----------|-------|------------|
| Critical | 7 | 26% |
| High | 57 | 50% |
| Medium | 31 | 27% |
| Low | 4 | 4% |

### b2_gpt-oss-120b Severity Distribution
| Severity | Count | Percentage |
|----------|-------|------------|
| Critical | 8 | 9% |
| High | 47 | 54% |
| Medium | 29 | 33% |
| Low | 3 | 3% |

### b2_gptoss-20b Severity Distribution
| Severity | Count | Percentage |
|----------|-------|------------|
| Critical | 18 | 18% |
| High | 66 | 66% |
| Medium | 15 | 15% |
| Low | 1 | 1% |