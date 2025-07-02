const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/user");
const nodemailer = require('nodemailer');
// const User = require('../Models/user');
const signup = async (req, res) => {
    try{
          const { name, email, password } = req.body;
          const user = await UserModel.findOne({ email  });
          if (user) {
              return res.status(409).json({ message: "User already exists" ,success: false  });

          }
          const userModel = new UserModel({
                name,
                email,
                password
            });
            userModel.password = await bcrypt.hash(userModel.password, 10);
            await userModel.save();
            res.status(201).json({ message: "User created successfully", success: true });

    }
    catch (err) {
         res.status(500).json({ message: "Internal server error nadeem", success: false });

    }
}

const login = async (req, res) => {
    try{
          const {  email, password } = req.body;
          const user = await UserModel.findOne({ email  });
          const errorMsg = 'Auth failed email or password is wrong';
          if (!user) {
              return res.status(403).json({ message: errorMsg ,success: false  });

          }
          const isPassEqual = await bcrypt.compare(password, user.password);
            if (!isPassEqual) {
                 return res.status(403).json({ message: errorMsg ,success: false  });
            }

            const jwtToken = jwt.sign(
                {
                    email: user.email,
                    Id: user._id  
                },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            res.status(200)
            .json({ 
                message: "Login success", 
                success: true ,
                jwtToken,
                email,
                name: user.name   
            });

    }
    catch (err) {
         res.status(500).json({ message: "Internal server error nadeem", success: false });

    }
}


const changePassword = async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        const isPassEqual = await bcrypt.compare(oldPassword, user.password);
        if (!isPassEqual) {
            return res.status(403).json({ message: "Old password is incorrect", success: false });
        }
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.status(200).json({ message: "Password changed successfully", success: true });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false });
    }
}



const sendResetLink = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_RESET_SECRET, { expiresIn: '15m' });

        const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

        // Send email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }

        });

        await transporter.sendMail({
            from: `"YourApp Support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Reset your password',
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password. Link expires in 15 minutes.</p>`,
        });

        res.json({ message: 'Reset link sent to email', success: true });
    } catch (err) {
        console.log("❌ Error sending email:", err); // 👈 log real error
        res.status(500).json({ message: 'Something went wrong', success: false });
    }
};

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
        const user = await UserModel.findById(decoded.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: 'Password reset successful', success: true });
    } catch (err) {
        res.status(400).json({ message: 'Invalid or expired token', success: false });
    }
};

module.exports = {
    signup,
    login,
    sendResetLink,
    resetPassword,
    changePassword
}