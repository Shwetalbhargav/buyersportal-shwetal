// lib/auth.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import type { NextRequest } from "next/server";
import { cookies } from 'next/headers';
const prisma = new PrismaClient();

// Keep secret in env
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const JWT_EXPIRES_IN = "7d";

export type AuthUser = { id: string; email: string };

export type UserRole = 'OWNER' | 'ADMIN' | 'MEMBER';
export interface SessionUser {
  id: string;
  email: string;
  role?: UserRole;
}

export async function register(email: string, password: string): Promise<{ user: AuthUser; token: string }> {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("Email already in use");
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, passwordHash } });
  const token = signToken({ id: user.id, email: user.email });
  return { user: { id: user.id, email: user.email }, token };
}

export async function login(email: string, password: string): Promise<{ user: AuthUser; token: string }> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new Error("Invalid credentials");
  const token = signToken({ id: user.id, email: user.email });
  return { user: { id: user.id, email: user.email }, token };
}

export function signToken(payload: AuthUser) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// --- helpers your routes can UTILIZE ---

/** Read JWT either from Authorization: Bearer <token> or cookie named "token" */
export function getTokenFromRequest(req: NextRequest): string | null {
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  const cookie = req.cookies.get("token")?.value;
  return cookie ?? null;
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthUser;
    return { id: payload.id, email: payload.email };
  } catch {
    return null;
  }
}

/** Throws on missing/invalid token. Use inside route handlers. */
export function requireUser(req: NextRequest): AuthUser {
  const token = getTokenFromRequest(req);
  if (!token) throw new Error("Unauthorized");
  const user = verifyToken(token);
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get('session')?.value;
  if (!token) return null;

  // Example: if your token is a base64 JSON string:
  try {
    const parsed = JSON.parse(Buffer.from(token, 'base64').toString('utf8')) as Partial<SessionUser>;
    if (!parsed?.id || !parsed?.email) return null;
    return {
      id: String(parsed.id),
      email: String(parsed.email),
      role: (parsed.role as UserRole) ?? 'MEMBER',
    };
  } catch {
    return null;
  }
}
