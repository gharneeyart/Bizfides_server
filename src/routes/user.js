import express from 'express';
import { deleteUser, getAllUsers, getOneUser, updateUser } from '../controllers/user.js';
import { isLoggedIn } from '../middlewares/auth.js';
import { upload } from '../helpers/multer.js';

const router = express.Router();


// User routes
// Get all the users
router.get("/users",getAllUsers)
// Get a user by id
router.get("/user/:userId",getOneUser)
// update the user profile. Only a logged in user can update
router.put("/user/update",isLoggedIn, upload.single('image'), updateUser )
// Delete a user
router.delete("/:userId",deleteUser)

export default router;
