import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    try {
      const user = await new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
          if (err) {
            return reject(err);
          }
          resolve(decoded);
        });
      });

      req.user = user;
      next(); // verified
    } catch (err) {
      return res.sendStatus(403); // Forbidden
    }
  } else {
    return res.sendStatus(401); // Unauthorized
  }
};

export default authMiddleware;
