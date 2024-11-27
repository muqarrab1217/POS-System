import React from "react";

const OrderTable = ({ orders, actions }) => {
  // Function to format the order date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: 'numeric',
      month: 'long',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,  // Use 12-hour format for time
    };
    return date.toLocaleString('en-US', options);  // Adjust locale as needed
  };

  return (
    <div className="scrollable-content">
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Staff Name</th>
            <th>Customer Phone Number</th>
            <th>Status</th>
            <th>Total Amount</th>
            <th>Order Date</th> {/* Added Order Date column */}
            {actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.orderId}> {/* Use orderId as the unique key */}
                <td>{order.orderId}</td>
                <td>{order.staffName}</td>
                <td>{order.customerNumber}</td>
                <td>{order.status}</td>
                <td>${order.totalAmount.toFixed(2)}</td>
                <td>{formatDate(order.orderDate)}</td> {/* Format and display the order date */}
                {actions && (
                  <td>
                    {actions.map((action) => (
                      <button
                        key={action.label} // You can also add a key for action buttons
                        className="action-button"
                        onClick={() => action.onClick(order.orderId)}
                      >
                        {action.label}
                      </button>
                    ))}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={actions ? 8 : 7}>No orders in this category.</td> {/* Adjust colspan if actions are present */}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
