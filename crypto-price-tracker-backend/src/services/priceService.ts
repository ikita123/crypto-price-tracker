import { exponentialBackoff } from '../utils';
import { PriceData } from '../model/price.model';
import axios, { AxiosResponse } from 'axios';

const fetchPriceDataFromAPI = async (days: number, vs_currency: string): Promise<any> => {
  try {
    const response: AxiosResponse<any> = await axios.get(`https://api.coingecko.com/api/v3/coins/bitcore/market_chart`, {
      params: {
        vs_currency: vs_currency,
        days: days,
      },
    });
    return response.data;
  } catch (error:any) {
    // Handle rate-limiting error with exponential backoff
    if (error.response && error.response.status === 429) {
      // Retry with exponential backoff
      await exponentialBackoff();
      return fetchPriceDataFromAPI(days, vs_currency); 
    } else {
      throw error; // Throw other errors
    }
  }
};

export const fetchPriceData = async (days: number, vs_currency: string) => {
  const data = await fetchPriceDataFromAPI(days, vs_currency);
  return data;
};

export const getPriceChangePercentage = async (days: number, vs_currency: string) => {
  try {
      // Fetch data from the database based on days and vs_currency
      const data = await PriceData.findOne({ days, vs_currency }).sort({ lastUpdated: -1 });

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
      const priceData = prices.map(({ timestamp, price }: { timestamp: number, price: number }) => ({ timestamp, price }));

      return {
          percentageChange,
          lastUpdated,
          maxRecords,
          comparativeRates,
          currentValue,
          priceData
      };
  } catch (error) {
      throw error;
  }
};

const getMaxRecords = (data: any) => {
  const prices = data.prices;
  const startPrice = prices[0].price;
  const endPrice = prices[prices.length - 1].price;
  const increaseFactor = endPrice / startPrice;
  const formattedFactor = increaseFactor.toFixed(2);

  return `${formattedFactor} times increase to the last month`;
};

const getComparativeRates = (data: any) => {
  const prices = data.prices;
  const startPrice = prices[0].price;
  const endPrice = prices[prices.length - 1].price;
  const percentageChange = ((endPrice - startPrice) / startPrice) * 100;
  const formattedPercentage = percentageChange.toFixed(2);

  return `${formattedPercentage}`;
};



export const fetchAndStoreDataFromAPIA = async (days: number, vs_currency: string) => {
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/bitcore/market_chart`, {
      params: {
        vs_currency: vs_currency,
        days: days,
      },
    });
    
    const data = response.data;
    const prices = data.prices.map(([timestamp, price]: [number, number]) => ({ timestamp, price }));

    // Create a new document using Mongoose model and save it to the database
    const newPriceData = new PriceData({
      vs_currency,
      days,
      prices,
      lastUpdated: new Date()
    });
    
    await newPriceData.save();
    
    return { success: true, message: 'Data stored successfully' };
  } catch (error:any) {
    return { success: false, error: error.message };
  }
};