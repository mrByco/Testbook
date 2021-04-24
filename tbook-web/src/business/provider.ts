import {SheetEntity} from "./sheets/sheet.entity";
import {DatabaseGateway} from "../abstraction/database-gateway";

class ProviderObject {
    Database: DatabaseGateway = {}
    Entities = {
        SheetEntity: new SheetEntity(this.Database)
    }
}


export const Provider = new ProviderObject()
