document.addEventListener('DOMContentLoaded', () => {

    // 1. Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const closeMenu = document.querySelector('.close-menu');
    const mobileOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    const toggleMenu = (open) => {
        if (open) {
            mobileOverlay.classList.add('open');
            document.body.style.overflow = 'hidden'; // Prevent scroll
        } else {
            mobileOverlay.classList.remove('open');
            document.body.style.overflow = ''; // Restore scroll
        }
    };

    if (mobileToggle) mobileToggle.addEventListener('click', () => toggleMenu(true));
    if (closeMenu) closeMenu.addEventListener('click', () => toggleMenu(false));

    // Close menu when clicking links
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    // 2. Sticky Header Transition
    const header = document.querySelector('.sticky-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('fixed');
        } else {
            header.classList.remove('fixed');
        }
    });

    // 3. Scroll Reveal Animations (Fade, Slide, Zoom)
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // 4. Stats Counter Animation
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const targetStr = counter.getAttribute('data-target') || counter.innerText;
                const target = parseFloat(targetStr);
                const prefix = counter.getAttribute('data-prefix') || '';
                const suffix = counter.getAttribute('data-suffix') || '';
                
                if (isNaN(target)) return;
                
                const isDecimal = targetStr.includes('.');
                const decimals = isDecimal ? targetStr.split('.')[1].length : 0;
                
                const duration = 2000; // 2 seconds
                let startTime = null;
                
                const animate = (currentTime) => {
                    if (!startTime) startTime = currentTime;
                    const elapsedTime = currentTime - startTime;
                    const progress = Math.min(elapsedTime / duration, 1);
                    
                    // Ease out cubic
                    const easeProgress = 1 - Math.pow(1 - progress, 3);
                    const currentVal = easeProgress * target;
                    
                    let formattedVal = isDecimal ? currentVal.toFixed(decimals) : Math.floor(currentVal).toString();
                    
                    counter.innerText = prefix + formattedVal + suffix;
                    
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        counter.innerText = prefix + targetStr + suffix;
                    }
                };
                
                requestAnimationFrame(animate);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));

    // 5. Profit Graph (Chart.js)
    const ctx = document.getElementById('profitChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['2013', '2014', '2015', '2016', '2017', '2018'],
                datasets: [
                    {
                        label: 'Teal Line',
                        data: [1000, 2500, 2000, 3500, 3000, 4500],
                        borderColor: '#00D1C1', // Teal
                        backgroundColor: 'transparent',
                        borderWidth: 3,
                        tension: 0.4,
                        pointBackgroundColor: '#00D1C1',
                        pointRadius: 5
                    },
                    {
                        label: 'Pink Line',
                        data: [1500, 1800, 3200, 2800, 4200, 3800],
                        borderColor: '#FF4081', // Pink
                        backgroundColor: 'transparent',
                        borderWidth: 3,
                        tension: 0.4,
                        pointBackgroundColor: '#FF4081',
                        pointRadius: 5
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: {
                                family: 'Poppins',
                                size: 14
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // 6. Smooth Scroll for Nav Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 60,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 7. Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true
        });
    }

    // 8. GSAP animations (ScrollTrigger)
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Timeline Progress Line Growth
        const timelineProgress = document.querySelector('.timeline-progress-line');
        const timelineContainer = document.querySelector('.timeline-container');
        if (timelineProgress && timelineContainer) {
            gsap.to(timelineProgress, {
                height: '100%',
                ease: 'none',
                scrollTrigger: {
                    trigger: timelineContainer,
                    start: 'top 20%',
                    end: 'bottom 80%',
                    scrub: true
                }
            });

            // Node activation as scroll passes
            const timelineItems = document.querySelectorAll('.timeline-item');
            timelineItems.forEach(item => {
                ScrollTrigger.create({
                    trigger: item,
                    start: 'top 50%',
                    onEnter: () => item.classList.add('active'),
                    onLeaveBack: () => item.classList.remove('active')
                });
            });
        }

        // Sticky Stacking Cards Transformation
        const stackingCards = gsap.utils.toArray('.stacking-card');
        stackingCards.forEach((card, index) => {
            if (index < stackingCards.length - 1) {
                gsap.to(card, {
                    scale: 0.9 - (stackingCards.length - 1 - index) * 0.03,
                    opacity: 0.5,
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 150px',
                        end: 'bottom 150px',
                        scrub: true,
                        persist: true
                    }
                });
            }
        });

        // Horizontal Scroll Showcase
        const horizontalSection = document.querySelector('.horizontal-scroll-section');
        const horizontalTrack = document.querySelector('.horizontal-track');
        if (horizontalSection && horizontalTrack) {
            const getScrollAmount = () => {
                let trackWidth = horizontalTrack.scrollWidth;
                return -(trackWidth - window.innerWidth + window.innerWidth * 0.2);
            };

            ScrollTrigger.matchMedia({
                "(min-width: 769px)": function() {
                    gsap.to(horizontalTrack, {
                        x: () => getScrollAmount(),
                        ease: 'none',
                        scrollTrigger: {
                            trigger: '.horizontal-scroll-section',
                            start: 'top top',
                            end: () => `+=${horizontalTrack.scrollWidth - window.innerWidth + 200}`,
                            pin: true,
                            scrub: 1,
                            invalidateOnRefresh: true
                        }
                    });
                }
            });
        }
    }

    // 9. Expandable Card Toggles
    const expandableCards = document.querySelectorAll('.expandable-card');
    expandableCards.forEach(card => {
        card.addEventListener('click', () => {
            const isActive = card.classList.contains('active');
            expandableCards.forEach(c => c.classList.remove('active'));
            
            if (!isActive) {
                card.classList.add('active');
            }
            // Refresh ScrollTrigger as height changed
            if (typeof ScrollTrigger !== 'undefined') {
                setTimeout(() => {
                    ScrollTrigger.refresh();
                }, 300);
            }
        });
    });

    // 10. Hover Spotlight Effect
    const spotlightCards = document.querySelectorAll('.spotlight-card');
    spotlightCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 11. 3D Floating (Tilt) Cards
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const px = (x / rect.width) - 0.5;
            const py = (y / rect.height) - 0.5;
            
            const rotX = -py * 15;
            const rotY = px * 15;
            
            card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    // 12. FAQ & Accordion Toggle
    const faqItems = document.querySelectorAll('.faq-item, .accordion-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question, .accordion-header');
        const answer = item.querySelector('.faq-answer, .accordion-body');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close other items
                faqItems.forEach(i => {
                    i.classList.remove('active');
                    const ans = i.querySelector('.faq-answer, .accordion-body');
                    if (ans) ans.style.maxHeight = null;
                });
                
                if (!isActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        }
    });

    // 13. Services Tab Switcher
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content-item');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // 14. Services Tax Calculator
    const assetSlider = document.getElementById('asset-slider');
    const assetDisplay = document.getElementById('asset-display');
    const jurisdictionSelect = document.getElementById('jurisdiction-select');
    const savingsVal = document.getElementById('savings-val');
    const rateVal = document.getElementById('rate-val');

    const updateCalculator = () => {
        if (!assetSlider || !jurisdictionSelect) return;
        const assets = parseInt(assetSlider.value);
        const structure = jurisdictionSelect.value;
        
        // Display formatted asset size
        assetDisplay.innerText = '$' + assets.toLocaleString();
        
        let rate = 0;
        let savingsRate = 0;
        
        if (structure === 'high') {
            rate = 12.5; // Optimized to 12.5%
            savingsRate = 0.18; // Saves 18% of assets per year
        } else if (structure === 'medium') {
            rate = 8.5; // Optimized to 8.5%
            savingsRate = 0.115; // Saves 11.5%
        } else {
            rate = 5.0; // Optimized to 5%
            savingsRate = 0.08; // Saves 8%
        }
        
        const annualSavings = assets * savingsRate;
        
        // Set values
        if (savingsVal) savingsVal.innerText = '$' + Math.floor(annualSavings).toLocaleString();
        if (rateVal) rateVal.innerText = rate.toFixed(1) + '%';
    };

    if (assetSlider && jurisdictionSelect) {
        assetSlider.addEventListener('input', updateCalculator);
        jurisdictionSelect.addEventListener('change', updateCalculator);
        updateCalculator(); // Run initial calculation
    }

    // 15. Blog Category Filter Switcher
    const filterButtons = document.querySelectorAll('.blog-filter-btn');
    const blogCards = document.querySelectorAll('.blog-card-v2');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');

            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            blogCards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                if (category === 'all' || cardCat === category) {
                    card.style.display = 'flex';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                } else {
                    card.style.display = 'none';
                }
            });

            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }
        });
    });

    // 16. Strict Phone Number Input Validation
    const phoneInputs = document.querySelectorAll('input[type="tel"], .phone-input');
    phoneInputs.forEach(input => {
        // Strip non-numeric/phone characters in real-time
        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9+\s\-()]/g, '');
        });

        // Block invalid keypresses immediately
        input.addEventListener('keypress', (e) => {
            const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'];
            if (allowedKeys.includes(e.key)) return;

            if (!/[0-9+\s\-()]/.test(e.key)) {
                e.preventDefault();
            }
        });

        // Validate length on blur
        input.addEventListener('blur', () => {
            const digitsOnly = input.value.replace(/[^0-9]/g, '');
            if (input.value && digitsOnly.length < 7) {
                input.setCustomValidity('Please enter a valid phone number containing at least 7 digits.');
            } else {
                input.setCustomValidity('');
            }
        });
    });

    // 17. Authentication & Account Portal Logic (login.html)
    const authTabBtns = document.querySelectorAll('.auth-tab-btn');
    const authFormPanels = document.querySelectorAll('.auth-form-panel');
    const switchTabLinks = document.querySelectorAll('.switch-tab-link');

    const switchAuthTab = (targetTab) => {
        authTabBtns.forEach(btn => {
            if (btn.getAttribute('data-tab') === targetTab) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        authFormPanels.forEach(panel => {
            if (panel.id === `${targetTab}-panel`) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });
    };

    authTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            switchAuthTab(targetTab);
        });
    });

    switchTabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetTab = link.getAttribute('data-tab');
            switchAuthTab(targetTab);
        });
    });

    // Role Selection Pills Handling
    document.querySelectorAll('.role-pills').forEach(container => {
        const pills = container.querySelectorAll('.role-pill');
        const hiddenInput = container.parentElement.querySelector('.role-hidden-input');

        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                pills.forEach(p => p.classList.remove('selected'));
                pill.classList.add('selected');
                const selectedRole = pill.getAttribute('data-role');
                if (hiddenInput) {
                    hiddenInput.value = selectedRole;
                }
            });
        });
    });

    // Password Visibility Eye Toggle
    document.querySelectorAll('.password-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const wrapper = btn.closest('.input-field-wrapper');
            const input = wrapper.querySelector('input');
            const icon = btn.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Toast Notification Utility
    const showToast = (title, message, type = 'success') => {
        let toast = document.querySelector('.auth-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = `auth-toast ${type}`;
            toast.innerHTML = `
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <div class="auth-toast-text">
                    <h4>${title}</h4>
                    <p>${message}</p>
                </div>
            `;
            document.body.appendChild(toast);
        } else {
            toast.className = `auth-toast ${type}`;
            toast.querySelector('i').className = `fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`;
            toast.querySelector('h4').innerText = title;
            toast.querySelector('p').innerText = message;
        }

        setTimeout(() => toast.classList.add('show'), 50);

        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    };

    // Helper: Validate Email Format
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Login Form Submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = loginForm.querySelector('#loginEmail');
            const passInput = loginForm.querySelector('#loginPassword');
            const roleInput = loginForm.querySelector('#loginRole');

            const email = emailInput.value.trim();
            const password = passInput.value.trim();
            const role = roleInput ? roleInput.value : 'USER';

            if (!email || !isValidEmail(email)) {
                showToast('Invalid Email', 'Please enter a valid email address.', 'error');
                emailInput.focus();
                return;
            }

            if (!password) {
                showToast('Password Required', 'Please enter your password.', 'error');
                passInput.focus();
                return;
            }

            // Save login credentials to localStorage for dashboard retrieval
            localStorage.setItem('loggedInEmail', email);
            localStorage.setItem('userRole', role);
            localStorage.setItem('loggedInName', email.split('@')[0]);

            // Clear any previous dashboard section/scroll state on new login
            sessionStorage.removeItem('dashboard_last_section');
            sessionStorage.removeItem('dashboard_last_scroll');
            sessionStorage.removeItem('dashboard_last_url');

            showToast('Login Successful!', `Redirecting to ${role} portal...`, 'success');

            setTimeout(() => {
                if (role.toUpperCase() === 'ADMIN') {
                    window.location.href = 'admin-dashboard.html';
                } else {
                    window.location.href = 'user-dashboard.html';
                }
            }, 1200);
        });
    }

    // Signup Form Submission
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = signupForm.querySelector('#signupName');
            const emailInput = signupForm.querySelector('#signupEmail');
            const phoneInput = signupForm.querySelector('#signupPhone');
            const roleInput = signupForm.querySelector('#signupRole');
            const passInput = signupForm.querySelector('#signupPassword');
            const confirmPassInput = signupForm.querySelector('#signupConfirmPassword');
            const termsInput = signupForm.querySelector('#signupTerms');

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const phone = phoneInput.value.trim();
            const role = roleInput ? roleInput.value : 'USER';
            const password = passInput.value.trim();
            const confirmPassword = confirmPassInput.value.trim();

            if (!name) {
                showToast('Missing Details', 'Please enter your full name.', 'error');
                nameInput.focus();
                return;
            }

            if (!email || !isValidEmail(email)) {
                showToast('Invalid Email', 'Please enter a valid email address.', 'error');
                emailInput.focus();
                return;
            }

            const digitsOnly = phone.replace(/[^0-9]/g, '');
            if (!phone || digitsOnly.length < 7) {
                showToast('Invalid Phone Number', 'Please enter a valid phone number with at least 7 digits.', 'error');
                phoneInput.focus();
                return;
            }

            if (!password || password.length < 6) {
                showToast('Weak Password', 'Password must be at least 6 characters long.', 'error');
                passInput.focus();
                return;
            }

            if (password !== confirmPassword) {
                showToast('Password Mismatch', 'Password and Confirm Password do not match.', 'error');
                confirmPassInput.focus();
                return;
            }

            if (termsInput && !termsInput.checked) {
                showToast('Terms Required', 'Please accept the Terms of Service to proceed.', 'error');
                return;
            }

            // Save signup credentials to localStorage for dashboard retrieval
            localStorage.setItem('loggedInEmail', email);
            localStorage.setItem('userRole', role);
            localStorage.setItem('loggedInName', name);

            showToast('Account Created!', 'Account created successfully! Please log in with your credentials.', 'success');

            // Pre-fill email and role in login form for quick login
            const loginEmailInput = document.getElementById('loginEmail');
            const loginRoleInput = document.getElementById('loginRole');
            if (loginEmailInput) loginEmailInput.value = email;
            if (loginRoleInput) loginRoleInput.value = role;

            // Update role pill selection in login form
            const loginRolePills = document.querySelectorAll('#login-panel .role-pill');
            loginRolePills.forEach(pill => {
                if (pill.getAttribute('data-role') === role) {
                    pill.classList.add('selected');
                } else {
                    pill.classList.remove('selected');
                }
            });

            // Reset signup form fields
            signupForm.reset();

            // Switch back to login section
            switchAuthTab('login');
        });
    }
});


