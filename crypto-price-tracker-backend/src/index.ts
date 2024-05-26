import express from 'express';
import priceRoutes from './routes/priceRoutes';
import cors from 'cors';
import connectDB from './database';
import { fetchAndStoreDataFromAPIA } from './services/priceService'; // Adjust the path as needed
import WebSocket from 'ws'; // Import WebSocket library

const app = express();

// Enable CORS using the cors middleware
app.use(cors());

// Middleware to set CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

// Connect to the database
connectDB()
  .then(async () => {
    console.log('Database connected');


    const port = 5000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    // Set up WebSocket server
    const wss = new WebSocket.Server({ port: 8080 });

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

  })
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });

async function fetchDataAndStore() {
  const periods = [7, 1, 30];
  const vs_currency = 'usd';

  for (const days of periods) {
    try {
      const result = await fetchAndStoreDataFromAPIA(days, vs_currency);
      if (!result.success) {
        // Retry after 1 second if the data storage failed
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return fetchDataAndStore();
      }
      console.log(result.message)
      return { success: true, message: result.message };
    } catch (error:any) {
      return { success: false, error: error.message };
    }
  }
}
app.use('/api', priceRoutes);
export default app;
