const jwt = require('jsonwebtoken');

require('dotenv').config();


const verifyToken = (req,res,next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).send({message:'Authorization header missing'});
    const token = authHeader.split(' ')[1];
    if(!token) return res.status(401).send("Token missing");
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(e){
        res.status(403).send(e)
    }
}

module.exports = verifyToken;