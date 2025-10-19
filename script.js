const agreeBtn = document.getElementById('agreeBtn');
const formArea = document.getElementById('formArea');
const screens = document.querySelectorAll('.screen');

const phrases = [
  "☑️ I still agree",
  "☑️ I continue to agree",
  "☑️ I agree to agreeing",
  "☑️ Agreement cannot be undone",
  "☑️ I consent to being categorised",
  "☑️ I consent again (for clarity)",
  "☑️ I agree on your behalf",
  "☑️ I accept implied consent",
  "☑️ I agree to automatic participation"
];

let index = 0;

agreeBtn.onclick = () => {
  screens[0].classList.remove('active');
  screens[1].classList.add('active');
};

formArea.addEventListener('click', () => {
  if (index < phrases.length) {
    const newLine = document.createElement('p');
    newLine.textContent = phrases[index];
    formArea.appendChild(newLine);
    index++;
  } else {
    screens[1].classList.remove('active');
    screens[2].classList.add('active');
  }
});

