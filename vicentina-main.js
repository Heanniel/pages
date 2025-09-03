// ======================================= //
// FUNCIONALIDAD PRINCIPAL DE VICENTINA //
// ======================================= //

// Variables globales para cada carrusel
const carousels = {
  kids: { currentSlide: 0, totalSlides: 10 },
  women: { currentSlide: 0, totalSlides: 23 },
  men: { currentSlide: 0, totalSlides: 34 },
  lingerie: { currentSlide: 0, totalSlides: 36 },
  featured: { currentSlide: 0, totalSlides: 29 }
};

// Sistema de carrito
let cart = [];

// Función para agregar artículos al carrito
function addToCart(articleId, category, description) {
  const existingItem = cart.find(item => item.id === articleId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: articleId,
      category: category,
      description: description,
      quantity: 1
    });
  }
  
  updateCartDisplay();
  showCartNotification(articleId);
}

// Función para remover artículos del carrito
function removeFromCart(articleId) {
  cart = cart.filter(item => item.id !== articleId);
  updateCartDisplay();
}

// Función para actualizar la cantidad de un artículo
function updateQuantity(articleId, newQuantity) {
  const item = cart.find(item => item.id === articleId);
  if (item) {
    if (newQuantity <= 0) {
      removeFromCart(articleId);
    } else {
      item.quantity = newQuantity;
      updateCartDisplay();
    }
  }
}

// Función para mostrar notificación de artículo agregado
function showCartNotification(articleId) {
  const notification = document.createElement('div');
  notification.className = 'cart-notification';
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">✅</span>
      <span class="notification-text">Artículo ${articleId} agregado al carrito</span>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Animar la notificación
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  // Remover después de 3 segundos
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Función para actualizar la visualización del carrito
function updateCartDisplay() {
  const cartCount = document.getElementById('cart-count');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const cartEmpty = document.getElementById('cart-empty');
  
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'block' : 'none';
  }
  
  if (cartItems) {
    cartItems.innerHTML = '';
    cart.forEach(item => {
      const cartItem = document.createElement('div');
      cartItem.className = 'cart-item';
      cartItem.innerHTML = `
        <div class="cart-item-info">
          <span class="cart-item-id">${item.id}</span>
          <span class="cart-item-category">${item.category}</span>
        </div>
        <div class="cart-item-controls">
          <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})" class="quantity-btn">-</button>
          <span class="quantity">${item.quantity}</span>
          <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})" class="quantity-btn">+</button>
          <button onclick="removeFromCart('${item.id}')" class="remove-btn">🗑️</button>
        </div>
      `;
      cartItems.appendChild(cartItem);
    });
  }
  
  if (cartTotal) {
    cartTotal.textContent = cart.length;
  }
  
  // Mostrar/ocultar mensaje de carrito vacío
  if (cartEmpty) {
    cartEmpty.style.display = cart.length === 0 ? 'block' : 'none';
  }
}

// Función para generar mensaje de WhatsApp
function generateWhatsAppMessage() {
  if (cart.length === 0) {
    alert('Tu carrito está vacío. Agrega algunos artículos primero.');
    return;
  }
  
  let message = '¡Hola! Me interesan los siguientes artículos de Vicentina:\n\n';
  
  // Agrupar por categoría
  const groupedCart = {};
  cart.forEach(item => {
    if (!groupedCart[item.category]) {
      groupedCart[item.category] = [];
    }
    groupedCart[item.category].push(item);
  });
  
  // Construir mensaje por categorías
  Object.keys(groupedCart).forEach(category => {
    message += `📂 ${category}:\n`;
    groupedCart[category].forEach(item => {
      message += `• Artículo #${item.id} (${item.description}) - Cantidad: ${item.quantity}\n`;
    });
    message += '\n';
  });
  
  message += '¿Podrían darme más información sobre disponibilidad y precios? ¡Gracias!';
  
  // Codificar mensaje para URL
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/+584245794208?text=${encodedMessage}`;
  
  // Abrir WhatsApp
  window.open(whatsappUrl, '_blank');
}

// Función para limpiar el carrito
function clearCart() {
  cart = [];
  updateCartDisplay();
}

// Función para mostrar/ocultar el carrito
function toggleCart() {
  const cartModal = document.getElementById('cart-modal');
  const cartEmpty = document.getElementById('cart-empty');
  
  if (cartModal.classList.contains('show')) {
    cartModal.classList.remove('show');
  } else {
    cartModal.classList.add('show');
    // Mostrar/ocultar mensaje de carrito vacío
    if (cart.length === 0) {
      cartEmpty.style.display = 'block';
    } else {
      cartEmpty.style.display = 'none';
    }
  }
}

// Función para cambiar de slide
function changeSlide(carouselId, direction) {
  const carousel = carousels[carouselId];
  const carouselElement = document.getElementById(`${carouselId}-carousel`);
  
  if (!carouselElement) return;

  // Obtener la flecha derecha para aplicar efectos visuales
  const nextArrow = carouselElement.parentElement.querySelector('.carousel-arrow.next');
  
  // Calcular el nuevo slide moviendo 4 artículos a la vez
  const itemsPerSlide = 4;
  carousel.currentSlide += direction * itemsPerSlide;
  
  // Manejar el bucle con animación especial para la flecha derecha
  if (carousel.currentSlide >= carousel.totalSlides) {
    // Animación especial cuando se llega al final con la flecha derecha
    if (direction > 0) {
      // Aplicar efecto visual a la flecha derecha
      if (nextArrow) {
        nextArrow.classList.add('at-end');
        // Remover la clase después de la animación
        setTimeout(() => {
          nextArrow.classList.remove('at-end');
        }, 600);
      }
      
      // Primero ir al final para mostrar la transición
      const slideWidth = 220 + 25; // ancho de la tarjeta + gap
      const finalPosition = (carousel.totalSlides - 1) * slideWidth;
      
      carouselElement.scrollTo({
        left: finalPosition,
        behavior: 'smooth'
      });
      
      // Después de un breve delay, ir al inicio con animación
      setTimeout(() => {
        carousel.currentSlide = 0;
        carouselElement.scrollTo({
          left: 0,
          behavior: 'smooth'
        });
      }, 300);
      return;
    } else {
      carousel.currentSlide = 0;
    }
  } else if (carousel.currentSlide < 0) {
    carousel.currentSlide = Math.max(0, carousel.totalSlides - itemsPerSlide);
  }

  // Calcular el scroll para movimientos normales
  const slideWidth = 220 + 25; // ancho de la tarjeta + gap
  const scrollPosition = carousel.currentSlide * slideWidth;
  
  // Aplicar el scroll
  carouselElement.scrollTo({
    left: scrollPosition,
    behavior: 'smooth'
  });
}

// Función para manejar el scroll del carrusel
function handleCarouselScroll(carouselId) {
  const carouselElement = document.getElementById(`${carouselId}-carousel`);
  const carousel = carousels[carouselId];
  
  if (!carouselElement) return;

  carouselElement.addEventListener('scroll', () => {
    const slideWidth = 220 + 25; // ancho de la tarjeta + gap
    const itemsPerSlide = 4;
    const scrollPosition = carouselElement.scrollLeft;
    const currentSlide = Math.round(scrollPosition / slideWidth);
    
    // Ajustar para que el slide actual sea múltiplo de 4
    const adjustedSlide = Math.floor(currentSlide / itemsPerSlide) * itemsPerSlide;
    
    if (adjustedSlide !== carousel.currentSlide) {
      carousel.currentSlide = adjustedSlide;
    }
  });
}

// Función para habilitar el arrastre del carrusel
function enableCarouselDrag(carouselId) {
  const carouselElement = document.getElementById(`${carouselId}-carousel`);
  if (!carouselElement) return;

  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID = 0;
  let currentIndex = 0;

  // Eventos para mouse
  carouselElement.addEventListener('mousedown', dragStart);
  carouselElement.addEventListener('mousemove', drag);
  carouselElement.addEventListener('mouseup', dragEnd);
  carouselElement.addEventListener('mouseleave', dragEnd);

  // Eventos para touch
  carouselElement.addEventListener('touchstart', dragStart);
  carouselElement.addEventListener('touchmove', drag);
  carouselElement.addEventListener('touchend', dragEnd);

  // Prevenir selección de texto durante el arrastre
  carouselElement.addEventListener('selectstart', (e) => e.preventDefault());

  function dragStart(event) {
    isDragging = true;
    startPos = getPositionX(event);
    animationID = requestAnimationFrame(animation);
    carouselElement.style.cursor = 'grabbing';
    carouselElement.style.userSelect = 'none';
  }

  function drag(event) {
    if (!isDragging) return;
    
    const currentPosition = getPositionX(event);
    const diff = currentPosition - startPos;
    
    // Solo permitir arrastre horizontal y limitar el movimiento
    if (Math.abs(diff) > 10) {
      currentTranslate = prevTranslate + diff;
      // Limitar el arrastre para no interferir con las flechas
      if (Math.abs(currentTranslate) < 200) {
        // Aplicar transform solo al contenedor del carrusel, no a las flechas
        const carouselCards = carouselElement.querySelector('.product-cards');
        if (carouselCards) {
          carouselCards.style.transform = `translateX(${currentTranslate}px)`;
        }
      }
    }
  }

  function dragEnd() {
    isDragging = false;
    cancelAnimationFrame(animationID);
    
    const movedBy = currentTranslate - prevTranslate;
    
    // Determinar si se debe cambiar de slide
    if (Math.abs(movedBy) > 100) {
      if (movedBy < 0) {
        // Arrastre hacia la izquierda (siguiente slide)
        changeSlide(carouselId, 1);
      } else {
        // Arrastre hacia la derecha (slide anterior)
        changeSlide(carouselId, -1);
      }
    }
    
    // Siempre limpiar el transform del contenedor del carrusel
    const carouselCards = carouselElement.querySelector('.product-cards');
    if (carouselCards) {
      carouselCards.style.transform = '';
    }
    carouselElement.style.cursor = 'grab';
    carouselElement.style.userSelect = 'auto';
    currentTranslate = 0;
    prevTranslate = 0;
  }

  function animation() {
    const carouselCards = carouselElement.querySelector('.product-cards');
    if (carouselCards) {
      carouselCards.style.transform = `translateX(${currentTranslate}px)`;
    }
    if (isDragging) {
      requestAnimationFrame(animation);
    }
  }

  function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  }
}

// Función para desplazamiento suave a secciones
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    // Calcular la posición considerando el navbar fijo
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    const sectionPosition = section.offsetTop - navbarHeight - 20; // 20px de margen adicional
    
    // Aplicar desplazamiento suave
    window.scrollTo({
      top: sectionPosition,
      behavior: 'smooth'
    });
    
    // Agregar efecto visual al enlace clickeado
    const clickedLink = event.target;
    if (clickedLink) {
      clickedLink.style.transform = 'scale(0.95)';
      clickedLink.style.transition = 'transform 0.2s ease';
      
      setTimeout(() => {
        clickedLink.style.transform = 'scale(1)';
      }, 200);
    }
  }
}

// Función para recargar la página
function reloadPage() {
  // Agregar efecto visual antes de recargar
  const brandElement = document.querySelector('.navbar-brand h2');
  if (brandElement) {
    brandElement.style.transform = 'scale(0.9)';
    brandElement.style.transition = 'transform 0.2s ease';
    
    setTimeout(() => {
      brandElement.style.transform = 'scale(1)';
      // Recargar la página después del efecto visual
      setTimeout(() => {
        window.location.reload();
      }, 200);
    }, 100);
  } else {
    // Si no se encuentra el elemento, recargar directamente
    window.location.reload();
  }
}

// Función para manejar el envío del formulario de contacto
function handleContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Aquí puedes agregar la lógica para enviar el formulario
      alert('¡Gracias por tu mensaje! Te contactaremos pronto.');
      
      // Limpiar el formulario
      contactForm.reset();
    });
  }
}

// Función para inicializar todos los componentes
function initializeVicentina() {
  // Inicializar cada carrusel
  Object.keys(carousels).forEach(carouselId => {
    handleCarouselScroll(carouselId);
    enableCarouselDrag(carouselId);
  });

  // Inicializar el formulario de contacto
  handleContactForm();

  // Agregar efectos de scroll suave para enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      scrollToSection(targetId);
    });
  });

  // Agregar efectos de hover para las tarjetas de productos
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.zIndex = '10';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.zIndex = '1';
    });
  });

  // Agregar efectos de focus para accesibilidad
  document.querySelectorAll('.carousel-arrow').forEach(arrow => {
    arrow.addEventListener('focus', function() {
      this.style.transform = 'translateY(-50%) scale(1.1)';
      this.style.boxShadow = '0 5px 20px rgba(255, 255, 255, 0.4)';
    });
    
    arrow.addEventListener('blur', function() {
      this.style.transform = 'translateY(-50%) scale(1)';
      this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
    });
  });

  // Agregar efectos de teclado para navegación
  document.addEventListener('keydown', function(e) {
    // Navegación con flechas del teclado
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const activeCarousel = document.querySelector('.product-cards:hover');
      if (activeCarousel) {
        const carouselId = activeCarousel.id.replace('-carousel', '');
        const direction = e.key === 'ArrowLeft' ? -1 : 1;
        changeSlide(carouselId, direction);
      }
    }
  });

  // Agregar efectos de scroll para el navbar
  let lastScrollTop = 0;
  window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (currentScrollTop > lastScrollTop && currentScrollTop > 100) {
      // Scrolling down
      navbar.style.transform = 'translateY(-100%)';
    } else {
      // Scrolling up
      navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = currentScrollTop;
  });

  // Agregar efectos de carga para las imágenes
  document.querySelectorAll('.card-image img').forEach(img => {
    img.addEventListener('load', function() {
      this.style.opacity = '1';
      this.style.transform = 'scale(1)';
    });
    
    img.addEventListener('error', function() {
      this.style.opacity = '0.7';
      this.style.filter = 'grayscale(100%)';
    });
  });

  // Agregar efectos de hover para los botones sociales
  document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-3px) scale(1.05)';
    });
    
    btn.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Agregar efectos de hover para el botón de WhatsApp
  const whatsappBtn = document.querySelector('.whatsapp-float');
  if (whatsappBtn) {
    whatsappBtn.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.1)';
    });
    
    whatsappBtn.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  }

  // Agregar efectos de scroll para las secciones
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.section-category').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });

  console.log('Vicentina inicializada correctamente');
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initializeVicentina);

// Inicializar también cuando la ventana se cargue completamente
window.addEventListener('load', function() {
  // Asegurar que todas las imágenes estén cargadas
  const images = document.querySelectorAll('img');
  let loadedImages = 0;
  
  images.forEach(img => {
    if (img.complete) {
      loadedImages++;
    } else {
      img.addEventListener('load', function() {
        loadedImages++;
        if (loadedImages === images.length) {
          console.log('Todas las imágenes han sido cargadas');
        }
      });
    }
  });
  
  if (loadedImages === images.length) {
    console.log('Todas las imágenes ya estaban cargadas');
  }
});

// Exportar funciones para uso global
window.Vicentina = {
  changeSlide,
  scrollToSection,
  reloadPage,
  initializeVicentina,
  addToCart,
  removeFromCart,
  updateQuantity,
  generateWhatsAppMessage,
  clearCart,
  toggleCart
};
