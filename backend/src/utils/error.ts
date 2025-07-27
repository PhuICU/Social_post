import e from "express";
import httpStatusCode from "~/constants/httpStatusCode";
import messages from "~/constants/message";

type ErrorTypes = Record<string, { msg: string; [key: string]: any }>;

export class ErrorWithStatus {
  message: string;
  status: number;
  constructor({ message, status }: { message: string; status: number }) {
    this.message = message;
    this.status = status;
  }
}

export class ErrorWithMessage extends ErrorWithStatus {
  constructor({ message, status }: { message: string; status: number }) {
    super({ message, status });
  }
}

export class UnauthorizedError extends ErrorWithMessage {
  errors: ErrorTypes;
  constructor({
    message = messages.errors.unProcessableEntity,
    errors,
  }: {
    message?: string;
    errors: ErrorTypes;
  }) {
    super({ message, status: httpStatusCode.UNAUTHORIZED });
    this.errors = errors;
  }
}

export class EntityError extends ErrorWithStatus {
  errors: ErrorTypes;
  constructor({
    message = messages.errors.unProcessableEntity,
    errors,
  }: {
    message?: string;
    errors: ErrorTypes;
  }) {
    super({ message, status: httpStatusCode.UNPROCESSABLE_ENTITY });
    this.errors = errors;
  }
}
