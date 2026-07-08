import crypto from "node:crypto";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });
const password = await rl.question("Admin password: ");
rl.close();

if (!password || password.length < 12) {
  console.error("Password must be at least 12 characters.");
  process.exit(1);
}

const salt = crypto.randomBytes(16).toString("base64url");
const options = { N: 16384, r: 8, p: 1 };
const hash = crypto.scryptSync(password, salt, 32, options).toString("base64url");

console.log(`ADMIN_PASSWORD_HASH=scrypt:${options.N}:${options.r}:${options.p}:${salt}:${hash}`);
