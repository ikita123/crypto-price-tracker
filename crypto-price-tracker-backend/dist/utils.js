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
Object.defineProperty(exports, "__esModule", { value: true });
exports.exponentialBackoff = exports.API_URL = exports.API_MESSAGE = void 0;
exports.API_MESSAGE = 'Price change data retrieved successfully';
exports.API_URL = 'https://your-api-url.com';
const exponentialBackoff = () => __awaiter(void 0, void 0, void 0, function* () {
    const baseDelay = 1000; // Initial delay in milliseconds
    const maxRetries = 3; // Maximum number of retries
    let delay = baseDelay;
    for (let retry = 0; retry < maxRetries; retry++) {
        yield new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
    }
});
exports.exponentialBackoff = exponentialBackoff;
