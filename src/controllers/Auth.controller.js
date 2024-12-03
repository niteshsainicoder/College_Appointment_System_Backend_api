import bcryptjs from "bcryptjs";
import { UserSchema } from "../models/User.models.js";
import jwt from 'jsonwebtoken';

export const Login = async (req, res) => {
  try {
    // Destructure the email and password 
    const { email, password } = req.body;

    // Find the user by email
    const user = await UserSchema.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role }, // Payload
      process.env.JWT_SECRET, // Secret key from environment variables
      { expiresIn: '1d' } // Token expiration time
    );

    // Send the response with the token
    res.cookie('authToken', token, {
      httpOnly: true, // Cookie is not accessible via JavaScript
      secure: true, // Secure in production
      sameSite: 'strict', // Prevents CSRF
      maxAge: 3600000 // Cookie expiration in milliseconds (1 hour)
    })

    return res.status(200).json({
      message: "Login successful",
      
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
};

export const Register = async (req, res) => {

  try {
    //destructuring the body 
    const { name, email, password, role } = req.body;

    //finding if the user already exists
    if (await UserSchema.findOne({ email })) {
      return res.status(400).json({ message: "Email already exists", });
    }
    if (await UserSchema.findOne({ name })) {
      return res.status(400).json({ message: "Name already exists" });
    }

    //hashing the password
    const hashedPassword = await bcryptjs.hash(password, 8);

    //creating the user
    const user = await UserSchema.create({ name, email, password: hashedPassword, role });

    //sending the response
   return  res.status(201).json({ message: "User registered successfully", Data: user });
  } catch (error) {
    return res.status(500).json({ message: " Error Occured", error: error.message });
  }
};