import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const envVariables = {
    PORT: String(process.env.PORT),
    HOSTNAME: String(process.env.HOSTNAME),
    MONGO_DB_URL: String(process.env.MONGO_DB_URL),
    MONGO_DB_DATABASE_NAME: String(process.env.MONGO_DB_DATABASE_NAME),
    JWT_SECRET: String(process.env.JWT_SECRET)
};

export default envVariables;
