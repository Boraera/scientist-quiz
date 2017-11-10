module.exports = function(app) {

    /**
     * @swagger
     * /api/synergy/health:
     *   get:
     *     tags: ["integration-synergy"]
     */
    app.get('/api/synergy/health', function (req, res) {
        res.send({
            status: 'UP'
        });
    });
    
    
    app.get('/teachers/login', function (req, res) {
        res.send({
            info: 'This is a page for teacher. The functionality is coming later. :)'
        });
    });

    /**
     * @swagger
     * /api/synergy/info:
     *   get:
     *     tags: ["integration-synergy"]
     */
    app.get('/api/synergy/info', function (req, res) {
        res.send({
            displayName: 'NodeJS Demo App',
            address: process.env.URL,
            directlyAccessed: true,
            identities: [
                {category: 'application', type: 'example'}
            ],
            features: [
                {
                    namespace: 'synergy/app-info', attributes: {
                    url: process.env.URL + '/api/synergy/info' }
                },
                {
                    namespace: 'synergy/health', attributes: {
                    url: process.env.URL + '/api/synergy/health' }
                },{
                    namespace: 'synergy/icon', attributes: {
                        /*url: process.env.URL + '/icon.png' }*/
                        url: 'http://findicons.com/files/icons/2166/oxygen/128/applications_science.png' }
                },
                {
                    namespace: "synergy/web", attributes: {
                        mainEntryPoint: "http://localhost:8102/login",
                        modules: [
                               {name:'BioChemLearnie for students', entryPoint: '/'},
                               {name:'BioChemLearnie for teachers', entryPoint: '/teachers/login'}
                        ]
                    }
                }                
            ]

        });
    });
};