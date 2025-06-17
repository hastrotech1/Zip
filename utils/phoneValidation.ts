export const isValidNGPhone = (phone: string): boolean =>
  /^(?:\+234|0)?[789][01]\d{8}$/.test(phone.trim());
