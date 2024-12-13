import React, { useEffect } from 'react';
import Quagga from 'quagga';
import axios from 'axios'; 

const BarcodeScanner = ({ onScan }) => {
  const [productName, setProductName] = React.useState('');

  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          type: 'LiveStream',
          target: document.querySelector('#scanner'),
          constraints: {
            facingMode: 'environment',
          },
        },
        decoder: {
          readers: ['ean_reader'],
        },
      },
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
        Quagga.start();
      }
    );

    Quagga.onDetected(async (data) => {
      const barcode = data.codeResult.code;
      if (onScan) {
        onScan(barcode); // Pass scanned code to parent component
      }

      try {
        const response = await axios.get(
          `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
        );
        const product = response.data.product;
        if (product) {
          setProductName(product.product_name || 'Unknown Product');
        } else {
          setProductName('Product not found');
        }
      } catch (error) {
        setProductName('Error fetching product data');
        console.error('Error fetching product data:', error);
      }

      Quagga.stop();
    });

    return () => {
      Quagga.stop();
    };
  }, [onScan]);

  return (
    <div>
      <div id="scanner" style={{ width: '100%', height: '400px', position: 'relative' }} />
      <div className="scanned-product-info">
        <strong>Scanned Product:</strong> {productName}
      </div>
    </div>
  );
};

export default BarcodeScanner;
