# Scanner Performance Statistics Report: b2_o3-mini

## Overall Detection Rate
- **Total Planted Vulnerabilities**: 37
- **Successfully Detected**: 27
- **Detection Rate**: **73%**
- **Missed Vulnerabilities**: 10 (27%)

## Detection by Vulnerability Category

### OWASP Top 10 (25 vulnerabilities)
- **Detected**: 22/25
- **Detection Rate**: **88%**
- **Missed**: 3

| Category | Detected | Total | Rate |
|----------|----------|-------|------|
| A01 - Broken Access Control | 5/5 | 5 | **100%** |
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
- **Detected**: 4/7
- **Detection Rate**: **57%**
- **Missed**: 3

| Category | Status |
|----------|--------|
| ML-001 - Model Info Leakage | ✅ Detected |
| ML-002 - Unthrottled Predictions | ❌ Missed |
| ML-003 - Arbitrary Model Loading | ✅ Detected |
| ML-004 - Raw PII in Training Data | ✅ Detected |
| ML-005 - ScriptEngine Code Execution | ✅ Detected |
| ML-006 - Unauthorized Model Export | ❌ Missed |
| ML-007 - Debug PII Exposure | ❌ Missed |

### Agentic AI Top 10 (5 vulnerabilities)
- **Detected**: 3/5
- **Detection Rate**: **60%**
- **Missed**: 2

| Category | Status |
|----------|--------|
| AG-001 - Secrets to Third-Party | ✅ Detected |
| AG-002 - AI Command Execution | ✅ Detected |
| AG-003 - Excessive AI Permissions | ❌ Missed |
| AG-004 - Dynamic Plugin Import | ✅ Detected |
| AG-005 - Auto-Approval Financial Actions | ❌ Missed |

## Detection Rate by Complexity

| Complexity Level | Detection Rate | Description |
|------------------|----------------|-------------|
| **Traditional Web Security** | **94%** (17/18) | Classic injection, access control, crypto |
| **Configuration Issues** | **100%** (4/4) | CORS, actuator exposure, error handling |
| **Business Logic Flaws** | **33%** (1/3) | Financial workflows, approval bypasses |
| **ML/AI Security** | **58%** (7/12) | ML-specific and AI-specific vulnerabilities |

## Scanner Output Statistics
- **Total Scanner Findings**: 113
- **True Positives** (matched planted vulns): 27
- **Additional Findings**: 86
- **Potential False Positive Rate**: 76%

## Severity Distribution of Detected Vulnerabilities

| Severity | Count | Percentage |
|----------|-------|------------|
| Critical | 7 | 26% |
| High | 57 | 50% |
| Medium | 31 | 27% |
| Low | 4 | 4% |

## True Positive Detections

### Excellent Performance (100% detection)
- **Access Control Issues**: All 5 vulnerabilities detected
- **Cryptographic Failures**: All 4 vulnerabilities detected
- **Injection Vulnerabilities**: All 5 vulnerabilities detected
- **Authentication Issues**: All 2 vulnerabilities detected
- **SSRF Vulnerabilities**: All 2 vulnerabilities detected
- **Logging Failures**: All 1 vulnerability detected
- **Security Misconfiguration**: All 3 vulnerabilities detected

### Good Performance (50-89% detection)
- **ML Security**: 57% (4/7 vulnerabilities)
- **AI Security**: 60% (3/5 vulnerabilities)

### Poor Performance (0-49% detection)
- **Insecure Design**: 33% (1/3 vulnerabilities)
- **Vulnerable Components**: 0% (0/1 vulnerability)
- **Software Integrity**: 0% (0/1 vulnerability)
- **Business Logic**: 33% (1/3 vulnerabilities)

## Critical Missed Vulnerabilities
1. **JAVA-A04-002**: Financial transaction validation bypass
2. **JAVA-A04-003**: Credit limit approval workflow bypass
3. **JAVA-A06-001**: Vulnerable Spring Boot dependencies
4. **JAVA-A08-001**: Missing file integrity validation
5. **JAVA-ML-002**: Unthrottled ML prediction DoS
6. **JAVA-ML-006**: Unauthorized model export
7. **JAVA-ML-007**: Debug PII exposure
8. **JAVA-AG-003**: Excessive AI tool permissions
9. **JAVA-AG-005**: Auto-approval financial actions

## Comparison with Other Scanners

| Metric | b2_o3-mini | b2_gpt-oss-120b | b2_gptoss-20b | Performance |
|--------|------------|-----------------|---------------|-------------|
| **Overall Detection Rate** | 73% | 65% | 68% | **1st** |
| **OWASP Detection** | 88% | 72% | 72% | **1st** |
| **AI Detection** | 60% | 80% | 80% | **3rd** |
| **ML Detection** | 57% | 29% | 43% | **1st** |
| **Total Findings** | 113 | 87 | 100 | **3rd** (highest volume) |
| **False Positive Rate** | 76% | 72% | 75% | **3rd** (highest) |
| **Precision** | 24% | 28% | 25% | **3rd** |

## Performance Metrics by Category

### Perfect Performance (100% detection)
- **Access Control Issues**: 100%
- **Cryptographic Failures**: 100%
- **Injection Vulnerabilities**: 100%
- **Authentication Issues**: 100%
- **SSRF Vulnerabilities**: 100%
- **Logging Failures**: 100%
- **Security Misconfiguration**: 100%

### Good Performance (50-89% detection)
- **ML Security**: 57%
- **AI Security**: 60%

### Poor Performance (0-49% detection)
- **Insecure Design**: 33%
- **Business Logic**: 33%
- **Vulnerable Components**: 0%
- **Software Integrity**: 0%

## Detected Vulnerability Categories

### Traditional Web Security (17/18 detected)
- SQL Injection vulnerabilities
- LDAP Injection vulnerabilities
- Command Injection vulnerabilities
- Cross-Site Scripting (XSS)
- Insecure Direct Object References (IDOR)
- Authentication bypass issues
- Cryptographic weaknesses
- CORS misconfigurations
- Debug endpoint exposures

### ML Security (4/7 detected)
- Model information leakage
- Arbitrary model loading
- Raw PII in training data
- ScriptEngine code execution

### AI Security (3/5 detected)
- Secrets to third-party services
- AI command execution
- Dynamic plugin imports

### Configuration Security (4/4 detected)
- CORS misconfigurations
- Actuator endpoint exposures
- Error handling information disclosure
- Debug endpoint security issues