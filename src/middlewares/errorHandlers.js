export default function errorHandler (err, req, res, next)  {
    const {status =  500, message = "Something went wrong", details = null} = err;
    res.status(status).json({
        status,
        message,
        errors: details,
    });
};