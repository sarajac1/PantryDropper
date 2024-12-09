import { createContext, useState, useContext, useEffect } from 'react';

export const InventoryContext = createContext();

export const useInventory = () => {
  return useContext(InventoryContext);
};

export const InventoryProvider = ({ children }) => {
  const [inventory, setInventory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Fetching inventory...');
    fetch('/api/inventory', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((res) => {
        console.log('Response status:', res.status);
        console.log('Response headers:', Object.fromEntries(res.headers));

        if (!res.ok) {
          return res.text().then(text => {
            console.error('Error response text:', text);
            throw new Error(`HTTP error! status: ${res.status}, text: ${text}`);
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log('Inventory data received:', data);
        setInventory(data);
      })
      .catch((error) => {
        console.error('Full error details:', error);
        setError(error.message);
      });
  }, []);

  const addItem = (itemName, quantity) => {
    console.log('Adding item:', { itemName, quantity });
    const newItem = { item_name: itemName, quantity: parseInt(quantity, 10) };

    fetch('/api/add_item', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    })
      .then((res) => {
        console.log('Add item response status:', res.status);
        if (!res.ok) {
          return res.text().then(text => {
            console.error('Add item error text:', text);
            throw new Error(`HTTP error! status: ${res.status}, text: ${text}`);
          });
        }
        return res.json();
      })
      .then((savedItem) => {
        console.log('Saved item:', savedItem);
        setInventory((prevInventory) => [...prevInventory, savedItem]);
      })
      .catch((error) => {
        console.error('Error adding item:', error);
        setError(error.message);
      });
  };

  const removeItem = (itemId) => {
    fetch(`/api/delete_item/${itemId}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to delete item.');
        }
        return res.json();
      })
      .then(() => {
        setInventory((prevInventory) =>
          prevInventory.filter((item) => item.id !== itemId)
        );
      })
      .catch((error) => console.error('Error deleting item:', error));
  };

  // Add error display to context
  return (
    <InventoryContext.Provider
      value={{
        inventory,
        addItem,
        removeItem,
        error, // Expose error for debugging
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};