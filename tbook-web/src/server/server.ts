import * as express from 'express';
import {RegisterRoutes} from "./router";
import * as bodyParser from 'body-parser';

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json())
RegisterRoutes(app)



const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port: ${port}`));
