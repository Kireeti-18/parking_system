export function getPathType(
  pathname: string,
  userType: 'user' | 'admin' | null | undefined,
): ['auth', true | false | null] | ['default', true | false | null] {
  const isAdmin =
    userType === null || userType === undefined ? null : userType === 'admin';
  if (pathname?.includes('signin') || pathname?.includes('signup')) {
    return ['auth', isAdmin];
  } else {
    return ['default', isAdmin];
  }
}
