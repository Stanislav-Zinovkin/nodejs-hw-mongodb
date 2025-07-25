import mongoose from "mongoose";
import createHttpError from "http-errors";

export const invalidFormatId = (paramName) => (req, res, next) => {
 const id = req.params[paramName];
 if(!mongoose.Types.ObjectId.isValid(id)) {
    return  next(createHttpError(400, `Invalid ID format '${paramName}'`));
 }
 next();
};