const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-menu');

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  mobileMenu.hidden = isOpen;
  document.body.style.overflow = isOpen ? '' : 'hidden';
});

mobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

const smartQuestionForm = document.querySelector('#smart-question-form');
const smartQuestionInput = document.querySelector('#smart-question-input');
const quickAnswer = document.querySelector('#quick-answer');
const quickAnswerText = document.querySelector('#quick-answer-text');
const quickSourceTitle = document.querySelector('#quick-source-title');

const sampleQuestions = [
  'Какие баллы ЕГЭ нужны для подтверждения БВИ?',
  'Что будет, если я не сдам экзамен с первого раза?',
  'Какие документы нужны для заселения в общежитие?',
  'Как оформить академический отпуск?'
];

let sampleIndex = 0;
let characterIndex = 0;
let isDeleting = false;
let animationTimer;
let userIsTyping = false;

const fitQuestionOnOneLine = () => {
  if (!smartQuestionInput) return;

  smartQuestionInput.style.fontSize = '';
  const baseSize = Number.parseFloat(window.getComputedStyle(smartQuestionInput).fontSize);
  if (smartQuestionInput.scrollWidth <= smartQuestionInput.clientWidth) return;

  const fittedSize = Math.max(16, baseSize * ((smartQuestionInput.clientWidth - 6) / smartQuestionInput.scrollWidth));
  smartQuestionInput.style.fontSize = `${fittedSize}px`;
};

const animateQuestion = () => {
  if (!smartQuestionInput || userIsTyping || document.activeElement === smartQuestionInput) return;

  const question = sampleQuestions[sampleIndex];
  characterIndex += isDeleting ? -1 : 1;
  smartQuestionInput.value = question.slice(0, characterIndex);
  fitQuestionOnOneLine();

  let delay = isDeleting ? 28 : 52;
  if (!isDeleting && characterIndex === question.length) {
    isDeleting = true;
    delay = 1750;
  } else if (isDeleting && characterIndex === 0) {
    isDeleting = false;
    sampleIndex = (sampleIndex + 1) % sampleQuestions.length;
    delay = 420;
  }

  animationTimer = window.setTimeout(animateQuestion, delay);
};

if (smartQuestionInput) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    smartQuestionInput.value = sampleQuestions[0];
    fitQuestionOnOneLine();
  } else {
    animationTimer = window.setTimeout(animateQuestion, 500);
  }

  smartQuestionInput.addEventListener('focus', () => {
    window.clearTimeout(animationTimer);
    if (!userIsTyping) {
      smartQuestionInput.value = '';
      fitQuestionOnOneLine();
    }
  });

  smartQuestionInput.addEventListener('input', () => {
    userIsTyping = true;
    fitQuestionOnOneLine();
    if (quickAnswer) quickAnswer.hidden = true;
  });

  smartQuestionInput.addEventListener('blur', () => {
    if (smartQuestionInput.value.trim()) return;
    userIsTyping = false;
    characterIndex = 0;
    isDeleting = false;
    animationTimer = window.setTimeout(animateQuestion, 600);
  });
}

window.addEventListener('resize', fitQuestionOnOneLine);

smartQuestionForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const question = smartQuestionInput.value.trim();
  if (!question) return;

  window.clearTimeout(animationTimer);
  userIsTyping = true;

  if (/пересда|экзамен|не сдам/i.test(question)) {
    quickAnswerText.textContent = 'Обычно студенту дают возможность закрыть задолженность в установленные вузом сроки. Точный порядок и число попыток указаны в положении об аттестации.';
    quickSourceTitle.textContent = 'Положение об аттестации';
  } else if (/общежит|заселен/i.test(question)) {
    quickAnswerText.textContent = 'Для заселения понадобятся документы из списка университета и подтверждение предоставленного места. Сроки и порядок зависят от кампуса.';
    quickSourceTitle.textContent = 'Правила проживания';
  } else if (/академ/i.test(question)) {
    quickAnswerText.textContent = 'Академический отпуск оформляется по заявлению и при наличии подтверждающих оснований. Решение принимает университет после проверки документов.';
    quickSourceTitle.textContent = 'Положение об академическом отпуске';
  } else {
    quickAnswerText.textContent = 'Для подтверждения БВИ нужен установленный вузом балл ЕГЭ по профильному предмету. Точное значение зависит от олимпиады и программы.';
    quickSourceTitle.textContent = 'Правила приёма';
  }

  quickAnswer.hidden = false;
});
