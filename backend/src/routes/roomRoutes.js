const express = require('express');
const { roomController } = require('../controllers/roomController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { validate } = require('../middlewares/validate');
const {
  createRoomSchema,
  updateRoomSchema,
  createFurnitureSchema,
  updateFurnitureSchema,
} = require('../validators/roomValidator');

const router = express.Router();

router.use(authMiddleware);

router.get('/', roomController.getAll);
router.post('/', validate(createRoomSchema), roomController.create);
router.get('/:id', roomController.getOne);
router.put('/:id', validate(updateRoomSchema), roomController.update);
router.delete('/:id', roomController.delete);

router.post('/:id/furniture', validate(createFurnitureSchema), roomController.addFurniture);
router.put('/:id/furniture/:fid', validate(updateFurnitureSchema), roomController.updateFurniture);
router.delete('/:id/furniture/:fid', roomController.deleteFurniture);

module.exports = router;
