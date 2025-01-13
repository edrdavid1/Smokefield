const qrcodeContainer = document.getElementById("qrcode");
const idtext = document.getElementById("id");

let qrData = "qwerty"; 
idtext.innerHTML = qrData;

if (!qrcodeContainer) {
  console.error("Элемент з id='qrcode' не знойдзены ў HTML!");
} else {
  
  function generateQRCode(text) {
    if (typeof text !== "string" || !text.trim()) {
      console.error("Тэкст для QR-кода мусіць быць радком!");
      return;
    }
    qrcodeContainer.innerHTML = "";

    new QRCode(qrcodeContainer, {
        text: text,  
        width: 160,
        height: 160,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H  
    });
  }

  generateQRCode(qrData);
}


const startScanButton = document.getElementById("startScanButton");
const closeScanButton = document.getElementById("closeScanButton");
const scannerContainer = document.getElementById("qr-code-scanner");

let html5QrCode;  // Аб'ект сканера

function startQRCodeScanner() {
    startScanButton.style.display = "none";
    closeScanButton.style.display = "block";  // Паказаць кнопку закрыцця
    scannerContainer.style.display = "block"; // Паказаць сканер

    html5QrCode = new Html5Qrcode("qr-code-scanner");

    html5QrCode.start(
        { facingMode: "environment" },  // Камера на ззаду
        {
            fps: 10,    // Колькасць кадраў у секунду
            qrbox: 250  // Памер зоны для сканавання QR-кода
        },
        (decodedText, decodedResult) => {
            // Гэта будзе выклікана, калі QR-код будзе сканаваны
            alert(`QR Code: ${decodedText}`);
            stopQRCodeScanner();  // Спыніць сканер пасля сканавання
        },
        (errorMessage) => {
            // Гэта будзе выклікана, калі ёсць праблемы з сканаваннем
            console.error(errorMessage);
        }
    ).catch(err => {
        console.log("Памылка запуску сканера", err);
    });
}

// Спыніць сканер
function stopQRCodeScanner() {
    if (html5QrCode) {
        html5QrCode.stop()  // Спыніць сканер
            .then(() => {
                scannerContainer.style.display = "none";  // Схаваць відэа
                startScanButton.style.display = "block";  // Паказаць кнопку
                closeScanButton.style.display = "none";   // Схаваць кнопку закрыцця
            }).catch(err => {
                console.log("Памылка спынення сканера", err);
            });
    }
}

// Функцыя для закрыцця сканера
function closeQRCodeScanner() {
    stopQRCodeScanner();  // Спыніць сканер пры закрыцці
}

// Пачатак сканавання пры націску на кнопку
startScanButton.addEventListener("click", startQRCodeScanner);

// Закрыццё сканера пры націску на кнопку
closeScanButton.addEventListener("click", closeQRCodeScanner);
