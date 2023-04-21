import { Result } from "@ikasoba000/result-ts";
import { Awaitable } from "vitest";

export class UnAuthorizedError extends Error {}
export class BadRequestError extends Error {}

export type ModelErrors = UnAuthorizedError | BadRequestError;

export interface MicropubModel {
  verifyToken(token: string): Awaitable<boolean | Result<boolean, ModelErrors>>;
}
