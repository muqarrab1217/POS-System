import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";  // Import jsPDF for PDF generation
import 'jspdf-autotable';
import axios from 'axios';
import './Inventory.css';  // Importing the CSS for styling
import Header from './Header';

const InventoryManagement = () => {
  const location = useLocation();
  const role = location.state?.role;
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [editItemIndex, setEditItemIndex] = useState(null);
  const [newItem, setNewItem] = useState({
    itemName: '',
    unitPrice: '',
    stockLocation: '',
    quantity: '',
    description: '',
    category: '',
    imagePath: ''  // Just the imagePath here
  });

  const [editItem, setEditItem] = useState({
    itemId: '',
    itemName: '',
    unitPrice: '',
    stockLocation: '',
    quantity: '',
    description: '',
    category: '',
    imagePath: ''  // For editing, imagePath will be used
  });

  // Fetch inventory data
  useEffect(() => {
    axios
      .get('http://localhost:8080/api/auth/inventory')  // Replace with your API endpoint
      .then((response) => {
        setInventory(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching inventory:', error);
        setIsLoading(false);
      });
  }, []);

  // Handle adding a new item
  const handleAddItem = () => {
    // Check if the image path is provided
    if (!newItem.imagePath) {
      alert("Please provide an image.");
      return;
    }

    // Create the data in the required format
    const dataToSend = {
      item: {
        name: newItem.itemName,
        description: newItem.description,
        itemPath: newItem.imagePath,  // Image path needs to be sent as itemPath
        price: parseFloat(newItem.unitPrice),  // Convert to number if necessary
        category: newItem.category
      },
      inventory: {
        itemName: newItem.itemName,
        unitPrice: newItem.unitPrice,
        stockLocation: newItem.stockLocation,
        quantity: parseInt(newItem.quantity, 10)  // Convert to integer if necessary
      }
    };

    console.log('Data to send:', dataToSend);

    // Send the data to the backend (make sure you're sending JSON, not FormData)
    axios
      .post('http://localhost:8080/api/auth/add-inventory', dataToSend, {
        headers: {
          'Content-Type': 'application/json',  // Ensure the correct content-type is sent
        },
      })
      .then(() => {
        // After the item is successfully added, fetch the updated inventory
        return axios.get('http://localhost:8080/api/auth/inventory');
      })
      .then((response) => {
        // Update the inventory state with the newly fetched inventory data
        setInventory(response.data);  // This will re-render the table with the new inventory list

        // Reset the form and close the add item form
        setNewItem({
          itemName: '',
          unitPrice: '',
          stockLocation: '',
          quantity: '',
          description: '',
          category: '',
          imagePath: ''  // Reset imagePath
        });
        setShowAddItemForm(false);  // Close the form after submission
      })
      .catch((error) => {
        console.error('Error adding item to inventory:', error);
      });
  };

  // Handle editing an item
  const handleEditItem = (index) => {
    setEditItemIndex(index);
    setEditItem(inventory[index]);
  };

  // Handle updating an item
  // Handle updating an item
const handleUpdateItem = () => {
  const { itemId, unitPrice, stockLocation, quantity } = editItem;

  // Construct the API URL with query parameters
  const updateUrl = `http://localhost:8080/api/auth/update-item-inventory/${itemId}?newUnitPrice=${unitPrice}&newStockLocation=${stockLocation}&newQuantity=${quantity}`;

  // Make the API request to update the item
  axios
    .put(updateUrl)  // We use PUT since we're updating an existing resource
    .then(() => {
      // After the item is successfully updated, fetch the updated inventory
      console.log("Inventory Updated");
      return axios.get('http://localhost:8080/api/auth/inventory');
    })
    .then((response) => {
      // Update the inventory state with the newly fetched inventory data
      setInventory(response.data);  // This will re-render the table with the updated inventory

      // Reset the edit state after updating
      setEditItemIndex(null);
      setEditItem({
        itemId: '',
        itemName: '',
        unitPrice: '',
        stockLocation: '',
        quantity: '',
        description: '',
        category: '',
        imagePath: ''  // Reset imagePath
      });
    })
    .catch((error) => {
      console.error('Error updating inventory item:', error);
    });
};


  // Handle deleting an item
  const handleDeleteItem = (index, itemId) => {
    // Call the DELETE API to delete the inventory item
    axios
      .delete(`http://localhost:8080/api/auth/delete-inventory/${itemId}`)
      .then(() => {
        // Once the item is deleted, fetch the updated inventory
        return axios.get('http://localhost:8080/api/auth/inventory');
      })
      .then((response) => {
        // Update the inventory state with the newly fetched inventory data
        setInventory(response.data);
      })
      .catch((error) => {
        console.error('Error deleting inventory:', error);
      });
  };

  // Handle image path change for the new item
  const handleImagePathChange = (e) => {
    const file = e.target.files[0];

    // Check if a file is selected
    if (!file) {
      alert("No image selected.");
      return;
    }

    // Create a relative path for the image, assuming all images will be stored in the "public/images" folder
    const imagePath = `/images/${file.name}`;

    // Update the newItem state to include the selected image path
    setNewItem({ ...newItem, imagePath: imagePath });
  };

  const generateCombinedReport = () => {
    // Import jsPDF and AutoTable
    const { jsPDF } = require('jspdf');
    require('jspdf-autotable');
  
    // Create a new PDF instance
    const doc = new jsPDF();
  
    // Add the title
    doc.setFontSize(18);
    const pageWidth = doc.internal.pageSize.getWidth(); // Get the width of the page
    const textWidth = doc.getTextWidth("Sales Report"); // Get the width of the text
    const textX = (pageWidth - textWidth) / 2; // Calculate the X position to center the text
    doc.text("Sales Report", textX, 20); // Use the calculated X position
  
    // Define table columns
    const columns = [
      'Item ID',
      'Item Name',
      'Unit Price',
      'Stock Location',
      'Quantity',
      'Description',
      'Category',
    ];
  
    let nextY = 30; // Start position after the title
  
    // Section 1: Low Stock Report (Quantity < 50)
    const lowStockItems = inventory.filter((item) => item.quantity < 50);
    if (lowStockItems.length > 0) {
      doc.setFontSize(16);
      doc.text('Low Stock Report (Quantity < 50)', 14, nextY); // Section title
      nextY += 10; // Adjust Y position
      const lowStockRows = lowStockItems.map((item) => [
        item.itemId,
        item.itemName,
        `$${parseFloat(item.unitPrice).toFixed(2)}`, // Format price to 2 decimals
        item.stockLocation,
        item.quantity,
        item.description,
        item.category,
      ]);
      doc.autoTable({
        head: [columns],
        body: lowStockRows,
        startY: nextY,
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [255, 99, 71] }, // Red header
      });
      nextY = doc.lastAutoTable.finalY + 10; // Update next Y position
    } else {
      doc.setFontSize(16);
      doc.text('Low Stock Report (Quantity < 50)', 14, nextY); // Section title
      nextY += 10; // Adjust Y position
      doc.setFontSize(12);
      doc.text('No items with quantity less than 50.', 14, nextY);
      nextY += 10; // Adjust Y position for the next section
    }
  
    // Section 2: Out of Stock Report (Quantity = 0)
    const outOfStockItems = inventory.filter((item) => item.quantity === 0);
    if (outOfStockItems.length > 0) {
      doc.setFontSize(16);
      doc.text('Out of Stock Report (Quantity = 0)', 14, nextY); // Section title
      nextY += 10; // Adjust Y position
      const outOfStockRows = outOfStockItems.map((item) => [
        item.itemId,
        item.itemName,
        `$${parseFloat(item.unitPrice).toFixed(2)}`,
        item.stockLocation,
        item.quantity,
        item.description,
        item.category,
      ]);
      doc.autoTable({
        head: [columns],
        body: outOfStockRows,
        startY: nextY,
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [255, 165, 0] }, // Orange header
      });
      nextY = doc.lastAutoTable.finalY + 10; // Update next Y position
    } else {
      doc.setFontSize(16);
      doc.text('Out of Stock Report (Quantity = 0)', 14, nextY); // Section title
      nextY += 10; // Adjust Y position
      doc.setFontSize(12);
      doc.text('No items are out of stock.', 14, nextY);
      nextY += 10; // Adjust Y position for the next section
    }
  
    // Section 3: Warehouse Reports (Sorted by Warehouse A, B, C)
    const warehouses = ['Warehouse A', 'Warehouse B', 'Warehouse C'];
    const warehouseReports = warehouses.map((warehouse) => {
      return {
        warehouse,
        items: inventory.filter((item) => item.stockLocation === warehouse),
      };
    });
  
    warehouseReports.forEach((warehouseReport) => {
      if (warehouseReport.items.length > 0) {
        doc.setFontSize(14);
        doc.text(`${warehouseReport.warehouse}`, 14, nextY); // Add title for each warehouse
        nextY += 10; // Adjust Y position
        const warehouseRows = warehouseReport.items.map((item) => [
          item.itemId,
          item.itemName,
          `$${parseFloat(item.unitPrice).toFixed(2)}`, // Format price to 2 decimals
          item.stockLocation,
          item.quantity,
          item.description,
          item.category,
        ]);
        doc.autoTable({
          head: [columns],
          body: warehouseRows,
          startY: nextY,
          styles: { fontSize: 10, cellPadding: 3 },
          headStyles: { fillColor: [22, 160, 133] }, // Green header
        });
        nextY = doc.lastAutoTable.finalY + 15; // Update next Y position
      }
    });
  
    // Save the PDF
    doc.save('combined_inventory_report.pdf');
  };
  
  

  return (
    <div className="inventory-container">

  <Header role={role} />

      {/* Add Item Button */}
      <div className="add-item-section">
        <button className="add-item-btn" onClick={() => setShowAddItemForm(true)}>
          Add New Item
        </button>
        <button className="add-item-btn" onClick={generateCombinedReport}>
          Generate Report
        </button>
      </div>


      {/* Add Item Form */}
      {showAddItemForm && (
        <div className="add-item-form">
          <h2>Add New Item</h2>
          <div className="input-group">
            {/* Item Name */}
            <div className="input-field">
              <label htmlFor="item-name">Item Name</label>
              <input
                type="text"
                id="item-name"
                value={newItem.itemName}
                onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                placeholder="Enter item name"
              />
            </div>

            {/* Unit Price */}
            <div className="input-field">
              <label htmlFor="unit-price">Unit Price</label>
              <input
                type="number"
                id="unit-price"
                value={newItem.unitPrice}
                onChange={(e) => setNewItem({ ...newItem, unitPrice: e.target.value })}
                placeholder="Enter price"
              />
            </div>

              {/* Stock Location */}
            <div className="input-field">
              <label htmlFor="edit-stock-location">Stock Location</label>
              <select
                id="edit-stock-location"
                value={newItem.stockLocation} 
                onChange={(e) => setNewItem({ ...newItem, stockLocation: e.target.value })} 
              >
                <option value="">Select Stock Location</option>
                <option value="Warehouse A">Warehouse A</option>
                <option value="Warehouse B">Warehouse B</option>
                <option value="Warehouse C">Warehouse C</option>
              </select>
            </div>



            {/* Quantity */}
            <div className="input-field">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                placeholder="Enter quantity"
              />
            </div>

            {/* Description */}
            <div className="input-field">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Enter item description"
              />
            </div>

            {/* Category */}
            <div className="input-field">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              >
                <option value="">Select category</option>
                <option value="FastFood">FastFood</option>
                <option value="Dessert">Dessert</option>
                <option value="Drinks">Drinks</option>
                <option value="Fruits">Fruits</option>
              </select>
            </div>

            {/* Image Upload */}
            <div className="input-field">
              <label htmlFor="image">Upload Image</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImagePathChange}
              />
            </div>
          </div>

          <div className="button-field">
            <button className="save-btn" onClick={handleAddItem}>
              Save Item
            </button>
            <button className="cancel-btn" onClick={() => setShowAddItemForm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Inventory List Table */}
      <div className="inventory-list">
        <h2>Inventory</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : inventory.length > 0 ? (
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Item ID</th>
                <th>Item Name</th>
                <th>Unit Price</th>
                <th>Stock Location</th>
                <th>Quantity</th>
                <th>Stocked Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item, index) => (
                <tr key={`${item.itemId || index}-${item.itemName}`}>
                  <td>{item.itemId}</td>
                  <td>{item.itemName}</td>
                  <td>{typeof item.unitPrice === 'number' ? `$${item.unitPrice.toFixed(2)}` : 'N/A'}</td>
                  <td>{item.stockLocation}</td>
                  <td>{item.quantity}</td>
                  <td>{new Date(item.stockedDate).toLocaleDateString()}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEditItem(index)}>
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteItem(index, item.itemId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No items in inventory.</p>
        )}
      </div>

      {/* Edit Item Modal */}
      {editItemIndex !== null && (
        <div className="edit-item-form">
          <h2>Edit Item</h2>
          <div className="input-group">
            {/* Item Name */}
            <div className="input-field">
              <label htmlFor="edit-item-name">Item Name</label>
              <input
                type="text"
                id="edit-item-name"
                value={editItem.itemName}
                disabled
                onChange={(e) => setEditItem({ ...editItem, itemName: e.target.value })}
              />
            </div>

            {/* Unit Price */}
            <div className="input-field">
              <label htmlFor="edit-unit-price">Unit Price</label>
              <input
                type="number"
                id="edit-unit-price"
                value={editItem.unitPrice}
                onChange={(e) => setEditItem({ ...editItem, unitPrice: e.target.value })}
              />
            </div>

            {/* Stock Location */}
            <div className="input-field">
              <label htmlFor="edit-stock-location">Stock Location</label>
              <select
                id="edit-stock-location"
                value={editItem.stockLocation}
                onChange={(e) => setEditItem({ ...editItem, stockLocation: e.target.value })}
              >
                <option value="">Select Stock Location</option>
                <option value="Warehouse A">Warehouse A</option>
                <option value="Warehouse B">Warehouse B</option>
                <option value="Warehouse C">Warehouse C</option>
              </select>
            </div>


            {/* Quantity */}
            <div className="input-field">
              <label htmlFor="edit-quantity">Quantity</label>
              <input
                type="number"
                id="edit-quantity"
                value={editItem.quantity}
                onChange={(e) => setEditItem({ ...editItem, quantity: e.target.value })}
              />
            </div>

           

            
          </div>

          <div className="button-field">
            <button className="save-btn" onClick={handleUpdateItem}>
              Save Changes
            </button>
            <button className="cancel-btn" onClick={() => setEditItemIndex(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
