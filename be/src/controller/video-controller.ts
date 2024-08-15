import { Request, Response, NextFunction } from "express";
import { VideoService } from "../service/video-service";

export class VideoController {
    static async getVideos(req: Request, res: Response, next: NextFunction) {
        try {
            const user = res.locals.loginSession.email
            const response = await VideoService.getVideos(user);
            res.status(200).json({ data: response });
        } catch (e) {
            next(e);
        }
    }
}
