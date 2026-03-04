export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
}

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  label: "Weak" | "Fair" | "Good" | "Strong" | "Very Strong";
  entropyBits: number;
  color: string;
}

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const UPPERCASE_CLEAN = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // no I, O
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const LOWERCASE_CLEAN = "abcdefghjkmnpqrstuvwxyz"; // no i, l
const NUMBERS = "0123456789";
const NUMBERS_CLEAN = "23456789"; // no 0, 1
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

export function buildCharset(options: PasswordOptions): string {
  let charset = "";
  if (options.uppercase) {
    charset += options.excludeAmbiguous ? UPPERCASE_CLEAN : UPPERCASE;
  }
  if (options.lowercase) {
    charset += options.excludeAmbiguous ? LOWERCASE_CLEAN : LOWERCASE;
  }
  if (options.numbers) {
    charset += options.excludeAmbiguous ? NUMBERS_CLEAN : NUMBERS;
  }
  if (options.symbols) {
    charset += SYMBOLS;
  }
  return charset;
}

export function generatePassword(options: PasswordOptions): string {
  const charset = buildCharset(options);
  if (charset.length === 0) {
    throw new Error("Select at least one character type");
  }
  const length = Math.max(1, Math.min(128, options.length));
  const randomBytes = new Uint32Array(length);
  crypto.getRandomValues(randomBytes);

  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset[randomBytes[i] % charset.length];
  }
  return password;
}

export function generateMultiple(
  count: number,
  options: PasswordOptions
): string[] {
  return Array.from({ length: Math.max(1, Math.min(50, count)) }, () =>
    generatePassword(options)
  );
}

export function calcStrength(password: string): PasswordStrength {
  if (password.length === 0) {
    return { score: 0, label: "Weak", entropyBits: 0, color: "#f85149" };
  }
  let charsetSize = 0;
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;

  const entropyBits =
    charsetSize > 0 ? Math.log2(charsetSize) * password.length : 0;

  if (entropyBits < 40)
    return { score: 0, label: "Weak", entropyBits, color: "#f85149" };
  if (entropyBits < 60)
    return { score: 1, label: "Fair", entropyBits, color: "#d29922" };
  if (entropyBits < 80)
    return { score: 2, label: "Good", entropyBits, color: "#3b82f6" };
  if (entropyBits < 100)
    return { score: 3, label: "Strong", entropyBits, color: "#3fb950" };
  return { score: 4, label: "Very Strong", entropyBits, color: "#39d353" };
}
