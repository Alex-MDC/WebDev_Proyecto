const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET || "perryThePlatypus"


function verifyToken(req,res,next) {

    const token = req.cookies.token || '' 

    console.log(token)

    if (!token) {
        return res.redirect('/login')
    }
    // Validar el token 
    else {

        jwt.verify(token, SECRET, function(err, data){

            if (err){
                console.log(err)
                return res.redirect('/login')
            }
            else {
                console.log("All good")
                req.userId = data.id
                console.log(data)
                next()
            }

        })

    }

}

module.exports = verifyToken