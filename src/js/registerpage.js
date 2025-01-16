document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Атрыманне дадзеных з формы
    const usernameInput = document.getElementById("registerName").value;
    const emailInput = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    // Зводзім да ніжняга рэгістру
    const username = usernameInput.toLowerCase();
    const name = usernameInput; // Калі name і username павінны быць рознымі, змяніце адпаведна
    const email = emailInput.toLowerCase();

    // Праверка, ці ўсе палі запоўнены
    if (!username || !name || !email || !password) {
        document.getElementById("errorMessage").textContent = 'Усе палі абавязковыя для запаўнення.';
        document.getElementById("errorMessage").style.display = 'block';
        return;
    }

    // Захоўваем email для пацверджання
    registeredEmail = email;

    try {
        const response = await fetch('https://smokefieldserver.onrender.com/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                username, 
                password, 
                name, 
                email 
            }),
        });

        const data = await response.json();

        if (response.ok) {
            // Паказваем акно для ўводу кода
            document.getElementById("registerForm").style.display = 'none';
            document.getElementById("confirmationCodeSection").style.display = 'block';
        } else {
            document.getElementById("errorMessage").textContent = data.message || 'Рэгістрацыя не ўдалася. Паспрабуйце зноў.';
            document.getElementById("errorMessage").style.display = 'block';
        }
    } catch (error) {
        console.error('Error during registration:', error);
        document.getElementById("errorMessage").textContent = 'Адбылася памылка. Паспрабуйце пазней.';
        document.getElementById("errorMessage").style.display = 'block';
    }
});


document.getElementById("confirmEmailButton").addEventListener("click", async function () {
    const confirmationCode = document.getElementById("confirmationCode").value;

    if (!confirmationCode) {
      
        return;
    }

    console.log(registeredEmail, confirmationCode);
    try {
        const response = await fetch('https://smokefieldserver.onrender.com/confirm-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: registeredEmail, confirmationCode }) // Выкарыстоўваем захаваны email
        });

        const data = await response.json();

        if (response.ok) {
            alert('Email confirmed successfully!');
            window.location.href = 'index.html';
        } else {
           
            console.log(registeredEmail, confirmationCode);
        }
    } catch (error) {
        console.error('Error during email confirmation:', error);
       
    }
});
