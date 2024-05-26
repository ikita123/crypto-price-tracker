import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

// Define a global variable for the active period
let globalActivePeriod = '1';

const BTXPriceChart = () => {
  const [data24h, setData24h] = useState([]);
  const [dataWeek, setDataWeek] = useState([]);
  const [dataMonth, setDataMonth] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [currentLabel, setCurrentLabel] = useState('Last 24 Hours');
  const [additionalData, setAdditionalData] = useState({});
  const [blinking, setBlinking] = useState(false);

  const fetchDataFromDB = async (period) => {
    console.log(period, "periodperiodperiod")
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/price-change`, {
        params: { vs_currency: 'usd', days: period },
      });
      const data = response.data;
      setCurrentData(data.priceData);
      setAdditionalData(data);
      setBlinking(true); // Start blinking
      setTimeout(() => setBlinking(false), 2000); // Stop blinking after 2 seconds
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {

    const fetchDataFromDB = async (period) => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/price-change`, {
          params: { vs_currency: 'usd', days: period },
        });
        const data = response.data;
        setCurrentData(data.priceData);
        setAdditionalData(data);
        setBlinking(true); // Start blinking
        setTimeout(() => setBlinking(false), 2000); // Stop blinking after 2 seconds
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    const ws = new WebSocket('ws://localhost:8080'); // WebSocket connection
    ws.onopen = () => {

      const interval = setInterval(() => {
        fetchDataFromDB(globalActivePeriod);
      }, 2000);

      console.log('Connected to WebSocket server');
      return () => clearInterval(interval);
    };

    ws.onmessage = (event) => {
      console.log("Message received from server:", event.data);
      // Process the received message
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket server');
    };

    return () => {
      // Clean up WebSocket connection when component unmounts
      ws.close();
    };
  }, []); // Empty dependency array to ensure effect runs only once


  const handleButtonClick = async (period) => {
    let data;
    let additionalData;
    switch (period) {
      case '1':
        setCurrentData(data24h);
        setCurrentLabel('24');
        additionalData = await fetchDataFromDB('1', setData24h);
        globalActivePeriod = '1';
        break;
      case '7':
        setCurrentData(dataWeek);
        setCurrentLabel('Weekly');
        additionalData = await fetchDataFromDB('7', setDataWeek);
        globalActivePeriod = '7';
        break;
      case '30':
        setCurrentData(dataMonth);
        setCurrentLabel('Monthly');
        additionalData = await fetchDataFromDB('30', setDataMonth);
        globalActivePeriod = '30';
        break;
     
    }

    

  };

  const renderChart = (label, data) => (
    <div className="chart-card">
      <Line
        data={{
          labels: data.map((item) => new Date(item.timestamp)),
          datasets: [
            {
              label: '$',
              data: data.map((item) => item.price),
              borderColor: 'blue',
              backgroundColor: 'rgba(0, 123, 255, 0.2)',
              fill: true,
            },
          ],
        }}
        options={{
          scales: {
            y: {
              display: false,
            },
            x: {
              type: 'time',
              time: {
                unit: 'day',
                tooltipFormat: 'MMM d',
                displayFormats: {
                  day: 'MMM d',
                },
              },
              ticks: {
                callback: function (value, index, values) {
                  const date = new Date(values[index].value);
                  return date.toLocaleString('en-US', { month: 'short', day: 'numeric' });
                },
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              displayColors: false,
              callbacks: {
                label: function (context) {
                  let label = '';
                  if (context.parsed.y !== null && context.parsed.y !== undefined) {
                    label += context.parsed.y.toFixed(3);
                  }
                  return label;
                },
              },
            },
          },
        }}
      />
    </div>
  );

  return (
    <div className="container">
      <div className="child-card">
        <div className="overview">
          <b>Overview</b>
          <span className="infobtn" title="BTX Price Chart"><i className="info"></i></span>
        </div>
        <div className="overview">
          Max records
          <span className={`hardcoded ${blinking ? 'blink' : ''}`}>{additionalData?.maxRecords}</span>
        </div>
        <div className="overview">
          Comparative rates
          <div className="blue">+<span className={`hardcoded ${blinking ? 'blink' : ''}`}>{additionalData?.comparativeRates}</span></div>
        </div>
        <div className="button-container">
          <button className={`tab-button ${globalActivePeriod === '1' ? 'active' : ''}`} onClick={() => handleButtonClick('1')}>24</button>
          <button className={`tab-button ${globalActivePeriod === '7' ? 'active' : ''}`} onClick={() => handleButtonClick('7')}>Week</button>
          <button className={`tab-button ${globalActivePeriod === '30' ? 'active' : ''}`} onClick={() => handleButtonClick('30')}>Month</button>
        </div>
        <div className="chart-container">
          {renderChart(currentLabel, currentData)}
        </div>
        <div>
          <div className={`hardcoded-left ${blinking ? 'blink' : ''}`}>
            +<span className="overview-left">
              <b>{additionalData?.percentageChange?.toFixed(2)}</b>
            </span>
            <span className='percentage'>%</span>
          </div>
          <span className={`info-right-grey ${blinking ? 'blink' : ''}`}>Last updated: {new Date(additionalData?.lastUpdated).toLocaleString()}</span>
        </div>
        <div>
          <span className={`hardcoded ${blinking ? 'blink' : ''}`}>Today, {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default BTXPriceChart;

