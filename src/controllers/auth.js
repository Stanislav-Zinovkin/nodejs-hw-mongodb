import { ONE_DAY } from '../index.js';
import {logoutUser, refreshToken as refreshSession} from '../services/auth.js';
import { loginUser } from '../services/auth.js';
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
        maxAge: ONE_DAY,
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
export const loginUserController = async (req, res, next) => {
    
   try {
    const session =  await loginUser(req.body);
    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        maxAge: ONE_DAY,
        sameSite: 'strict',
    });
    res.cookie('sessionId', session._id, {
        httpOnly: true,
        maxAge: ONE_DAY,
    });

    res.status(200).json({
         status: 'success',
         message: 'Successfully logged in',
         data: {
            accessToken: session.accessToken,
        },
    });
   } catch(error) {
    next(error);
   }
};
export const logoutUserController = async (req, res) => {
    if (req.cookies.sessionId) {
        await logoutUser(req.cookies.sessionId);
    }

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).send();
}