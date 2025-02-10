const jwt = require('jsonwebtoken');
const User = require('../models/User');
const clodinary = require('../config/cloudinary');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const user = new User({ email, password, name });
    await user.save();

    const token = generateToken(user._id);
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.profile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.signout = async (req, res) => {
  console.log('signout');
  try {
    res.clearCookie('token');
    res.json({ message: 'User signed out successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phone, location, bio } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (location) user.location = location;
    if (bio) user.bio = bio;

    // Handle file upload to Cloudinary
    if (req.file) {
      // Convert buffer to base64
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      
      const result = await clodinary.uploader.upload(dataURI, {
        resource_type: 'auto'
      });
      user.avatar = result.secure_url;
    }

    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(400).json({ error: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { confirm, current } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!(await user.comparePassword(current))) {
      return res.status(401).json({ error: "Invalid password" });
    }

    user.password = confirm;
    await user.save();
    res.json({ message: "Password updated" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

exports.deleteProfile = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.userId);
    res.json({ message: 'User deleted' });
  }
  catch (error) {
    res.status(400).json({ error: error.message });
  }
};


