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
        const interactor = this.GetExecutorInteractor(request.path);
        const context = this.ProduceContext(request);
        response.json(interactor.execute(context))
    }

    private GetExecutorInteractor(path: string): Interactor<unknown> {
        let interactor = this.map[path]()
        if (!interactor) throw new Error('Can not find interactor for code: ' + path)
        return interactor
    }

    private ProduceContext(request: express.Request): { request?: RequestModel } | undefined {
        if (request.body) return {request: request.body}
        else return undefined
    }
}
