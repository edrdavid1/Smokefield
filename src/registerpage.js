let registeredEmail = "";  // Дадаць змянную для захоўвання email

document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("registerName").value;
    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    if (!username || !name || !email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    registeredEmail = email;  // Захоўваем email

    try {
        const response = await fetch('https://smokefieldserver.onrender.com/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, name, email })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registration successful! Please check your email to confirm your account.');
            
            // Паказваем акно для ўводу кода
            document.getElementById("registerForm").style.display = 'none';
            document.getElementById("confirmationCodeSection").style.display = 'block';
        } else {
            alert(data.message || 'Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('Error during registration. Please try again.');
    }
});

document.getElementById("confirmEmailButton").addEventListener("click", async function () {
    const confirmationCode = document.getElementById("confirmationCode").value;

    if (!confirmationCode) {
        alert("Please enter the confirmation code.");
        return;
    }

    try {
        const response = await fetch('https://smokefieldserver.onrender.com/confirm-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: registeredEmail, confirmationCode })  // Выкарыстоўваем захаваны email
        });

        const data = await response.json();

        if (response.ok) {
            alert('Email confirmed successfully!');
            window.location.href = 'index.html';
        } else {
            alert(data.message || 'Failed to confirm email. Please try again.');
        }
    } catch (error) {
        console.error('Error during email confirmation:', error);
        alert('Error during email confirmation. Please try again.');
    }
});
