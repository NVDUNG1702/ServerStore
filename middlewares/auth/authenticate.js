const createHttpError = require("http-errors");
const  jwt  = require("jsonwebtoken");


const authenticate = async (req, res, next)=>{
    const token = req.header('token');
    
    if(!token) return next(createHttpError(401, "Vui lòng đăng nhập!"));
    jwt.verify(token, process.env.KEY_ACCESS, (err, payload)=>{
        if(err) return next(createHttpError.Unauthorized());

        req.user = payload;
        next();
    })
}

 
module.exports = {authenticate};