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

// Removed the Proxy back to explicit export to avoid "ce" null errors.
// Components should use useAuth() or getAuthClient() directly.
export const authClient = null as any;

export type ClientSession = any;
