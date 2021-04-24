import {Express, Router} from "express";
import {RegisterSheets} from "./router/sheets";
import {RequestProcessor} from "./request-processor";


export function RegisterRoutes(app: Express){
    app.get('/api/hello', (req, res, next) => {
        res.json('world');
    });
    app.post('/api', (req, res, next) => {
            processor.ProcessRequest(req, res, next)
        }
    )

    const processor = new RequestProcessor()
    RegisterSheets(processor)
}
