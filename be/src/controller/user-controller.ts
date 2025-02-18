import { Request, Response, NextFunction } from "express";
import { CreateUserRequest, LoginUserRequest } from "../model/user_model";
import { UserService } from "../service/user-service";

export class UserController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const request: CreateUserRequest = req.body as CreateUserRequest;
      const response = await UserService.register(request);
      res.status(200).json({ data: response });
    } catch (e) {
      next(e);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
        const request: LoginUserRequest = req.body as LoginUserRequest;
        const response = await UserService.login(request);
        res.status(200).json({ data: response });
    } catch (e) {
        next(e);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
        const user = res.locals.loginSession.obj.email
        const response = await UserService.logout(user);
        res.status(200).json({
            data: response
        })
    } catch (e) {
        next(e);
    }
}
}
