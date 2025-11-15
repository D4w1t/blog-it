// Generate random username
export const genUsername = (): string => {
  const userNamePrefix = "user-";
  const randomChars = Math.random().toString(36).slice(2); // example: '0.5xtj3z9' -> '5xtj3z9'

  const username = userNamePrefix + randomChars;

  return username;
};
