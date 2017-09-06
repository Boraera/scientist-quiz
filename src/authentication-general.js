module.exports = function(app) {

    /**
     * @swagger
     * /auth/logout:
     *   get:
     *     tags: ["authentication-general"]
     */
    app.get('/auth/logout', function(req, res) {
        const previousUser = req.user;
        req.logout();
        res.send(previousUser);
    });

    /**
     * @swagger
     * /auth/user:
     *   get:
     *     tags: ["authentication-general"]
     */
    app.get('/auth/user', function(req, res) {
        res.send( req.user );
    });
};
