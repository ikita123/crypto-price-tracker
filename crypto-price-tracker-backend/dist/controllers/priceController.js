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
exports.getPriceChange = void 0;
const priceService_1 = require("../services/priceService");
const constants_1 = require("../constants");
const { httpErrorType } = constants_1.CommonParameter;
const getPriceChange = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract parameters from the request query
    const days = parseInt(req.query.days, 10);
    const vs_currency = req.query.vs_currency; // Ensure vs_currency is treated as a string
    // Check if either days or vs_currency is not included in the allowed values
    if (![1, 7, 30].includes(days) || !['usd'].includes(vs_currency)) {
        console.log(httpErrorType.badRequest.message, "httpErrorType.badRequest.message ");
        return res.status(httpErrorType.badRequest.code).json({ error: httpErrorType.badRequest.message });
    }
    const data = yield (0, priceService_1.getPriceChangePercentage)(days, vs_currency);
    // Send the response with the fetched data
    res.json(data);
});
exports.getPriceChange = getPriceChange;
