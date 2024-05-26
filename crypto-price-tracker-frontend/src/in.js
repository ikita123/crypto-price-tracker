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

const BTXPriceChart = () => {
  const [data24h, setData24h] = useState([]);
  const [dataWeek, setDataWeek] = useState([]);
  const [dataMonth, setDataMonth] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [currentLabel, setCurrentLabel] = useState('Last 24 Hours');
  const [activePeriod, setActivePeriod] = useState('24h');
  const [additionalData, setAdditionalData] = useState(null);

  useEffect(() => {
    fetchData('1', setData24h);
    fetchData('7', setDataWeek);
    fetchData('30', setDataMonth);

    const ws = new WebSocket('ws://localhost:5000');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'update') {
        setAdditionalData(data.payload);
      }
    };

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    setCurrentData(data24h);
  }, [data24h]);

  const fetchData = async (days, setData) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/price-change`, {
        params: {
          vs_currency: 'usd',
          days: days,
        },
      });
      const formattedData = response.data.priceData.map((item) => ({
        timestamp: item.timestamp,
        price: item.price,
      }));
      setData(formattedData);
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleButtonClick = async (period) => {
    switch (period) {
      case '24h':
        setCurrentData(data24h);
        setCurrentLabel('Last 24 Hours');
        break;
      case 'week':
        setCurrentData(dataWeek);
        setCurrentLabel('Weekly');
        break;
      case 'month':
        setCurrentData(dataMonth);
        setCurrentLabel('Monthly');
        break;
      default:
        setCurrentData(data24h);
        setCurrentLabel('Last 24 Hours');
    }
    setActivePeriod(period);
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
                  if (context.parsed.y !== null) {
                    label += context.parsed.y.toFixed(3);
                  }
                  return label;
                },
              },
              bodyFontColor: '#fff',
              bodyFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
              bodyFontSize: 20,
              bodySpacing: 20,
              mode: 'index',
              intersect: false,
              position: 'nearest',
              custom: function (tooltipModel) {
                var tooltipEl = document.getElementById('chartjs-tooltip');

                if (!tooltipEl) {
                  tooltipEl = document.createElement('div');
                  tooltipEl.id = 'chartjs-tooltip';
                  tooltipEl.classList.add('custom-tooltip');
                  document.body.appendChild(tooltipEl);
                }

                if (tooltipModel.opacity === 0) {
                  tooltipEl.style.opacity = 0;
                  return;
                }

                tooltipEl.classList.remove('above', 'below', 'no-transform');
                if (tooltipModel.yAlign) {
                  tooltipEl.classList.add(tooltipModel.yAlign);
                } else {
                  tooltipEl.classList.add('no-transform');
                }

                if (tooltipModel.body) {
                  var titleLines = tooltipModel.title || [];
                  var bodyLines = tooltipModel.body.map(function (bodyItem) {
                    return bodyItem.lines;
                  });

                  var innerHtml = '<thead>';

                  titleLines.forEach(function (title) {
                    innerHtml += '<tr><th>' + title + '</th></tr>';
                  });
                  innerHtml += '</thead><tbody>';

                  bodyLines.forEach(function (body, i) {
                    var colors = tooltipModel.labelColors[i];
                    var style = 'background:' + colors.backgroundColor;
                    style += '; border-color:' + colors.borderColor;
                    style += '; border-width: 2px';
                    var span = '<span style="' + style + '"></span>';
                    innerHtml += '<tr><td>' + span + body + '</td></tr>';
                  });
                  innerHtml += '</tbody>';

                  var tableRoot = tooltipEl.querySelector('table');
                  tableRoot.innerHTML = innerHtml;
                }

                var position = this._chart.canvas.getBoundingClientRect();

                tooltipEl.style.opacity = 1;
                tooltipEl.style.position = 'absolute';
                tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
                tooltipEl.style.pointerEvents = 'none';
              }
            }
          }
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
        <div className="chart-controls">
          <button onClick={() => handleButtonClick('24h')} className={activePeriod === '24h' ? 'active' : ''}>24H</button>
          <button onClick={() => handleButtonClick('week')} className={activePeriod === 'week' ? 'active' : ''}>Week</button>
          <button onClick={() => handleButtonClick('month')} className={activePeriod === 'month' ? 'active' : ''}>Month</button>
        </div>
        {renderChart(currentLabel, currentData)}
        {additionalData && (
          <div className="additional-info">
            <p>{additionalData.currentValue}</p>
            <p>{additionalData.maxRecords}</p>
            <p>{additionalData.comparativeRates}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BTXPriceChart;
