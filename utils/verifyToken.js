import jwt from "jsonwebtoken";

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      console.log('Token Expired/Invalid');
      return false;
    } else {
      return decoded;
    }
  });
};