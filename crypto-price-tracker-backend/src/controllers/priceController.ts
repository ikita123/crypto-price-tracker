import { Request, Response } from 'express';
import { getPriceChangePercentage } from '../services/priceService';
import { CommonParameter } from '../constants';

const { httpErrorType } = CommonParameter;

export const getPriceChange = async (req: Request, res: Response) => {
  
    // Extract parameters from the request query
    const days = parseInt(req.query.days as string, 10);
    const vs_currency = req.query.vs_currency as string; // Ensure vs_currency is treated as a string
  
    // Check if either days or vs_currency is not included in the allowed values
    if (![1, 7, 30].includes(days) || !['usd'].includes(vs_currency)) {
      console.log(httpErrorType.badRequest.message, "httpErrorType.badRequest.message ")
      return res.status(httpErrorType.badRequest.code).json({ error: httpErrorType.badRequest.message });
    }
    const data = await getPriceChangePercentage(days, vs_currency);
    
    // Send the response with the fetched data
    res.json(data);
   
};
