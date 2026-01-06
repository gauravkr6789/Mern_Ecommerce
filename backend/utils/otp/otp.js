import bcrypt from 'bcrypt';
import User from '../../model/UserSchema.model.js';
import OtpModel from '../../model/OtpSchema.model.js';
import { generateOtp } from './generateOtp.js'
import { sendEmail } from '../../services/email.services.js'
import generateToken from '../Token/token.js'
import jwt from 'jsonwebtoken'

export const sendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found",
        status: false
      });
    }

    const { otp, hashOtp } = await generateOtp();

    const newOtp = new OtpModel({
      user: user._id,
      otp: hashOtp,
      expiresAt: new Date(Date.now() + 1 * 60 * 1000), 
      attempts: 0
    });
    await newOtp.save();

    await sendEmail({
      to: email,
      subject: "Your OTP Code",
      html: `<p>Your OTP is: <b>${otp}</b>. It expires in 1 minutes.</p>`
    });

    return res.status(200).json({
      message: "OTP sent successfully",
      status: true
    });

  } catch (err) {
    return res.status(500).json({
      message: "Failed to send OTP",
      status: false,
      error: err.message
    });
  }
};

export const otpVerification = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found', status: false });
    }

    const record = await OtpModel.findOne({ user: user._id });
    if (!record) {
      return res.status(400).json({ message: "OTP not found", status: false });
    }


    if (record.expiresAt < new Date()) {
      await OtpModel.deleteOne({ user: user._id });
      return res.status(400).json({ message: "OTP has expired", status: false });
    }

    const isValidOtp = await bcrypt.compare(otp, record.otp);
    if (!isValidOtp) {
      record.attempts += 1;
      await record.save();

      if (record.attempts >= 5) {
        await OtpModel.deleteOne({ user: user._id });
        return res.status(400).json({
          message: "Maximum attempts reached",
          status: false
        });
      }

      return res.status(400).json({
        message: "Invalid OTP",
        status: false
      });
    }

    await OtpModel.deleteOne({ user: user._id });
    await User.findByIdAndUpdate(user._id, { isVerified: true });

    const token = generateToken({ id: user._id, email: user.email }, '1h');

    return res.status(200).json({
      message: "OTP verified",
      status: true,
      token
    });

  } catch (err) {
    return res.status(500).json({
      message: "OTP verification failed",
      status: false,
      error: err.message
    });
  }
};

export const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: "No token provided", status: false });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decodedToken;
    next();
  } catch (err) {
    return res.status(401).json({ message: "unauthorized", status: false });
  }
};
