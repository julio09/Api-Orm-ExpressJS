const session = require("express-session");
const Keycloak = require("keycloak-connect");
module.exports = app => {
    const tutorials = require("../controllers/tuto.controller.js");

    const memoryStore = new session.MemoryStore();
    const kcConfig = {
        clientId: 'Job',
        bearerOnly: true,
        serverUrl: 'http://localhost:8080',
        realm: 'job.mg'
    };

    function adminOnly(token, request) {
        return token.hasRole(`realm:${ADMIN_ROLE}`);
    }

    function isAuthenticated(token, request) {
        return token.hasRole(`realm:${ADMIN_ROLE}`) || token.hasRole(`realm:${USER_ROLE}`);
    }

    function isUser(token, request) {
        return token.hasRole(`realm:${USER_ROLE}`);
    }

    Keycloak.prototype.accessDenied = function (request, response) {
        response.status(401)
        response.setHeader('Content-Type', 'application/json')
        response.end(JSON.stringify({ status: 401, message: 'Unauthorized/Forbidden', result: { errorCode: 'ERR-401', errorMessage: 'Unauthorized/Forbidden' } }))
    }

    const keycloak = new Keycloak({ store: memoryStore }, kcConfig);

    app.use(session({
        secret: process.env.APP_SECRET || 'ntGgGcxReZtheHge8zMJx7emGqxLZPXs',
        resave: false,
        saveUninitialized: true,
        store: memoryStore
    }));

    app.use(
        keycloak.middleware()
    );

    const router = require("express").Router();

    // Create a new Tutorial
    router.post("/", tutorials.create);

    // Retrieve all Tutorials
    router.get("/", keycloak.protect(), tutorials.findAll);

    // Retrieve all published Tutorials
    router.get("/published", tutorials.findAllPublished);

    // Retrieve a single Tutorial with id
    router.get("/:id", tutorials.findOne);

    // Update a Tutorial with id
    router.put("/:id", tutorials.update);

    // Delete a Tutorial with id
    router.delete("/:id", tutorials.delete);

    // Delete all Tutorials
    router.delete("/", tutorials.deleteAll);

    app.use('/api/tutorials', router);
};