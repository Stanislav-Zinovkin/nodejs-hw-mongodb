import createHttpError from "http-errors";
import bcrypt from 'bcrypt';
import { User } from "../models/userModel.js";
import { Session } from "../models/sessionModel.js";
import { randomBytes } from 'crypto';
import { ONE_DAY, FIFTEEN_MINUTES } from "../index.js";

const createSession = () => {
    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');
    return {
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
    };
};

export const loginUser = async(payload) => {
    const user = await User.findOne({email: payload.email});
    if(!user) {
        throw createHttpError(404, 'User not found');
    }
    const isEqual = await bcrypt.compare(payload.password, user.password);
    if(!isEqual){
        throw createHttpError(401, 'Unauthorized');
    }
    await Session.deleteOne({ userId: user._id});

    const sessionData = createSession();

    const session = await Session.create({
        userId: user._id,
        ...sessionData,
    });

    return {
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        sessionId: session._id,
    };
};

export const registerUser = async (payload) => {
    const existingUser = await User.findOne({ email: payload.email });
    if (existingUser) {
        throw createHttpError(409, 'Email in use');
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const user = await User.create({
        ...payload,
        password: hashedPassword,
    });

    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
};

export const refreshToken = async ({sessionId, refreshToken}) => {
   
    const session = await Session.findOneAndDelete({
        _id: sessionId,
        refreshToken,
    });

    if(!session) {
        throw createHttpError(401, 'Session not found');
    }
    
    const expiredToken = new Date() > new Date(session.refreshTokenValidUntil);

    if(expiredToken) {
        throw createHttpError(401, 'Session token expired');
    }
  
    const newSessionData = createSession();

    const newSession = await Session.create({
        userId: session.userId,
        ...newSessionData,
    });

    return {
        accessToken: newSession.accessToken,
        refreshToken: newSession.refreshToken,
        sessionId: newSession._id,
    };
};

export const logoutUser = async (sessionId) => {
    await Session.deleteOne({
        _id: sessionId
    });
};
