const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Generate JWT Token
const generateToken = (userId) => {
    console.log("JWT_SECRET:", process.env.JWT_SECRET); // Debug line
    return jwt.sign({ id: userId} , process.env.JWT_SECRET, { expiresIn : "7d"});
};

//@desc register a new user
//@route POST/api/auth/login
//@access public
const registerUser = async(req,res) => {
    try{
        console.log("REQ BODY:", req.body);
        const {name , email ,password, profileImageUrl , adminInviteToken} = 
        req.body;

        //Check if user already exixts
        const userExixts = await User.findOne({email});
        if(userExixts){
            return res.status(400).json({message:"User already exists"});
        }

        //Determine user role: admin if correct token is provided, otherwise Member
        let role = "member";
        if(
            adminInviteToken && 
            adminInviteToken == process.env.ADMIN_INVITE_TOKEN
        ){
            role = "admin";
        }

        //Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password , salt);

        //create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImageUrl,
            role,
        });

        //return user data with JWT
        res.status(201).json({
          token: generateToken(user._id),
          role: user.role,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
          }
        });

    } catch(error){
        res.status(500).json({ message:"Server error", error: error.message});
    }
};

//@desc  Login user
//@route POST/api/auth/login
//@access public
const loginUser = async(req , res) => {
    try{
        const {email ,password} = req.body;

        const user = await User.findOne({ email });
        if(!user){
            return res.status(401).json({message: "invalid email or password"})
        }

        //compare password 
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({message: "invalid email or password"});
        }

        // return user data with JWT
        res.json({
            token: generateToken(user._id),
            role: user.role,
            user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            },
        }); 
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};

//@desc Get user profile
//@route Get/api/auth/profile
//@access private (Requires JWt)
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password"); // Exclude password
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

//@desc Update user profile
//@route PUT/api/auth/profiles
//@access private (Requires JWT)
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update fields if provided
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        // If password provided, hash and update
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            token: generateToken(updatedUser._id),
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {registerUser , loginUser , getUserProfile , updateUserProfile};