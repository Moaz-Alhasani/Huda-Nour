import express, {Application, NextFunction, Request, Response,} from 'express';
import 'dotenv/config';
import appRouter from "./globals/router/appRouter";
import { CustomError, IError } from "./globals/middlware/error.middlware";
import { HTTB_STATUS } from './globals/constants/http';
import cookieParser from 'cookie-parser';
import path from 'path';

class Server {
    private app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    public start() {
        this.setMiddleware();
        this.setRouter();
        this.setGlobalError();
        this.startServer();
    }

    private setMiddleware() {
        this.app.use(express.json())
        this.app.use(cookieParser())
        this.app.use('/upload', express.static(path.join(__dirname, '/upload')))
        this.app.use('/PDF', express.static(path.join(__dirname, '/PDF')))
    }

    private setRouter() {
        appRouter(this.app);
    }

    private setGlobalError() {
        this.app.all('*', (req, res) => {
            res.status(404).json({
                message: `URL ${req.originalUrl} not found`
            });
        });
        this.app.use(((error: IError, req: Request, res: Response, next: NextFunction) => {
            if (error instanceof CustomError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(HTTB_STATUS.INTERNAL_SERVER).json({ message: "Internal Server Error" });
        }) as unknown as express.ErrorRequestHandler);
    }
    
    private startServer() {
        const port = parseInt(process.env.PORT!) || 2000;

        this.app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    }
}

export default Server;
