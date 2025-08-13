# Scanner Performance Statistics Report: b2_gpt-oss-120b

## Overall Detection Rate
- **Total Planted Vulnerabilities**: 37
- **Successfully Detected**: 24
- **Detection Rate**: **65%**
- **Missed Vulnerabilities**: 13 (35%)

## Detection by Vulnerability Category

### OWASP Top 10 (25 vulnerabilities)
- **Detected**: 18/25
- **Detection Rate**: **72%**
- **Missed**: 7

| Category | Detected | Total | Rate |
|----------|----------|-------|------|
| A01 - Broken Access Control | 4/5 | 5 | **80%** |
| A02 - Cryptographic Failures | 4/4 | 4 | **100%** |
| A03 - Injection | 4/5 | 5 | **80%** |
| A04 - Insecure Design | 0/3 | 3 | **0%** |
| A05 - Security Misconfiguration | 2/3 | 3 | **67%** |
| A06 - Vulnerable Components | 0/1 | 1 | **0%** |
| A07 - Authentication Failures | 2/2 | 2 | **100%** |
| A08 - Software Integrity Failures | 0/1 | 1 | **0%** |
| A09 - Logging Failures | 1/1 | 1 | **100%** |
| A10 - Server-Side Request Forgery | 2/2 | 2 | **100%** |

### ML Top 10 (7 vulnerabilities)
- **Detected**: 2/7
- **Detection Rate**: **29%**
- **Missed**: 5

| Category | Status |
|----------|--------|
| ML-001 - Model Info Leakage | ❌ Missed |
| ML-002 - Unthrottled Predictions | ❌ Missed |
| ML-003 - Arbitrary Model Loading | ❌ Missed |
| ML-004 - Raw PII in Training Data | ❌ Missed |
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
| **Traditional Web Security** | **78%** (14/18) | Classic injection, access control, crypto |
| **Configuration Issues** | **75%** (3/4) | CORS, actuator exposure, error handling |
| **Business Logic Flaws** | **33%** (1/3) | Financial workflows, approval bypasses |
| **ML/AI Security** | **50%** (6/12) | ML-specific and AI-specific vulnerabilities |

## Scanner Output Statistics
- **Total Scanner Findings**: 87
- **True Positives** (matched planted vulns): 24
- **Additional Findings**: 63
- **Potential False Positive Rate**: 72%

## Severity Distribution of Detected Vulnerabilities

| Severity | Count | Percentage |
|----------|-------|------------|
| Critical | 8 | 9% |
| High | 47 | 54% |
| Medium | 29 | 33% |
| Low | 3 | 3% |

## True Positive Detections

### Excellent Performance (90-100% detection)
- **Cryptographic Failures**: 100% (4/4)
- **Authentication Issues**: 100% (2/2)
- **SSRF Vulnerabilities**: 100% (2/2)
- **Logging Failures**: 100% (1/1)

### Good Performance (70-89% detection)
- **Access Control Issues**: 80% (4/5)
- **Injection Vulnerabilities**: 80% (4/5)
- **Agentic AI Security**: 80% (4/5)

### Average Performance (50-69% detection)
- **Security Misconfiguration**: 67% (2/3)

### Poor Performance (0-49% detection)
- **ML Security**: 29% (2/7)
- **Business Logic**: 33% (1/3)
- **Insecure Design**: 0% (0/3)
- **Vulnerable Components**: 0% (0/1)
- **Software Integrity**: 0% (0/1)

## Critical Missed Vulnerabilities
1. **JAVA-A01-005**: Cross-tenant file download IDOR
2. **JAVA-A04-002**: Financial transaction validation bypass
3. **JAVA-A04-003**: Credit limit approval workflow bypass
4. **JAVA-A05-003**: Debug endpoints exposure
5. **JAVA-A06-001**: Vulnerable Spring Boot dependencies
6. **JAVA-A08-001**: Missing file integrity validation
7. **JAVA-ML-001**: ML model info leakage
8. **JAVA-ML-002**: Unthrottled ML prediction DoS
9. **JAVA-ML-003**: Arbitrary model loading from URLs
10. **JAVA-ML-004**: Raw PII in training data
11. **JAVA-ML-006**: Unauthorized model export
12. **JAVA-AG-003**: Excessive AI tool permissions

## Comparison with Other Scanners

| Metric | b2_gpt-oss-120b | b2_o3-mini | b2_gptoss-20b | Performance |
|--------|-----------------|------------|---------------|-------------|
| **Overall Detection Rate** | 65% | 73% | 68% | **3rd** |
| **OWASP Detection** | 72% | 88% | 72% | **2nd** (tied) |
| **AI Detection** | 80% | 60% | 80% | **1st** (tied) |
| **ML Detection** | 29% | 57% | 43% | **3rd** |
| **Total Findings** | 87 | 113 | 100 | **1st** (most efficient) |
| **False Positive Rate** | 72% | 76% | 75% | **1st** (lowest) |
| **Precision** | 28% | 24% | 25% | **1st** |

## Performance Metrics by Category

### Excellent Performance (90-100% detection)
- **Cryptographic Failures**: 100%
- **Authentication Issues**: 100%
- **SSRF Vulnerabilities**: 100%
- **Logging Failures**: 100%

### Good Performance (70-89% detection)
- **Access Control Issues**: 80%
- **Injection Vulnerabilities**: 80%
- **Agentic AI Security**: 80%

### Average Performance (50-69% detection)
- **Security Misconfiguration**: 67%

### Poor Performance (0-49% detection)
- **ML Security**: 29%
- **Business Logic**: 33%
- **Insecure Design**: 0%
- **Vulnerable Components**: 0%
- **Software Integrity**: 0%

## Detected Vulnerability Categories

### Traditional Web Security (14/18 detected)
- SQL Injection vulnerabilities
- LDAP Injection vulnerabilities
- Command Injection vulnerabilities
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

### ML Security (2/7 detected)
- ScriptEngine code execution
- Debug PII exposure

### Configuration Security (3/4 detected)
- CORS misconfigurations
- Actuator endpoint exposures
- Error handling information disclosure

## Unique Strengths vs Other Scanners
- **Superior AI Security Detection**: 80% vs b2_o3-mini's 60%
- **Financial Logic Awareness**: Detected auto-approval bypass
- **Most Efficient**: 87 findings vs 113 (b2_o3-mini) and 100 (b2_gptoss-20b)
- **Best Precision**: 28% vs 24% (b2_o3-mini) and 25% (b2_gptoss-20b)
- **Lowest False Positive Rate**: 72% vs 76% (b2_o3-mini) and 75% (b2_gptoss-20b)