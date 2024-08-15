import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { google } from "googleapis";
import "dotenv/config";
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      callbackURL: "http://localhost:3000/auth/facebook/callback",
      profileFields: ["id", "displayName", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(null, false, { message: "No email associated with Facebook account" });
        }

        let user = await prisma.user.findUnique({
          where: { email },
        });

        const payload = { email };
        const authToken = jwt.sign(payload, process.env.JWT_SECRET || "secret", {
          expiresIn: "1h",
        });

        if (user) {
          user = await prisma.user.update({
            where: { email },
            data: { token: authToken },
          });
        } else {
          const membershipType = await prisma.membershipType.findUnique({
            where: { typeName: "A" },
          });

          user = await prisma.user.create({
            data: {
              email,
              name: profile.displayName,
              password: null,
              token: authToken,
              membershipType: { connect: { id: membershipType?.id } },
            },
          });
        }

        done(null, user);
      } catch (e) {
        done(e);
      }
    }
  )
);

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "http://localhost:3000/auth/google/callback"
);

export class AuthController {
    static async facebookAuth(req: Request, res: Response, next: NextFunction) {
        passport.authenticate("facebook", { scope: ["email"] })(req, res, next);
    }

    static async facebookCallback(req: Request, res: Response, next: NextFunction) {
        passport.authenticate("facebook", {
          failureRedirect: "/login",
          session: false,
        })(req, res, () => {
          const user = req.user as any;
          return res.redirect(`http://localhost:5173?token=${user.token}&name=${user.name}&email=${user.email}`);
        });
    }

    static async googleAuth(req: Request, res: Response, next: NextFunction) {
        try {
          const scopes = [
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/userinfo.profile",
          ];
    
          const authorizationUrl = oauth2Client.generateAuthUrl({
            access_type: "offline",
            scope: scopes,
            include_granted_scopes: true,
          });
    
          res.redirect(authorizationUrl);
        } catch (e) {
          next(e);
        }
    }

    static async googleCallback(req: Request, res: Response, next: NextFunction) {
        try {
          const { code } = req.query;
    
          const { tokens } = await oauth2Client.getToken(code as string);
    
          oauth2Client.setCredentials(tokens);
    
          const oauth2 = google.oauth2({
            auth: oauth2Client,
            version: "v2",
          });
    
          const { data } = await oauth2.userinfo.get();
    
          if (!data.email || !data.name) {
            return res.status(400).json({ error: "Failed to retrieve user information" });
          }
    
          let user = await prisma.user.findUnique({
            where: { email: data.email },
          });
    
          const payload = { email: data.email };
          const authToken = jwt.sign(payload, process.env.JWT_SECRET || "secret", {
            expiresIn: "1h",
          });
    
          if (user) {
            user = await prisma.user.update({
              where: { email: data.email },
              data: { token: authToken },
            });
          } else {
            const membershipType = await prisma.membershipType.findUnique({
              where: { typeName: "A" },
            });
    
            user = await prisma.user.create({
              data: {
                email: data.email,
                name: data.name,
                password: null,
                token: authToken,
                membershipType: { connect: { id: membershipType?.id } },
              },
            });
          }
    
          return res.redirect(`http://localhost:5173?token=${authToken}&email=${data.email}&name=${data.name}`);
        } catch (e) {
          console.error(e);
          next(e);
        }
    }
}


