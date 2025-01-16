document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("loginUsername").value.toLowerCase(); // Замяняем на юзернэйм
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
           
            localStorage.setItem('username', username.toLowerCase());
            window.location.href = '../page/base.html'
        } else {
            alert(data.message || 'Login failed. Please check your credentials.');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('Error during login. Please try again.');
    }
});

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Блакуем стандартнае падзею, каб не паказваць стандартны дыялог
    e.preventDefault();
    deferredPrompt = e;

    // Паказваем кнопку ўстаноўкі
    const installButton = document.getElementById('installButton');
    installButton.style.display = 'block';

    installButton.addEventListener('click', () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            console.log(choiceResult.outcome);
            deferredPrompt = null;
        });
    });
});


if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('../swt.js')
            .then((registration) => {
                console.log('Service Worker registered with scope: ', registration.scope);
            })
            .catch((error) => {
                console.log('Service Worker registration failed: ', error);
            });
    });
}
