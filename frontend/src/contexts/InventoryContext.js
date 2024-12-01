import { createContext, useState, useContext } from 'react';

// Skapar context 
const InventoryContext = createContext();

// Skapar custom hook för att komma åt innehållet genom anrop av funktion  
export const useInventory = () => {
  return useContext(InventoryContext);
};

// Skapar provider komponent
export const InventoryProvider = ({ children }) => {
  // State som håller inventory-datan, initialiseras som en tom array 
  const [inventory, setInventory] = useState([]);

  // Funktion för att lägga till en vara i inventory 
  const addItem = (newItem) => {
    setInventory((prevInventory) => [...prevInventory, newItem]);
  };

  // Funktion för att ta bort en vara från inventory
  const removeItem = (itemId) => {
    setInventory((prevInventory) =>
      // Skapar en ny array som endast innehåller de varorna som ej matchar item id, dvs en ny array med endast ej borttagna varor 
      prevInventory.filter((item) => item.id !== itemId)
    );
  };

  return (
    <InventoryContext.Provider
      value={{
        inventory,
        addItem,
        removeItem,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

