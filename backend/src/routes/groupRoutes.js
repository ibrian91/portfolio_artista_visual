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

router.post('/', uploadCover.single('cover_image'), groupController.createGroup);
router.get('/', groupController.getGroups);
router.get('/cover-images', groupController.getGroupsCoverImages);
router.delete('/', groupController.deleteGroup);

export default router;
