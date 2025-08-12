package com.financehub.files;

import static org.assertj.core.api.Assertions.assertThat;

import com.financehub.service.FileService;
import com.financehub.tenancy.TenantContext;
import com.financehub.test.IntegrationTestBase;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockMultipartFile;

class FileControllerIntegrationTest extends IntegrationTestBase {

  @Autowired private FileService fileService;

  @BeforeEach
  void setup() {
    TenantContext.setTenantId("test-tenant");
  }

  @Test
  void upload_rejectsUnsupportedMime() {
    MockMultipartFile f = new MockMultipartFile("file", "evil.bin", "application/x-msdownload", new byte[]{1,2,3});
    try {
      fileService.upload(f);
      assertThat(true).isFalse();
    } catch (IllegalArgumentException expected) {
      assertThat(expected.getMessage()).contains("Unsupported file type");
    }
  }

  @Test
  void upload_acceptsPdf() {
    MockMultipartFile f = new MockMultipartFile("file", "test.pdf", "application/pdf", "data".getBytes(StandardCharsets.UTF_8));
    String id = fileService.upload(f);
    assertThat(id).isNotBlank();
  }
}


