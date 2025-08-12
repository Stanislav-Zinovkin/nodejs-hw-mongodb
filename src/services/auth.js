import createHttpError from "http-errors";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
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
export const registerUser = async (payload) => {
    const existingUser = await User.findOne({ email: payload.email });
    if (existingUser) {
        throw createHttpError(409, 'Email in use');
    }

    const user = await User.create({
        ...payload
    });

    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
};

export const loginUser = async(payload) => {
   
   console.log('Login attempt:', payload);
    const user = await User.findOne({email: payload.email});
    if(!user) {
        throw createHttpError(404, 'User not found');
    }
    const isEqual = await bcrypt.compare(payload.password, user.password);
        console.log('Password match:', isEqual);

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
        sessionId: session._id.toString(),
    };
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
export const sendRequestToken = async (email) => {
    const user = await User.findOne({email});
    if (!user) {
        throw createHttpError(404, 'User not found');
    }

    const token = jwt.sign(
        {email},
        process.env.JWT_SECRET,
        {expiresIn: '5m'}
    );

    const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Reset your password',
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link valid for 5 minutes.</p>`,

    };
    try {
        await transporter.sendMail(mailOptions);
    } catch (error){
        console.error('Nodemailer error:', error);
        throw createHttpError(500,'Failed to send the email, please ty again later.');
    }
}
export const resetPassword = async (payload) => {
    let entries;

    try{
        entries = jwt.verify(payload.token,
            process.env.JWT_SECRET
        );
    } catch(error){
        if(error ) throw createHttpError(401, 'Token expired or invalid');
        throw error;
    }
    const user = await User.findOne({
        email: entries.email,
        _id: entries.sub,
    });

    if(!user){
        throw createHttpError(404, 'USer not found');
    }
    user.password = payload.password;
    await user.save();

    await User.updateOne({
        _id: user._id },
    {password: user.password},);
};
export const deleteUserSessions = async (userId) => {
  await Session.deleteMany({ userId });
};
