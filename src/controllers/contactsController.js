import notfoundHandler from "../middlewares/notFoundHandler.js";
import { createContact, getAllContacts, getContactsById, updateContact, deleteContact, countContacts } from "../services/contacts.js";
import createHttpError from "http-errors";
import { parseNumber } from "../utils/parsePaginationParams.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { saveFileToUploadDir } from "../utils/saveFileToUploadDir.js";
import { TEMP_UPLOAD_DIR } from "../index.js";

export const handleGetAllContacts = async (req, res) => {
    const {type, isFavourite} = req.query;
    const page = parseNumber(req.query.page, 1);
    const perPage = parseNumber(req.query.perPage, 10);
    const {sortBy = 'name', sortOrder = 'asc'} = req.query;
    const skip = (page - 1) * perPage;
    const allowedSortFields = ['name', 'email', 'phoneNumber'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'name';
    const sortDirection = sortOrder === 'desc' ? -1 : 1;
    const sortCriteria = {[sortField]: sortDirection};
    const allowedTypes = ['work', 'home', 'personal'];
    const userId = req.user._id;
    const filter = {userId};
        if(allowedTypes.includes(type)) {
            filter.contactType = type;
        }
        if (isFavourite === 'true') filter.isFavourite = true;
        else if (isFavourite === 'false') filter.isFavourite = false;
    ;

    const [totalItems, contacts] = await Promise.all([
        countContacts(filter),
        getAllContacts(skip, perPage, sortCriteria, filter)
    ]);
    const totalPages = Math.ceil(totalItems / perPage);
    const hasPreviousPage = page > 1;
    const hasNextPage = page < totalPages;

    res.status(200).json({
        status: 200,
        message: 'Successfully found contacts',
        data: {
            data: contacts,
            page,
            perPage,
            totalItems,
            totalPages,
            hasPreviousPage,
            hasNextPage
        }
    });
};

export const handleGetContactById = async (req, res) => {
    const {contactId} = req.params;

    const contact = await getContactsById(contactId, req.user._id);

    if(!contact ) {
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
    let photoUrl = null;

    if(req.file){
  
        photoUrl = await uploadToCloudinary(req.file.path, 'contacts');
        await fs.unlink(req.file.path);
    }
    const userId = req.user._id;
    const newContact = await createContact({name, phoneNumber,email, isFavourite, contactType, userId, photo: photoUrl,});

    res.status(201).json({
        status: 201,
        message: "Successfully created a contact",
        data: newContact,
    })
}
export const handleUpdateContact = async(req,res) => {
    const {contactId} = req.params;
    const updateData = req.body;
    const userId = req.user._id;

    if(Object.keys(updateData).length === 0 && !req.file){
        throw createHttpError(400, 'Missing fields to update');
    }

    const existingContact = await getContactsById(contactId, req.user._id);
    if (!existingContact) {
        throw createHttpError(404, 'Contact not found');
    }
    if (req.file){
    const photo = await uploadToCloudinary(req.file.path, 'contacts');
    await fs.unlink(req.file.path);
    updateData.photo = photo;
    }
    const updatedContact = await updateContact(contactId,req.user._id, updateData);
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
    const result = await deleteContact(contactId, req.user._id);

    if (!result){
        throw createHttpError(404, 'Contact not found');

    }
    res.status(204).send();
}