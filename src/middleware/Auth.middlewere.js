import jwt from "jsonwebtoken";
export const authMiddleware = () => {
  return (req, res, next) => {
    try {
      const token = req.cookies.authToken;
      if (!token) {
        return res.status(401).json({ error: "Token not found" });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.role !== 'professor' && decoded.role !== 'student') {

        return res.status(403).json({ error: "Unauthorized" });
        
      }

      req.user = decoded;
      next();
    } catch (error) {
      
      res.status(401).json({ error: "Unauthorized", error: error.message });

    }
  };
};

