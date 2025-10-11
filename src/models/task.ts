import { Model, Optional } from "sequelize";
import { TaskAttributes } from "focustime_types";
import { CreateTaskDTO as TaskCreationAttributes } from "focustime_types";

// export type TaskCreationAttributes = Omit<
//   TaskAttributes,
//   "id" | "created_at"
// >;

export class Task
  extends Model<TaskAttributes, TaskCreationAttributes>
  implements TaskAttributes
{
  public id!: number;
  public title!: string;
  public user_id!: number;
  public scheduled_for?: Date;
  public is_completed?: boolean;
  public description?: string;
  public status?: string;
  public priority?: string;
  public image_url?: string;
  public is_important?: boolean;
  public completed_at?: Date;
}
