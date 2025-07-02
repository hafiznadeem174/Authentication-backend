const joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../Models/user');
const signupValidation = (req, res, next) => {
    const schema = joi.object({
        name: joi.string().min(3).max(30).required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).max(30).required()    
    });
    const {error} = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: "Bad Request", error  });
    }
    next();
}

const loginValidation = (req, res, next) => {
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(6).max(30).required()    
    });
    const {error} = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: "Bad Request", error  });
    }
    next();
} 


const changePasswordValidation = (req, res, next) => {
    const schema = joi.object({
        email: joi.string().email().required(),
        oldPassword: joi.string().min(6).max(30).required(),
        newPassword: joi.string().min(6).max(30).required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: "Bad Request", error });
    }
    next();
}

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
        const user = await UserModel.findById(decoded.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: 'Password updated successfully', success: true });
    } catch (err) {
        res.status(400).json({ message: 'Invalid or expired token', success: false });
    }
};
const resetPasswordValidation = (req, res, next) => {
    const schema = joi.object({
        newPassword: joi.string().min(6).max(30).required()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: "Bad Request", error });
    }
    next();
};


module.exports = {
    signupValidation,
    loginValidation,
    resetPassword,
    resetPasswordValidation,
    changePasswordValidation
};