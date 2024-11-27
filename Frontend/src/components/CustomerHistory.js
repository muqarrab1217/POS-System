import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CustomerHistory.css";
import Header from "./Header";

const CustomerHistory = () => {
  const [customerHistory, setCustomerHistory] = useState([]);  // To store the fetched data
  const [searchTerm, setSearchTerm] = useState("");  // To store the search term
  const [loading, setLoading] = useState(true);  // To handle loading state
  const [error, setError] = useState(null);  // To handle errors

  // Function to format date in the desired format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,  // Use 12-hour clock
    };
    return date.toLocaleString('en-GB', options).replace(',', '');  // 'en-GB' for UK format
  };

  // Fetch data from the backend API
  useEffect(() => {
    const fetchCustomerHistory = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/auth/customer-history");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();

        // Group the orders by customerNumber
        const groupedData = data.reduce((acc, order) => {
          if (!acc[order.customerNumber]) {
            acc[order.customerNumber] = [];
          }
          acc[order.customerNumber].push(order);
          return acc;
        }, {});

        setCustomerHistory(groupedData);  // Set the grouped data into state
      } catch (error) {
        setError(error.message);  // Set error message if fetch fails
      } finally {
        setLoading(false);  // Set loading to false after data is fetched
      }
    };

    fetchCustomerHistory();
  }, []);

  // Filter customer data based on the search term
  const filteredCustomerHistory = Object.keys(customerHistory).filter((customerNumber) =>
    customerNumber.toLowerCase().includes(searchTerm.toLowerCase())  // Case insensitive search
  );

  if (loading) {
    return <div>Loading...</div>;  // Display loading state
  }

  if (error) {
    return <div>Error: {error}</div>;  // Display error if there was an issue with the fetch
  }

  return (
    <div className="customer-history-container">
      <Header />

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Customer Number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}  // Update search term as user types
        />
      </div>

      {/* Customer Orders Table */}
      <div className="customer-history-table">
        <table>
          <thead>
            <tr>
              <th>Customer Phone Number</th>
              <th>Order ID</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomerHistory.length > 0 ? (
              filteredCustomerHistory.map((customerNumber) => {
                const orders = customerHistory[customerNumber];
                
                // Ensure orders is an array before calling .map
                if (Array.isArray(orders)) {
                  return orders.map((order) => (
                    <tr key={order.orderId}>
                      <td>{customerNumber}</td>
                      <td>{order.orderId}</td>
                      <td>{order.items}</td>
                      <td>${order.totalAmount.toFixed(2)}</td>
                      <td>{formatDate(order.date)}</td>  {/* Use the formatDate function here */}
                    </tr>
                  ));
                } else {
                  return (
                    <tr key={customerNumber}>
                      <td colSpan={5}>No orders found for customer {customerNumber}</td>
                    </tr>
                  );
                }
              })
            ) : (
              <tr>
                <td colSpan={5}>No orders found for this customer number.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerHistory;
