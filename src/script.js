const qrcodeContainer = document.getElementById("qrcode");
const idtext = document.getElementById("id");
const rangtext = document.getElementById("rang");
const startScanButton = document.getElementById("startScanButton");
const closeScanButton = document.getElementById("closeScanButton");
const scannerContainer = document.getElementById("qr-code-scanner");

let html5QrCode; 

const userDataApiFetch = async () => {
    try {
        const response = await fetch("http://localhost:3000/userdata");
        if (!response.ok) {
            throw new Error(`HTTP памылка! статус: ${response.status}`);
        }
        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error("Памылка атрымання дадзеных:", error);
        throw error;
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
        uniqecode: user.uniqecode,
        newCurrentNum: newCurrentNum
    };

    return fetch("http://localhost:3000/updateuser", {
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
        return data;
    })
    .catch(error => {
        console.error("Памылка запыту:", error);
        throw error;
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
    startQRCodeScanner(user);
});


closeScanButton.addEventListener("click", closeQRCodeScanner);


// Ініцыялізацыя пачатковых дадзеных
async function initializeUserData() {
    const users = await userDataApiFetch();
    const user = users[0];
    
    idtext.innerHTML = user.uniqecode;
    rangFunc(user.totalNum);
    generateQRCode(user.uniqecode);
}

// Выклікаем ініцыялізацыю пры загрузцы
initializeUserData();
    
