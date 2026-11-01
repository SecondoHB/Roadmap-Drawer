// ============================================================================
// 1. DATEN FÜR DEN STARTSEITEN-SLIDER
// ============================================================================

const stepData = {
  1: {
    number: '1',
    code: `&lt;!DOCTYPE html&gt;\n&lt;html&gt;\n  &lt;!-- Das nackte Gerüst --&gt;\n&lt;/html&gt;`,
  },
  2: {
    number: '2',
    code: `&lt;!DOCTYPE html&gt;\n&lt;html&gt;\n  &lt;head&gt;\n    &lt;meta charset="UTF-8"&gt;\n    &lt;title&gt;Salon&lt;/title&gt;\n  &lt;/head&gt;\n&lt;/html&gt;`,
  },
  3: {
    number: '99',
    code: `&lt;!-- Schritt 99: Das fertige CSS/JS Wunder --&gt;\n&lt;header class="hero-salon"&gt;\n  &lt;h1&gt;Meisterhafte Schnitte&lt;/h1&gt;\n  &lt;button onclick="openBooking()"&gt;Termin&lt;/button&gt;\n&lt;/header&gt;`,
  },
};

// ============================================================================
// 2. INITIALISIERUNG
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // A: STARTSEITEN-SLIDER
  // --------------------------------------------------------------------------

  const slider = document.getElementById('step-slider');
  const stepNumberSpan = document.getElementById('step-number');
  const codeDisplayElement = document.getElementById('code-display');

  if (slider && stepNumberSpan && codeDisplayElement) {
    slider.addEventListener('input', (e) => {
      const currentStep = e.target.value;
      const data = stepData[currentStep];

      if (data) {
        stepNumberSpan.textContent = data.number;
        codeDisplayElement.innerHTML = data.code;
      }
    });
  }

  // --------------------------------------------------------------------------
  // B: ROADMAP – NATIVER MODALER DIALOG (Reihenfolge korrigiert!)
  // --------------------------------------------------------------------------

  const menuToggle = document.getElementById('menu-toggle');
  const menuClose = document.getElementById('menu-close');
  const drawer = document.getElementById('roadmap-drawer');

  if (menuToggle && menuClose && drawer) {
    const menuLinks = Array.from(drawer.querySelectorAll('.drawer-list a'));

    // Dialog öffnen
    const openMenu = () => {
      if (drawer.open) return;

      const activeLink = menuLinks.find((link) =>
        link.hasAttribute('aria-current'),
      );

      drawer.showModal();
      menuToggle.setAttribute('aria-expanded', 'true');

      requestAnimationFrame(() => {
        if (activeLink) {
          activeLink.focus();
        } else {
          menuClose.focus();
        }
      });
    };

    // Dialog schließen
    const closeMenu = () => {
      if (!drawer.open) return;
      drawer.close();
    };

    // Öffnen und Schließen Events zuweisen
    menuToggle.addEventListener('click', openMenu);
    menuClose.addEventListener('click', closeMenu);

    // Fokus nach dem Schließen zurückgeben (Barrierefreiheit)
    drawer.addEventListener('close', () => {
      menuToggle.setAttribute('aria-expanded', 'false');

      // Fokus nur zurückgeben, wenn der Fokus noch im Dialog liegt
      if (
        drawer.contains(document.activeElement) ||
        document.activeElement === document.body
      ) {
        menuToggle.focus();
      }
    });

    // Fokus-Trap und Pfeiltasten-Navigation kombinieren
    drawer.addEventListener('keydown', (e) => {
      // 1. Zuerst alle interaktiven Elemente im Drawer sammeln
      const focusableElements = Array.from(
        drawer.querySelectorAll(
          'button, a, input, select, textarea, [tabindex="0"]',
        ),
      );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // --- WASSERDICHTER FOKUS-TRAP (TAB-TASTE) ---
      if (e.key === 'Tab') {
        // Rückwärts-Tab (Shift + Tab) am ersten Element -> Springe zum letzten Element
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
          return;
        }
        // Vorwärts-Tab am letzten Element -> Springe zum ersten Element (X-Button)
        if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
          return;
        }
      }

      // --- DEINE BESTEHENDE PFEILTASTEN-NAVIGATION ---
      if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
        if (menuLinks.length === 0) return;

        const currentIndex = menuLinks.indexOf(document.activeElement);
        if (currentIndex === -1) return;

        let nextIndex;

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            nextIndex = (currentIndex + 1) % menuLinks.length;
            break;

          case 'ArrowUp':
            e.preventDefault();
            nextIndex =
              (currentIndex - 1 + menuLinks.length) % menuLinks.length;
            break;

          case 'Home':
            e.preventDefault();
            nextIndex = 0;
            break;

          case 'End':
            e.preventDefault();
            nextIndex = menuLinks.length - 1;
            break;
        }

        menuLinks[nextIndex].focus();
      }
    });
  }

  // --------------------------------------------------------------------------
  // C: BARRIEREFREIER COPY-BUTTON
  // --------------------------------------------------------------------------

  const copyBtn = document.querySelector('.btn-copy');
  const codeElement = document.getElementById('code-to-copy');
  const copyStatus = document.getElementById('copy-status');

  if (copyBtn && codeElement && copyStatus) {
    const originalLabel = 'Code in die Zwischenablage kopieren';

    copyBtn.addEventListener('click', async () => {
      const textToCopy = codeElement.textContent;

      try {
        await navigator.clipboard.writeText(textToCopy);

        const btnText = copyBtn.querySelector('.copy-btn-text');
        copyBtn.classList.add('copied');

        if (btnText) {
          btnText.textContent = 'Kopiert!';
        }

        copyBtn.setAttribute('aria-label', 'Code erfolgreich kopiert');
        copyStatus.textContent = 'Code wurde in die Zwischenablage kopiert.';

        setTimeout(() => {
          copyBtn.classList.remove('copied');

          if (btnText) {
            btnText.textContent = 'Kopieren';
          }

          copyBtn.setAttribute('aria-label', originalLabel);
          copyStatus.textContent = '';
        }, 2000);
      } catch (err) {
        console.error('Fehler beim Kopieren:', err);
        copyStatus.textContent =
          'Kopieren fehlgeschlagen. Bitte markiere den Code und kopiere ihn manuell.';
      }
    });
  }
});
