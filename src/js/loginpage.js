document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("loginUsername").value; // Замяняем на юзернэйм
    const password = document.getElementById("loginPassword").value;

    try {
        const response = await fetch('https://smokefieldserver.onrender.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }) // Адпраўляць username, а не email
        });

        const data = await response.json();

        if (response.ok) {
           
            localStorage.setItem('username', username);
            window.location.href = '../page/base.html'
        } else {
            alert(data.message || 'Login failed. Please check your credentials.');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('Error during login. Please try again.');
    }
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('../sw.js')
            .then((registration) => {
                console.log('Service Worker registered with scope: ', registration.scope);
            })
            .catch((error) => {
                console.log('Service Worker registration failed: ', error);
            });
    });
}
