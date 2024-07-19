import React, { useState, useEffect, useRef } from 'react';
import ScanbotSDK from 'scanbot-web-sdk/webpack';
import './App.css';

const App = () => {
  const [lastBarcode, setLastBarcode] = useState(null);
  const barcodes = useRef([]);
  const barcodeScannerRef = useRef(null);
  const sdkRef = useRef(null);

  useEffect(() => {
    const initializeScanner = async () => {
      sdkRef.current = await ScanbotSDK.initialize({
        licenseKey: '',
        engine: "/",
      });

      const config = {
        onBarcodesDetected: onBarcodesDetected,
        containerId: 'barcode-scanner-view',
        style: {
          window: {
            aspectRatio: 2,
            paddingPropLeft: 0.7,
          },
        },
        barcodeFormat: [
          "AZTEC",
          "CODABAR",
          "CODE_39",
          "CODE_11",
          "CODE_93",
          "CODE_128",
          "DATA_MATRIX",
          "EAN_8",
          "EAN_13",
          "ITF",
          "MAXICODE",
          "PDF_417",
          "QR_CODE",
          "RSS_14",
          "RSS_EXPANDED",
          "UPC_A",
          "UPC_E",
          "UPC_EAN_EXTENSION",
          "MSI_PLESSEY",
          "PHARMACODE",
          "INTERLEAVED_2_OF_5",
          "POSTNET",
          "PLANET",
          "JAPAN_POST",
          "DUTCH_POST",
          "AUSTRALIAN_POST",
          "GS1_128" // UCC/EAN-128
        ]
      };

      barcodeScannerRef.current = await sdkRef.current.createBarcodeScanner(config);
    };

    initializeScanner();

    return () => {
      if (barcodeScannerRef.current) {
        barcodeScannerRef.current.disposeBarcodeScanner();
      }
    };
  }, []);

  const onBarcodesDetected = (result) => {
    barcodes.current.push(result);
    setLastBarcode(result);
    console.log('Barcodes detected:', result);
  };

  let barcodeText;
  if (!lastBarcode) {
    barcodeText = '';
  } else {
    const detectedBarcodes = lastBarcode.barcodes;
    barcodeText = JSON.stringify(
      detectedBarcodes.map((barcode) => barcode.text + " (" + barcode.format + ") "));
  }

  return (
    <div>
      <div
        id='barcode-scanner-view'
        style={{ height: "70%", width:"70%"}}>
      </div>
      <div>{barcodeText}</div>
    </div>
  );
}

export default App;
