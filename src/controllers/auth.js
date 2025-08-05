import { ONE_DAY } from '../index.js';
import {logoutUser, refreshToken as refreshSession} from '../services/auth.js';
import { loginUser } from '../services/auth.js';
export const refreshSessionController = async (req, res, next) => {
 try {
    const {refreshToken} = req.cookies;
    const sessionId = req.cookies.sessionId;
   
    if(!refreshToken || !sessionId) {
    return res.status(401).json({
        status: 'error',
        message: 'Missing token',
    });
   }
   
   const {accessToken, refreshToken: newRefreshToken} = await refreshSession({ sessionId, refreshToken});
   res.cookie('refreshToken', newRefreshToken,
    {httpOnly: true,
        sameSite: 'strict',
        secure: true,
        maxAge: ONE_DAY,
    }
   );
   res.cookie('sessionId', sessionId, {
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
    maxAge: ONE_DAY,
    });

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
    console.log('session:', session); 
    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        maxAge: ONE_DAY,
        sameSite: 'strict',
    });
    res.cookie('sessionId', session.sessionId , {
        httpOnly: true,
        maxAge: ONE_DAY,
        sameSite: 'strict',
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