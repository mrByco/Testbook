import * as express from 'express';
import apiRouter from './router';
import {RequestProcessor} from "./request-processor";

const app = express();
app.use(express.static('public'));

const processor = new RequestProcessor()

app.get('/api/*', (req, res) => {
        res.json('asd')
    }
)

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port: ${port}`));
