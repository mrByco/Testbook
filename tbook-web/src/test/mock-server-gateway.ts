import {ServerTransferGateway} from "../abstraction/server-transfer-gateway";
import {RequestModel} from "../abstraction/request-model";
import {Observable} from "rxjs";

export class MockServerGateway implements ServerTransferGateway {

    constructor(public getResponse: () => any) {}

    SendRequest(request: RequestModel): Observable<any> {
        return new Observable<any>((s) => {
            setTimeout(() => {
                s.next(this.getResponse())
                s.complete()
            }, 0)
        })
    }

}
