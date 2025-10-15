const { validateToken } = require("../services/authencation");

function checkForAuthenticationCookie(cookieName){
    return (req,res,next)=> {
        const tokenCookieValue = req.cookies[cookieName];
        if(!tokenCookieValue){
           return next();
        };

        try {
            // console.log(req.user);
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
        } catch (error) {}

        return next();
    };
};

module.exports = {
    checkForAuthenticationCookie,
}