import { BlacklistedToken } from "../models/blacklistedToken";
import { CreationAttributes, Op } from "sequelize";

export async function addBlacklistedToken(
  tokenData: CreationAttributes<BlacklistedToken>
) {
  return await BlacklistedToken.create(tokenData);
}

export async function isTokenBlacklisted(token: string): Promise<boolean> {
  const record = await BlacklistedToken.findOne({
    where: {
      token,
      expires_at: { [Op.gt]: new Date() }, // still valid
    },
  });

  return !!record;
}
export async function cleanupExpiredTokens(): Promise<number> {
  return await BlacklistedToken.destroy({
    where: { expires_at: { [Op.lt]: new Date() } },
  });
}
