import createHttpError from 'http-errors';
import { ONE_DAY } from '../index.js';

import {logoutUser, refreshToken as refreshSession, sendRequestToken} from '../services/auth.js';
import { loginUser } from '../services/auth.js';
import { User } from '../models/userModel.js';
import jwt from 'jsonwebtoken';
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
};
export const sendResetEmailController = async (req,res,next) => {
    try {
    await sendRequestToken(req.body.email);
    res.status(200).json({
        message: "Reset password email has been successfully sent.",
        status: 200,
        data: {},
    });
} catch (error){
    next(error);
}
};
export const resetPasswordController = async (req,res,next) => {
    try{
        const {token, password} = req.body;

        if (!token || !password){
            throw createHttpError (400, 'Token and password are required!');
        }
        const secret = process.env.JWT_SECRET;
        let decoded;
        try {
            decoded = jwt.verify(token, secret);
        } catch (error) {
            return next(createHttpError(401, 'Token is expired or invalid.'));
        }

        const user = await User.findOne({email: decoded.email});
        if (!user) {
            throw createHttpError(404, 'User not found');
        }

       
        user.password = password;
        await user.save();

        await deleteUserSessions(user._id);


        res.status(200).json({
            message: 'Password has been successfully reset',
            status: 200,
            data:{},
        });
    }catch (error) {
        next(error);
    }
    }
