export const API_MESSAGE = 'Price change data retrieved successfully';
export const API_URL = 'https://your-api-url.com';

export const exponentialBackoff = async () => {
    const baseDelay = 1000; // Initial delay in milliseconds
    const maxRetries = 3; // Maximum number of retries
    let delay = baseDelay;
  
    for (let retry = 0; retry < maxRetries; retry++) {
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
};
