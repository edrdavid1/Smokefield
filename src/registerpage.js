document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("registerName").value;
    const name = document.getElementById("registerName").value;  // Дадаём name
    const email = document.getElementById("registerEmail").value; // Не выкарыстоўваем email на серверы, але яго можна захоўваць у базе для іншых мэт
    const password = document.getElementById("registerPassword").value;

    try {
        const response = await fetch('https://smokefieldserver.onrender.com/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, name, email })  // Fix: changed 'emeil' to 'email'
        });

        const data = await response.json();

        if (response.ok) {
            window.location.href = 'index.html';
            alert('Registration successful! Please check your email to confirm your account.');
        } else {
            alert(data.message || 'Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('Error during registration. Please try again.');
    }
});

