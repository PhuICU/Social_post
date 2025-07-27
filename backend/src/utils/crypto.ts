import { createHash } from "crypto";
import env_config from "~/configs/env.config";

const sha256 = (content: string) =>
  createHash("sha256").update(content).digest("hex");
const hashPassword = (password: string) =>
  sha256(password + env_config.HASH_PASSWORD_SECRET);
export default hashPassword;
