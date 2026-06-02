document.addEventListener("DOMContentLoaded", () => {
    
    // --- CITATIONS (ACCUEIL) ---
    const quotes = [
        "Le médium est le message.",
        "L'information n'est pas la communication.",
        "On ne peut pas ne pas communiquer.",
        "Le village global.",
        "Penser les réseaux, comprendre les liens.",
        "Signes, sens et systèmes.",
        "La communication construit la réalité."
    ];

    const quoteElement = document.getElementById("dynamic-quote");
    let currentIndex = 0;

    function changeQuote() {
        if (!quoteElement) return;
        quoteElement.classList.remove("visible");
        
        setTimeout(() => {
            quoteElement.textContent = quotes[currentIndex];
            quoteElement.classList.add("visible");
            currentIndex = (currentIndex + 1) % quotes.length;
        }, 700);
    }

    if(quoteElement) {
        setTimeout(() => {
            changeQuote();
            setInterval(changeQuote, 4800);
        }, 900);
    }

    // --- TRANSITIONS DE SECTIONS (FLOU DIRECTIONNEL) ---
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

            currentActiveLink.classList.remove("active");
            this.classList.add("active");

            setTimeout(() => {
                currentActiveSection.classList.remove("active", exitClass);
                targetSection.classList.remove(enterClass);
                targetSection.classList.add("active");

                isAnimating = false;

                if (targetId === "agence") {
                    // Remet le scroll de l'agence au tout début lors de l'ouverture
                    document.querySelector(".agence-fullscreen-container").scrollTop = 0;
                    animateCounters();
                }
            }, 850);
        });
    });

    // --- COMPTEURS DYNAMIQUES ---
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
});

// À rajouter en fin de document DOMContentLoaded si vous désirez intercepter la soumission :
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

// --- GESTION DE LA MODALE PROJETS ---
    const projetCards = document.querySelectorAll(".projet-card");
    const modalOverlay = document.getElementById("projet-modal");
    const modalCloseBtn = document.querySelector(".modal-close-btn");

    // Éléments cibles à modifier dans la modale
    const mImg = document.getElementById("modal-img");
    const mTitle = document.getElementById("modal-title");
    const mCategory = document.getElementById("modal-category");
    const mDetail = document.getElementById("modal-detail");
    const mClient = document.getElementById("modal-client");
    const mDate = document.getElementById("modal-date");

    if (projetCards.length > 0 && modalOverlay) {
        
        // Ouverture de la modale au clic sur une carte
        projetCards.forEach(card => {
            card.addEventListener("click", () => {
                // Récupération des données typées depuis les attributs data de la carte
                const title = card.getAttribute("data-title");
                const category = card.getAttribute("data-category");
                const detail = card.getAttribute("data-detail");
                const client = card.getAttribute("data-client");
                const date = card.getAttribute("data-date");
                const imgUrl = card.getAttribute("data-img");

                // Injection dynamique dans la structure de la modale
                mTitle.textContent = title;
                mCategory.textContent = category;
                mDetail.textContent = detail;
                mClient.textContent = client;
                mDate.textContent = date;
                mImg.setAttribute("src", imgUrl);
                mImg.setAttribute("alt", `North Agency — ${title}`);

                // Activation de la classe CSS pour l'affichage fluide
                modalOverlay.classList.add("modal-active");
            });
        });

        // Fonction de fermeture
        const closeModal = () => {
            modalOverlay.classList.remove("modal-active");
            // Optionnel : vider l'image après l'animation pour éviter un flash visuel au prochain clic
            setTimeout(() => { mImg.setAttribute("src", ""); }, 500);
        };

        // Fermeture via le bouton X
        modalCloseBtn.addEventListener("click", closeModal);

        // Fermeture en cliquant sur l'arrière-plan flouté (en dehors du wrapper)
        modalOverlay.addEventListener("click", (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });

        // Fermeture avec la touche Échap
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && modalOverlay.classList.contains("modal-active")) {
                closeModal();
            }
        });
    }