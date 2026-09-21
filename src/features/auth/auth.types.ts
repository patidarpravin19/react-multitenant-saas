export interface LoginInput {
  tenantSlug: string;
  username: string;
  password: string;
}

export interface AuthUser {
  id?: string;
  username: string;
  displayName?: string;
  tenantSlug?: string;
}

export interface AuthSession {
  token: string;
  user: AuthUser;
}
