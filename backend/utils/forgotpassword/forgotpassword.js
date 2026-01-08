import crypto from "crypto";
import User from "../../model/UserSchema.model.js"
import bcrypt from "bcrypt";
import { sendEmail } from "../../services/email.services.js"

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        const resetToken = crypto.randomBytes(32).toString("hex");


        user.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save();

        const resetUrl = `http://localhost:${process.env.PORT}/reset-password/${resetToken}`;

        await sendEmail({
  to: user.email,
  subject: "Reset Password",
  html: `
    <h2>Reset Your Password</h2>
    <p>Click the button below to reset your password:</p>
    <a href="${resetUrl}" 
       style="
         display:inline-block;
         padding:10px 16px;
         background:#4F46E5;
         color:#fff;
         text-decoration:none;
         border-radius:6px;
       ">
       Reset Password
    </a>
    <p style="margin-top:10px">
      Or copy paste this link in browser:
      <br />
      ${resetUrl}
    </p>
    <p>This link is valid for 10 minutes.</p>
  `
});


        res.status(200).json({ 
            message: "Reset link sent to email",
            success:true,
            linkurl:resetUrl

         });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


