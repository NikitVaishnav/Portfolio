/**
 * Nikita Vaishnav — Portfolio Interactive Script
 * Features: Theme toggle, dynamic role typer, scroll spy, modal, filters, contact form AJAX, toast notifications.
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initScrollProgress();
    initScrollSpy();
    initDynamicRoleTyper();
    initSkillFilters();
    initProjectFilters();
    initProjectModal();
    initContactForm();
    initMobileNav();
    initCopyrightYear();
    initLucideIcons();
});

/* --------------------------------------------------------------------------
   1. Theme Toggle & Persistence
   -------------------------------------------------------------------------- */
function initTheme() {
    const htmlEl = document.documentElement;
    const themeBtn = document.getElementById('theme-toggle-btn');
    
    // Check localStorage or system preference
    const savedTheme = localStorage.getItem('nikita_portfolio_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const activeTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(activeTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = htmlEl.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }

    function setTheme(theme) {
        htmlEl.setAttribute('data-theme', theme);
        localStorage.setItem('nikita_portfolio_theme', theme);
        initLucideIcons();
    }
}

/* --------------------------------------------------------------------------
   2. Reading Scroll Progress Bar
   -------------------------------------------------------------------------- */
function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress-bar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        progressBar.style.width = `${progress}%`;
    }, { passive: true });
}

/* --------------------------------------------------------------------------
   3. Scroll Spy & Active Nav Link Highlight
   -------------------------------------------------------------------------- */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.desktop-nav .nav-link, .mobile-nav-link');
    if (!sections.length || !navLinks.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

/* --------------------------------------------------------------------------
   4. Dynamic Role Typewriter / Cycler
   -------------------------------------------------------------------------- */
function initDynamicRoleTyper() {
    const roleElement = document.getElementById('typewriter-role');
    if (!roleElement) return;

    const roles = [
        "React Frontend Developer",
        "Full Stack Web Developer",
        "REST API & UI Specialist",
        "MCA Candidate @ RCOEM",
        "Component Architect"
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function type() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            roleElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 45;
        } else {
            roleElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 90;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            // Pause at end of text
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 400;
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

/* --------------------------------------------------------------------------
   5. Skill Category Filter Tabs
   -------------------------------------------------------------------------- */
function initSkillFilters() {
    const filterButtons = document.querySelectorAll('.skill-tab-btn');
    const categoryCards = document.querySelectorAll('.skill-category-card');
    if (!filterButtons.length || !categoryCards.length) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetCategory = btn.getAttribute('data-category');

            // Update active button state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter category cards
            categoryCards.forEach(card => {
                const group = card.getAttribute('data-category-group');
                if (targetCategory === 'all' || group === targetCategory) {
                    card.style.display = 'block';
                    card.classList.remove('hidden');
                } else {
                    card.style.display = 'none';
                    card.classList.add('hidden');
                }
            });
        });
    });
}

/* --------------------------------------------------------------------------
   6. Project Category Filter Controls
   -------------------------------------------------------------------------- */
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.project-filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    if (!filterButtons.length || !projectCards.length) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetFilter = btn.getAttribute('data-filter');

            // Toggle active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter cards
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (targetFilter === 'all' || category === targetFilter) {
                    card.style.display = 'flex';
                    card.classList.remove('hidden');
                } else {
                    card.style.display = 'none';
                    card.classList.add('hidden');
                }
            });
        });
    });
}

/* --------------------------------------------------------------------------
   7. Project Details Quick View Modal
   -------------------------------------------------------------------------- */
function initProjectModal() {
    const modalBackdrop = document.getElementById('project-modal');
    const closeBtn = document.getElementById('modal-close-btn');
    const modalTitle = document.getElementById('modal-project-title');
    const modalBadge = document.getElementById('modal-project-badge');
    const modalSummary = document.getElementById('modal-project-summary');
    const modalDesc = document.getElementById('modal-project-desc');
    const modalMetrics = document.getElementById('modal-project-metrics');
    const modalStack = document.getElementById('modal-project-stack');
    const modalGithubLink = document.getElementById('modal-github-link');
    const modalContactLink = document.getElementById('modal-contact-link');

    if (!modalBackdrop) return;

    // Get projects data from injected global object or DOM
    const projectsData = (window.PORTFOLIO_DATA && window.PORTFOLIO_DATA.projects) || [];

    // Open modal buttons
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.btn-open-modal');
        if (!trigger) return;

        const projectId = trigger.getAttribute('data-project-id');
        const project = projectsData.find(p => p.id === projectId);

        if (project) {
            modalTitle.textContent = project.title;
            modalBadge.textContent = project.badge || 'Featured Project';
            modalSummary.textContent = project.summary;
            modalDesc.textContent = project.description;

            // Render Metrics
            modalMetrics.innerHTML = '';
            if (project.metrics && project.metrics.length) {
                project.metrics.forEach(metric => {
                    const li = document.createElement('li');
                    li.className = 'modal-metric-item';
                    li.innerHTML = `<i data-lucide="check-circle" style="width:16px;height:16px;color:var(--accent-emerald)"></i><span>${metric}</span>`;
                    modalMetrics.appendChild(li);
                });
            }

            // Render Stack
            modalStack.innerHTML = '';
            if (project.tech_stack && project.tech_stack.length) {
                project.tech_stack.forEach(tech => {
                    const span = document.createElement('span');
                    span.className = 'tech-tag';
                    span.textContent = tech;
                    modalStack.appendChild(span);
                });
            }

            // Links
            if (modalGithubLink) {
                modalGithubLink.href = project.github_url || 'https://github.com/NikitVaishnav';
            }

            openModal();
            initLucideIcons();
        }
    });

    function openModal() {
        modalBackdrop.classList.add('open');
        modalBackdrop.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalBackdrop.classList.remove('open');
        modalBackdrop.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (modalContactLink) {
        modalContactLink.addEventListener('click', closeModal);
    }

    modalBackdrop.addEventListener('click', (e) => {
        if (e.target === modalBackdrop) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
            closeModal();
        }
    });
}

/* --------------------------------------------------------------------------
   8. Contact Form Async Submission
   -------------------------------------------------------------------------- */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('contact-submit-btn');
    if (!contactForm || !submitBtn) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Clear existing errors
        clearFormErrors();

        // Form Fields
        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email');
        const subjectInput = document.getElementById('contact-subject');
        const messageInput = document.getElementById('contact-message');

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const subject = subjectInput ? subjectInput.value.trim() : '';
        const message = messageInput.value.trim();

        // Client-side validation
        let isValid = true;

        if (!name || name.length < 2) {
            showFieldError(nameInput, 'name-error', 'Please enter your name (at least 2 characters).');
            isValid = false;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailPattern.test(email)) {
            showFieldError(emailInput, 'email-error', 'Please enter a valid email address.');
            isValid = false;
        }

        if (!message || message.length < 5) {
            showFieldError(messageInput, 'message-error', 'Please enter a message (at least 5 characters).');
            isValid = false;
        }

        if (!isValid) return;

        // Set Loading State
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ name, email, subject, message })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                showToast(result.message || "Thank you! Your message has been sent successfully.", 'success');
                contactForm.reset();
            } else {
                showToast(result.detail || "Something went wrong. Please try emailing directly.", 'error');
            }
        } catch (error) {
            console.error('Submission error:', error);
            showToast("Network error. Please email directly to nikitavaishnav1703@gmail.com", 'error');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });

    function showFieldError(inputEl, errorId, message) {
        inputEl.classList.add('invalid');
        const errorEl = document.getElementById(errorId);
        if (errorEl) {
            errorEl.textContent = message;
        }
    }

    function clearFormErrors() {
        document.querySelectorAll('.form-input, .form-textarea').forEach(el => el.classList.remove('invalid'));
        document.querySelectorAll('.field-error-msg').forEach(el => el.textContent = '');
    }
}

/* --------------------------------------------------------------------------
   9. Toast Notification System
   -------------------------------------------------------------------------- */
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const iconHtml = type === 'success'
        ? '<i data-lucide="check-circle-2" class="toast-icon"></i>'
        : '<i data-lucide="alert-circle" class="toast-icon"></i>';

    toast.innerHTML = `
        ${iconHtml}
        <span class="toast-message">${message}</span>
    `;

    container.appendChild(toast);
    initLucideIcons();

    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

/* --------------------------------------------------------------------------
   10. Mobile Menu Drawer Navigation
   -------------------------------------------------------------------------- */
function initMobileNav() {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const drawer = document.getElementById('mobile-nav-drawer');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (!mobileBtn || !drawer) return;

    mobileBtn.addEventListener('click', () => {
        const isOpen = drawer.classList.contains('open');
        if (isOpen) {
            closeMobileNav();
        } else {
            openMobileNav();
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileNav();
        });
    });

    function openMobileNav() {
        drawer.classList.add('open');
        mobileBtn.classList.add('open');
        mobileBtn.setAttribute('aria-expanded', 'true');
        drawer.setAttribute('aria-hidden', 'false');
    }

    function closeMobileNav() {
        drawer.classList.remove('open');
        mobileBtn.classList.remove('open');
        mobileBtn.setAttribute('aria-expanded', 'false');
        drawer.setAttribute('aria-hidden', 'true');
    }
}

/* --------------------------------------------------------------------------
   11. Copyright Year Auto-updater
   -------------------------------------------------------------------------- */
function initCopyrightYear() {
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

/* --------------------------------------------------------------------------
   12. Lucide Icons Helper
   -------------------------------------------------------------------------- */
function initLucideIcons() {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}
