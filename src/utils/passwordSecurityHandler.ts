import bcrypt from 'bcryptjs';

const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

const comparePasswords = async (
  rawPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(rawPassword, hashedPassword);
};

export { hashPassword, comparePasswords };
