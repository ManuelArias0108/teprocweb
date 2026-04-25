document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling effect for navigation links
    const links = document.querySelectorAll('.navbar a');
    links.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = e.target.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            window.scrollTo({
                top: targetSection.offsetTop - 50,
                behavior: 'smooth'
            });
        });
    });

    // Animación en secciones al hacer scroll
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('fade-in');
        });
    });

    sections.forEach(section => observer.observe(section));

    // Galería interactiva: desplazamiento automático y con botones
    const galleryContainer = document.querySelector('.gallery-container');
    const nextButton = document.querySelector('.btn.next');
    const prevButton = document.querySelector('.btn.prev');
    let scrollPosition = 0;
    let autoScroll;

    // Tamaño de desplazamiento (basado en el ancho de cada imagen + espacio entre ellas)
    const imageWidth = 320; // Ancho fijo de las imágenes (300px + 20px de margen)
    const gap = 20; // Espaciado entre imágenes
    const totalScrollWidth = imageWidth + gap;

    // Función para desplazarse a la derecha
    const scrollRight = () => {
        scrollPosition -= totalScrollWidth;
        if (Math.abs(scrollPosition) >= galleryContainer.scrollWidth) {
            scrollPosition = 0; // Reinicia el desplazamiento al inicio
        }
        galleryContainer.style.transform = `translateX(${scrollPosition}px)`;
    };

    // Función para desplazarse a la izquierda
    const scrollLeft = () => {
        if (scrollPosition === 0) {
            scrollPosition = -(galleryContainer.scrollWidth - galleryContainer.offsetWidth); // Salta al final
        } else {
            scrollPosition += totalScrollWidth;
        }
        galleryContainer.style.transform = `translateX(${scrollPosition}px)`;
    };

    // Inicia el desplazamiento automático
    const startAutoScroll = () => {
        autoScroll = setInterval(scrollRight, 3000); // Cambia cada 3 segundos
    };

    // Detiene el desplazamiento automático
    const stopAutoScroll = () => {
        clearInterval(autoScroll);
    };

    // Eventos de botones
    nextButton.addEventListener('click', () => {
        stopAutoScroll();
        scrollRight();
        startAutoScroll(); // Reinicia el desplazamiento automático
    });

    prevButton.addEventListener('click', () => {
        stopAutoScroll();
        scrollLeft();
        startAutoScroll(); // Reinicia el desplazamiento automático
    });

    // Inicia el carrusel automáticamente al cargar la página
    startAutoScroll();

    // Formulario de contacto
    const contactForm = document.getElementById('contact-form');
    const statusMessage = document.getElementById('status-message');

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        statusMessage.textContent = 'Enviando...';

        emailjs.sendForm('service_bj92xu9', 'template_mjnmidr', this, 'ill7upUh3QWWqGWew')
            .then(() => {
                statusMessage.textContent = '¡Mensaje enviado con éxito!';
                contactForm.reset(); // Limpia el formulario después de enviarlo
            }, (error) => {
                console.error('Error:', error);
                statusMessage.textContent = 'Hubo un error. Intenta nuevamente.';
            });
    });

// Búsqueda de informes
const reportForm = document.getElementById('report-form');
const reportResult = document.getElementById('report-result');
const scriptUrl = 'https://script.google.com/macros/s/AKfycbzMkkaOeZTX9ZgUULY9fOnYxH7VmHXs4mBAC9xyx_2b2yDJHL43CQAlGpO1hU6iFBn9/exec';

reportForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const code = document.getElementById('report-code').value.trim();
    const requestData = { code: code };

    try {
        const response = await fetch(scriptUrl, {
            method: 'POST',
            redirect: 'follow',
            body: JSON.stringify(requestData),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) throw new Error('Error en la respuesta');

        const data = await response.json(); // Procesar como JSON

        if (data.status === "success" && data.files.length > 0) {
            reportResult.innerHTML = `
                <p>Archivo encontrado. Puedes descargarlo aquí:</p>
                <a href="${data.files[0]}" target="_blank" download>Descargar Informe</a>
            `;
        } else {
            reportResult.innerHTML = `<p style="color: red;">Código no válido. Intenta nuevamente.</p>`;
        }
    } catch (error) {
        console.error('Error:', error);
        reportResult.innerHTML = `<p style="color: red;">Hubo un error al realizar la búsqueda. Intenta nuevamente.</p>`;
    }
});


});