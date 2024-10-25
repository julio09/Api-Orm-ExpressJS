const Keycloak = require("keycloak-connect");
const session = require("express-session");
const memoryStore = new session.MemoryStore();
const kcConfig = {
    clientId: "Job",
    bearerOnly: true,
    serverUrl: process.env.KEYCLOAK_SERVER_URL,
    realm: "job.mg",
    realmPublicKey:''
};

exports.keycloak = new Keycloak({ store: memoryStore }, kcConfig.toString());