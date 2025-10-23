import express from 'express';
import multer from 'multer';
import groupController from '../controllers/groupController.js';

const router = express.Router();

// Multer para imagen de portada
const coverStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/tmp');
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '-' + file.originalname);
	}
});
const uploadCover = multer({ storage: coverStorage });

router.post('/groups', uploadCover.single('cover_image'), groupController.createGroup);
router.get('/groups', groupController.getGroups);
router.get('/groups/cover-images', groupController.getGroupsCoverImages);

export default router;
