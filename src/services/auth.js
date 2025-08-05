import createHttpError from "http-errors";
import bcrypt from 'bcrypt';
import { User } from "../models/userModel.js";
import { Session } from "../models/sessionModel.js";
import jwt from 'jsonwebtoken';
import { ONE_DAY, FIFTEEN_MINUTES } from "../index.js";

export const loginUser = async(payload) => {

    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
    const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

    const user = await User.findOne({email: payload.email});
    if(!user) {
        throw createHttpError(404, 'User not found');
    }
    const isEqual = await bcrypt.compare(payload.password, user.password);

    if(!isEqual){
        throw createHttpError(401, 'Unauthorized');
    }

    await Session.deleteOne({ userId: user._id});

     const userId = user._id;
    const session = await Session.create({
        userId: user._id,
        accessToken: '',
        refreshToken: '',
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),

    });
   
    const accessToken = jwt.sign({userId}, ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
    const refreshToken = jwt.sign({userId, sessionId: session._id}, REFRESH_TOKEN_SECRET, {expiresIn: '30d'});
   
    session.refreshToken = refreshToken;
    session.accessToken = accessToken;
    await session.save();
     
   return {accessToken, refreshToken, _id: session._id};
};

export const registerUser = async (payload) => {
    const existingUser = await User.findOne({email: payload.email });
    if (existingUser) {
        throw createHttpError(409, 'Email in use');
    }

    const user = await User.create(payload);
    const userObj = user.toObject();
    delete userObj.password;
    return userObj;

};
export const refreshToken = async (oldRefreshToken) => {
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
    const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
   
    let payload;
    try {
        payload = jwt.verify(oldRefreshToken, REFRESH_TOKEN_SECRET);
        
    } catch (error) {
        throw createHttpError(401, 'Invalid token');
    }

    const sessionId = payload.sessionId;
    const existingSession = await Session.findById(sessionId);
   
    if(!existingSession || existingSession.refreshToken !== oldRefreshToken) {
        throw createHttpError(401, 'Session not found');
    }
    await Session.deleteOne({_id: sessionId});

    const userId = payload.userId;
    const newSession  =  await Session.create({
        userId,
        accessToken: '',
        refreshToken: '',
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
    });

        const accessToken = jwt.sign({userId}, ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
    const newRefreshToken = jwt.sign({userId, sessionId: newSession._id}, REFRESH_TOKEN_SECRET, {expiresIn: '30d'});

    
    newSession.accessToken = accessToken;
    newSession.refreshToken = newRefreshToken;
    await newSession.save();

    return {accessToken, refreshToken: newRefreshToken};
};
export const logoutUser = async (sessionId) => {
    await Session.deleteOne({
        _id: sessionId
    });
}