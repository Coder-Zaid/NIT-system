// Language Management
const languageSwitcher = document.getElementById('language-switcher');
let currentLanguage = localStorage.getItem('language') || 'en';

// Set initial language
function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    
    // Update all translatable elements
    document.querySelectorAll('[data-en], [data-ar]').forEach(element => {
        if (element.tagName === 'TITLE') {
            element.textContent = element.getAttribute(`data-${lang}`) || element.getAttribute('data-en');
        } else {
            const text = element.getAttribute(`data-${lang}`) || element.getAttribute('data-en');
            if (text) element.textContent = text;
            
            // Handle HTML content
            if (element.hasAttribute('data-en-html') || element.hasAttribute('data-ar-html')) {
                const html = element.getAttribute(`data-${lang}-html`) || element.getAttribute('data-en-html');
                if (html) element.innerHTML = html;
            }
        }
    });

    // Toggle RTL classes if needed
    document.body.classList.toggle('rtl', lang === 'ar');
    document.body.classList.toggle('ltr', lang !== 'ar');
}

// Toggle between languages
function toggleLanguage() {
    const newLang = currentLanguage === 'en' ? 'ar' : 'en';
    setLanguage(newLang);
}

// Initialize language
setLanguage(currentLanguage);

// Event Listeners
if (languageSwitcher) {
    languageSwitcher.addEventListener('click', toggleLanguage);
}

// Mobile menu toggle
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const mobileMenu = document.createElement('div');
mobileMenu.className = 'mobile-menu hidden md:hidden fixed inset-0 bg-white z-50 flex flex-col items-center justify-center';
mobileMenu.innerHTML = `
    <button class="absolute top-6 right-6 text-2xl">
        <i class="fas fa-times"></i>
    </button>
    <nav class="flex flex-col items-center space-y-8">
        <a href="#" class="text-2xl font-medium hover:text-primary nav-link" data-en="Home" data-ar="الرئيسية">Home</a>
        <a href="#about" class="text-2xl font-medium hover:text-primary nav-link" data-en="About" data-ar="من نحن">About</a>
        <a href="#services" class="text-2xl font-medium hover:text-primary nav-link" data-en="Services" data-ar="خدماتنا">Services</a>
        <a href="#contact" class="btn-primary text-lg px-8 py-3" data-en="Contact Us" data-ar="اتصل بنا">Contact Us</a>
    </nav>
`;

document.body.appendChild(mobileMenu);

// Toggle mobile menu
function toggleMobileMenu() {
    mobileMenu.classList.toggle('hidden');
    document.body.style.overflow = document.body.style.overflow === 'hidden' ? '' : 'hidden';
}

// Event listeners
mobileMenuButton.addEventListener('click', toggleMobileMenu);
mobileMenu.querySelector('button').addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking on a link
const mobileLinks = mobileMenu.querySelectorAll('a');
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        document.body.style.overflow = '';
    });
});

// Navbar scroll effect
const navbar = document.querySelector('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add shadow when scrolling down
    if (currentScroll > 50) {
        navbar.classList.add('shadow-md');
        navbar.classList.add('bg-white');
        navbar.classList.remove('bg-transparent');
    } else {
        navbar.classList.remove('shadow-md');
        navbar.classList.add('bg-transparent');
        navbar.classList.remove('bg-white');
    }
    
    // Hide navbar on scroll down, show on scroll up
    if (currentScroll <= 0) {
        navbar.style.transform = 'translateY(0)';
        return;
    }
    
    if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
        // Scroll down
        navbar.style.transform = 'translateY(-100%)';
        navbar.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
        // Scroll up
        navbar.style.transform = 'translateY(0)';
        navbar.classList.remove('scroll-down');
    }
    
    lastScroll = currentScroll;
});

// Back to top button
const backToTopButton = document.createElement('div');
backToTopButton.className = 'fixed bottom-8 right-8 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white cursor-pointer opacity-0 invisible transition-all duration-300';
backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
document.body.appendChild(backToTopButton);

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.remove('opacity-0', 'invisible');
        backToTopButton.classList.add('opacity-100', 'visible');
    } else {
        backToTopButton.classList.remove('opacity-100', 'visible');
        backToTopButton.classList.add('opacity-0', 'invisible');
    }
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all elements with fade-in class
document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Adjust for fixed header
                behavior: 'smooth'
            });
        }
    });
});

// Form validation
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic form validation
        const name = this.querySelector('input[name="name"]');
        const email = this.querySelector('input[name="email"]');
        const message = this.querySelector('textarea[name="message"]');
        let isValid = true;
        
        // Reset error states
        [name, email, message].forEach(field => {
            field.classList.remove('border-red-500');
            const errorElement = field.nextElementSibling;
            if (errorElement && errorElement.classList.contains('text-red-500')) {
                errorElement.remove();
            }
        });
        
        // Validate name
        if (!name.value.trim()) {
            showError(name, 'Name is required');
            isValid = false;
        }
        
        // Validate email
        if (!email.value.trim()) {
            showError(email, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email');
            isValid = false;
        }
        
        // Validate message
        if (!message.value.trim()) {
            showError(message, 'Message is required');
            isValid = false;
        }
        
        if (isValid) {
            // Here you would typically send the form data to a server
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        }
    });
    
    function showError(field, message) {
        field.classList.add('border-red-500');
        const errorElement = document.createElement('p');
        errorElement.className = 'text-red-500 text-sm mt-1';
        errorElement.textContent = message;
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}

// Add animation delay to elements
function addAnimationDelays() {
    const elements = document.querySelectorAll('[data-animation-delay]');
    elements.forEach(element => {
        const delay = element.getAttribute('data-animation-delay');
        element.style.animationDelay = `${delay}ms`;
    });
}

// Initialize
addAnimationDelays();

// Preloader
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

// === Splash Screen Animation ===
window.addEventListener('DOMContentLoaded', function() {
  const splash = document.getElementById('splash-screen');
  const logo = document.getElementById('nit-logo');
  if (!splash || !logo) return;

  // Only run splash on first load (not on reloads/navigations)
  if (!sessionStorage.getItem('nitSplashShown')) {
    sessionStorage.setItem('nitSplashShown', '1');
    // Animate logo: fade in, scale up
    if (window.gsap) {
      gsap.set(logo, {opacity: 1, scale: 0.8});
      gsap.timeline()
        .to(logo, {opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out'})
        .to(logo, {scale: 1.1, duration: 0.3, yoyo: true, repeat: 1, ease: 'power1.inOut'}, '-=0.2')
        .to(splash, {opacity: 0, clipPath: 'inset(0 0 100% 0)', duration: 0.7, ease: 'power2.in'}, '+=0.7')
        .add(() => splash.remove());
    } else {
      // Fallback: simple fade/scale
      logo.style.opacity = 1;
      logo.style.transition = 'opacity 0.7s, transform 0.7s';
      logo.style.transform = 'scale(1)';
      setTimeout(() => {
        splash.style.opacity = 0;
        splash.style.transition = 'opacity 0.7s';
        setTimeout(() => splash.remove(), 700);
      }, 1800);
    }
  } else {
    splash.remove();
  }
});

// === Hero Section Page Load Animation ===
window.addEventListener('DOMContentLoaded', function() {
  // Splash logic already above
  if (window.gsap) {
    // Hero text reveal
    const heroTitle = document.querySelector('.hero-reveal');
    if (heroTitle) {
      gsap.to(heroTitle, {
        clipPath: 'inset(0 0 0% 0)',
        opacity: 1,
        duration: 1.1,
        ease: 'power2.out',
        delay: 0.2
      });
    }
    // Staggered fade-in-up for subtext, buttons, image
    gsap.to('.fade-in-up', {
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.18,
      ease: 'power2.out',
      delay: 0.7
    });
  }
});

// === Scroll-triggered Section and Card Animations ===
// window.addEventListener('DOMContentLoaded', function() {
//   if (window.gsap && window.ScrollTrigger) {
//     // Fade-in sections on scroll
//     gsap.utils.toArray('.fade-in-section').forEach(section => {
//       gsap.to(section, {
//         opacity: 1,
//         y: 0,
//         duration: 1,
//         ease: 'power2.out',
//         scrollTrigger: {
//           trigger: section,
//           start: 'top 80%',
//           toggleActions: 'play none none none'
//         }
//       });
//     });
//     // Slide-in service cards on load and scroll
//     gsap.utils.toArray('.slide-in-left').forEach((card, i) => {
//       gsap.to(card, {
//         opacity: 1,
//         x: 0,
//         duration: 1,
//         delay: 0.2 + i * 0.12,
//         ease: 'power2.out',
//         scrollTrigger: {
//           trigger: card,
//           start: 'top 85%',
//           toggleActions: 'play none none none'
//         }
//       });
//     });
//     gsap.utils.toArray('.slide-in-right').forEach((card, i) => {
//       gsap.to(card, {
//         opacity: 1,
//         x: 0,
//         duration: 1,
//         delay: 0.2 + i * 0.12,
//         ease: 'power2.out',
//         scrollTrigger: {
//           trigger: card,
//           start: 'top 85%',
//           toggleActions: 'play none none none'
//         }
//       });
//     });
//   }
// });

// === Parallax Background Effect ===
// window.addEventListener('DOMContentLoaded', function() {
//   if (window.gsap && window.ScrollTrigger) {
//     const parallaxBg = document.querySelector('.parallax-bg');
//     if (parallaxBg) {
//       // Create a parallax inner layer if not present
//       let inner = parallaxBg.querySelector('.parallax-bg-inner');
//       if (!inner) {
//         inner = document.createElement('div');
//         inner.className = 'parallax-bg-inner';
//         inner.style.background = 'linear-gradient(120deg, #0a0a0a 60%, #23272f 100%)';
//         parallaxBg.prepend(inner);
//       }
//       gsap.to(inner, {
//         y: () => window.innerWidth > 768 ? 80 : 30,
//         ease: 'none',
//         scrollTrigger: {
//           trigger: parallaxBg,
//           start: 'top top',
//           end: 'bottom top',
//           scrub: true
//         }
//       });
//     }
//   }
//
//   // 3D Card Tilt
//   document.querySelectorAll('.card-tilt').forEach(card => {
//     card.addEventListener('mousemove', e => {
//       const rect = card.getBoundingClientRect();
//       const x = e.clientX - rect.left;
//       const y = e.clientY - rect.top;
//       const cx = rect.width / 2;
//       const cy = rect.height / 2;
//       const dx = (x - cx) / cx;
//       const dy = (y - cy) / cy;
//       card.style.transform = `rotateY(${dx * 10}deg) rotateX(${-dy * 10}deg)`;
//     });
//     card.addEventListener('mouseleave', () => {
//       card.style.transform = '';
//     });
//   });
//
//   // Button Ripple Effect
//   document.querySelectorAll('.btn-ripple').forEach(btn => {
//     btn.addEventListener('click', function(e) {
//       const ripple = document.createElement('span');
//       ripple.className = 'ripple';
//       const rect = btn.getBoundingClientRect();
//       ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + 'px';
//       ripple.style.left = (e.clientX - rect.left - rect.width/2) + rect.width/2 + 'px';
//       ripple.style.top = (e.clientY - rect.top - rect.height/2) + rect.height/2 + 'px';
//       btn.appendChild(ripple);
//       ripple.addEventListener('animationend', () => ripple.remove());
//     });
//   });
// });
