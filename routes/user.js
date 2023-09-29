const router = require('express').Router();
const userController = require('../controllers/user');
const auth = require('../middlewares/auth');

router.post('/insert', auth, userController.insert);
router.get('/all', userController.getAllUsers);
router.get('/details/:user_id', userController.getDetails);
router.get('/image/:user_id', userController.getImage);
router.put('/update/:user_id', auth, userController.update);
router.delete('/delete/:user_id', userController.deleteUser);

module.exports = router;
