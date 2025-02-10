const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/register',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('name').notEmpty()
  ],
  validate,
  authController.register
);

router.post('/login',
  [
    body('email').isEmail(),
    body('password').notEmpty()
  ],
  validate,
  authController.login
);

router.put('/update',auth,upload.single('avatar'),authController.updateProfile
);

router.put('/password',auth,authController.updatePassword);

router.post('/signout',authController.signout);

router.get('/profile', auth, authController.profile);




module.exports = router;