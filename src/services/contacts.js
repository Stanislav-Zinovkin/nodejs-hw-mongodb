import { Contact } from "../models/contactModel.js";

export const getAllContacts = (skip = 0, limit = 10, sort ={}, filter = {}) => {
    return Contact.find(filter).skip(skip).limit(limit).sort(sort);
};

export const countContacts = (filter = {}) => {
    return Contact.countDocuments(filter);
};

export const getContactsById = async (id) => {
    const contact = await Contact.findById(id);
    return contact;
}
export const createContact = async (contactData) => {
    const contact = new Contact(contactData);
    await contact.save();
    return contact;
}
export const updateContact = async (id, updateData) => {
    const updatedContact = await Contact.findByIdAndUpdate(id, updateData, {new: true});
    return updatedContact;
}
export const deleteContact = async (id) => {
    const contact = await Contact.findByIdAndDelete(id);
    
    return contact
}