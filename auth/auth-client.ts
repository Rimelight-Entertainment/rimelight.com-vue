import { createAuthClient } from "better-auth/vue";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { adminClient, organizationClient } from "better-auth/client/plugins";
import type { AccessControl } from "better-auth/plugins/access";
import { statement } from "rimelight-components/auth/statements";
import { ac, owner, admin, member, user } from "rimelight-components/auth/permissions";

let _authClient: any = null;

export const getAuthClient = (baseURL?: string) => {
  if (!_authClient && import.meta.client) {
    _authClient = createAuthClient({
      baseURL,
      plugins: [
        inferAdditionalFields<any>(),
        adminClient(),
        organizationClient({
          ac: ac as AccessControl<typeof statement>,
          roles: { owner, admin, member, user },
          teams: { enabled: true },
        }),
      ],
    });
  }
  return _authClient;
};

// No top-level calls here!
