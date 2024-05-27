"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const priceRoutes_1 = __importDefault(require("./routes/priceRoutes"));
const cors_1 = __importDefault(require("cors"));
const database_1 = __importDefault(require("./database"));
const priceService_1 = require("./services/priceService"); // Adjust the path as needed
const ws_1 = __importDefault(require("ws")); // Import WebSocket library
const app = (0, express_1.default)();
// Enable CORS using the cors middleware
app.use((0, cors_1.default)());
// Middleware to set CORS headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});
// Connect to the database
(0, database_1.default)()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Database connected');
    const port = 5000;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
    // Set up WebSocket server
    const wss = new ws_1.default.Server({ port: 8080 });
    // WebSocket server event handlers
    wss.on('listening', () => {
        console.log('WebSocket server is running on port 8080');
    });
    wss.on('connection', (ws) => {
        console.log('Client connected to WebSocket');
        // Fetch and store data initially
        fetchDataAndStore();
        // Set up interval to fetch and store data every minute
        const interval = setInterval(fetchDataAndStore, 60000);
        // Handle WebSocket connection close
        ws.on('close', () => {
            console.log('Client disconnected from WebSocket');
            // Clear the interval when the client disconnects
            clearInterval(interval);
        });
        // Handle WebSocket errors
        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
    });
}))
    .catch((error) => {
    console.error(error.message);
    process.exit(1);
});
function fetchDataAndStore() {
    return __awaiter(this, void 0, void 0, function* () {
        const periods = [7, 1, 30];
        const vs_currency = 'usd';
        for (const days of periods) {
            try {
                const result = yield (0, priceService_1.fetchAndStoreDataFromAPIA)(days, vs_currency);
                if (!result.success) {
                    // Retry after 1 second if the data storage failed
                    yield new Promise((resolve) => setTimeout(resolve, 1000));
                    return fetchDataAndStore();
                }
                console.log(result.message);
                return { success: true, message: result.message };
            }
            catch (error) {
                return { success: false, error: error.message };
            }
        }
    });
}
app.use('/api', priceRoutes_1.default);
exports.default = app;
