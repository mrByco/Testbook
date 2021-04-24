import {DatabaseGateway} from "./database-gateway";

export abstract class Entity {
    constructor(protected database: DatabaseGateway) {}
}
