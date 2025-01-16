const qrcodeContainer = document.getElementById("qrcode");
const idtext = document.getElementById("id");
const rangtext = document.getElementById("rang");
const startScanButton = document.getElementById("startScanButton");
const closeScanButton = document.getElementById("closeScanButton");
const scannerContainer = document.getElementById("qr-code-scanner");
const actualscore = document.getElementById("actualscore");
const logoutBut = document.getElementById("logoutBut");
const totalScoretext = document.getElementById("totalScore")
const mainBut = document.getElementById("mainBut");
const enterTextButton = document.getElementById("enterTextButton")
const enterUsername = document.getElementById("enterUsername");
const input_container = document.getElementById("input-container");
const closeEnterButton = document.getElementById("closeEnterButton")
const username = localStorage.getItem('username').toLocaleLowerCase();
const enterUsernameText = document.getElementById("enterUsernameText");

// console.log(username);

let html5QrCode;
let cameraWork = true;
let receivedCig = 0;
let socket;

const userDataApiFetch = async (username) => {
    try {
        const response = await fetch(`https://smokefieldserver.onrender.com/userdata/${username}`);
        if (!response.ok) {
            throw new Error(`HTTP памылка! статус: ${response.status}`);
        }
        const userData = await response.json();
        return userData;
    } catch (error) {
        console.error("Памылка атрымання дадзеных:", error);
        if (error.status === "923") {
            console.log("у самога сабе страляць нельга");
        }
        throw error;
    }
};
const rangFunc = (total) => {
    totalScoretext.innerHTML = total;
    let rank;
    if (total < 20) {
        rank = "Рядовой";
    } else if (total >= 20 && total < 50) {
        rank = "Ефрейтор";
    } else if (total >= 50 && total < 80) {
        rank = "Младший сержант";
    } else if (total >= 80 && total < 100) {
        rank = "Сержант";
    } else if (total >= 100 && total < 150) {
        rank = "Старший сержант";
    } else if (total >= 150 && total < 200) {
        rank = "Сержант первого класса";
    } else if (total >= 200 && total < 250) {
        rank = "Мастеровый сержант";
    } else if (total >= 250 && total < 300) {
        rank = "Первый сержант";
    } else if (total >= 300 && total < 400) {
        rank = "Сержант-майор";
    } else {
        rank = "Командирский сержант-майор";
    }
    rangtext.innerHTML = rank;
};

function generateQRCode(text) {
    if (typeof text !== "string" || !text.trim()) {
        console.error("Тэкст для QR-кода мусіць быць радком!");
        return;
    }
    qrcodeContainer.innerHTML = "";
    new QRCode(qrcodeContainer, {
        text: text,
        width: 270,
        height: 270,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
    });
}

function startQRCodeScanner(user) {
    closeScanButton.style.display = "block";
    startScanButton.style.display = "none";
    idtext.style.display = "none";
    qrcodeContainer.style.display = "none";
    rangtext.style.display = "none";
    mainBut.style.display = "block";
    scannerContainer.style.display = "block";
    closeEnterButton.style.display = "none";

    html5QrCode = new Html5Qrcode("qr-code-scanner");

    html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
            // console.log("Сканаваны тэкст:", decodedText);
            stopQRCodeScanner();
            bumСigarette(decodedText, username);
        },
        (errorMessage) => {
            cameraWork = true;
            // console.log("Памылка сканавання:", errorMessage);
        }
    ).catch(err => {
        cameraWork = false;
        // console.log("Памылка запуску сканера", err);
    });
}

function stopQRCodeScanner() {
    if (html5QrCode) {
        html5QrCode.stop()
            .then(() => {
                backMain();
            })
            .catch(err => {
                // console.log("Памылка спынення сканера", err);
            });
    }
}

function backMain(){
    scannerContainer.style.display = "none";
    startScanButton.style.display = "block";
    idtext.style.display = "block";
    rangtext.style.display = "block";
    qrcodeContainer.style.display = "flex";
    mainBut.style.display = "none";
}

function checkCamera(){
    if (cameraWork) {
        html5QrCode.stop()
    }
}

function closeQRCodeScanner() {
    checkCamera();
    backMain();
}

async function initializeUserData() {
    try {
        const user = await userDataApiFetch(username);
        actualscore.innerHTML = user.currentNum;
        idtext.innerHTML = user.uniqecode;
        rangFunc(user.totalNum);
        generateQRCode(user.uniqecode);
    } catch (error) {
        console.error("Памылка ініцыялізацыі дадзеных карыстальніка:", error);
    }
}



function sendBumData(user, ggId) {
    const dataToSend = {
        userGG: ggId,
        userBB: user
    };
    return fetch("https://smokefieldserver.onrender.com/updateuser", {
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
        // console.log("Адказ сервера:", data);
        return data;
    })
    .catch(error => {
        console.error("Памылка запыту:", error);
        throw error;
    });
}

function bumСigarette(decodedText, username) {
    sendBumData(username, decodedText)
        .then(() => {
            // console.log("Дадзеныя паспяхова адпраўлены.");
        })
        .catch(error => {
            console.error("Памылка адпраўкі дадзеных:", error);
        });
    if (socket) {
        sendCig(socket, decodedText, 1);
    } else {
        console.error("WebSocket не падключаны для адпраўкі цыгарэты.");
    }
}



function setupWebSocket(userId) {
    socket = new WebSocket("wss://smokefieldserver.onrender.com");
    socket.onopen = () => {
        console.log("WebSocket падключаны.");
        socket.send(JSON.stringify({ type: 'register', userId }));
    };
    socket.onmessage = (event) => {
        const messageData = JSON.parse(event.data);
        console.log("Паведамленне ад сервера:", messageData);
        if (messageData.cig !== undefined) {
            receivedCig = messageData.cig;
            // console.log("Атрыманае значэнне:", receivedCig);
            actualscore.innerHTML = parseInt(actualscore.innerHTML) + receivedCig;
        }
    };
    socket.onclose = () => {
        console.log("WebSocket адключаны.");
    };
    socket.onerror = (error) => {
        console.error("Памылка WebSocket:", error);
    };
    return socket;
}

function sendCig(socket, userGG, cigValue) {
    const dataToSend = {
        type: 'sendCig',
        userGG,
        cig: cigValue
    };
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(dataToSend));
        // console.log("Даныя адпраўлены:", dataToSend);
        actualscoreFun();
    } else {
        console.error("WebSocket не падключаны.");
    }
}

function actualscoreFun() {
    actualscore.innerHTML = actualscore.innerHTML - 1;
}

function enterText() {
    enterTextButton.style.display = 'none';
    closeEnterButton.style.display = "block";
    closeScanButton.style.display = "none";
    scannerContainer.style.display = "none";
    input_container.style.display = "flex";
}

initializeUserData().then(() => {
    setupWebSocket(username);
});
enterTextButton.addEventListener("click", function(){
    checkCamera();
    enterText();
})

document.getElementById("menuBut").addEventListener("click", function() {
    var menu = document.getElementById("menu");
    menu.style.transform = "translateX(0)";
    menu.style.display = "block";
});

document.getElementById("closeMenu").addEventListener("click", function() {
    var menu = document.getElementById("menu");
    menu.style.transform = "translateX(-100%)";
    setTimeout(function() {
        menu.style.display = "none";
    }, 300);
});


closeEnterButton.addEventListener("click", function() {
    input_container.style.display = "none";
    backMain();
});

logoutBut.addEventListener("click", () => {
    localStorage.removeItem('username');
    window.location.href = '../page/index.html';
});

startScanButton.addEventListener("click", async () => {
    enterTextButton.style.display = "block";
    const users = await userDataApiFetch(username);
    const user = users[0];
    startQRCodeScanner(user);
});

enterUsernameText.addEventListener("click", () => {
    bumСigarette(document.getElementById("enterUsername").value.toLowerCase(), username)
    input_container.style.display = "none";
    backMain();
});
closeScanButton.addEventListener("click", closeQRCodeScanner);