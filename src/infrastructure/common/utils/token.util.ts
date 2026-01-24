export function extractJwt(token: string): string {
  const match = token.match(/=(.+?);/);
  return match ? match[1] : token;
}
