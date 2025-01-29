import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      lastname?: string;
      phone?: string;
      address?: string;
      role?: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: string;
    id: string;
    name: string;
    lastname?: string;
    email: string;
    phone?: string;
    address?: string;
    role?: string;
  }
}

interface Session {
  user: User;
}
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    lastname?: string;
    phone?: string;
    address?: string;
    role?: string;
  }
}
