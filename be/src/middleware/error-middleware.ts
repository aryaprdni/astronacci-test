import { Response, Request, NextFunction } from "express";
import { ResponseError } from "../error/response-error";
import Joi from "joi";

export const errorMiddleware = async (error: Error, req: Request, res: Response, next: NextFunction) => {
    if(error instanceof Joi.ValidationError) {
        res.status(400).json({
            errors: `Validation Error : ${JSON.stringify(error)}`
        });
    } else if(error instanceof ResponseError) {
        res.status(error.status).json({
            errors: error.message
        })
    } else {
        res.status(500).json({
            errors: error.message
        });
    }
}