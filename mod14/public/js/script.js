document.addEventListener('DOMContentLoaded', (event) => {

    const deleteButtons = document.querySelectorAll('.delete-post-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (!confirm("Are you sure you want to delete this post?")) {
                e.preventDefault();
            }
        });
    });

    const logoutLink = document.querySelector('a[href="/logout"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            fetch('/logout', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {
                if (data) {
                    window.location.href = '/login';
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        });
    }
});
