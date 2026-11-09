export function getSessionUser(): string | undefined {
  const cookie = document.cookie.split('; ').find(item => item.startsWith('user='));
  return cookie ? decodeURIComponent(cookie.slice('user='.length)) : undefined;
}
