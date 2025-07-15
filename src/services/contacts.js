import { Contact } from "../models/contactModel.js";

export const getAllContacts = async () => {
    const contacts = await Contact.find();
    return contacts;
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
    return updatedContact();
}