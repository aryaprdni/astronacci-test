import { Request, Response, NextFunction } from "express";
import { ArticleService } from "../service/article-service";

export class ArticleController {
    static async getArticles(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("Login Session:", res.locals.loginSession);
            const user = res.locals.loginSession.email
            console.log(user)
            const response = await ArticleService.getArticles(user);
            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }
}
