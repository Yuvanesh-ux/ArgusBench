# Scanner Performance Statistics Report: b2_gptoss-20b

## Overall Detection Rate
- **Total Planted Vulnerabilities**: 37
- **Successfully Detected**: 25
- **Detection Rate**: **68%**
- **Missed Vulnerabilities**: 12 (32%)

## Detection by Vulnerability Category

### OWASP Top 10 (25 vulnerabilities)
- **Detected**: 18/25
- **Detection Rate**: **72%**
- **Missed**: 7

| Category | Detected | Total | Rate |
|----------|----------|-------|------|
| A01 - Broken Access Control | 4/5 | 5 | **80%** |
| A02 - Cryptographic Failures | 4/4 | 4 | **100%** |
| A03 - Injection | 5/5 | 5 | **100%** |
| A04 - Insecure Design | 1/3 | 3 | **33%** |
| A05 - Security Misconfiguration | 3/3 | 3 | **100%** |
| A06 - Vulnerable Components | 0/1 | 1 | **0%** |
| A07 - Authentication Failures | 2/2 | 2 | **100%** |
| A08 - Software Integrity Failures | 0/1 | 1 | **0%** |
| A09 - Logging Failures | 1/1 | 1 | **100%** |
| A10 - Server-Side Request Forgery | 2/2 | 2 | **100%** |

### ML Top 10 (7 vulnerabilities)
- **Detected**: 3/7
- **Detection Rate**: **43%**
- **Missed**: 4

| Category | Status |
|----------|--------|
| ML-001 - Model Info Leakage | ❌ Missed |
| ML-002 - Unthrottled Predictions | ❌ Missed |
| ML-003 - Arbitrary Model Loading | ❌ Missed |
| ML-004 - Raw PII in Training Data | ✅ Detected |
| ML-005 - ScriptEngine Code Execution | ✅ Detected |
| ML-006 - Unauthorized Model Export | ❌ Missed |
| ML-007 - Debug PII Exposure | ✅ Detected |

### Agentic AI Top 10 (5 vulnerabilities)
- **Detected**: 4/5
- **Detection Rate**: **80%**
- **Missed**: 1

| Category | Status |
|----------|--------|
| AG-001 - Secrets to Third-Party | ✅ Detected |
| AG-002 - AI Command Execution | ✅ Detected |
| AG-003 - Excessive AI Permissions | ❌ Missed |
| AG-004 - Dynamic Plugin Import | ✅ Detected |
| AG-005 - Auto-Approval Financial Actions | ✅ Detected |

## Detection Rate by Complexity

| Complexity Level | Detection Rate | Description |
|------------------|----------------|-------------|
| **Traditional Web Security** | **89%** (16/18) | Classic injection, access control, crypto |
| **Configuration Issues** | **100%** (4/4) | CORS, actuator exposure, error handling |
| **Business Logic Flaws** | **33%** (1/3) | Financial workflows, approval bypasses |
| **ML/AI Security** | **58%** (7/12) | ML-specific and AI-specific vulnerabilities |

## Scanner Output Statistics
- **Total Scanner Findings**: 100
- **True Positives** (matched planted vulns): 25
- **Additional Findings**: 75
- **Potential False Positive Rate**: 75%

## Severity Distribution of Detected Vulnerabilities

| Severity | Count | Percentage |
|----------|-------|------------|
| Critical | 18 | 18% |
| High | 66 | 66% |
| Medium | 15 | 15% |
| Low | 1 | 1% |

## True Positive Detections

### Excellent Performance (90-100% detection)
- **Injection Vulnerabilities**: 100% (5/5)
- **Cryptographic Failures**: 100% (4/4)
- **Authentication Issues**: 100% (2/2)
- **SSRF Vulnerabilities**: 100% (2/2)
- **Logging Failures**: 100% (1/1)
- **Security Misconfiguration**: 100% (3/3)
- **Configuration Issues**: 100% (4/4)

### Good Performance (70-89% detection)
- **Access Control Issues**: 80% (4/5)
- **Agentic AI Security**: 80% (4/5)

### Average Performance (50-69% detection)
- **ML/AI Security**: 58% (7/12)

### Poor Performance (0-49% detection)
- **ML Security**: 43% (3/7)
- **Business Logic**: 33% (1/3)
- **Insecure Design**: 33% (1/3)
- **Vulnerable Components**: 0% (0/1)
- **Software Integrity**: 0% (0/1)

## Critical Missed Vulnerabilities
1. **JAVA-A01-005**: Cross-tenant file download IDOR
2. **JAVA-A04-002**: Financial transaction validation bypass
3. **JAVA-A04-003**: Credit limit approval workflow bypass
4. **JAVA-A06-001**: Vulnerable Spring Boot dependencies
5. **JAVA-A08-001**: Missing file integrity validation
6. **JAVA-ML-001**: ML model information leakage
7. **JAVA-ML-002**: Unthrottled ML prediction DoS
8. **JAVA-ML-003**: Arbitrary model loading from URLs
9. **JAVA-ML-006**: Unauthorized model export
10. **JAVA-AG-003**: Excessive AI tool permissions

## Comparison with Other Scanners

| Metric | b2_gptoss-20b | b2_o3-mini | b2_gpt-oss-120b | Performance |
|--------|---------------|------------|------------------|-------------|
| **Overall Detection Rate** | 68% | 73% | 65% | **2nd** |
| **OWASP Detection** | 72% | 88% | 72% | **2nd** (tied) |
| **AI Detection** | 80% | 60% | 80% | **1st** (tied) |
| **ML Detection** | 43% | 57% | 29% | **2nd** |
| **Total Findings** | 100 | 113 | 87 | **2nd** |
| **False Positive Rate** | 75% | 76% | 72% | **2nd** |
| **Precision** | 25% | 24% | 28% | **2nd** |

## Performance Metrics by Category

### Perfect Performance (100% detection)
- **Injection Vulnerabilities**: 100%
- **Cryptographic Failures**: 100%
- **Authentication Issues**: 100%
- **SSRF Vulnerabilities**: 100%
- **Logging Failures**: 100%
- **Security Misconfiguration**: 100%

### Good Performance (70-89% detection)
- **Access Control Issues**: 80%
- **Agentic AI Security**: 80%

### Average Performance (50-69% detection)
- **ML/AI Security**: 58%

### Poor Performance (0-49% detection)
- **ML Security**: 43%
- **Business Logic**: 33%
- **Insecure Design**: 33%
- **Vulnerable Components**: 0%
- **Software Integrity**: 0%

## Detected Vulnerability Categories

### Traditional Web Security (16/18 detected)
- SQL Injection vulnerabilities
- LDAP Injection vulnerabilities
- Command Injection vulnerabilities
- Template Injection vulnerabilities
- Cross-Site Scripting (XSS)
- Insecure Direct Object References (IDOR)
- Authentication bypass issues
- Cryptographic weaknesses
- CORS misconfigurations

### AI Security (4/5 detected)
- Secrets to third-party services
- AI command execution
- Dynamic plugin imports
- Auto-approval financial actions

### ML Security (3/7 detected)
- Raw PII in training data
- ScriptEngine code execution
- Debug PII exposure

### Configuration Security (4/4 detected)
- CORS misconfigurations
- Actuator endpoint exposures
- Error handling information disclosure
- Debug endpoint security issues

## Unique Strengths vs Other Scanners
- **Perfect Injection Detection**: 100% across all injection types
- **Perfect Configuration Security**: 100% detection of config issues
- **Strong Traditional Web Security**: 89% vs 78% (b2_gpt-oss-120b)
- **Comprehensive Debug Analysis**: Strong information disclosure detection
- **Effective Script Execution Detection**: Multiple ScriptEngine findings
- **Good CORS Analysis**: Properly identified permissive CORS configuration

## Key Weaknesses vs Other Scanners
- **Lower Overall Performance**: 68% vs b2_o3-mini's 73%
- **Business Logic Blindness**: Only 33% detection of complex workflow issues
- **No Dependency Analysis**: 0% detection of vulnerable components
- **Missing ML Model Security**: Failed to detect model loading and export issues
- **High False Positive Rate**: 75% of findings don't match planted vulnerabilities