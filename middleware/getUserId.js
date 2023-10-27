const jwt = require('jsonwebtoken');
const { log } = require("mercedlogger")

function getUserId(req, res, next) {
    //   const token = req.header('x-auth-token'); Supondo que o token está no cabeçalho

    const autoHeader = req.headers['authorization']
    const token = autoHeader && autoHeader.split(' ')[1]

    if (!token) return res.status(401).send('Acesso negado. Token não fornecido.');

    try {
        const secret = process.env.SECRET
        const decoded = jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                res.status(401).json({ msg: 'Token expirado' })
            } else {
                userId = decoded.id;
                next();
            }
        });

    } catch (err) {
        log.magenta(err)
        res.status(400).send('Token inválido.');
    }
}

module.exports = getUserId;