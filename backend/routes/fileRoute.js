// routes/fileRoutes.js
import express from 'express';
import fileController from '../controller/fileController.js'; // Use .js for ES6 imports

const router = express.Router();

router.get('/files', fileController.getFiles);
router.post('/files', fileController.createFile);
router.put('/files', fileController.updateFile);
router.delete('/files/:name', fileController.deleteFile);
router.post('/run-code', fileController.runCode);

export default router; // Use default export
