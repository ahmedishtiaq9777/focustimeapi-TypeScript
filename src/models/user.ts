import { Model, Optional } from "sequelize";
import { UserAttributes } from "focustime_types";
import { UserCreationAttributes } from "focustime_types";

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public uid!: number;
  public name!: string;
  public email?: string;
  public password!: string;
  public role!: "user" | "admin";
}
