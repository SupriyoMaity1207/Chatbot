
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'dark-mode';
    document.body.classList.add(currentTheme);

    themeToggle.addEventListener('click', function () {
        if (document.body.classList.contains('dark-mode')) {
            document.body.classList.replace('dark-mode', 'light-mode');
            themeToggle.classList.replace('btn-dark', 'btn-light');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'light-mode');
        } else {
            document.body.classList.replace('light-mode', 'dark-mode');
            themeToggle.classList.replace('btn-light', 'btn-dark');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'dark-mode');
        }
    });

    // Set the initial theme button icon
    if (currentTheme === 'light-mode') {
        themeToggle.classList.replace('btn-dark', 'btn-light');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeToggle.classList.replace('btn-light', 'btn-dark');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }

