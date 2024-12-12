import React, { useState } from 'react';
import { useInventory } from '../contexts/InventoryContext';
import '../styles/App.css';

const App = () => {
  const { inventory, addItem, removeItem, updateItem, error } = useInventory();
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [description, setDescription] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [editValues, setEditValues] = useState({
    item_name: '',
    quantity: '',
    expiration_date: '',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (itemName.trim() && quantity.trim()) {
      addItem(itemName, quantity, expirationDate || 'unknown', description)
        .then(() => {
          console.log('Item added successfully.');
          setItemName('');
          setQuantity('');
          setExpirationDate('');
          setDescription('');
        })
        .catch((error) => {
          console.error('Error adding item:', error);
        });
    } else {
      console.error('Item name and quantity are required.');
    }
  };

  const handleEdit = (item) => {
    setEditItem(item.id);
    setEditValues({
      item_name: item.item_name,
      quantity: item.quantity,
      expiration_date: item.expiration_date || '',
      description: item.description || '',
    })
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = () => {
    if (!editItem) return;

    updateItem(editItem, editValues) // `updateItem` is now from context
      .then(() => {
        setEditItem(null); // Close edit mode on success
      })
      .catch((err) => console.error('Error saving edit:', err));
  };

  return (
    <div className="container">
      <h1>PantryDropper</h1>

      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}

      {/* Add Item Form */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="itemName">Item Name:</label>
          <input
            id="itemName"
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="quantity">Quantity:</label>
          <input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="expirationDate">Expiration Date:</label>
          <input
            id="expirationDate"
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <button type="submit" className="submit-btn">Add Item</button>
      </form>

      {/* Inventory List */}
      <ul className="inventory-list">
        {inventory.map((item) => (
          <li key={item.id} className="inventory-item">
            {editItem === item.id ? (
              <>
                <input
                  type="text"
                  name="item_name"
                  value={editValues.item_name}
                  onChange={handleEditChange}
                />
                <input
                  type="number"
                  name="quantity"
                  value={editValues.quantity}
                  onChange={handleEditChange}
                />
                <input
                  type="date"
                  name="expiration_date"
                  value={editValues.expiration_date}
                  onChange={handleEditChange}
                />
                <textarea
                  name="description"
                  value={editValues.description}
                  onChange={handleEditChange}
                ></textarea>
                <button onClick={() => saveEdit()} className="save-btn">
                  Save
                </button>
                <button onClick={() => setEditItem(null)} className="cancel-btn">
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span>
                  {item.item_name} - Qty: {item.quantity} - Expiry: {item.expiration_date || 'unknown'}
                  {item.description && ` (${item.description})`}
                </span>
                <div className="inventory-item-actions">
                  <button
                    onClick={() => handleEdit(item)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

    </div>
  );
};

export default App;

