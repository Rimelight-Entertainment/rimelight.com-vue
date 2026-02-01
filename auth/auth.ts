import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "../server/db"
import { v7 as uuidv7 } from "uuid"
import { admin } from "better-auth/plugins"
import { generateUniqueTag } from "./utils"
import { APIError } from "better-auth/api"
import { RESTRICTED_SET } from "#shared/constants/restricted-usernames"

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  advanced: {
    database: {
      generateId: () => uuidv7()
    },
    cookiePrefix: "better-auth",
    useSecureCookies: true
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true
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
        max: 3
      },
      "/two-factor/*": async (_request) => {
        return {
          window: 10,
          max: 3
        }
      }
    }
  },
  user: {
    changeEmail: {
      enabled: true
    },
    emailVerification: {
      //sendVerificationEmail: async ({ user, url, token }) => {
      //await sendEmail({
      //  to: user.email
      //})
      //}
    },
    deleteUser: {
      enabled: true
      //sendDeleteAccountVerification: async ({ user, url, token }, request) => {
      //await sendEmail(Odata.user.email, "Delete Account Verification", data.url)
      // }
    },
    additionalFields: {
      tag: {
        type: "string",
        required: false,
        default: "0000",
        input: false
      },
      firstName: {
        type: "string",
        required: true,
        default: "",
        input: true
      },
      lastName: {
        type: "string",
        required: true,
        default: "",
        input: true
      },
      role: {
        type: "string",
        required: false,
        default: "user",
        input: false
      },
      availability: {
        type: "string",
        required: false,
        default: "available"
      },
      status: {
        type: "string",
        required: false,
        default: ""
      }
    }
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    freshAge: 60 * 15,
    disableSessionRefresh: false,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5
    }
  },
  plugins: [admin()],
  databaseHooks: {
    user: {
      create: {
        before: async (user, _ctx) => {
          // 1. Normalize the incoming username (strip dots, dashes, underscores)
          const normalizedInput = user.name.toLowerCase().replace(/[^a-z0-9]/g, "")

          // 2. Strict check against the restricted set
          // This prevents "admin" but allows "admin_fan"
          if (RESTRICTED_SET.has(normalizedInput)) {
            throw new APIError("BAD_REQUEST", {
              message: "This username is reserved for official use."
            })
          }

          const role = user.email.endsWith("@rimelight.com") ? "admin" : "user"
          const uniqueTag = await generateUniqueTag(user.name)

          return {
            data: {
              ...user,
              role,
              tag: uniqueTag
            }
          }
        }
      }
    }
  }
})

export type Session = typeof auth.$Infer.Session
