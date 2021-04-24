import {ServerTransferGateway} from "../abstraction/server-transfer-gateway";
import {RequestModel} from "../abstraction/request-model";
import {Observable} from "rxjs";
import {fromFetch} from "rxjs/fetch";
import {map} from "rxjs/operators";

export class ReactServerGatewayImpl implements ServerTransferGateway {
    private apiAddress = 'http://localhost:3000';
    private baseRoute = `${this.apiAddress}/api`;

    SendRequest(requestModel: RequestModel): Observable<any> {
        return fromFetch(this.baseRoute, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }, body: JSON.stringify(requestModel)
        }).pipe(map(a => a.json()))
    }
}
