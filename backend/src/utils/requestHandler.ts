import { Request, Response, NextFunction, RequestHandler } from "express";
import { omit } from "lodash";
import { ErrorWithMessage, ErrorWithStatus } from "./error";
import httpStatusCode from "~/constants/httpStatusCode";

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const defaultErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (err instanceof ErrorWithMessage) {
      res.status(err.status).json({ message: err.message });
      return;
    }

    if (err instanceof ErrorWithStatus) {
      res.status(err.status).json(omit(err, ["status"]));
      return;
    }

    const finalError: any = {};
    Object.getOwnPropertyNames(err).forEach((key) => {
      if (
        Object.getOwnPropertyDescriptor(err, key)?.configurable &&
        Object.getOwnPropertyDescriptor(err, key)?.writable
      ) {
        finalError[key] = err[key];
      }
    });

    res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: finalError.message || "An unknown error occurred",
      errorInfo: omit(finalError, ["stack"]),
    });
  } catch (error) {
    res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      message: "Internal server error",
      errorInfo: omit(error as any, ["stack"]),
    });
  }
};

export const wrapRequestHandler = (
  func: AsyncRequestHandler
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    func(req, res, next).catch(next);
  };
};
