const router = require('express').Router();
const {
    signupValidation,
    loginValidation,
    changePasswordValidation,
    resetPasswordValidation,
} = require('../Middlewares/AuthValidation');

const {
    signup,
    login,
    changePassword,
    sendResetLink,
    resetPassword,
} = require('../Controllers/AuthController');

const ensureAuthenticated = require('../Middlewares/Auth');

// 🔒 Auth routes
router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.post('/change-password', ensureAuthenticated, changePasswordValidation, changePassword);

// 🔁 Password reset flow
router.post('/send-reset-link', sendResetLink); // Step 1: send email
router.post('/reset-password/:token', resetPasswordValidation, resetPassword); // Step 2: reset password
router.get('/test', (req, res) => {
    res.send('Auth route working zzzzzzzzzzzzzzz ✅');
});
module.exports = router;
