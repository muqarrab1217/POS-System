import React, { useEffect, useState, useRef } from 'react';
import '../App.css';
import './Report.css';
import Header from "./Header"
import { Chart } from 'chart.js/auto';

const App = () => {
  // State to store the top-selling items fetched from the backend
  const [topSellingItems, setTopSellingItems] = useState([]);
  const [topWaiters, setTopWaiters] = useState([]); // State to store top waiters

  // Refs for the chart elements
  const topSellingChartRef = useRef(null);
  const waiterOrdersChartRef = useRef(null);
  const topSellingChartInstance = useRef(null);
  const waiterOrdersChartInstance = useRef(null);
  const dailyWaiterAverageRef = useRef(null);
  const dailyWaiterAverageInstance = useRef(null);

  // Fetch top-selling items from the API
  useEffect(() => {
    const fetchTopSellingItems = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/auth/top-selling');
        const data = await response.json();
        setTopSellingItems(data); // Set the state with the fetched data
      } catch (error) {
        console.error('Error fetching top-selling items:', error);
      }
    };

    fetchTopSellingItems();
  }, []);

  // Fetch top waiters from the API
  useEffect(() => {
    const fetchTopWaiters = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/auth/top-staff'); // Update with the correct endpoint
        const data = await response.json();
        setTopWaiters(data); // Set the state with the fetched data
      } catch (error) {
        console.error('Error fetching top waiters:', error);
      }
    };

    fetchTopWaiters();
  }, []);

  useEffect(() => {
    drawCharts();

    // Cleanup on component unmount
    return () => {
      if (topSellingChartInstance.current) {
        topSellingChartInstance.current.destroy();
      }
      if (waiterOrdersChartInstance.current) {
        waiterOrdersChartInstance.current.destroy();
      }
      if (dailyWaiterAverageInstance.current) {
        dailyWaiterAverageInstance.current.destroy();
      }
    };
  }, [topSellingItems]); // Re-run charts when top-selling items change

  const drawCharts = () => {
    // Destroy existing charts to prevent reinitialization issues
    if (topSellingChartInstance.current) {
      topSellingChartInstance.current.destroy();
    }
    if (waiterOrdersChartInstance.current) {
      waiterOrdersChartInstance.current.destroy();
    }
    if (dailyWaiterAverageInstance.current) {
      dailyWaiterAverageInstance.current.destroy();
    }

    // Top Selling Items Chart (Bar)
    const topSellingCtx = topSellingChartRef.current.getContext('2d');
    topSellingChartInstance.current = new Chart(topSellingCtx, {
      type: 'bar',
      data: {
        labels: topSellingItems.map((item) => item.itemName), // Changed to match backend response
        datasets: [
          {
            label: 'Orders',
            data: topSellingItems.map((item) => item.totalOrders), // Changed to match backend response
            backgroundColor: ['#00796b', '#004d40', '#e0f7fa', '#80cbc4', '#26a69a'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
      },
    });

    // Waiter Orders Chart (Pie) - Using `topWaiters`
    const waiterOrdersCtx = waiterOrdersChartRef.current.getContext('2d');
    waiterOrdersChartInstance.current = new Chart(waiterOrdersCtx, {
      type: 'pie',
      data: {
        labels: topWaiters.map((waiter) => waiter.staffName), // Use staffName for labels
        datasets: [
          {
            label: 'Orders',
            data: topWaiters.map((waiter) => waiter.totalOrders), // Use totalOrders for data
            backgroundColor: ['#00796b', '#004d40', '#26a69a', '#80cbc4'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
        },
      },
    });

    // Second Pie Chart - Waiters Who Took the Most Orders Chart (using same `topWaiters`)
    const dailyAverageCtx = dailyWaiterAverageRef.current.getContext('2d');
    dailyWaiterAverageInstance.current = new Chart(dailyAverageCtx, {
      type: 'pie',
      data: {
        labels: topWaiters.map((waiter) => waiter.staffName), // Same as first pie chart, use staffName for labels
        datasets: [
          {
            label: 'Orders',
            data: topWaiters.map((waiter) => waiter.totalOrders), // Same as first pie chart, use totalOrders
            backgroundColor: ['#00796b', '#004d40', '#26a69a', '#80cbc4'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
        },
      },
    });
  };

  return (
    <div className="App">
      
      <Header/>

      <main className="report-main">
      <h2>Charts</h2>
        <section className="chart-section">
          <div className="bar-chart">
            <canvas ref={topSellingChartRef} id="topSellingChart"></canvas>
          </div>
          <div className="chart-box">
            <canvas ref={waiterOrdersChartRef} id="waiterOrdersChart"></canvas>
          </div>
          <div className="chart-box">
            <canvas ref={dailyWaiterAverageRef} id="waiterOrdersChart"></canvas>
          </div>
        </section>

        <section className="report-section">
          <div className="report-container">
            <div className="report">
              <h2>Top Selling Food Items</h2>
            </div>
            <div className="generate-report">
              <button className="checkout-button">
                Generate Report
              </button>
            </div>
          </div>

          <table className="report-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Food Item</th>
                <th>Orders</th>
              </tr>
            </thead>
            <tbody>
              {topSellingItems.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.itemName}</td>
                  <td>{item.totalOrders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="report-section">
          <div className="report-container">
            <div className="report">
              <h2>Waiters Who Took the Most Orders</h2>
            </div>
            <div className="generate-report">
              <button className="checkout-button">
                Generate Report
              </button>
            </div>
          </div>
          <table className="report-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Waiter Name</th>
                <th>Orders</th>
              </tr>
            </thead>
            <tbody>
              {topWaiters.map((waiter, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{waiter.staffName}</td> 
                  <td>{waiter.totalOrders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      <footer>
        <p>&copy; 2024 Restaurant POS System</p>
      </footer>
    </div>
  );
};

export default App;
