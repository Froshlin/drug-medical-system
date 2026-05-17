const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ error: "All fields are required (including role)" });
        }

        // Validate role
        if (!['patient', 'doctor'].includes(role)) {
            return res.status(400).json({ error: "Role must be 'patient' or 'doctor'" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await user.save();

        const token = jwt.sign(
            { 
                id: user._id, 
                name: user.name,
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            success: true,
            message: "Account created successfully",
            token,
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                role: user.role 
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign(
            { 
                id: user._id,
                name: user.name,
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.json({
            success: true,
            token,
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                role: user.role 
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};