import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "mssql",
  host: process.env.DB_HOST || "localhost",
  username: process.env.DB_USER || "sa",
  password: process.env.DB_PASS || "your_password",
  database: process.env.DB_NAME || "Focustime",
  logging: false,
  dialectOptions: {
    options: {
      encrypt: false,
    },
  },
});

export default sequelize;
