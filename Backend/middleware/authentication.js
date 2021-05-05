const auth = (req, res, next)=>{
    if (!req.session.isLogined) {
        return res.status(401).json({
            success: false,
            isLogined: false
        });
    }

    next();
}

const professorAuth = (req, res, next)=>{
    if (!req.session.isLogined) {
        return res.status(401).json({
            success: false,
            isLogined: false
        });
    }
    else if (req.session.type != 'professor') {
        return res.status(403).json({
            success: false,
            isProfessor: false
        });
    }

    next();
}

module.exports = {
    auth, professorAuth
}