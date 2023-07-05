import {z} from "zod";

const dbEnvSchema = z.object({
  database: z.string(),
  username: z.string(),
  password: z.string(),
  host: z.string(),
  port: z.string(),
});

const databaseEnv = dbEnvSchema.parse({
  database: process.env['MONGO_DATABASE'],
  username: process.env['MONGO_USER'],
  password: process.env['MONGO_PASSWORD'],
  port: process.env['MONGO_PORT'],
  host: process.env['MONGO_HOST'],
});

const connectString = `mongodb://${databaseEnv.username}:${databaseEnv.password}@${databaseEnv.host}:${databaseEnv.port}`

const databaseConfig = {
  connectionString: connectString,
  credentials: databaseEnv
}

export default databaseConfig;
