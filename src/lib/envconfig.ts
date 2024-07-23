import dotenv from "dotenv";

dotenv.config();

export const envconfig = {
  port: process.env.PORT,
  db: process.env.DB_MAIN,
};
