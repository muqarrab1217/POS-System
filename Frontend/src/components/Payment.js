import React, { useState, useEffect } from 'react';
import './Payment.css';
import { jsPDF } from 'jspdf';
import axios from 'axios'; 


// Modal Component
const PaymentModal = ({ isOpen, onClose, totalAmount, cart, appliedTax, paymentMethod, discount,activeCategory,refreshOrderData, staffID }) => {
  const [paymentMethodState, setPaymentMethod] = useState('cash');
  const [cashReceived, setCashReceived] = useState('');

  console.log("this is staff from take order: ", staffID);

  // Tax rates for each payment method
  const cashTaxRate = 16;
  const cardTaxRate = 4;

  // Ensure totalAmount is a valid number
  const validTotalAmount = totalAmount && !isNaN(totalAmount) ? totalAmount : 0;

  // Calculate discount amount based on discount percentage
  const calculateDiscount = () => {
    const total = calculateTotal();
    if (total > 0) {
      return total * (discount / 100); // Use the discount prop passed from the parent
    }
    return 0;
  };

  const placeOrder = async () => {
    // Prepare the order data
    const orderData = {
      staffId: staffID,
      orderDate: new Date().toISOString(),
      discount: discount,
      paymentMethod: paymentMethodState,
      totalAmount: finalAmount(), // This should reflect tax, discount, and total
      orderDetails: cart.map((item) => ({
        itemId: item.itemId, // Ensure you use itemId here
        customerNumber: '1234567890', // Replace with actual customer data
        quantity: item.count, // Quantity of each item in the cart
        price: item.price, // Price of the item
      })),
      tableName: activeCategory === "Dine-in" ? document.getElementById('tableNumber').value : null,
    };
    
  
    try {
      const response = await axios.post('http://localhost:8080/api/auth/place-order', orderData);
      console.log(orderData);
      if (response.status === 200) {
        console.log('Order placed successfully:', response.data);

        generateReceipt();
        refreshOrderData(); 
      }
    } catch (error) {
      console.error('Error placing the order:', error);
      alert('Failed to place the order. Please try again.');
    }
  };
  

  // Calculate total value of the cart
const calculateTotal = () => {
    if (!Array.isArray(cart)) {
      console.error('Invalid cart: cart should be an array');
      return 0;
    }
    console.log("in payment.js: ");
    console.log({cart});
    let cartTotal = 0;
  
    // Iterate over each item in the cart
    cart.forEach((item, index) => {
      if (item && typeof item.price === 'number' && item.price > 0 && typeof item.count === 'number' && item.count > 0) {
        // If price and count are valid, calculate the total for the item
        cartTotal += item.price * item.count;
      } else {
        console.warn(`Invalid data for item at index ${index}:`, item);
      }
    });
  
    console.log('Cart Total:', cartTotal);
    return cartTotal;
  };
  

  // Calculate tax based on selected payment method
  const calculateTax = (amount, taxRate) => (amount * taxRate) / 100;

  const taxAmount = paymentMethodState === 'cash'
    ? calculateTax(validTotalAmount, cashTaxRate)
    : calculateTax(validTotalAmount, cardTaxRate);

  // Handle cash-to-return calculation
  const cashToReturn = paymentMethodState === 'cash' && cashReceived
    ? parseFloat(cashReceived) - (validTotalAmount + taxAmount - calculateDiscount())
    : 0;

  // Handle payment method change
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setCashReceived(''); // Reset cash received when switching to credit card
  };

  // Final amount calculation considering discount and tax
  const finalAmount = () => {
    const discountAmount = calculateDiscount();
    const taxAmount = paymentMethodState === 'cash'
      ? calculateTax(validTotalAmount, cashTaxRate)
      : calculateTax(validTotalAmount, cardTaxRate);
    return validTotalAmount + taxAmount - discountAmount;
  };

  // Generate Receipt using jsPDF
  const generateReceipt = () => {
    // Convert cashReceived to a float for comparison
    const cashReceivedAmount = parseFloat(cashReceived);
  
    // Ensure the cashReceivedAmount is a valid number and greater than or equal to the finalAmount
    if (paymentMethodState === 'cash' && (isNaN(cashReceivedAmount) || cashReceivedAmount < finalAmount())) {
      // Show an error message if cash received is less than the total amount
      alert('Insufficient cash received. Please provide enough cash to cover the total amount.');
      return; // Exit the function to prevent the checkout
    }
  
    const doc = new jsPDF();
  
    // Header
    doc.setFontSize(18);
    doc.text("Restaurant POS System", 20, 20);
  
    // Receipt Information
    doc.setFontSize(12);
    doc.text(`Order Receipt`, 20, 30);
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 40);
  
    // Check if cart is defined and not empty before trying to print items
    let yPosition = 50;
    if (Array.isArray(cart) && cart.length > 0) {
      // Print each item in the cart
      cart.forEach((item) => {
        doc.text(`${item.name} x${item.count} - $${(item.price * item.count).toFixed(2)}`, 20, yPosition);
        yPosition += 10;
      });
    } else {
      doc.text("No items in cart.", 20, yPosition);
      yPosition += 10;
    }
  
    // Discount Section
    const discountAmount = calculateDiscount();
    doc.text(`Discount (${discount}%): -$${discountAmount.toFixed(2)}`, 20, yPosition);
    yPosition += 10;
  
    // Tax Section
    const taxAmount = paymentMethodState === 'cash'
      ? calculateTax(validTotalAmount, cashTaxRate)
      : calculateTax(validTotalAmount, cardTaxRate);
    doc.text(`Tax (${paymentMethodState === 'cash' ? cashTaxRate : cardTaxRate}%): +$${taxAmount.toFixed(2)}`, 20, yPosition);
    yPosition += 10;
  
    // Final Total
    const finalTotal = finalAmount();
    doc.text(`Final Total: $${finalTotal.toFixed(2)}`, 20, yPosition);
    yPosition += 20;
  
    // Payment Method
    doc.text(`Payment Method: ${paymentMethodState}`, 20, yPosition);
    yPosition += 10; // Add some space after payment method text
    
    // Save the PDF
    doc.save("receipt.pdf");
  
    // Close the modal after generating the receipt
    onClose();
  };
  

  useEffect(() => {
    // Log rendering and important values for debugging
    console.log("PaymentModal Rendered");
    console.log("isOpen:", isOpen);
    console.log("totalAmount:", totalAmount);
  }, [isOpen, totalAmount]);

  // Modal JSX
  return (
    isOpen && (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-btn" onClick={onClose}>X</button>
          
          <h2>Payment Method</h2>
          <div className="payment-options">
            <button 
              className={paymentMethodState === 'cash' ? 'active' : ''} 
              onClick={() => handlePaymentMethodChange('cash')}
            >
              Cash
            </button>
            <button 
              className={paymentMethodState === 'credit-card' ? 'active' : ''} 
              onClick={() => handlePaymentMethodChange('credit-card')}
            >
              Credit Card
            </button>
          </div>

          {/* Cash Payment Details */}
          {paymentMethodState === 'cash' && (
            <div className="cash-payment-details">
              <p>Tax Amount (16%): ${taxAmount.toFixed(2)}</p>
              <p>Discount Amount: ${calculateDiscount().toFixed(2)}</p>
              <p>
                Total Amount: 
                ${finalAmount().toFixed(2)}
              </p>
              <label>Cash Received: </label>
              <input
                type="number"
                value={cashReceived}
                onChange={(e) => setCashReceived(e.target.value)}
                placeholder="Enter cash received"
                min="0"
              />
              <p>Cash to Return: ${cashToReturn > 0 ? cashToReturn.toFixed(2) : '0.00'}</p>
            </div>
          )}

          {/* Credit Card Payment Details */}
          {paymentMethodState === 'credit-card' && (
            <div className="card-payment-details">
              <p>Tax Amount (4%): ${taxAmount.toFixed(2)}</p>
              <p>Discount Amount: ${calculateDiscount().toFixed(2)}</p>
              <p>
                Total Amount: 
                ${finalAmount().toFixed(2)}
              </p>
            </div>
          )}

          {/* Checkout Button */}
          <div className="checkout-container">
          <button className="checkout-btn" onClick={placeOrder}>Place Order</button>
          </div>
        </div>
      </div>
    )
  );
};

export default PaymentModal;
