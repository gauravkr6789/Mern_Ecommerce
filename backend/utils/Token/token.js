import jwt from 'jsonwebtoken'

const generateToken=(user)=>{
    const JWT_SECRET_KEY=process.env.JWT_SECRET_KEY
    const token=jwt.sign({
        id:user._id,
        email:user.email,
    },
        JWT_SECRET_KEY,
        {expiresIn:"1d"},
    )
    return token
}

export default generateToken