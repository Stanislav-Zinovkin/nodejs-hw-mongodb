export default function errorHandler (err, req, res, next)  {
    const errorMessage = err.message;
    res.status(500).json({
        status:500,
        message: "Something went wrong",
        data: err.message,
    });
};