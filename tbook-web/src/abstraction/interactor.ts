import {RequestModel} from "./request-model";

export abstract class Interactor<Response> {
    static get(): Interactor<unknown> {
        throw new Error('Get not implemented in an interactor')
    }

    abstract execute(context?: {request?: RequestModel}): Response;
}

