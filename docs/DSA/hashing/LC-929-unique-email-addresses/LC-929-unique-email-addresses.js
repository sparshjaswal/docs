// These normalization rules belong to this exercise, not every email provider.
export function numUniqueEmails(emails) {
  const unique = new Set();
  for (const email of emails) {
    const [local, domain] = email.split('@');
    const normalized = local.split('+')[0].replaceAll('.', '');
    unique.add(`${normalized}@${domain}`);
  }
  return unique.size;
}
