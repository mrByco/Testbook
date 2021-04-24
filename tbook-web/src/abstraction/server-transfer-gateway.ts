import {RequestModel} from "./request-model";
import {Observable} from "rxjs";

export interface ServerTransferGateway {
    SendRequest(request: RequestModel): Observable<any>
}
