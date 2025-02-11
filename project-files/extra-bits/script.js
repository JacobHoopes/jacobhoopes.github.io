function handleIntersection(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in'); 
        } else {
            entry.target.classList.remove('fade-in');
        }
    });
}

const observer = new IntersectionObserver(handleIntersection, {
    root: document.getElementById('scroll-container'),
    threshold: 0.5
});

const fadeElement = document.getElementById('fade-element');

observer.observe(fadeElement);