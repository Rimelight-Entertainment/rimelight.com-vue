export const defaultAuthOptions = {
  restrictedUsernames: [] as string[],
  adminEmailDomain: null as string | null,
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    freshAge: 60 * 15, // 15 minutes
  },
};
