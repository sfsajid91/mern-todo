const router = require('express').Router();

const {
    signUp,
    login,
    refreshController,
    logout,
    emailVerification,
    getForgotPass,
    resetPassword,
    validToken,
} = require('../controllers/authController');

const {
    signupValidator,
    loginValidator,
    forgotPassValidator,
} = require('../validators/authValidator');

router.post('/signup', signupValidator, signUp);
router.post('/login', loginValidator, login);
router.get('/refresh', refreshController);
router.get('/logout', logout);
// token veryfication route
router.get('/confirm/:token', emailVerification);
router.post('/reset-password', forgotPassValidator, getForgotPass);
router.get('/reset-password/:token', validToken);
router.put('/reset-password/:token', resetPassword);

module.exports = router;
