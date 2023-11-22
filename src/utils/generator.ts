export function generateUserVerifyCode(length: number): string {
  const num1 = Number(`1${'0'.repeat(length - 1)}`);
  const num2 = Number(`9${'0'.repeat(length - 1)}`);
  return Math.floor(num1 + Math.random() * num2).toString();
}
