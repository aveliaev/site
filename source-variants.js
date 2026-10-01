const toast = document.querySelector('.choice-toast');
document.querySelectorAll('[data-choice]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-choice]').forEach((item) => {
      item.classList.remove('chosen');
      item.textContent = 'Выбрать';
    });
    button.classList.add('chosen');
    button.textContent = 'Выбрано ✓';
    toast.querySelector('strong').textContent = button.dataset.choice;
    toast.hidden = false;
    window.clearTimeout(window.choiceTimer);
    window.choiceTimer = window.setTimeout(() => { toast.hidden = true; }, 2400);
  });
});

const butterflySearch = document.querySelector('#butterfly-search');
document.querySelector('.replay-search')?.addEventListener('click', () => {
  const animatedParts = butterflySearch.querySelectorAll('.flying-butterfly, .search-progress i, .return-answer');
  animatedParts.forEach((item) => { item.style.animation = 'none'; });
  void butterflySearch.offsetWidth;
  animatedParts.forEach((item) => { item.style.animation = ''; });
});
