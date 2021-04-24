import express = require("express");
import {Interactor} from "../abstraction/interactor";
import {RequestModel} from "../abstraction/request-model";

export class RequestProcessor {
    private map: any = {}

    RegisterRequest<Request>(path: string, getInteractor: () => Interactor<Request>) {
        this.map[path] = getInteractor;
    }

    ProcessRequest(request: express.Request, response: express.Response, next: express.NextFunction) {
        if (!request.path.startsWith('/api'))
            next()
        this.ExecuteRequest(request, response)
    }

    private ExecuteRequest(request: express.Request, response: express.Response) {
        const context = this.ProduceContext(request);
        try {
            const execute = (context: any) => this.GetExecutorInteractor(context.request.path).execute(context);
            response.json(execute(context))
        }
        catch (err) {
            console.error('Can not execute interactor for code: ' + context.request.path)
            console.error(err)
            response.status(500)
        }
    }

    private GetExecutorInteractor(path: string): Interactor<unknown> {
        return this.map[path]()
    }

    private ProduceContext(request: express.Request): { request?: RequestModel } {
        if (request.body) return {request: request.body}
        else throw new Error('Requests must have path')
    }
}
