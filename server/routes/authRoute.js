const router = require('express').Router();

const {
    signUp,
    login,
    refreshController,
    logout,
    emailVerification,
} = require('../controllers/authController');

const { signupValidator, loginValidator } = require('../validators/authValidator');

router.post('/signup', signupValidator, signUp);
router.post('/login', loginValidator, login);
router.get('/refresh', refreshController);
router.get('/logout', logout);
// token veryfication route
router.get('/confirm/:token', emailVerification);

// TODO: add forgot password route

module.exports = router;
