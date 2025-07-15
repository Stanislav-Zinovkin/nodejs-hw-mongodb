import express from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { handleGetAllContacts, handleGetContactById, handleCreateContact, handleDeleteContact, handleUpdateContact } from '../controllers/contactsController.js';

const router = express.Router();

router.get('/', ctrlWrapper(handleGetAllContacts));
router.get('/:contactId', ctrlWrapper(handleGetContactById));
router.post('/', ctrlWrapper(handleCreateContact));
router.patch('/:contactId', ctrlWrapper(handleUpdateContact));
router.delete('/:contactId', ctrlWrapper(handleDeleteContact));
export default router;