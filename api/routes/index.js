import { Router } from "express";
import bodyParser from "body-parser";
import middlewares from "../middleware";
const route = Router();
export default (app => {
  app.use("/postmark", route);
  route.post("/send", bodyParser.raw({
    type: "application/json"
  }), middlewares.wrap(require("./send-email").default));
  return app;
});