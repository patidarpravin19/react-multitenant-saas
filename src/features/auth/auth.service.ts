import { apiClient } from "../../services/apiClient";
import type { AuthSession, AuthUser, LoginInput } from "./auth.types";

const loginEndpoint = import.meta.env.VITE_AUTH_LOGIN_ENDPOINT ?? "/auth/login";
const logoutEndpoint = import.meta.env.VITE_AUTH_LOGOUT_ENDPOINT ?? "/auth/logout";

type LoginResponse = {
  token?: string;
  accessToken?: string;
  tenantId?: string;
  access_token?: string;
  user?: Partial<AuthUser>;
  data?: LoginResponse;
};

function toSession(response: LoginResponse, input: LoginInput): AuthSession {
  const body = response.data ?? response;
  const token = body.accessToken ?? body.access_token ?? body.token;
  if (!token) throw new Error("The login response did not include an access token.");

  return {
    token,
    tenantId: body.tenantId,
    user: {
      username: body.user?.username ?? input.username,
      tenantSlug: body.user?.tenantSlug ?? input.tenantSlug,
      id: body.user?.id,
      displayName: body.user?.displayName,
    },
  };
}

export const authService = {
  async login(input: LoginInput) {
    const response = await apiClient.post<LoginResponse>(loginEndpoint, input, {
      authenticate: false,
    });
    return toSession(response, input);
  },
  logout: () => apiClient.post<void>(logoutEndpoint, undefined),
};
