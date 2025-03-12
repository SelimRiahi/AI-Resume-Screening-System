const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register User
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create a new user
    user = new User({
      name,
      email,
      password,
      role,
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save the user to the database
    await user.save();

    // Create a payload for the JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    // Generate a JWT token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 }, // Token expires in 100 hours
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token, 
          role: user.role, 
          recruiterId: user._id // Use _id as recruiterId
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Authenticate User
const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create a payload for the JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    // Generate a JWT token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 }, // Token expires in 100 hours
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token, 
          role: user.role, 
          recruiterId: user._id // Use _id as recruiterId
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  registerUser,
  authUser,
};
