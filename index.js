import dotenv from "dotenv";
import express from "express";
import { dbConect } from "./DB/connection.js";
import usersRouter from "./src/modules/Users/users.router.js";
import companiesRouter from "./src/modules/companies/companies.router.js";
import jobsRouter from "./src/modules/jobs/jobs.router.js";

dotenv.config();
const port = process.env.PORT;
const app = express();
app.use(express.json());
await dbConect();

app.use("/auth", usersRouter);
app.use("/company", companiesRouter);
app.use("/jobs", jobsRouter);

app.all("*", (req, res, next) => res.send("End Point Not Found"));

app.use((error, req, res, next) => {
  return res.json({
    success: false,
    errors: { error: error.message, stack: error.stack },
  });
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
