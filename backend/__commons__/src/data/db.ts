import  {Sequelize, Dialect}  from "sequelize";

const dbDialect  = process.env.DB_DIALECT! as Dialect;
const dbHost     = process.env.DB_HOST;
const dbName     = process.env.DB_NAME!;
const dbUser     = process.env.DB_USER!;
const dbLogging  = process.env.DB_SQLLOG ? true : false;
const dbPassword = process.env.DB_PASSWORD;

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    dialect: dbDialect,
    host: dbHost,
    logging: dbLogging
})

export default sequelize;