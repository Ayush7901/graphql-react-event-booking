const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    // check for an authorization header
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        // adds an isAuth fiel to  the request later used in ends which need authn
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1]; // authHeader.split(' ') = [Bearer, gsdahjgads]
    if (!token || token === '') {
        req.isAuth = false;
        return next;
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'somesuperscretkey');
    }
    catch (err) {
        throw new Error('Unauthenticated !');
    }
    req.isAuth = true;
    req.userId = decodedToken.userId;

    next();
}