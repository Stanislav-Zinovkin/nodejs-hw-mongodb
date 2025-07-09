import { Contact } from "../models/contactModel.js";

export const getAllContacts = async () => {
    const contacts = await Contact.find();
    return contacts;
};

export const getContactsById = async (id) => {
    const contact = await Contact.findById(id);
    return contact;
}