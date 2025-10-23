import sequelize from "../config/sequelize";

import { DataTypes } from "sequelize";
import { User } from "./user";
import { Task } from "./task";
import { Notification } from "./notification";
import { BlacklistedToken } from "./blacklistedToken";

User.init(
  {
    uid: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(50), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "user",
    },
  },
  { sequelize, tableName: "User", timestamps: false }
);

Task.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    is_completed: { type: DataTypes.BOOLEAN, defaultValue: false },
    scheduled_for: { type: DataTypes.DATE, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    description: { type: DataTypes.TEXT },
    status: { type: DataTypes.STRING(50) },
    priority: { type: DataTypes.STRING(50) },
    image_url: { type: DataTypes.STRING(500) },
    is_important: { type: DataTypes.BOOLEAN, defaultValue: false },
    completed_at: { type: DataTypes.DATE },
  },
  { sequelize, tableName: "Tasks", timestamps: false }
);

Notification.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    taskId: { type: DataTypes.INTEGER, allowNull: false },
    message: { type: DataTypes.STRING, allowNull: false },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { sequelize, tableName: "Notifications", timestamps: true }
);

BlacklistedToken.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    token: { type: DataTypes.TEXT, allowNull: false, unique: true },
    expires_at: { type: DataTypes.DATE, allowNull: false },
    reason: { type: DataTypes.STRING(255) },
    blacklisted_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { sequelize, tableName: "BlacklistedTokens", timestamps: false }
);

// 2️⃣ Define associations

// User ↔ Task
User.hasMany(Task, { foreignKey: "user_id", as: "tasks" });
Task.belongsTo(User, { foreignKey: "user_id", as: "user" });

// User ↔ Notification
User.hasMany(Notification, { foreignKey: "userId", as: "notifications" });
Notification.belongsTo(User, { foreignKey: "userId", as: "user" });

// Task ↔ Notification
Task.hasMany(Notification, { foreignKey: "taskId", as: "notifications" });
Notification.belongsTo(Task, { foreignKey: "taskId", as: "task" });

// 3️⃣ Export everything
export { sequelize, User, Task, Notification, BlacklistedToken };
