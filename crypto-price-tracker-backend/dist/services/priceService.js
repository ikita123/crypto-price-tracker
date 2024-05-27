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
exports.fetchAndStoreDataFromAPIA = exports.getPriceChangePercentage = exports.fetchPriceData = void 0;
const utils_1 = require("../utils");
const price_model_1 = require("../model/price.model");
const axios_1 = __importDefault(require("axios"));
const fetchPriceDataFromAPI = (days, vs_currency) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`https://api.coingecko.com/api/v3/coins/bitcore/market_chart`, {
            params: {
                vs_currency: vs_currency,
                days: days,
            },
        });
        return response.data;
    }
    catch (error) {
        // Handle rate-limiting error with exponential backoff
        if (error.response && error.response.status === 429) {
            // Retry with exponential backoff
            yield (0, utils_1.exponentialBackoff)();
            return fetchPriceDataFromAPI(days, vs_currency);
        }
        else {
            throw error; // Throw other errors
        }
    }
});
const fetchPriceData = (days, vs_currency) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield fetchPriceDataFromAPI(days, vs_currency);
    return data;
});
exports.fetchPriceData = fetchPriceData;
const getPriceChangePercentage = (days, vs_currency) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch data from the database based on days and vs_currency
        const data = yield price_model_1.PriceData.findOne({ days, vs_currency }).sort({ lastUpdated: -1 });
        if (!data) {
            throw new Error('Data not found in the database');
        }
        const prices = data.prices;
        const startPrice = prices[0].price;
        const endPrice = prices[prices.length - 1].price;
        if (typeof startPrice !== 'number' || typeof endPrice !== 'number') {
            throw new Error('Price data is not a number');
        }
        const percentageChange = ((endPrice - startPrice) / startPrice) * 100;
        const lastUpdated = data.lastUpdated.toISOString();
        const formattedPercentageChange = percentageChange.toFixed(2);
        const currentValue = `+${formattedPercentageChange}%`;
        const maxRecords = getMaxRecords(data);
        const comparativeRates = getComparativeRates(data);
        const priceData = prices.map(({ timestamp, price }) => ({ timestamp, price }));
        return {
            percentageChange,
            lastUpdated,
            maxRecords,
            comparativeRates,
            currentValue,
            priceData
        };
    }
    catch (error) {
        throw error;
    }
});
exports.getPriceChangePercentage = getPriceChangePercentage;
const getMaxRecords = (data) => {
    const prices = data.prices;
    const startPrice = prices[0].price;
    const endPrice = prices[prices.length - 1].price;
    const increaseFactor = endPrice / startPrice;
    const formattedFactor = increaseFactor.toFixed(2);
    return `${formattedFactor} times increase to the last month`;
};
const getComparativeRates = (data) => {
    const prices = data.prices;
    const startPrice = prices[0].price;
    const endPrice = prices[prices.length - 1].price;
    const percentageChange = ((endPrice - startPrice) / startPrice) * 100;
    const formattedPercentage = percentageChange.toFixed(2);
    return `${formattedPercentage}`;
};
const fetchAndStoreDataFromAPIA = (days, vs_currency) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`https://api.coingecko.com/api/v3/coins/bitcore/market_chart`, {
            params: {
                vs_currency: vs_currency,
                days: days,
            },
        });
        const data = response.data;
        const prices = data.prices.map(([timestamp, price]) => ({ timestamp, price }));
        // Create a new document using Mongoose model and save it to the database
        const newPriceData = new price_model_1.PriceData({
            vs_currency,
            days,
            prices,
            lastUpdated: new Date()
        });
        yield newPriceData.save();
        return { success: true, message: 'Data stored successfully' };
    }
    catch (error) {
        return { success: false, error: error.message };
    }
});
exports.fetchAndStoreDataFromAPIA = fetchAndStoreDataFromAPIA;
