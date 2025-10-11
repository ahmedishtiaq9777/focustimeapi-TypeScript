import { Model, Optional } from "sequelize";

export interface BlacklistedTokenAttributes {
  id: number;
  token: string;
  expires_at: Date;
  reason?: string;
  blacklisted_at: Date;
}

export type BlacklistedTokenCreationAttributes = Optional<
  BlacklistedTokenAttributes,
  "id" | "reason" | "blacklisted_at"
>;
export class BlacklistedToken
  extends Model<BlacklistedTokenAttributes, BlacklistedTokenCreationAttributes>
  implements BlacklistedTokenAttributes
{
  public id!: number;
  public token!: string;
  public expires_at!: Date;
  public reason?: string;
  public blacklisted_at!: Date;
}
