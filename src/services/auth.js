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
    const accessToken = jwt.sign({userId}, ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
    const refreshToken = jwt.sign({userId}, REFRESH_TOKEN_SECRET, {expiresIn: '30d'});

     const session = await Session.create({
        userId: user._id,
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),

    });
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
    let payload;
    try {
        payload = jwt.verify(oldRefreshToken, REFRESH_TOKEN_SECRET);
    } catch (error) {
        throw createHttpError(401, 'Session not found');
    }
    const existingSession = await Session.findOne({refreshToken: oldRefreshToken});
    if(!existingSession) {
        throw createHttpError(401, 'Session not found');
    }
    await Session.deleteOne({refreshToken: oldRefreshToken});

    const userId = payload.userId;
    const accessToken = jwt.sign({userId}, ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
    const newRefreshToken = jwt.sign({userId}, REFRESH_TOKEN_SECRET, {expiresIn: '30d'});

    await Session.create({
        userId,
        refreshToken: newRefreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
    });
    return {accessToken, newRefreshToken};
};
export const logoutUser = async (sessionId) => {
    await Session.deleteOne({
        _id: sessionId
    });
}