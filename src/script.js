const qrcodeContainer = document.getElementById("qrcode");
const idtext = document.getElementById("id");
const rangtext = document.getElementById("rang");
const startScanButton = document.getElementById("startScanButton");
const closeScanButton = document.getElementById("closeScanButton");
const scannerContainer = document.getElementById("qr-code-scanner");

let html5QrCode; 

const userDataApiFetch = async () => {
    try {
        const response = await fetch("https://api.example.com/userdata"); // URL нашего сервера
        const userData = await response.json();
        return userData.map(user => ({
            name: user.name,
            uniqecode: user.uniqecode,
            currentNum: user.currentNum,
            totalNum: user.totalNum,
        }));
    } catch (error) {
        console.error("Fetch user data failed:", error);
    }
};

const rangFunc = (total) => {
    if (total < 0) {
        rangtext.innerHTML = "0";
    } else if (total < 20) {
        rangtext.innerHTML = "Рядовой";
    } else if (total >= 20) {
        rangtext.innerHTML = "Прапорщик";
    } else {
        rangtext.innerHTML = "Майор";
    }
};

function sendBumData(user, newCurrentNum, ggId) {
    const dataToSend = {
        myData: {
            unquecod: user.uniqecode,
            newCurrentNum: newCurrentNum,
        },
        ggData: {
            ggId: ggId,
        },
    };

    return fetch("https://api.example.com/test", { // URL нашего сервера
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Памылка сервера: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Адказ сервера:", data);
        })
        .catch(error => {
            console.error("Памылка запыту:", error);
        });
}

const bumСigarette = (decodedText, user) => {
    const newCurrentNum = user.currentNum - 1; 
    sendBumData(user, newCurrentNum, decodedText);
    user.currentNum = newCurrentNum; 
};

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
        correctLevel: QRCode.CorrectLevel.H,
    });
}

function startQRCodeScanner(user) {
    startScanButton.style.display = "none";
    closeScanButton.style.display = "block";
    scannerContainer.style.display = "block";

    html5QrCode = new Html5Qrcode("qr-code-scanner");

    html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
            console.log("Сканаваны тэкст:", decodedText);
            bumСigarette(decodedText, user); 
            stopQRCodeScanner();
        },
        (errorMessage) => {
            console.error("Памылка сканавання:", errorMessage);
        }
    ).catch(err => {
        console.log("Памылка запуску сканера", err);
    });
}


function stopQRCodeScanner() {
    if (html5QrCode) {
        html5QrCode.stop()
            .then(() => {
                scannerContainer.style.display = "none";
                startScanButton.style.display = "block";
                closeScanButton.style.display = "none";
            })
            .catch(err => {
                console.log("Памылка спынення сканера", err);
            });
    }
}


function closeQRCodeScanner() {
    stopQRCodeScanner();
}


startScanButton.addEventListener("click", async () => {
    const users = await userDataApiFetch();
    const user = users[0]; 
    idtext.innerHTML = user.uniqecode;
    
});

    rangFunc(user.totalNum);
    generateQRCode(user.uniqecode);
    startQRCodeScanner(user);
closeScanButton.addEventListener("click", closeQRCodeScanner);
