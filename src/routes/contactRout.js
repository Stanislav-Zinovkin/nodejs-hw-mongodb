import express from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { handleGetAllContacts, handleGetContactById, handleCreateContact, handleDeleteContact, handleUpdateContact } from '../controllers/contactsController.js';
import { createContactSchema, updateContactSchema } from '../schemas/contactsSchema.js';
import { validateBody } from '../middlewares/validateBody.js';
import { invalidFormatId } from '../middlewares/invalidFormatId.js';
const router = express.Router();

router.get('/', ctrlWrapper(handleGetAllContacts));
router.get('/:contactId', invalidFormatId('contactId'),ctrlWrapper(handleGetContactById));
router.post('/', validateBody(createContactSchema),ctrlWrapper(handleCreateContact));
router.patch('/:contactId', invalidFormatId('contactId'), validateBody(updateContactSchema),ctrlWrapper(handleUpdateContact));
router.delete('/:contactId', invalidFormatId('contactId'), ctrlWrapper(handleDeleteContact));
export default router;