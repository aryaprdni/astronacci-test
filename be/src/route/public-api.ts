import express from 'express';
import { UserController } from '../controller/user-controller';
import { AuthController } from '../controller/auth-controller';
import { ArticleController } from '../controller/article-controller';
import authMiddleware from '../middleware/auth-middleware';
import { VideoController } from '../controller/video-controller';

export const publicRouter = express.Router();

publicRouter.post("/api/users/register", UserController.register);
publicRouter.post("/api/users/login", UserController.login);
publicRouter.post("/api/users/logout", authMiddleware.Auth, UserController.logout);

publicRouter.get("/api/articles", authMiddleware.Auth, ArticleController.getArticles);
publicRouter.get("/api/videos", authMiddleware.Auth, VideoController.getVideos);

publicRouter.get("/auth/google", AuthController.googleAuth);
publicRouter.get("/auth/google/callback", AuthController.googleCallback);

publicRouter.get("/auth/facebook", AuthController.facebookAuth);
publicRouter.get("/auth/facebook/callback", AuthController.facebookCallback);
