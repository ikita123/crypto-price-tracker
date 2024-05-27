"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const priceRoutes_1 = __importDefault(require("./routes/priceRoutes"));
const cors_1 = __importDefault(require("cors"));
const database_1 = __importDefault(require("./database"));
const app = (0, express_1.default)();
// Enable CORS using the cors middleware
app.use((0, cors_1.default)());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});
(0, database_1.default)()
    .then(() => {
    console.log('Database connected');
    const port = 3000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})
    .catch((error) => {
    console.error(error.message);
    process.exit(1);
});
app.use('/api', priceRoutes_1.default);
exports.default = app;
