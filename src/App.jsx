import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import jsBarcode from 'jsbarcode';
import { ChromePicker } from 'react-color';
import { saveAs } from 'file-saver';
import { toBlob } from 'html-to-image';
import styled from 'styled-components';
import './App.css'

// Breakpoints for different device sizes
const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  laptop: '1024px',
  desktop: '1200px'
};

// Media queries
const devices = {
  mobile: `@media (min-width: ${breakpoints.mobile})`,
  tablet: `@media (min-width: ${breakpoints.tablet})`,
  laptop: `@media (min-width: ${breakpoints.laptop})`,
  desktop: `@media (min-width: ${breakpoints.desktop})`
};

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 1rem;

  ${devices.tablet} {
    padding: 1.5rem;
  }

  ${devices.laptop} {
    padding: 2rem;
  }
`;

const MainContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;

  ${devices.tablet} {
    margin-bottom: 3rem;
  }
`;

const MainTitle = styled.h1`
  font-size: 1.75rem;
  color: #2d3748;
  margin-bottom: 0.75rem;
  font-weight: 700;

  ${devices.mobile} {
    font-size: 2rem;
  }

  ${devices.tablet} {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
`;

const Description = styled.p`
  color: #4a5568;
  font-size: 0.875rem;
  padding: 0 1rem;
  margin: 0 auto;

  ${devices.mobile} {
    font-size: 1rem;
  }

  ${devices.tablet} {
    font-size: 1.1rem;
    max-width: 600px;
    padding: 0;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin-bottom: 1.5rem;
  transition: transform 0.2s ease;
  overflow: hidden;

  ${devices.mobile} {
    padding: 1.5rem;
    border-radius: 14px;
  }

  ${devices.tablet} {
    padding: 2rem;
    border-radius: 16px;
    margin-bottom: 2rem;
  }

  &:hover {
    transform: translateY(-2px);
  }
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  color: #2d3748;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  ${devices.mobile} {
    font-size: 1.5rem;
  }

  ${devices.tablet} {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }

  &:before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 20px;
    background: #4299e1;
    border-radius: 2px;

    ${devices.tablet} {
      height: 24px;
    }
  }
`;

const InputGroup = styled.div`
  margin-bottom: 1rem;

  ${devices.tablet} {
    margin-bottom: 1.5rem;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.375rem;
  color: #4a5568;
  font-weight: 500;
  font-size: 0.875rem;

  ${devices.tablet} {
    margin-bottom: 0.5rem;
    font-size: 1rem;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  ${devices.tablet} {
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-size: 1rem;
  }

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 2px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.875rem;
  background-color: black;
  cursor: pointer;

  ${devices.tablet} {
    padding: 0.75rem 1rem;
    border-radius: 8px;
    font-size: 1rem;
  }

  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
  }
`;

const ColorPickerContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin: 1rem 0;

  ${devices.tablet} {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    margin: 1.5rem 0;
  }
`;

const ColorPickerWrapper = styled.div`
  .chrome-picker {
    width: 100% !important;
    box-shadow: none !important;
    border: 2px solid #e2e8f0 !important;
    border-radius: 6px !important;

    ${devices.tablet} {
      border-radius: 8px !important;
    }
  }
`;

const PreviewContainer = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;

  ${devices.tablet} {
    margin: 2rem 0;
    padding: 2rem;
    border-radius: 8px;
  }

  /* Make QR code responsive */
  svg {
    max-width: 100%;
    height: auto;
  }

  /* Make barcode responsive */
  canvas {
    max-width: 100%;
    height: auto;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;

  ${devices.mobile} {
    flex-direction: row;
    gap: 1rem;
    margin-top: 1.5rem;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.625rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  ${devices.mobile} {
    width: auto;
  }

  ${devices.tablet} {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
  }
  
  ${props => props.primary ? `
    background: #4299e1;
    color: white;
    border: none;
    
    &:hover {
      background: #3182ce;
    }
  ` : `
    background: white;
    color: #4299e1;
    border: 2px solid #4299e1;
    
    &:hover {
      background: #ebf8ff;
    }
  `}
`;

const FileInput = styled.div`
  position: relative;
  margin: 1rem 0;

  ${devices.tablet} {
    margin: 1.5rem 0;
  }

  input[type="file"] {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  .file-label {
    display: block;
    padding: 0.625rem 0.875rem;
    background: #f7fafc;
    border: 2px dashed #e2e8f0;
    border-radius: 6px;
    text-align: center;
    color: #4a5568;
    font-size: 0.875rem;
    transition: all 0.2s ease;

    ${devices.tablet} {
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 1rem;
    }

    &:hover {
      border-color: #4299e1;
      color: #4299e1;
    }
  }
`;

function App() {
  const [qrText, setQrText] = useState('');
  const [qrColor, setQrColor] = useState('#000000');
  const [qrBgColor, setQrBgColor] = useState('#ffffff');
  const [qrLogo, setQrLogo] = useState(null);
  const [qrSize, setQrSize] = useState(256);

  const [barcodeText, setBarcodeText] = useState('');
  const [barcodeColor, setBarcodeColor] = useState('#000000');
  const [barcodeBgColor, setBarcodeBgColor] = useState('#ffffff');
  const [barcodeType, setBarcodeType] = useState('CODE128');

  // Update QR code size based on screen width
  useEffect(() => {
    const updateQRSize = () => {
      const width = window.innerWidth;
      if (width < 468) {
        setQrSize(200);
      } else if (width < 768) {
        setQrSize(220);
      } else {
        setQrSize(256);
      }
    };

    window.addEventListener('resize', updateQRSize);
    updateQRSize(); // Initial size

    return () => window.removeEventListener('resize', updateQRSize);
  }, []);

  const handleQrLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setQrLogo(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const downloadQrCode = (format) => {
    const qrCodeNode = document.getElementById('qr-code');
    toBlob(qrCodeNode).then((blob) => {
      saveAs(blob, `QRCode.${format}`);
    });
  };

  // const downloadQrCode = (format, padding = 20) => {
  //   const qrCodeNode = document.getElementById('qr-code');
  //   toBlob(qrCodeNode).then((blob) => {
  //     const img = new Image();
  //     img.src = URL.createObjectURL(blob);
  //     img.onload = () => {
  //       const canvas = document.createElement('canvas');
  //       const context = canvas.getContext('2d');

  //       // Set canvas size with padding on all sides
  //       canvas.width = img.width + padding * 2;
  //       canvas.height = img.height + padding * 2;

  //       // Fill the canvas with a white background or any desired color
  //       context.fillStyle = '#ffffff';
  //       context.fillRect(0, 0, canvas.width, canvas.height);

  //       // Draw the QR code in the center of the canvas with padding around it
  //       context.drawImage(img, padding, padding, img.width, img.height);

  //       // Convert canvas to blob and save
  //       canvas.toBlob((paddedBlob) => {
  //         saveAs(paddedBlob, `QRCode.${format}`);
  //         URL.revokeObjectURL(img.src); // Clean up
  //       }, `image/${format}`);
  //     };
  //   });
  // };


  const generateBarcode = () => {
    const canvas = document.getElementById('barcode');
    jsBarcode(canvas, barcodeText || '0000000000000', {
      format: barcodeType,
      lineColor: barcodeColor,
      background: barcodeBgColor,
      displayValue: true,
      fontSize: window.innerWidth < 768 ? 12 : 16,
      margin: window.innerWidth < 768 ? 5 : 10,
      width: window.innerWidth < 468 ? 1 : 2,
      height: window.innerWidth < 468 ? 50 : 100,
    });
  };

  const downloadBarcode = (format) => {
    const barcodeNode = document.getElementById('barcode-container');
    toBlob(barcodeNode).then((blob) => {
      saveAs(blob, `Barcode.${format}`);
    });
  };

  return (
    <AppContainer>
      <MainContainer>
        <Header>
          <MainTitle>QR & Barcode Generator</MainTitle>
          <Description>
            Create custom QR codes and barcodes with your own colors and styling. Perfect for business cards,
            product labels, and marketing materials.
          </Description>
        </Header>

        <Card>
          <CardTitle>QR Code Generator</CardTitle>
          <InputGroup>
            <Label>Enter URL or Text</Label>
            <Input
              type="text"
              placeholder="https://example.com"
              value={qrText}
              onChange={(e) => setQrText(e.target.value)}
            />
          </InputGroup>

          <ColorPickerContainer>
            <ColorPickerWrapper>
              <Label>Foreground Color</Label>
              <ChromePicker
                color={qrColor}
                onChangeComplete={(color) => setQrColor(color.hex)}
                disableAlpha
              />
            </ColorPickerWrapper>
            <ColorPickerWrapper>
              <Label>Background Color</Label>
              <ChromePicker
                color={qrBgColor}
                onChangeComplete={(color) => setQrBgColor(color.hex)}
                disableAlpha
              />
            </ColorPickerWrapper>
          </ColorPickerContainer>

          <FileInput>
            <input type="file" accept="image/png, image/jpeg" onChange={handleQrLogoUpload} />
            <div className="file-label">
              {qrLogo ? 'Change Logo' : 'Upload Logo (Optional)'}
            </div>
          </FileInput>

          <PreviewContainer id="qr-code">
            <QRCode
              value={qrText || 'https://example.com'}
              size={qrSize}
              fgColor={qrColor}
              bgColor={qrBgColor}
              level="H"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            {qrLogo && (
              <img
                src={qrLogo}
                alt="Logo"
                style={{
                  position: 'absolute',
                  width: qrSize * 0.2,
                  height: qrSize * 0.2,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            )}
          </PreviewContainer>

          <ButtonGroup>
            <Button primary onClick={() => downloadQrCode('png')}>
              Download PNG
            </Button>
            <Button onClick={() => downloadQrCode('svg')}>
              Download SVG
            </Button>
          </ButtonGroup>
        </Card>

        <Card>
          <CardTitle>Barcode Generator</CardTitle>
          <InputGroup>
            <Label>Enter Text or Number</Label>
            <Input
              type="text"
              placeholder="Enter barcode content"
              value={barcodeText}
              onChange={(e) => setBarcodeText(e.target.value)}
            />
          </InputGroup>

          <InputGroup>
            <Label>Barcode Type</Label>
            <Select
              value={barcodeType}
              onChange={(e) => setBarcodeType(e.target.value)}
            >
              <option value="CODE128">Code 128</option>
              {/* <option value="UPC">UPC</option>
              <option value="EAN13">EAN-13</option>
              <option value="EAN8">EAN-8</option> */}
              <option value="CODE39">Code 39</option>
              {/* <option value="ITF14">ITF-14</option> */}
              <option value="MSI">MSI</option>
              <option value="pharmacode">Pharmacode</option>
            </Select>
          </InputGroup>

          <ColorPickerContainer>
            <ColorPickerWrapper>
              <Label>Barcode Color</Label>
              <ChromePicker
                color={barcodeColor}
                onChangeComplete={(color) => setBarcodeColor(color.hex)}
                disableAlpha
              />
            </ColorPickerWrapper>
            <ColorPickerWrapper>
              <Label>Background Color</Label>
              <ChromePicker
                color={barcodeBgColor}
                onChangeComplete={(color) => setBarcodeBgColor(color.hex)}
                disableAlpha
              />
            </ColorPickerWrapper>
          </ColorPickerContainer>

          <PreviewContainer id="barcode-container">
            <canvas id="barcode" />
          </PreviewContainer>

          <ButtonGroup>
            <Button primary onClick={generateBarcode}>
              Generate Barcode
            </Button>
            <Button onClick={() => downloadBarcode('png')}>
              Download PNG
            </Button>
          </ButtonGroup>
        </Card>
      </MainContainer>

      {/* Add a responsive footer */}
      <Footer>
        <FooterText>
          © {new Date().getFullYear()} QR & Barcode Generator. All rights reserved.
        </FooterText>
      </Footer>
    </AppContainer>
  );
}

// Add styled components for footer
const Footer = styled.footer`
  text-align: center;
  padding: 1rem;
  margin-top: 2rem;

  ${devices.tablet} {
    margin-top: 3rem;
  }
`;

const FooterText = styled.p`
  color: #4a5568;
  font-size: 0.875rem;

  ${devices.tablet} {
    font-size: 1rem;
  }
`;


export default function AppWrapper() {
  return (
    <>
      <App />
    </>
  );
}
