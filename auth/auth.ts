import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import { admin, organization } from "better-auth/plugins";
import { v7 as uuidv7 } from "uuid";
import { db, user } from "../server/db";
import { createAccessControl } from "better-auth/plugins/access";
import {
  statement,
  admin as adminRole,
  member,
  owner,
  user as userRole,
  createRestrictedSet,
  normalizeUsername,
  createGenerateUniqueTag,
} from "rimelight-components/auth";

const ac = createAccessControl(statement);

// Project-specific restricted usernames (brand names, founder, etc.)
const PROJECT_RESTRICTED_USERNAMES = [
  "rimelight",
  "rimelightent",
  "rimelightentertainment",
  "rimelightofficial",
  "grandtale",
  "playgrandtale",
  "danielmarchi",
  "dmarchi",
];
const RESTRICTED_SET = createRestrictedSet(PROJECT_RESTRICTED_USERNAMES);
const generateUniqueTag = createGenerateUniqueTag(db, user);

// Project-specific admin email domain
const ADMIN_EMAIL_DOMAIN = "@rimelight.com";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  advanced: {
    database: {
      generateId: () => uuidv7(),
    },
    cookiePrefix: "better-auth",
    useSecureCookies: true,
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  rateLimit: {
    enabled: true,
    storage: "database",
    modelName: "rateLimit",
    window: 60,
    max: 100,
    customRules: {
      "/sign-in/email": {
        window: 10,
        max: 3,
      },
      "/two-factor/*": async (_request) => {
        return {
          window: 10,
          max: 3,
        };
      },
    },
  },
  user: {
    changeEmail: {
      enabled: true,
    },
    emailVerification: {
      //sendVerificationEmail: async ({ user, url, token }) => {
      //await sendEmail({
      //  to: user.email
      //})
      //}
    },
    deleteUser: {
      enabled: true,
      //sendDeleteAccountVerification: async ({ user, url, token }, request) => {
      //await sendEmail(Odata.user.email, "Delete Account Verification", data.url)
      // }
    },
    additionalFields: {
      tag: {
        type: "string",
        required: false,
        default: "0000",
        input: false,
      },
      firstName: {
        type: "string",
        required: true,
        default: "",
        input: true,
      },
      lastName: {
        type: "string",
        required: true,
        default: "",
        input: true,
      },
      role: {
        type: "string",
        required: false,
        default: "user",
        input: false,
      },
      availability: {
        type: "string",
        required: false,
        default: "available",
      },
      status: {
        type: "string",
        required: false,
        default: "",
      },
      publicKey: {
        type: "string",
        required: false,
        input: true,
      },
      encryptedPrivateKey: {
        type: "string",
        required: false,
        input: true,
      },
      derivationSalt: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    freshAge: 60 * 15,
    disableSessionRefresh: false,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  plugins: [
    admin(),
    organization({
      ac,
      roles: {
        owner,
        admin: adminRole,
        member,
        user: userRole,
      },
      teams: {
        enabled: true,
      },
    }),
  ],
  databaseHooks: {
    user: {
      create: {
        before: async (userData, _ctx) => {
          throw new APIError("FORBIDDEN", {
            message: "Signups are temporarily disabled",
          });

          // 1. Normalize the incoming username (strip dots, dashes, underscores)
          const normalizedInput = normalizeUsername(userData.name);

          // 2. Strict check against the restricted set
          if (RESTRICTED_SET.has(normalizedInput)) {
            throw new APIError("BAD_REQUEST", {
              message: "This username is reserved for official use.",
            });
          }

          // Determine admin role based on email domain
          const role = userData.email.endsWith(ADMIN_EMAIL_DOMAIN) ? "admin" : "user";
          const uniqueTag = await generateUniqueTag(userData.name);

          return {
            data: {
              ...userData,
              role,
              tag: uniqueTag,
            },
          };
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
