import createHttpError from "http-errors";
import { User } from "../models/userModel";
import { Session } from "../models/sessionModel";
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export const registerUser = async (payload) => {
    return await User.create(payload);
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
        accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
        refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    return {accessToken, newRefreshToken};
};