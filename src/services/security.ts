/**
 * Security architecture (contracts only).
 * Nothing here performs cryptography yet — it defines the boundary so the
 * app can adopt biometrics, PIN, encryption-at-rest and session control
 * without touching feature code.
 */
export type LockReason = "startup" | "timeout" | "background" | "manual";

export interface SessionState {
  status: "locked" | "unlocked" | "unauthenticated";
  lockedAt?: string;
  reason?: LockReason;
}

export interface EncryptionProvider {
  /** Envelope-encrypt a payload before it touches persistent storage. */
  encrypt(plain: string): Promise<string>;
  decrypt(cipher: string): Promise<string>;
}

export interface CredentialVault {
  set(key: string, value: string): Promise<void>;
  get(key: string): Promise<string | null>;
  remove(key: string): Promise<void>;
}

export interface SessionPolicy {
  autoLockMinutes: number;
  requireAuthOnLaunch: boolean;
  allowBiometrics: boolean;
  allowPin: boolean;
}

export const DEFAULT_SESSION_POLICY: SessionPolicy = {
  autoLockMinutes: 5,
  requireAuthOnLaunch: true,
  allowBiometrics: true,
  allowPin: true,
};

/** Fields that must never be logged, exported in plain text or cached. */
export const SENSITIVE_FIELDS = ["pin", "password", "accessToken", "refreshToken", "documentUrl"] as const;
