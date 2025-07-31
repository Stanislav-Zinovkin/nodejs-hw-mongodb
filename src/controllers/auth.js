import {refreshToken as refreshSession} from '../services/auth.js'
export const refreshSessionController = async (req, res, next) => {
 try {
    const {refreshToken} = req.cookies;

   if(!refreshToken) {
    return res.status(401).json({
        status: 'error',
        message: 'Missing token',
    });
   }
   const {accessToken, newRefreshToken} = await refreshSession(refreshToken);
   res.cookie('refreshToken', newRefreshToken,
    {httpOnly: true,
        sameSite: 'strict',
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
    }
   );
   res.status(200).json({
    status: 'success',
    message: 'Successfully refreshed a session',
    data:{accessToken,},
   });
} catch (error){
    next(error);
}
};
