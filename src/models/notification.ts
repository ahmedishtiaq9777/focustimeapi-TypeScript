import { Model, Optional } from "sequelize";
import { NotificationAttributes } from "focustime_types";

export type NotificationCreationAttributes = Optional<
  NotificationAttributes,
  "id" | "isRead" | "createdAt" | "updatedAt"
>;

export class Notification
  extends Model<NotificationAttributes, NotificationCreationAttributes>
  implements NotificationAttributes
{
  public id!: number;
  public userId!: number;
  public taskId!: number;
  public message!: string;
  public isRead!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
