import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { sql } from "@vercel/postgres";
import { User } from "./lib/definitions";
import { signInSchema } from "./lib/zod";

const getUser = async (email: string): Promise<User | undefined> => {
  try {
    const user = await sql<User>`SELECT * from USERS where email = ${email}`;
    return user.rows[0];
  } catch (error) {
    console.error("failed to fetch user: ", error);
    throw new Error("failed to fetch user");
  }
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = await signInSchema.parseAsync(
            credentials
          );
          const user = await getUser(email);
          if (!user) return null;
          const verifyPassword = await bcrypt.compare(password, user.password);
          if (verifyPassword) return user;
        }

        return null;
      },
    }),
  ],
});
