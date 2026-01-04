import User from "../model/UserSchema.model.js";
import bcrypt from 'bcrypt'
import generateToken from "../Token/Token.js";
export const registerUser=async (req,res)=>{
    try{
        const {username,email,password,phone,confirmPassword}=req.body
        if(!username || !email || !password || !phone || !confirmPassword){
            return res.status(400).json({
                message:"All field are required to fill",
                success:false,
                status:400
            })
        }
        if(username.length < 6 || username.length > 20){
            return res.status(400).json({
                message:"username must be between 6 to 20 length",
                success:false,
                status:400
            })  
        }
        if(phone.length !== 10){
            return res.status(400).json({
                message:"phone length must be 10 ",
                success:false,
                status:400
            })
        }

        if(password !== confirmPassword){
            return res.status(400).json({
                message:"password missmatch with confirm password",
                success:false,
                status:400
            })
           
        }
        const IsexistEmail=await User.findOne({email})
        if(IsexistEmail){
            return res.status(409).json({
                message:"this email already preser ",
                success:false,
                status:409
            })
        }

        const hashPassword=await bcrypt.hash(password,10)

        const newUser=new User({
            username,
            email,
            phone,
            password:hashPassword
        })

        const token=generateToken(newUser)

        const saveUser=await newUser.save()
        if(saveUser){
            return res.status(201).json({
                message:"user create successfully ",
                status:201,
                success:true,
                Token:token
            })
        }
        else{
            return res.status(500).json({
                message:"internal server error !!!",
                status:500,
                success:false
            })
        }
    }
    catch(err){
        console.error("Register user  error:", err.message);
        return res.status(500).json({
            message: "Server error",
            success: false,
            status:500
        });
     
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

       
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                success: false,
                status:400,
                token: null
            });
        }

        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
                success: false,
                status:401,
                token: null
            });
        }

        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
                success: false,
                status:401,
                token: null
            });
        }

        
        const token = generateToken(user);

        
        return res.status(200).json({
            message: "Login successful",
            success: true,
            status:401,
            token
        });

    } catch (err) {
        console.error("Login error:", err.message);
        return res.status(500).json({
            message: "Server error",
            success: false,
            status:401,
            token: null
        });
    }
};

export const logoutUser=async(req,res)=>{
    return res.status(200).json({
        message:"logout user successfull",
        success:true,
        status:200,
        token:null
    })
}