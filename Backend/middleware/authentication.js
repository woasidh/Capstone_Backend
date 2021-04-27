const auth = (req, res, next)=>{
    if (!req.session.isLogined) {
        return res.status(401).json({
            success: false
        });
    }

    next();
}

const professorAuth = (req, res, next)=>{
    if (!req.session.isLogined) {
        return res.status(401).json({
            success: false
        });
    }
    else if (req.session.type != 'professor') {
        return res.status(403).json({
            success: false
        });
    }

    next();
}

module.exports = {
    auth, professorAuth
}