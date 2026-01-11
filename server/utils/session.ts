import { auth } from "~~/auth/auth";
import { createError, getRequestHeaders, type H3Event } from "h3";

export const getUserSession = async (event: H3Event) => {
  const headers = new Headers(getRequestHeaders(event) as HeadersInit);

  return await auth.api.getSession({
    headers
  });
};

export const requireAuth = async (event: H3Event) => {
  const session = await getUserSession(event);

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized"
    });
  }

  return session;
};
