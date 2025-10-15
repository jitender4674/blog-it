const {Router} = require("express");
const User = require("../models/user")

const router = Router();


router.get('/signin', (req,res) =>{
    res.render("signin");
});

router.post("/signin", async(req,res) => {
    try {
        const {email,password} = req.body;
    const token = await User.matchPasswordGenerateToken(email,password);

    // console.log("token",token);
    return res.cookie("token", token).redirect("/");
        
    } catch (error) {
        res.render("signin", {
            error:"incorrect email or password",
        })
        
    }
});

// 
router.get('/signup', (req,res) =>{
    res.render('signup');
})


router.post('/signup', async(req,res) =>{
    const {fullName, email, password} = req.body;

    await User.create({
        fullName,
        email,
        password,
    });

    return res.redirect("/");
})

//
router.get("/logout", (req,res) =>{
    res.clearCookie("token").redirect("/");
});





module.exports = router;
