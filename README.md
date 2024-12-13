# PantryDropper

- PantryDropper är ett digitalt inventariesystem för köket som ska hjälpa hushåll att minska på matsvinn genom att spåra matvaror och deras hållbarhet.  
- Systemet lagrar information om varornas namn, antal, en frivillig beskrivning och bäst-före datum.  
- Nya matvaror matas in antingen manuellt eller med hjälp av en kamera för att skanna en varas streckkod. 


## Features

- **Lagring av matvaror**: Lagra varunamn, antal, beskrivning, utgångsdatum
- **Streckkodsskanning**: Lägg till varor genom att skanna streckkoder med hjälp av en kamera.


## Tekniker

- **Frontend**: React.js
- **Backend**: Flask (Python)
- **Databas**: SQLite3

## Instruktioner

1. **Back-end**:
   - Navigera till backend:
     ```bash
     cd backend
     ```
   - Installera dependencies:
     ```bash
     npm install
     ```
   - Kör back-end servern:
     ```bash
     python app.py
     ```

2. **Front-end**:
   - Navigera till front-end:
     ```bash
     cd ../frontend
     ```
   - Installera dependencies och starta React:
     ```bash
     npm install
     npm run dev
     ```

## Användning

1. Följ länken som genereras av React.
2. Lägg till varor till inventory manuellt eller med hjälp av streckkodsskannern.
3. Se och redigera varor. 
4. Spåra utgångsdatum. 



