// script.js
document.addEventListener('DOMContentLoaded', () => {
  const phrases = [
    'I still agree',
    'I continue to agree',
    'I agree again (for clarity)',
    'I agree to being archived',
    'I agree without reading',
    'I agree because it’s easier'
  ];
  const container = document.getElementById('checkboxes');
  const gridAnim = document.createElement('div');
  gridAnim.className = 'grid‑anim';
  document.body.appendChild(gridAnim);

  let step = 0;
  let locked = new Set();

  function triggerFlashAndGrid() {
    document.body.classList.add('flash‑red');
    gridAnim.style.transform = 'scale(1)';
    gridAnim.style.opacity = '1';
    setTimeout(() => {
      document.body.classList.remove('flash‑red');
      gridAnim.style.transform = 'scale(0)';
      gridAnim.style.opacity = '0';
    }, 300);
  }

  function addCheckbox(text) {
    const label = document.createElement('label');
    label.className = 'checkbox‑label';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.className = 'consent‑checkbox';
    label.appendChild(input);
    label.appendChild(document.createTextNode(text));
    container.appendChild(label);

    input.addEventListener('change', () => {
      if (!input.checked) {
        input.checked = true;
        return;
      }
      // lock this one:
      input.disabled = true;
      locked.add(input);
      triggerFlashAndGrid();

      step++;
      if (step < phrases.length) {
        addCheckbox(phrases[step]);
      } else {
        // All done – final action
        endSequence();
      }
    });
  }

  // Initial checkbox event:
  container.querySelector('.consent‑checkbox').addEventListener('change', (e) => {
    const input = e.target;
    if (!input.checked) {
      input.checked = true;
      return;
    }
    input.disabled = true;
    locked.add(input);
    triggerFlashAndGrid();
    // then add next
    addCheckbox(phrases[0]);
    step = 1;
  });

  function endSequence() {
    // Add glitch / flicker effect
    document.body.style.animation = 'glitchAnim 0.5s steps(2) infinite';
    document.body.style.color = '#fff';
    // Remove cursor halo
    const halo = document.getElementById('cursor‑halo');
    halo.style.display = 'none';

    // Wait a bit then show end screen
    setTimeout(() => {
      document.body.style.animation = '';
      document.body.innerHTML = 
        `<div class="end‑screen active">
           you shouldn’t have agreed to something you never read.<span class="underscore"></span>
         </div>`;
    }, 1000);
  }
});


