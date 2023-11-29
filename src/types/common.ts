import {Request} from "express";

export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>
export type RequestWithParams<P> = Request<P, {}, {}, {}>
export type RequestWithBody<B> = Request<{}, {}, B, {}>
export type RequestWithBodyAndParams<P, B> = Request<P, {}, B, {}>