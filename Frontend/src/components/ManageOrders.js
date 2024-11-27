import React, { useState, useEffect, useMemo } from "react";
import { jsPDF } from "jspdf";  // Import jsPDF for PDF generation
import 'jspdf-autotable';
import axios from "axios";
import OrderTable from "./OrderTable";  // Import the reusable OrderTable component
import "./ManageOrders.css";
import Header from "./Header";

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [activeCategory, setActiveCategory] = useState("completed");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  // Fetch orders from the backend when the component mounts
  useEffect(() => {
    fetchOrders();  // Fetch orders on mount
  }, []);

  // Function to fetch orders from the backend
  const fetchOrders = () => {
    axios.get("http://localhost:8080/api/auth/manageorders")
      .then((response) => {
        setOrders(response.data);  // Assuming the response returns an array of orders
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  };

  useEffect(() => {
    // Check if orders is an array before applying filter
    if (Array.isArray(orders)) {
      const filtered = orders.filter(order => order.status === activeCategory);
      setFilteredOrders(filtered);
    } else {
      console.error('Orders is not an array:', orders);
      setFilteredOrders([]);  // In case orders is not an array, fallback to empty array
    }
  }, [orders, activeCategory]);
  // Handle change of start date for the report
  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  // Handle change of end date for the report
  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  // Function to filter orders by date range
  // Function to filter orders by date range
    const filterOrdersByDateRange = (startDate, endDate) => {
      if (!startDate || !endDate) return orders;  // Return all orders if no date range selected

      const start = new Date(startDate);
      const end = new Date(endDate);

      // Ensure the end date includes the full day by setting the time to 23:59:59
      end.setHours(23, 59, 59, 999);  // Setting the end time to the last moment of the day

      return orders.filter((order) => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= start && orderDate <= end;
      });
    };


  // Define actions for the "Pending" category
  const actionsForPending = [
    {
      label: "Mark Completed",
      onClick: (orderId) => handleStatusChange(orderId, "completed"),
    },
    {
      label: "Cancel",
      onClick: (orderId) => handleStatusChange(orderId, "cancelled"),
    },
  ];

  // Define actions for the "Completed" category
  const actionsForCompleted = [
    {
      label: "Revert to Pending",
      onClick: (orderId) => handleStatusChange(orderId, "pending"),
    },
  ];

  // Define actions for the "Cancelled" category
  const actionsForCancelled = [
    {
      label: "Revert to Pending",
      onClick: (orderId) => handleStatusChange(orderId, "pending"),
    },
    {
      label: "Revert to Completed",
      onClick: (orderId) => handleStatusChange(orderId, "completed"),
    },
  ];

  // Determine which actions to show based on the active category
  let actions;
  if (activeCategory === "pending") {
    actions = actionsForPending;
  } else if (activeCategory === "completed") {
    actions = actionsForCompleted;
  } else if (activeCategory === "cancelled") {
    actions = actionsForCancelled;
  }

  // Function to handle status change (updating the order status)
  const handleStatusChange = (orderId, newStatus) => {
    axios.put(`http://localhost:8080/api/auth/update-status/${orderId}`, { status: newStatus })
      .then((response) => {
        alert(response.data);  // Show success message from backend
        fetchOrders();  // Refetch orders from the backend after successful update
      })
      .catch((error) => {
        console.error("Error updating order status:", error);
        alert("Error updating order status");
      });
  };

  // Function to generate the PDF report
  const generatePDF = () => {
    const doc = new jsPDF();

    // Add Title
    doc.setFontSize(18);
const pageWidth = doc.internal.pageSize.getWidth(); // Get the width of the page
const textWidth = doc.getTextWidth("Sales Report"); // Get the width of the text
const textX = (pageWidth - textWidth) / 2; // Calculate the X position to center the text
doc.text("Sales Report", textX, 20); // Use the calculated X position


    doc.setFontSize(13);  
    // Add Report Date
    const reportDate = new Date().toLocaleString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,  // 12-hour format (AM/PM)
    });
    
    doc.text(`Report Generated On: ${reportDate}`, 14, 30);
    

    // Add Date Range
    // Format the start and end dates
const formattedStartDate = new Date(startDate).toLocaleString('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,  // 12-hour format
});

const formattedEndDate = new Date(endDate).toLocaleString('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,  // 12-hour format
});

// Display the formatted date range
doc.text(`Date Range: ${formattedStartDate} to ${formattedEndDate}`, 14, 40);


    // Filter Orders by Date Range
    const filteredOrdersByDate = filterOrdersByDateRange(startDate, endDate);

    // Completed Orders Table
    const completedOrders = filteredOrdersByDate.filter(order => order.status === "completed");
    doc.setFontSize(12);
    doc.text(`Completed Orders: ${completedOrders.length}`, 14, 50);
    doc.autoTable({
      startY: 60,
      head: [['Order ID', 'Staff Name', 'Customer Number', 'Total Amount', 'Order Date']],
      body: completedOrders.map(order => [
        order.orderId,
        order.staffName,
        order.customerNumber,
        order.totalAmount,
        new Date(order.orderDate).toLocaleString('en-GB', {
          day: 'numeric',
          month: 'long',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,  // 12-hour format (AM/PM)
        }),
        
      ]),
    });

    // Cancelled Orders Table
    const cancelledOrders = filteredOrdersByDate.filter(order => order.status === "cancelled");
    doc.text(`Cancelled Orders: ${cancelledOrders.length}`, 14, doc.lastAutoTable.finalY + 10);
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 20,
      head: [['Order ID', 'Staff Name', 'Customer Number', 'Total Amount', 'Order Date']],
      body: cancelledOrders.map(order => [
        order.orderId,
        order.staffName,
        order.customerNumber,
        order.totalAmount,
        new Date(order.orderDate).toLocaleString('en-GB', {
          day: 'numeric',
          month: 'long',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,  // 12-hour format (AM/PM)
        }),
        
      ]),
    });

    // Save the PDF
    doc.save("sales_report.pdf");
  };

  return (
    <div className="orders-container">
      <Header />

      {/* Category Buttons */}
      <div className="category-buttons scrollable-content">
        <button
          className={`category-button ${activeCategory === "completed" ? "active" : ""}`}
          onClick={() => setActiveCategory("completed")}
        >
          Completed
        </button>
        <button
          className={`category-button ${activeCategory === "pending" ? "active" : ""}`}
          onClick={() => setActiveCategory("pending")}
        >
          Pending
        </button>
        <button
          className={`category-button ${activeCategory === "cancelled" ? "active" : ""}`}
          onClick={() => setActiveCategory("cancelled")}
        >
          Cancelled
        </button>
      </div>

      {/* Date Range for Report Generation */}
            <div className="generate-report-section">
        <div className="date-range">
          <label>Start Date: </label>
          <input type="date" value={startDate} onChange={handleStartDateChange} />
        </div>
        <div className="date-range">
          <label>End Date: </label>
          <input type="date" value={endDate} onChange={handleEndDateChange} />
        </div>

        <button 
          className="button" 
          onClick={() => {
            if (!startDate || !endDate) {
              alert("Please select both start and end dates to generate the report.");
            } else {
              generatePDF(); // Call the generatePDF function if dates are valid
            }
          }}
        >
          Generate Report
        </button>
      </div>

      {/* Orders Table */}
      <div className="orders-table">
        <OrderTable
          orders={filteredOrders}  // Pass filtered orders based on active category
          actions={actions}  // Pass the actions for the active category
        />
      </div>
      
    </div>
  );
};

export default OrdersManagement;
