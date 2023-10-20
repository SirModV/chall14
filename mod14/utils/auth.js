// utils/auth.js
const authMiddleware = (req, res, next) => {
    if (!req.session.loggedIn) {
        return res.redirect('/login');
    }
    next();
};
module.exports = authMiddleware;
