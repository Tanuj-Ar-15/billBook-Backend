const User = require("../models/Users");
const { cookieGenerate } = require("../utils/cookiesGenerate");
const generateOTP = require("../utils/generateOtp");
const { generateToken } = require("../utils/Jwt");
const sendOTP = require("../utils/sendOtp");
const bcrypt = require("bcrypt")
const crypto = require("crypto");
const sendResetLink = require("../utils/sendLink");


exports.login = async (req, res) => {

    const { email, password } = req.body
    try {


        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: "All fields are required!",
            })
        }

        const user = await User.findOne({ email })


        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(password, user.password);


        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid Credentials!' });

        }
        const otp = generateOTP()

        await sendOTP(user.email, otp)

        user.otp = otp
        user.otpExpiry = new Date(Date.now() + 15 * 60 * 1000);


        await user.save();
        return res.status(200).json({
            success: true,
            message: "Otp Sent Successfully!",
            email: user.email
        })
    } catch (error) {
        console.log("Error in auth Api: ", error);

        return res.status(400).json({
            success: false,
            message: "Error in authentication api",
            error
        })

    }
}


exports.register = async (req, res) => {
    try {

        const { username, email, password } = req.body;


        if (!email || !password || !username) {

            return res.status(400).json({
                success: false,
                message: "All fields are required!",
            })
        }


        if (password.length < 6) {

            return res.status(400).json({
                success: false,
                message: "Password must be in 6 characters.",
            })
        }


        const user = await User.create({ username, email, password })

        return res.status(201).json({
            success: true,
            message: "User created successfull!",
            user
        })

    } catch (error) {
        console.log("Error in register Api: ", error);

        return res.status(400).json({
            success: false,
            message: "Error in register api",
            error
        })
    }
}


exports.verifyLogin = async (req, res) => {
    const { email, otp } = req.body


    try {
        const user = await User.findOne({ email }).select('+otp +otpExpiry');

        if (!user) {
            console.log(`[LOGIN] user not found: ${email}`);
            return res.status(400).json({
                status: false,
                message: 'User not found',
                data: null
            });
        }
        if (!user.otp || !user.otpExpiry) {
            console.log(`[LOGIN] No OTP found for user: ${email}`);
            return res.status(400).json({
                status: false,
                message: 'OTP expired or not found. Please request a new OTP.',
                data: null
            });
        }

        if (user.otpExpiry < new Date()) {
            console.log(`[LOGIN] OTP expired for user: ${email}`);
            return res.status(400).json({
                status: false,
                message: 'OTP expired. Please request a new OTP.',
                data: null
            });
        }

        const storedOTP = String(user.otp);
        console.log(`[LOGIN] Comparing OTPs - Stored: '${storedOTP}', Input: '${otp}'`);
        if (storedOTP !== otp) {
            console.log(`[LOGIN] OTP verification failed. Input OTP doesn't match stored OTP.`);
            return res.status(400).json({
                status: false,
                message: 'Invalid OTP',
                data: null
            });
        }


        const token = generateToken(user._id);
        user.token = token;

        // Clear OTP after successful verification
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        cookieGenerate(token, res)

        const userWithoutSensitiveData = await User.findById(user._id).select('-password -token -otp -otpExpiry');


        res.status(200).json({
            status: true,
            message: 'Login successful',
            data: {
                token,
                user: userWithoutSensitiveData
            }
        });


    } catch (error) {
        console.log("error", error);
        return res.status(400).json({
            success: false,
            message: "Error in verify api",
            error
        })
    }

}


exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            return res.status(400).json({
                seccess: false,
                message: "Email is Required"
            })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({
                seccess: false,
                message: "Invalid Email"
            })
        }



        const token = crypto.randomBytes(32).toString("hex");

        await sendResetLink(email , token)
        user.resetTokenExpiry = new Date(Date.now() +  60 * 60 * 1000) 
        user.resetToken = token
        await user.save()

        res.status(200).json({
            success: true,
            message: "Link sent successfully to your Email "
        })

    } catch (error) {
        console.log("error", error);
        return res.status(400).json({
            success: false,
            message: "Error in send link api",
            error
        })
    }
}




exports.resetPassword = async (req, res) => {
    try {
        const { password, token } = req.body;

        if (!password || !token) {
            return res.status(400).json({
                success: false,
                message: "Password and token are required.",
            });
        }


        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired password link.",
            });
        }

        user.password = password;
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();


        return res.status(200).json({
            success: true,
            message: "Your password has been reset successfully. You can now log in with your new password.",
        });
    } catch (error) {
        console.error("[RESET] Error in resetPassword:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while resetting password.",
            error: error.message,
        });
    }
};


exports.logout = async (req, res) => {
    try {


        if (req.user) {
            const user = await User.findById(req.user._id);
            if (user) {
                user.token = null;
                await user.save();
            }
        }


        res.clearCookie("userToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return res.status(200).json({
            success: true,
            message: "Logout successful!",
        });
    } catch (error) {
        console.error("[LOGOUT] Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during logout.",
            error: error.message,
        });
    }
};


exports.readLoggedUser = async (req, res) => {
    try {

        const user = req.user

        if (!user) {

            return res.status(400).json({

                success: false,
                authenticated: false,
                message: "You are not logged in."
            })
        }

        res.status(200).json({
            success: true,
            authenticated: true,
            message: "Read user success",
            user
        })

    } catch (error) {
        console.log("error in read logged user", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error during read user.",
            error: error.message,
        });
    }
}