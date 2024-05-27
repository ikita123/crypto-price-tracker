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
const mongoose_1 = __importDefault(require("mongoose"));
const DB_URL = 'mongodb+srv://nikitasharma:nikita-sharma@cluster1.poqels0.mongodb.net/karnot?retryWrites=true&w=majority';
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Connecting to the database:', DB_URL);
        yield mongoose_1.default.connect(DB_URL);
        console.log('Connected to the database');
    }
    catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
});
exports.default = connectDB;
