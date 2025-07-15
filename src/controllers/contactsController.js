import notfoundHandler from "../middlewares/notFoundHandler.js";
import { createContact, getAllContacts, getContactsById, updateContact, deleteContact } from "../services/contacts.js";
import createHttpError from "http-errors";

export const handleGetAllContacts = async (req, res) => {
    const contacts = await getAllContacts();

    res.status(200).json({
        status: 200,
        message: 'Successfully found contacts',
        data: contacts,
    });
};

export const handleGetContactById = async (req, res) => {
    const {contactId} = req.params;

    const contact = await getContactsById(contactId);

    if(!contact) {
        throw createHttpError(404, "Contact not found");

    }
    res.status(200).json({
        status:200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
    });
};

export const handleCreateContact = async (req,res) => {
    const {name, phoneNumber, email, isFavourite, contactType} = req.body;
    if (!name || !phoneNumber || !contactType){
        throw createHttpError(400, "Missing required fields");
    }
    const newContact = await createContact({name, phoneNumber,email, isFavourite, contactType});

    res.status(201).json({
        status: 201,
        message: "Successfully created a contact",
        data: newContact,
    })
}
export const handleUpdateContact = async(req,res) => {
    const {contactId} = req.params;
    const updateData = req.body;
    if(Object.keys(updateData).length === 0){
        throw createHttpError(400, 'Missing fields to update');
    }
    const updatedContact = await updateContact(contactId, updateData);
    if(!updatedContact) {
        throw createHttpError(404, 'Contact not found');

    }
    res.status(200).json({
        status: 200,
        message: 'Successfully patched a contact',
        data: updatedContact,
    });
}
export const handleDeleteContact = async(req,res) => {
    const {contactId} = req.params;
    const result = await deleteContact(contactId);

    if (!result){
        throw createHttpError(404, 'Contact not found');

    }
    res.status(204).send();
}