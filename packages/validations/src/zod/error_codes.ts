import { ZodError } from 'zod';

const errorMessages: Record<string, string> = {
  empty: 'not be empty',
  invalid: 'be a valid email address',
  len: 'be exactly 8 characters long',
  small: 'be at least 8 characters long',
  lower: 'contain at least one lowercase letter',
  upper: 'contain at least one uppercase letter',
  num: 'contain at least one number',
  special: 'contain at least one special character',
};

const fieldPrefixes: Record<string, string> = {
  name: 'Name must',
  email: 'Email must',
  token: 'Access token must',
  pass: 'Password must',
};

function getErrorCodes(error: ZodError) {
  return error.issues.map((issue) => issue.message);
}

export function formatErrors(error: ZodError): string[] {
  const codes = getErrorCodes(error);
  const grouped: Record<string, string[]> = {};

  for (const code of codes) {
    const field = code.split('_')[0] as keyof typeof fieldPrefixes | string;

    if (!grouped[field]) grouped[field] = [];
    grouped[field].push(
      errorMessages[code.split('_')[1] || ''] || `Unknown rule: ${code}`,
    );
  }

  return Object.entries(grouped).map(([field, msgs]) => {
    const prefix = (fieldPrefixes as Record<string, string>)[field] || ``;

    if (
      msgs.length === 1 &&
      ((msgs[0] || '').startsWith("can't") || (msgs[0] || '').startsWith('not'))
    ) {
      return `${prefix.replace(' must', '')} ${msgs[0]}`;
    }

    return `${prefix} ${msgs.join(' and ')}`;
  });
}
