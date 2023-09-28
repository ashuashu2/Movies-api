    require("dotenv").config()
    const jwt = require("jsonwebtoken")


    
    function verifyToken(token){
        try {
          const decode  = jwt.verify(token,process.env.SECREAT)
          
          return decode;
          
        } catch (error) {
          console.log("token is not provided")
        }
        }
                
    
      function extractUserIdFromToken(token){
        const decode = verifyToken(token)
        if (decode && decode.userId) {
            return decode.userId
        } else {
         console.log("userId is not available")
            
        }
        }
        
        
        



        module.exports = extractUserIdFromToken