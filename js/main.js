// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== DOM ELEMENTS =====
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const closeSidebarBtn = document.getElementById('closeSidebar');
    const darkToggle = document.getElementById('darkModeToggle');
    const typingEl = document.getElementById('typing');
    const profilePhoto = document.getElementById('profilePhoto');
    const currentYearSpan = document.getElementById('currentYear');
    
    // ===== SIDEBAR FUNCTIONS =====
    function openSidebar() {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeSidebar() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Event listeners for sidebar
    if (menuToggle) menuToggle.addEventListener('click', openSidebar);
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);
    
    // Close sidebar on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            closeSidebar();
        }
    });
    
    // ===== SIDEBAR SMOOTH SCROLL =====
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    closeSidebar();
                    setTimeout(() => {
                        const headerOffset = 90;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    }, 150);
                }
            }
        });
    });
    
    // ===== TYPING EFFECT =====
    if (typingEl) {
        const phrases = ['Cyrus Akacha Cyprian', 'Python Developer', 'Creative developer', 'Automation Enthusiast', 'Web Developer'];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function typeEffect() {
            const currentPhrase = phrases[phraseIndex];
            
            if (isDeleting) {
                typingEl.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingEl.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
            }
            
            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                setTimeout(typeEffect, 2000);
                return;
            }
            
            if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(typeEffect, 300);
                return;
            }
            
            const speed = isDeleting ? 50 : 100;
            setTimeout(typeEffect, speed);
        }
        
        typeEffect();
    }
    
    // ===== DARK MODE =====
    const root = document.body;
    const moonIcon = darkToggle ? darkToggle.querySelector('i') : null;
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        root.classList.add('dark');
        if (moonIcon) {
            moonIcon.classList.remove('fa-moon');
            moonIcon.classList.add('fa-sun');
        }
    }
    
    if (darkToggle) {
        darkToggle.addEventListener('click', function() {
            root.classList.toggle('dark');
            const isDark = root.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            
            if (moonIcon) {
                if (isDark) {
                    moonIcon.classList.remove('fa-moon');
                    moonIcon.classList.add('fa-sun');
                } else {
                    moonIcon.classList.remove('fa-sun');
                    moonIcon.classList.add('fa-moon');
                }
            }
        });
    }
    
    // ===== SCROLL ANIMATIONS =====
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    sections.forEach(section => observer.observe(section));
    
    // Check for already visible sections
    setTimeout(() => {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                section.classList.add('visible');
            }
        });
    }, 100);
    
    // ===== CURRENT YEAR =====
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    
    // ===== IMAGE FALLBACKS =====
    if (profilePhoto) {
        profilePhoto.onerror = function() {
            this.src = 'https://ui-avatars.com/api/?background=1cc88a&color=fff&bold=true&size=250&name=Cyrus';
        };
    }
    
    const projectImages = document.querySelectorAll('.project-img');
    projectImages.forEach(img => {
        img.onerror = function() {
            const parentCard = this.closest('.project-card');
            const title = parentCard ? parentCard.querySelector('p')?.innerText || 'Project' : 'Project';
            this.src = `https://via.placeholder.com/400x160/1cc88a/ffffff?text=${encodeURIComponent(title)}`;
        };
    });
    
    // ===== ACTIVE SECTION HIGHLIGHT =====
    function updateActiveLink() {
        const scrollPos = window.scrollY + 100;
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (
