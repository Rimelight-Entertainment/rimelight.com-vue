import { auth } from "~~/auth/auth";
import { createError, getRequestHeaders, type H3Event } from "h3";

export const getUserSession = async (event: H3Event) => {
  const headers = new Headers(getRequestHeaders(event) as HeadersInit);

  // Wrap the Better Auth call in a promise race to enforce a timeout
  // This prevents infinite hangs if the database (Neon) is unreachable
  const timeoutPromise = new Promise<null>((_, reject) =>
    setTimeout(() => reject(new Error("Session fetch timed out")), 5000),
  );

  try {
    return await Promise.race([
      auth.api.getSession({
        headers,
      }),
      timeoutPromise,
    ]);
  } catch (e) {
    console.error("Session fetch failed or timed out:", e);
    return null;
  }
};

export const requireAuth = async (event: H3Event) => {
  const session = await getUserSession(event);

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  return session;
};

export const requireAdminOrOwner = async (event: H3Event) => {
  const session = await getUserSession(event);

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized: Login required",
    });
  }

  let role = session.user.role;

  // Fallback: fetch role from DB if missing from session
  if (!role) {
    const { db, user } = await import("#server/db");
    const { eq } = await import("drizzle-orm");
    const [u] = await db
      .select({ role: user.role })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);
    role = u?.role || undefined;
  }

  if (!role || !["admin", "owner"].includes(role)) {
    console.warn(`Unauthorized access attempt by ${session.user.id}. Role: ${role}`);
    throw createError({
      statusCode: 403,
      statusMessage: "Unauthorized: Admin or Owner access required",
    });
  }

  return { ...session, user: { ...session.user, role } };
};
