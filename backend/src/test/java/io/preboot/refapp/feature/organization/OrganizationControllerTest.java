package io.preboot.refapp.feature.organization;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import io.preboot.refapp.config.AbstractIntegrationTest;
import com.absolutsystems.refapp.feature.organization.dto.OrganizationCreateRequest;
import com.absolutsystems.refapp.feature.organization.dto.OrganizationResponse;
import com.absolutsystems.refapp.feature.organization.dto.OrganizationUserAssignRequest;
import com.absolutsystems.refapp.feature.organization.model.Organization;
import com.absolutsystems.refapp.feature.organization.repository.OrganizationRepository;
import com.absolutsystems.refapp.feature.organization.repository.UserAccountOrganizationRepository;
import io.preboot.auth.api.dto.AuthResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Set;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class OrganizationControllerTest extends AbstractIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private UserAccountOrganizationRepository userOrgRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private String superAdminToken;

    @BeforeEach
    void setUp() throws Exception {
        // Clean the database
        userOrgRepository.deleteAll();
        organizationRepository.deleteAll();

        // Create super admin token
        MvcResult loginResult = mockMvc.perform(
                        post("/api/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(
                                        """
                    {
                        "email": "super-admin@system.local",
                        "password": "changeme",
                        "rememberMe": false
                    }
                    """))
                .andExpect(status().isOk())
                .andReturn();

        AuthResponse authResponse =
                objectMapper.readValue(loginResult.getResponse().getContentAsString(), AuthResponse.class);

        superAdminToken = authResponse.token();
    }

    @Test
    void shouldCreateOrganization() throws Exception {
        // given
        OrganizationCreateRequest request = new OrganizationCreateRequest("Test Org");

        // when
        MvcResult result = mockMvc.perform(post("/api/organizations")
                        .header("Authorization", "Bearer " + superAdminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andReturn();

        // then
        OrganizationResponse response =
                objectMapper.readValue(result.getResponse().getContentAsString(), OrganizationResponse.class);

        assertThat(response.uuid()).isNotNull();
        assertThat(response.name()).isEqualTo("Test Org");

        // verify database
        assertThat(organizationRepository.findByUuid(response.uuid()))
                .isPresent()
                .hasValueSatisfying(org -> {
                    assertThat(org.getName()).isEqualTo("Test Org");
                });
    }

    @Test
    void shouldGetOrganization() throws Exception {
        // given
        Organization org = organizationRepository.save(
                new Organization().setUuid(UUID.randomUUID()).setName("Test Org"));

        // when
        MvcResult result = mockMvc.perform(
                        get("/api/organizations/" + org.getUuid()).header("Authorization", "Bearer " + superAdminToken))
                .andExpect(status().isOk())
                .andReturn();

        // then
        OrganizationResponse response =
                objectMapper.readValue(result.getResponse().getContentAsString(), OrganizationResponse.class);

        assertThat(response.uuid()).isEqualTo(org.getUuid());
        assertThat(response.name()).isEqualTo(org.getName());
    }

    @Test
    void shouldAssignUserToOrganization() throws Exception {
        // given
        Organization org = organizationRepository.save(
                new Organization().setUuid(UUID.randomUUID()).setName("Test Org"));

        UUID userUuid = UUID.randomUUID(); // in real test we would create a real user
        OrganizationUserAssignRequest request = new OrganizationUserAssignRequest(userUuid, Set.of("USER"));

        // when
        mockMvc.perform(post("/api/organizations/" + org.getUuid() + "/users")
                        .header("Authorization", "Bearer " + superAdminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        // then
        assertThat(userOrgRepository.getByUserAccountUuid(userUuid)).isPresent().hasValueSatisfying(userOrg -> {
            assertThat(userOrg.getOrganizationUuid()).isEqualTo(org.getUuid());
        });
    }
}
