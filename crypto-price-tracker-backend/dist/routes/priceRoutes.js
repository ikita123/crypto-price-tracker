"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const priceController_1 = require("../controllers/priceController");
const router = (0, express_1.Router)();
router.get('/v1/price-change', priceController_1.getPriceChange);
exports.default = router;
