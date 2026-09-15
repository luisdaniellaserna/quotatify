import type { AuthType } from '#shared/types/provider'

const AUTH_HEADERS: Record<AuthType, (apiKey: string) => Record<string, string>> = {
  bearer: apiKey => ({ Authorization: `Bearer ${apiKey}` }),
  'x-api-key': apiKey => ({ 'x-api-key': apiKey }),
}

export function buildAuthHeaders(authType: AuthType, apiKey: string): Record<string, string> {
  return (AUTH_HEADERS[authType] ?? AUTH_HEADERS.bearer)(apiKey)
}
