import { User } from "../models/userModel";

export const registerUser = async (payload) => {
    return await User.create(payload);
};