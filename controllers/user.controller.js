const { User, AccessToken, Refresh_tokens, Otp } = require("../models/index");

const createError = require("http-errors");
const gravatarUrl = require("gravatar-url");
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const { transporter } = require("../config/common/mail");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../helpers/jwt_service");
const { generateRandomPassword } = require("../helpers/generateRandomPassword");
const { Op } = require('sequelize');

// const { where } = require("sequelize");

const userController = {
    register: async (req, res) => {
        try {
            const { fullName, password, email, phoneNumber } = req.body;
            const salt = bcrypt.genSaltSync(10);
            const hashPass = bcrypt.hashSync(password, salt);
            const role = 0;
            const newUser = await User.create({
                fullName,
                password: hashPass,
                email,
                phoneNumber,
                role,
            });

            if (!newUser) return createError(501, "register error");

            const mailOptions = {
                from: '"Nguyễn Văn Dũng 👻" <dungkuro1702@gmail.com>', // sender address
                to: `${email}`, // list of receivers
                subject: "Hello ✔", // Subject line
                // text: `Hello ${name}!, register !`, // plain text body
                html: `<p>We are pleased to inform you that your account registration has been successfully completed. Welcome to Server trái đất!</p>`, // html body
            };

            await transporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    // console.log("Error send mail: ", err);
                    return;
                };
                console.log("Send mail: ", info);
            });

            res.json({
                status: 201,
                message: "register success",
            });
        } catch (error) {
            console.log("signup error: ", error);
            res.json({
                status: 501,
                message: error.message,
            });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const userLogin = await User.findOne({ where: { email } });
            if (!userLogin) throw createError(404, "Login faild, user not found!");

            const validationPass = await userLogin.validationPassword(password);
            if (!validationPass) throw createError(500, "Password incorrect");

            const ACCESS_TOKEN = await signAccessToken(userLogin.id);
            const REFRESH_TOKEN = await signRefreshToken(userLogin.id);
            const { id, fullName, avatar, phoneNumber, createdAt, updatedAt } = userLogin;
            res.json({
                status: 200,
                ACCESS_TOKEN: ACCESS_TOKEN,
                REFRESH_TOKEN: REFRESH_TOKEN,
                user: {
                    id, fullName, email, avatar, phoneNumber, createdAt, updatedAt
                }
            });
        } catch (error) {
            console.log("Error login: ", error);
            res.json({
                status: error.status,
                message: error.message
            });
        }
    },

    loginWithToken: async (req, res) => {
        try {
            const { user } = req;
            if (!user) throw createError.UnprocessableEntity();
            const userLogin = await User.findOne({ where: { id: user.uid } });
            if (!userLogin) {
                throw createError.Unauthorized();
            }

            const { id, fullName, email, avatar, phoneNumber, createdAt, updatedAt } = userLogin;
            const resAvatar = await

                res.json({
                    status: 200,
                    user: {
                        id, fullName, email, avatar: avatar, phoneNumber, createdAt, updatedAt
                    }
                })
        } catch (error) {
            res.json({
                status: error.status,
                message: error.message
            })
        }
    },

    refreshToken: async (req, res) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) throw createError.BadRequest();
            const payload = await verifyRefreshToken(refreshToken);
            const findUser = await User.findOne({ where: { id: payload.uid } });
            if (!findUser) {
                res.json({
                    status: 404,
                    message: 'user not found'
                });
            }
            const ACCESS_TOKEN = await signAccessToken(payload.uid);
            res.status(201).json({
                status: 201,
                ACCESS_TOKEN: ACCESS_TOKEN,
            });
        } catch (error) {
            console.log("refresh token error: ", error);
            res.json({
                status: 401,
                message: error.message
            })
        }
    },

    uploadAvatar: async (req, res) => {
        try {
            const { file } = req;
            console.log(file);

            const uid = req.user.uid;
            console.log(uid);
            
            if (!file) {
                return res.status(400).json({ message: 'File upload failed. Please try again.' });
            }


            const userFind = await User.findOne({ where: { id: uid } });


            if (!userFind) throw createError(401, "vui lòng đăng nhập!");

            const linkImg = `http://localhost:1702/${file.path}`;
            const newLink = linkImg.replace('/public', '');
            userFind.avatar = newLink;
            await userFind.save();
            res.status(201).json({
                avatar: newLink
            })
        } catch (error) {
            console.log("error upload image: ", error);
            res.send(error);
        }

    },

    forgot: async (req, res) => {

        try {
            const { emailForgot } = req.body;
            if (!emailForgot) throw createError(404, "email forgot not found");
            const userForgot = await User.findOne({ where: { email: emailForgot } });

            if (!userForgot) throw createError(404, "User undefine");

            const newPassword = generateRandomPassword();
            const mailOptions = {
                from: '"Nguyễn Văn Dũng 👻" <dungkuro1702@gmail.com>', // sender address
                to: `${emailForgot}`, // list of receivers
                subject: "Forgot password ✔", // Subject line
                // text: `Hello ${name}!, register !`, // plain text body
                html: `<p>your new password is: ${newPassword}</p>`, // html body
            }
            await transporter.sendMail(mailOptions, (err, info) => {
                if (err) throw new Error("Lỗi send mail vui lòng thử lại sau!");

            });
            const salt = await bcrypt.genSaltSync(10);
            const newHashPass = await bcrypt.hashSync(newPassword, salt);

            userForgot.password = newHashPass;
            await userForgot.save();

            res.json({
                status: 201,
                message: "Forgot password success!"
            })
        } catch (error) {
            res.json({
                error: "Forgot password faild!",
                error: error
            });
            console.log("Error forgot password!", error);
        }

    },
    logout: async (req, res) => {
        try {

            const { uid } = req.body
            await AccessToken.destroy({
                where: { uid }
            })
            await Refresh_tokens.destroy({
                where: { uid }
            })

            res.status(200).json({
                status: 200,
                message: "logut success"
            })

        } catch (error) {

        }
    },


    senOTP: async (req, res) => {



        try {
            const { email } = req.body;

            const uid = req.user.uid

            const user = await User.findOne({ where: { id: uid, email } });
            console.log(email, uid);

            if (!email || !user) {
                console.log(email, user);

                return res.status(400).json({ message: 'Email is required.' });
            }

            const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // OTP expires in 10 minutes

            const mailOptions = {
                from: '"Nguyễn Văn Dũng 👻" <dungkuro1702@gmail.com>', // sender address
                to: `${email}`, // list of receivers
                subject: "OTP ✔", // Subject line
                // text: `Hello ${name}!, register !`, // plain text body
                html: `<p>Your OTP is: ${otpCode}</p>`, // html body
            }
            // Gửi email OTP
            await transporter.sendMail(mailOptions)
                .then(async (info) => {
                    console.log("Email sent successfully:", info.messageId);

                    // Lưu OTP vào cơ sở dữ liệu
                    const newOTP = await Otp.create({ email, used: false, otp: otpCode, expiresAt });
                    // console.log("newOTP: ", newOTP);


                    return res.status(200).json({ message: 'OTP has been sent to your email.' });
                })
                .catch((emailError) => {
                    console.error('Error sending OTP email:', emailError);
                    return res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
                });;

            // Lưu OTP vào cơ sở dữ liệu
            // await Otp.create({ email, otp: otpCode, expiresAt });

            // res.status(200).json({ message: 'OTP has been sent to your email.' });
        } catch (error) {
            console.error('Error sending OTP:', error);
            res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
        }
    },



    update: async (req, res) => {

        const uid = req.user.uid;

        const { email, fullName, phoneNumber, mailSen, otp } = req.body;
        console.log(email, fullName, phoneNumber, mailSen, otp);


        if (!email || !fullName || !phoneNumber || !otp) {
            return res.status(400).json({ message: 'All fields are required.' });
        }


        try {
            const otpRecord = await Otp.findOne({
                where: {
                    email: mailSen,
                    otp,
                    used: false,
                    expiresAt: { [Op.gt]: new Date() }, // OTP chưa hết hạn
                },
            });

            if (!otpRecord) {
                console.log("check null otpRecord");

                return res.status(400).json({ message: 'Invalid or expired OTP.' });
            }

            // Đánh dấu OTP là đã sử dụng
            otpRecord.used = true;
            await otpRecord.save();


            const user = await User.findOne({ where: { email: mailSen, id: uid } });

            if (!user) {

                return res.status(404).json({ message: 'User not found.' });
            }

            // Cập nhật thông tin người dùng
            user.fullName = fullName;
            user.phoneNumber = phoneNumber;
            user.email = email
            await user.save();

            res.status(200).json({ message: 'User information updated successfully.' });

        } catch (error) {
            console.error('Error updating user information:', error);
            res.status(500).json({ message: 'Failed to update user information. Please try again.' });
        }
    }



};



module.exports = userController;