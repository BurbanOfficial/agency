document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. CITATIONS (ACCUEIL)
    // ==========================================
    const quotes = [
        "Développement Web sur mesure.",
        "Création de sites e-commerce performants.",
        "Refonte de sites internet.",
        "Stratégie de communication digitale.",
        "Copywriting & rédaction de contenus.",
        "Design d'expérience utilisateur (UI/UX).",
        "Création de supports print & digitaux."
    ];

    const quoteElement = document.getElementById("dynamic-quote");
    let currentQuoteIndex = 0;

    function changeQuote() {
        if (!quoteElement) return;
        quoteElement.classList.remove("visible");
        
        setTimeout(() => {
            quoteElement.textContent = quotes[currentQuoteIndex];
            quoteElement.classList.add("visible");
            currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
        }, 700);
    }

    if (quoteElement) {
        setTimeout(() => {
            changeQuote();
            setInterval(changeQuote, 4800);
        }, 900);
    }

    // ==========================================
    // 2. CARROUSEL D'AVIS EN FONDU (ACCUEIL)
    // ==========================================
    const reviews = document.querySelectorAll('.fade-review-item');
    let currentReviewIndex = 0;

    if (reviews.length > 1) {
        setInterval(() => {
            // Masquer l'avis actuel
            reviews[currentReviewIndex].classList.remove('active');
            
            // Calculer l'index du prochain avis
            currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
            
            // Afficher le nouvel avis après un micro-délai fluidifiant
            setTimeout(() => {
                reviews[currentReviewIndex].classList.add('active');
            }, 50); 
        }, 4500);
    }

    // ==========================================
    // 3. TRANSITIONS DE SECTIONS (FLOU DIRECTIONNEL)
    // ==========================================
    const menuLinks = document.querySelectorAll(".menu-link");
    let isAnimating = false;

    menuLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
            if (isAnimating) return;

            const targetId = this.getAttribute("href").replace("#", "");
            const currentActiveSection = document.querySelector(".page-section.active");
            const targetSection = document.getElementById(targetId);

            if (!targetSection || currentActiveSection === targetSection) return;

            isAnimating = true;

            const currentActiveLink = document.querySelector(".menu-link.active");
            const currentIndex = parseInt(currentActiveLink.getAttribute("data-index"));
            const targetIndex = parseInt(this.getAttribute("data-index"));

            let exitClass, enterClass;
            if (targetIndex > currentIndex) {
                exitClass = "anim-exit-next";
                enterClass = "anim-enter-next";
            } else {
                exitClass = "anim-exit-prev";
                enterClass = "anim-enter-prev";
            }

            currentActiveSection.classList.add(exitClass);
            targetSection.classList.add(enterClass);

            if (currentActiveLink) currentActiveLink.classList.remove("active");
            this.classList.add("active");

            setTimeout(() => {
                currentActiveSection.classList.remove("active", exitClass);
                targetSection.classList.remove(enterClass);
                targetSection.classList.add("active");

                isAnimating = false;

                if (targetId === "vision" || targetId === "equipe") {
                    const agenceContainer = document.querySelector(".agence-fullscreen-container");
                    if (agenceContainer) agenceContainer.scrollTop = 0;
                    animateCounters();
                }
            }, 850);
        });
    });

    // ==========================================
    // 4. COMPTEURS DYNAMIQUES (AGENCE)
    // ==========================================
    function animateCounters() {
        const counters = document.querySelectorAll(".stat-number");
        counters.forEach(counter => {
            counter.innerText = "0"; 
            const updateCounter = () => {
                const target = +counter.getAttribute("data-target");
                const count = +counter.innerText;
                const increment = Math.ceil(target / 45); 

                if (count < target) {
                    counter.innerText = count + increment > target ? target : count + increment;
                    setTimeout(updateCounter, 30);
                } else {
                    counter.innerText = target;
                }
            };
            updateCounter();
        });
    }

    // ==========================================
    // 5. INTERCEPTION FORMULAIRE DE CONTACT
    // ==========================================
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btnText = this.querySelector('.btn-text');
            if (btnText) {
                btnText.textContent = "Signal envoyé.";
                this.reset();
            }
        });
    }

    // Formulaire mobile par étapes
    const mobileForm = document.querySelector('.contact-form-mobile');
    if (mobileForm) {
        mobileForm.querySelectorAll('.mobile-next-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const nextStep = btn.getAttribute('data-next');
                const currentStep = btn.closest('.mobile-step');
                const target = mobileForm.querySelector(`[data-step="${nextStep}"]`);
                if (target) {
                    currentStep.classList.remove('active');
                    target.classList.add('active');
                }
            });
        });

        mobileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            this.style.display = 'none';
            const successScreen = document.getElementById('mobile-success-screen');
            if (successScreen) {
                successScreen.classList.add('visible');
                // Sync open hours badge dans l'écran de succès
                const mainBadge = document.getElementById('open-hours-badge');
                const mobileBadge = document.getElementById('mobile-open-hours-badge');
                const mobileLabel = document.getElementById('mobile-open-hours-label');
                if (mainBadge && mobileBadge && mobileLabel) {
                    mobileBadge.className = mainBadge.className;
                    mobileLabel.textContent = document.getElementById('open-hours-label').textContent;
                }
            }
        });
    }

    // ==========================================
    // 5b. OPEN HOURS BADGE
    // ==========================================
    function updateOpenHours() {
        const badge = document.getElementById('open-hours-badge');
        const label = document.getElementById('open-hours-label');
        if (!badge || !label) return;

        // Lundi=1 ... Samedi=6, Dimanche=0
        const schedule = {
            1: { open: 9, close: 18 },
            2: { open: 9, close: 18 },
            3: { open: 9, close: 18 },
            4: { open: 9, close: 18 },
            5: { open: 9, close: 18 },
            6: { open: 9, close: 18 }
        };

        const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Lundi'];

        const now = new Date();
        const day = now.getDay();
        const hour = now.getHours() + now.getMinutes() / 60;
        const todaySchedule = schedule[day];

        if (todaySchedule && hour >= todaySchedule.open && hour < todaySchedule.close) {
            badge.className = 'open-hours-badge is-open';
            label.textContent = `Ouvert • Ferme à ${todaySchedule.close}h`;
        } else {
            badge.className = 'open-hours-badge is-closed';
            let nextDay = (day + 1) % 7;
            let daysChecked = 0;
            while (!schedule[nextDay] && daysChecked < 7) {
                nextDay = (nextDay + 1) % 7;
                daysChecked++;
            }
            const nextSchedule = schedule[nextDay];
            const isToday = todaySchedule && hour < todaySchedule.open;
            if (isToday) {
                label.textContent = `Fermé. On revient aujourd'hui à ${todaySchedule.open}h`;
            } else {
                label.textContent = `Fermé. On revient ${dayNames[nextDay]} à ${nextSchedule.open}h`;
            }
        }
    }

    updateOpenHours();
    setInterval(updateOpenHours, 60000);

    // ==========================================
    // 6. GESTION DE LA MODALE PROJETS ENRICHIE
    // ==========================================
    const projetCards = document.querySelectorAll(".projet-card");
    const modalOverlay = document.getElementById("projet-modal");
    const modalCloseBtn = document.querySelector(".modal-close-btn");

    // Éléments cibles existants et nouveaux dans la modale
    const mImg = document.getElementById("modal-img");
    const mTitle = document.getElementById("modal-title");
    const mCategory = document.getElementById("modal-category");
    const mDetail = document.getElementById("modal-detail");
    const mClient = document.getElementById("modal-client");
    const mDate = document.getElementById("modal-date");
    
    // Nouveaux éléments cibles enrichis
    const mScope = document.getElementById("modal-scope");
    const mReview = document.getElementById("modal-review");
    const mLink = document.getElementById("modal-link");

    if (projetCards.length > 0 && modalOverlay) {
        
        // Ouverture de la modale au clic sur une carte
        projetCards.forEach(card => {
            card.addEventListener("click", () => {
                // Récupération des données globales
                const title = card.getAttribute("data-title");
                const category = card.getAttribute("data-category");
                const detail = card.getAttribute("data-detail");
                const client = card.getAttribute("data-client");
                const date = card.getAttribute("data-date");
                const imgUrl = card.getAttribute("data-img");
                
                // Récupération des nouvelles données enrichies
                const scope = card.getAttribute("data-scope");
                const review = card.getAttribute("data-review");
                const link = card.getAttribute("data-link");

                // Injections de base
                if (mTitle) mTitle.textContent = title;
                if (mCategory) mCategory.textContent = category;
                if (mDetail) mDetail.textContent = detail;
                if (mClient) mClient.textContent = client;
                if (mDate) mDate.textContent = date;
                if (mImg) {
                    mImg.setAttribute("src", imgUrl);
                    mImg.setAttribute("alt", `North Agency — ${title}`);
                }

                // Injection du Scope (Ce qui a été effectué)
                if (mScope) {
                    mScope.textContent = scope || "Non spécifié";
                }

                // Gestion et affichage conditionnel de l'avis client
                if (mReview) {
                    if (review) {
                        mReview.textContent = review;
                        mReview.style.display = "block";
                    } else {
                        mReview.style.display = "none";
                    }
                }

                // Gestion et affichage conditionnel du lien vers le site
                if (mLink) {
                    if (link) {
                        mLink.setAttribute("href", link);
                        mLink.style.display = "inline-flex";
                    } else {
                        mLink.style.display = "none";
                    }
                }

                // Activation de la modale
                modalOverlay.classList.add("modal-active");
            });
        });

        // Fonction globale de fermeture
        const closeModal = () => {
            modalOverlay.classList.remove("modal-active");
            // Évite le flash de l'ancien visuel à la prochaine ouverture
            setTimeout(() => { 
                if (mImg) mImg.setAttribute("src", ""); 
            }, 500);
        };

        // Déclencheurs de fermeture
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener("click", closeModal);
        }

        modalOverlay.addEventListener("click", (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });

        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && modalOverlay.classList.contains("modal-active")) {
                closeModal();
            }
        });
    }
});

// ==========================================
// 7. GESTION DU MENU MOBILE
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const mobileToggleBtn = document.querySelector('.mobile-menu-toggle');
    const mobileCloseBtn = document.querySelector('.mobile-menu-close');
    const mainNavWrapper = document.getElementById('main-nav');

    if (!mobileToggleBtn || !mobileCloseBtn || !mainNavWrapper) return;

    const floatingMenu = mainNavWrapper.querySelector('.floating-menu');
    const mobileSubmenu = document.getElementById('mobile-submenu-agence');
    const submenuBackBtn = mobileSubmenu ? mobileSubmenu.querySelector('.mobile-submenu-back') : null;
    const agenceListItem = mainNavWrapper.querySelector('.has-submenu');

    const openMenu = () => {
        mainNavWrapper.classList.add('is-open');
        document.body.classList.add('menu-open');
    };

    const closeSubmenu = () => {
        if (!mobileSubmenu) return;
        floatingMenu.classList.remove('submenu-active');
        mobileSubmenu.classList.remove('is-open');
    };

    const closeMenu = () => {
        mainNavWrapper.classList.remove('is-open');
        document.body.classList.remove('menu-open');
        closeSubmenu();
    };

    const openSubmenu = () => {
        if (!mobileSubmenu) return;
        floatingMenu.classList.add('submenu-active');
        mobileSubmenu.classList.add('is-open');
    };

    mobileToggleBtn.addEventListener('click', openMenu);
    mobileCloseBtn.addEventListener('click', closeMenu);

    if (agenceListItem) {
        agenceListItem.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                if (!e.target.closest('.submenu-link')) {
                    e.preventDefault();
                    e.stopPropagation();
                    openSubmenu();
                }
            }
        });
    }

    if (submenuBackBtn) {
        submenuBackBtn.addEventListener('click', closeSubmenu);
    }

    // Ferme le menu immédiatement sur tout lien de navigation (y compris sous-menu)
    document.querySelectorAll('.menu-link[href], .contact-floating-btn[href]').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) closeMenu();
        });
    });
});