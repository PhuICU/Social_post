import { Response } from "express";
import { ErrorWithStatus, EntityError } from "./error";
import { omit } from "lodash";
import httpStatusCode from "~/constants/httpStatusCode";
import { SuccessResponse } from "~/type";

export const responseError = (
  res: Response,
  error: ErrorWithStatus | EntityError | any
) => {
  if (error instanceof ErrorWithStatus) {
    const status = error.status;
    // Xử lý trường hợp lỗi là chuổi (string)
    if (typeof error === "string") {
      return res.status(status).json({
        message: error,
      });
    }
    // Xử lý trường hợp lỗi là object
    if (typeof error === "object") {
      return res.status(status).json(omit(error, ["status"]));
    }
  }
  return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
    message: error.message,
  });
};

export const responseSuccess = (res: Response, data: SuccessResponse<any>) => {
  return res.status(httpStatusCode.OK).json({
    message: data.message,
    data: data.data,
  });
};
