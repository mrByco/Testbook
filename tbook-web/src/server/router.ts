import {Router} from "express";
import SheetRouter from "./router/sheet.router";

const router = Router();

router.get('/hello', (req, res, next) => {
    res.json('world');
});

router.use('/sheets', SheetRouter);

export default router;
