document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("loginUsername").value; // Замяняем на юзернэйм
    const password = document.getElementById("loginPassword").value;

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }) // Адпраўляць username, а не email
        });

        const data = await response.json();

        if (response.ok) {
           
            localStorage.setItem('username', username);
            window.location.href = 'base.html'
        } else {
            alert(data.message || 'Login failed. Please check your credentials.');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('Error during login. Please try again.');
    }
});
