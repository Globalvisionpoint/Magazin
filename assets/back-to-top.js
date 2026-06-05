const scrollTop = document.getElementById('scroll__top');

if (scrollTop) {
  scrollTop.addEventListener('click', function () {
    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
  });

  let isTicking = false;
  const updateVisibility = function () {
    if (window.scrollY > 300) {
      scrollTop.classList.add('active');
    } else {
      scrollTop.classList.remove('active');
    }
    isTicking = false;
  };

  window.addEventListener(
    'scroll',
    function () {
      if (!isTicking) {
        isTicking = true;
        window.requestAnimationFrame(updateVisibility);
      }
    },
    { passive: true }
  );
}