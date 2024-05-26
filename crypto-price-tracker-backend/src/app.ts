import express from 'express';
import priceRoutes from './routes/priceRoutes';
import cors from 'cors';
import connectDB from './database';
const app = express();

// Enable CORS using the cors middleware
app.use(cors());


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  });



  connectDB()
  .then(() => {
    console.log('Database connected');
    

    const port = 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });

app.use('/api', priceRoutes);

export default app;
