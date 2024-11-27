import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./TakeOrder.css";
import Footer from './Footer';
import Header from './Header';
import PaymentModal from './Payment'; // Import the PaymentModal component

const TakeOrder = () => {
  // State variables
  const location = useLocation();
  const role = location.state?.role;
  const staffId = location.state?.staffId;
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [appliedTax, setAppliedTax] = useState(0.16);
  const [discount, setDiscount] = useState(5);
  const [OrderNumber, setOrderNumber] = useState(0);
  const [OrderDate, setOrderDate] = useState(new Date().toLocaleDateString()); // Set current date as default
  const [customerNumber, setCustomerNumber] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [isCustomerNumberValid, setIsCustomerNumberValid] = useState(true); // State to track customer number validity

  console.log("user Role:", role);
  console.log("taken from login staffId:", staffId);

  // Modal state for displaying PaymentModal component
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Tax rates
  const cardTax = 0.04;
  const cashTax = 0.16;

  // Fetch menu items from the backend
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/api/auth/getitems"); // Backend API endpoint
        setMenuItems(response.data);
      } catch (err) {
        setError("Failed to fetch items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    // Fetch reservations when Dine-in is active
    if (activeCategory === "Dine-in") {
      axios.get('http://localhost:8080/api/auth/reservations')
        .then(response => {
          const reservationData = response.data;
          setReservations(reservationData);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching reservations:', error);
          setLoading(false);
        });
    }
  }, [activeCategory]); // Only re-fetch when activeCategory changes

  const refreshOrderData = async () => {
    try {
      const orderNumberResponse = await axios.get("http://localhost:8080/api/auth/next-order-number");
      setOrderNumber(orderNumberResponse.data); // Update the order number state
  
      // Fetch available tables
      const reservationsResponse = await axios.get('http://localhost:8080/api/auth/reservations');
      setReservations(reservationsResponse.data); // Update the reservations state
    } catch (error) {
      console.error("Error refreshing order data:", error);
    }
  };

  const validateCustomerNumber = () => {
    // Ensure the customer number is a valid non-empty integer
    if (!customerNumber.trim() || isNaN(customerNumber) || Number(customerNumber) <= 0) {
      setIsCustomerNumberValid(false);
      return false;
    }
    setIsCustomerNumberValid(true);
    return true;
  };

  const handleCustomerNumberChange = (e) => {
    setCustomerNumber(e.target.value);
    validateCustomerNumber(); // Validate whenever the user types
  };
  
  // Update appliedTax when payment method changes
  useEffect(() => {
    if (paymentMethod === "Credit Card" || paymentMethod === "Mobile Payment") {
      setAppliedTax(cardTax);
    } else if (paymentMethod === "Cash") {
      setAppliedTax(cashTax);
    }
  }, [paymentMethod]);

  useEffect(() => {
    const fetchNextOrderNumber = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/auth/next-order-number");
        setOrderNumber(response.data);
      } catch (err) {
        console.error("Error fetching order number", err);
        setError("Failed to fetch order number. Please try again.");
      }
    };
  
    fetchNextOrderNumber();
  }, []);
  

  // Add item to the cart
  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.itemId === item.itemId); // Use itemId to match items
      
      if (existingItem) {
        // If item already in the cart, increase the count
        return prevCart.map((cartItem) =>
          cartItem.itemId === item.itemId
            ? { ...cartItem, count: cartItem.count + 1 }  // Increase count if item is already in cart
            : cartItem
        );
      }
  
      // If item is not in the cart, add a new item with count set to 1
      return [...prevCart, { ...item, count: 1 }];
    });
  };

  // Remove item from the cart
  const removeFromCart = (index) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item, idx) =>
        idx === index ? { ...item, count: item.count - 1 } : item
      );
      return updatedCart.filter((item) => item.count > 0);
    });
  };

  // Calculate total price of cart
  const calculateTotal = () =>
    cart.reduce((total, item) => total + item.price * item.count, 0);

  // Calculate discount
  const calculateDiscount = () => {
    const total = calculateTotal();
    return total * (discount / 100); // Apply selected discount percentage
  };

  // Calculate tax
  const calculateTax = () => {
    const total = calculateTotal() - calculateDiscount(); // Tax is applied after discount
    return total * appliedTax;
  };

  // Calculate final total
  const calculateFinalTotal = () => {
    const totalAmount = calculateTotal();
    const taxAmount = calculateTax(totalAmount, appliedTax);
    const discountAmount = calculateDiscount();
    return totalAmount + taxAmount - discountAmount;
  };
  

  // Conditional rendering based on loading and error state
  if (loading) {
    return <div>Loading menu items...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Header role={role} />

      <main className="takeOrdermain">
        <div className="menu-section">
          <h2>Take Order</h2>
          <div className="categories">
            <button onClick={() => setSelectedCategory("FastFood")}>
              Fast Food
            </button>
            <button onClick={() => setSelectedCategory("Desert")}>Desert</button>
            <button onClick={() => setSelectedCategory("Drinks")}>Drinks</button>
            <button onClick={() => setSelectedCategory("all")}>Show All</button>
          </div>
          
          <div className="menu-items">
      {menuItems
        .filter(
          (item) =>
            selectedCategory === "all" || item.category === selectedCategory
        )
        .map((item, index) => (
          <div
            className={`menu-item ${item.category}`}
            key={index}
            onClick={() => addToCart(item)} // Pass the entire item object
          >
            <div className="image-container">
              <img src={item.itemPath} alt={item.name} />
              <div className="price-overlay">
                <p>{item.name}</p>
                <p>${item.price.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
    </div>


        </div>

        <div className="middle-section">
  <div className="info-section">
    <form>
      <label htmlFor="customerNumber">Customer Number</label>
      <input
        type="text"
        id="customerNumber"
        name="customerNumber"
        value={customerNumber}
        onChange={handleCustomerNumberChange} 
      />
      <label htmlFor="OrderNumber">Order No.</label>
      <input
        type="number"
        id="OrderNumber"
        name="OrderNumber"
        value={OrderNumber}
        disabled
        onChange={(e) => setOrderNumber(e.target.value)}
      />
      {!isCustomerNumberValid && (
                <p className="error-message">Customer Number must be a valid positive integer!</p>
              )}
      <label htmlFor="OrderDate">Order Date</label>
      <input
        type="text"
        id="OrderDate"
        name="OrderDate"
        value={OrderDate} // Set to today's date by default
        readOnly
      />
      {activeCategory === "Dine-in" && (
      <div className="table-selection">
  <label htmlFor="tableNumber">Select Table</label>
  <select id="tableNumber" name="tableNumber">
    {/* Check if reservations is an array and has items */}
    {Array.isArray(reservations) && reservations.length > 0 ? (
      reservations.map((reservation) => (
        <option key={reservation.reservationId} value={reservation.tableName}>
          {reservation.tableName}
        </option>
      ))
    ) : (
      <option disabled>No available tables</option>  // Fallback message when no tables are available
    )}
  </select>
</div>

    )}
    </form>
    <div className="category-order">
      <button
        className={`category-button ${activeCategory === "Dine-in" ? "active" : ""}`}
        onClick={() => setActiveCategory("Dine-in")}
      >
        Dine In
      </button>
      <button
        className={`category-button ${activeCategory === "Take-away" ? "active" : ""}`}
        onClick={() => setActiveCategory("Take-away")}
      >
        Take Away
      </button>
    </div>

    <h3 className="discounts">Select Discount</h3>
    <div className="info-card discounts">
      {[2, 5, 7, 10].map((discountValue) => (
        <button
          key={discountValue}
          onClick={() => setDiscount(discountValue)}
          className={discount === discountValue ? "active" : ""}
        >
          {discountValue}%
        </button>
      ))}
    </div>
  </div>
</div>

        <div className="sections">
          <div className="order-section">
            <h2>Your Order</h2>
            <div id="cart-items" className="scrollable-cart">
              {cart.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                cart.map((item, index) => (
                  <div className="cart-item" key={index}>
                    <p>
                      {item.name} x {item.count} - $
                      {Number(item.price * item.count).toFixed(2)}
                    </p>
                    <button onClick={() => removeFromCart(index)}>Remove</button>
                  </div>
                ))
              )}
            </div>

            <table>
              <tr>
                <td className="label">Sub Total:</td>
                <td className="value">
                  <h3>${Number(calculateTotal()).toFixed(2)}</h3>
                </td>
              </tr>
              <tr>
                <td className="label">Discount ({discount}%):</td>
                <td className="value">
                  <h3>${Number(calculateDiscount()).toFixed(2)}</h3>
                </td>
              </tr>
              <tr>
                <td className="label">Tax ({(appliedTax * 100).toFixed(0)}%):</td>
                <td className="value">
                  <h3>${Number(calculateTax()).toFixed(2)}</h3>
                </td>
              </tr>
            </table>
            <div className="total">
              <h3>Total Amount: ${Number(calculateFinalTotal()).toFixed(2)}</h3>
            </div>

            {Array.isArray(cart) && cart.length > 0 ? (
                <button
                  className="checkout-button"
                  onClick={() => setShowPaymentModal(true)}
                  disabled={!isCustomerNumberValid || customerNumber.trim() === ""}  // Disable button if customer number is invalid
                >
                  Proceed to Payment
                  
                </button>
              ) : (
                <button>
                  Cart is Empty
                </button>
            )}
          </div>
        </div>
      </main>
      
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        totalAmount={calculateFinalTotal()}
        cart={cart}
        appliedTax={appliedTax}
        paymentMethod={paymentMethod}
        discount={discount}
        activeCategory={activeCategory}
        refreshOrderData={refreshOrderData}
        staffID={staffId} // Pass the staffId here
      />


     <Footer />
    </div>
  );
};

export default TakeOrder;
