const jwt = require('jsonwebtoken');

function verifyAdmin(req, res, next) {
    const token = req.cookies.accessTokenAdmin;
    if (!token) {
        return res.status(403).redirect('/users/login');
    } 
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decoded.role !== 'admin') {
            return res.status(403).send('Access denied. Admins only.');
        }
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).send('Invalid token. Please log in again.');
    }
}

module.exports = verifyAdmin;