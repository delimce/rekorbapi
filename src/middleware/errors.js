

const prefix = "Upsss,";

const error404 = function (req, res, next) {
    res.status(404);

    // respond with json
    if (req.accepts('json')) {
        res.send({ error: `${prefix} api method Not found` });
        return;
    }

    // default to plain-text. send()
    res.type('txt').send('Not found');
}

function error500(err, req, res, next) {
    res.status(500);
    res.render('error', { error: err });
}

module.exports = error404
//module.exports = error500