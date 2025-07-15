import createHttpError from "http-errors";

export default function notfoundHandler(req, res, next) {
    next(createHttpError(404, 'Page not found!'));
    
}