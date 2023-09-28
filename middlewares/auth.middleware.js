const extractUserIdFromToken = require("../utils/utils")
      
      
      async function authVerify(req,res,next){
        const token = req.headers.authorization;
        try {
          const decodeId =  extractUserIdFromToken(token);
          req.user = {decodeId };
          return next()
         } catch (error) {
          res.status(401).json({error:"invalid access , please add the token"})
        }
        }
      

    module.exports = authVerify