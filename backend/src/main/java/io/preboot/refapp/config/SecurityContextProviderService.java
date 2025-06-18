package io.preboot.refapp.config;

import io.preboot.auth.api.dto.UserAccountInfo;
import java.util.Set;
import java.util.UUID;

import io.preboot.securedata.context.SecurityContext;
import io.preboot.securedata.context.SecurityContextProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
class SecurityContextProviderService implements SecurityContextProvider {

    @Override
    public SecurityContext getCurrentContext() {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            final UserAccountInfo userAccountInfo = (UserAccountInfo) authentication.getPrincipal();
            return new BasicSecurityContext(
                    userAccountInfo.uuid(),
                    userAccountInfo.tenantId(),
                    userAccountInfo.roles(),
                    userAccountInfo.getAllPermissions());
        }
        return null;
    }

    static class BasicSecurityContext implements SecurityContext {
        private final UUID userId;
        private final UUID tenantId;
        private final Set<String> roles;
        private final Set<String> permissions;

        public BasicSecurityContext(UUID userId, UUID tenantId, Set<String> roles, Set<String> permissions) {
            this.userId = userId;
            this.tenantId = tenantId;
            this.roles = roles;
            this.permissions = permissions;
        }

        @Override
        public UUID getUserId() {
            return userId;
        }

        @Override
        public UUID getTenantId() {
            return tenantId;
        }

        @Override
        public Set<String> getRoles() {
            return roles;
        }

        @Override
        public Set<String> getPermissions() {
            return permissions;
        }
    }
}
