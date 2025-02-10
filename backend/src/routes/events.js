const express = require('express');
const { body } = require('express-validator');
const eventController = require('../controllers/eventController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload'); 

const router = express.Router();

router.post('/addevent', auth, upload.single('image'), eventController.createEvent); 

router.get('/', eventController.getEvents);
// router.get('/:id', eventController.getEvent);

router.put('/:id',auth, upload.single('image'),eventController.updateEvent);

router.delete('/:id', auth, eventController.deleteEvent);
router.get('/:id/join', auth, eventController.joinEvent);

module.exports = router;