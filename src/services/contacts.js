import mongoose from "mongoose";
import { Contact } from "../models/contactModel.js";

export const getAllContacts = (skip = 0, limit = 10, sort ={}, filter = {}) => {
    return Contact.find(filter).skip(skip).limit(limit).sort(sort);
};

export const countContacts = (filter = {}) => {
    return Contact.countDocuments(filter);
};

export const getContactsById = async (id, userId) => {
    return  await Contact.findOne({_id: id, userId: new mongoose.Types.ObjectId(userId)});
    
}
export const createContact = async (contactData) => {
    const contact = new Contact(contactData);
    await contact.save();
    return contact;
}
export const updateContact = async (id,userId, updateData) => {
   return  await Contact.findOneAndUpdate({_id: id, userId: new mongoose.Types.ObjectId(userId)}, updateData, {new: true});
    
}
export const deleteContact = async (id, userId) => {
    return  await Contact.findOneAndDelete({_id: id, userId: new mongoose.Types.ObjectId(userId)});
    
}
