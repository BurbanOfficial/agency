document.addEventListener('DOMContentLoaded', () => {
  // Injecte automatiquement l'année en cours dans le span dédié
  document.getElementById('currentYear').textContent = new Date().getFullYear();
  const hamburger = document.getElementById('hamburger');
const menuOverlay = document.getElementById('menuOverlay');

hamburger.addEventListener('click', () => {
  // Votre logique existante pour ouvrir/fermer le menu
  // Exemple si vous basculez l'attribut data-open :
  const isOpen = menuOverlay.getAttribute('data-open') === 'true';
  
  if (!isOpen) {
    // Si le menu s'ouvre
    menuOverlay.setAttribute('data-open', 'true');
    hamburger.classList.add('open'); // Si vous animez les barres du hamburger
    
    // ON BLOQUE LE SCROLL
    document.body.classList.add('menu-open');
  } else {
    // Si le menu se ferme
    menuOverlay.setAttribute('data-open', 'false');
    hamburger.classList.remove('open');
    
    // ON REND LE SCROLL
    document.body.classList.remove('menu-open');
  }
});

  // 2. Génération automatique de l'effet de vague sur les lettres
  const menuLinks = document.querySelectorAll('.menu-link');

  menuLinks.forEach(link => {
    const text = link.textContent.trim();
    link.textContent = ''; // On vide le texte brut

    // Crée la ligne principale (Blanche)
    const mainRow = document.createElement('span');
    mainRow.classList.add('text-roll-row');

    // Crée la ligne clonée (Orange)
    const cloneRow = document.createElement('span');
    cloneRow.classList.add('text-roll-row', 'text-roll-clone');
    cloneRow.setAttribute('aria-hidden', 'true');

    // Découpe le texte lettre par lettre
    [...text].forEach((letter, index) => {
      // Gestion des espaces pour ne pas casser le layout
      const letterChar = letter === ' ' ? '&nbsp;' : letter;

      // Crée le span pour la ligne principale
      const spanMain = document.createElement('span');
      spanMain.classList.add('text-roll-letter');
      spanMain.innerHTML = letterChar;
      spanMain.style.setProperty('--i', index);
      mainRow.appendChild(spanMain);

      // Crée le span pour la ligne clonée
      const spanClone = document.createElement('span');
      spanClone.classList.add('text-roll-letter');
      spanClone.innerHTML = letterChar;
      spanClone.style.setProperty('--i', index);
      cloneRow.appendChild(spanClone);
    });

    // Injecte les deux rangées dans le lien
    link.appendChild(mainRow);
    link.appendChild(cloneRow);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('menuCanvasPoints');
  const ctx = canvas.getContext('2d');
  const menuOverlay = document.getElementById('menuOverlay');
  
  const step = 12; // Écart entre les points
  let points = [];
  let animationFrameId;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initPoints();
  }

  function initPoints() {
    points = [];
    for (let x = step / 2; x < canvas.width; x += step) {
      for (let y = step / 2; y < canvas.height; y += step) {
        
        // 15% de chance qu'un point clignote
        const isTwinkling = Math.random() < 0.15; 
        let colorType = 'white';

        if (isTwinkling) {
          // Si le point clignote, il a 40% de chance d'être orange, et 60% d'être blanc
          colorType = Math.random() < 0.40 ? 'orange' : 'white';
        }

        points.push({
          x: x,
          y: y,
          isTwinkling: isTwinkling,
          colorType: colorType,
          phase: Math.random() * Math.PI * 2, // Rythme décalé
          speed: 0.03 + Math.random() * 0.04  // Vitesse de clignotement
        });
      }
    }
  }

  function animate() {
    if (menuOverlay.getAttribute('data-open') !== 'true') return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    points.forEach(p => {
      if (p.isTwinkling) {
        p.phase += p.speed;
        
        // Intensité lumineuse oscillante pour l'effet de pulsation
        const intensity = (Math.sin(p.phase) + 1) / 2; 

        if (p.colorType === 'orange') {
          // Transition fluide entre le blanc tamisé de fond et l'orange vif (#ff6a00)
          const r = Math.round(15 + (255 - 15) * intensity);
          const g = Math.round(15 + (106 - 15) * intensity);
          const b = Math.round(20 + (0 - 20) * intensity);
          const a = 0.15 + (0.85 - 0.15) * intensity;
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        } else {
          // Clignotement blanc classique (devient très brillant)
          const alpha = 0.15 + (0.85 - 0.15) * intensity;
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        }
      } else {
        // Points fixes en arrière-plan (blanc très tamisé)
        ctx.fillStyle = `rgba(255, 255, 255, 0.15)`;
      }

      ctx.beginPath();
      ctx.fillRect(p.x, p.y, 1, 1); // Rendu pixel précis
    });

    animationFrameId = requestAnimationFrame(animate);
  }

  document.getElementById('hamburger').addEventListener('click', () => {
    setTimeout(() => {
      if (menuOverlay.getAttribute('data-open') === 'true') {
        resizeCanvas();
        animate();
      } else {
        cancelAnimationFrame(animationFrameId);
      }
    }, 50);
  });

  window.addEventListener('resize', () => {
    if (menuOverlay.getAttribute('data-open') === 'true') {
      resizeCanvas();
    }
  });
});

function updateAgencyStatus() {
  const now = new Date();
  const day = now.getDay(); // 0 = Dimanche, 1 = Lundi, ..., 6 = Samedi
  const hour = now.getHours();
  const minutes = now.getMinutes();

  const msgElement = document.getElementById('statusMessage');
  const urgencyElement = document.getElementById('statusUrgency');
  const phoneBtn = document.getElementById('phoneButton');
  const phoneTxt = document.getElementById('phoneButtonText');

  // Configuration de l'agence
  const openHour = 9;
  const closeHour = 18;
  const isWeekendClosed = (day === 0); // Fermé le dimanche

  const currentTotalMinutes = hour * 60 + minutes;
  const closeTotalMinutes = closeHour * 60;

  let isOpen = false;
  let isNearClosing = false;

  if (!isWeekendClosed && hour >= openHour && hour < closeHour) {
    isOpen = true;
    // S'il reste moins de 45 minutes avant la fermeture (entre 17h15 et 17h59)
    if (closeTotalMinutes - currentTotalMinutes <= 45) {
      isNearClosing = true;
    }
  }

  // Application de la logique d'affichage
  if (isOpen) {
    msgElement.innerHTML = "Nous sommes <span style='color: #4cd964;'>actuellement en ligne !</span>";
    phoneBtn.classList.remove('disabled');
    phoneTxt.textContent = "Afficher le numéro de téléphone";

    if (isNearClosing) {
      urgencyElement.textContent = "Nous allons bientôt fermer. Saisissez votre chance ou revenez demain !";
    } else {
      urgencyElement.textContent = ""; // Pas de message d'urgence en journée
    }

  } else {
    // Cas où l'agence est FERMÉE
    phoneBtn.classList.add('disabled');
    phoneTxt.textContent = "Agence fermée";
    urgencyElement.textContent = "";

    if (day === 6 || day === 0) {
      // Si on est samedi soir ou dimanche
      msgElement.textContent = `Nous serons de retour lundi à ${openHour}h00`;
    } else {
      // En semaine, la nuit
      msgElement.textContent = `Nous serons de retour demain à ${openHour}h00`;
    }
  }
}

// Lancer la vérification au clic sur le hamburger
document.getElementById('hamburger').addEventListener('click', () => {
  updateAgencyStatus();
});