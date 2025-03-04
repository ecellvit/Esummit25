import { getSession } from "next-auth/react";

export const getSessionUser = async () => {
  const session = await getSession();
  return session?.user || null;
};
