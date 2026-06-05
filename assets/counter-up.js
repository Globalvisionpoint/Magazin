theme.counterup = (function () {
  function funfact(e) {
    const wrapper = document.getElementById(`${e.id}`);
    if (wrapper) {
      const counters = wrapper.querySelectorAll(".js-counter");
      const duration = 1000;
      let isCounted = false;

      const animateCounter = function (counter) {
        const countTo = parseInt(counter.dataset.count, 10) || 0;
        const startTime = performance.now();

        const tick = function (now) {
          const progress = Math.min((now - startTime) / duration, 1);
          counter.textContent = String(Math.round(countTo * progress));
          if (progress < 1) {
            requestAnimationFrame(tick);
          }
        };

        requestAnimationFrame(tick);
      };

      const runCounters = function () {
        if (isCounted) return;
        isCounted = true;
        counters.forEach(animateCounter);
      };

      if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                runCounters();
                observer.disconnect();
              }
            });
          },
          { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
        );

        observer.observe(wrapper);
      } else {
        runCounters();
      }
    }
  }
  return funfact;
})();