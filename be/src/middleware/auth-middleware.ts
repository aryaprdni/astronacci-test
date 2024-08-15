import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

export default new (class AuthMiddleware {
  Auth(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const token = authHeader.split(" ")[1];

    try {
      const loginSession = jwt.verify(token, "secret");
      res.locals.loginSession = loginSession;
      next();
    } catch (error) {
      res.status(401).json({ message: "Unauthorized" });
    }
  }
})();
