theme.footerSection = (function () {
  function footer() {
    // Mobile navigation bar
    const mobileNavigateBar = document.querySelector(
      ".mobile__navigation--bar"
    );
    if (mobileNavigateBar) {
      document.documentElement.style.setProperty(
        "--mobile-navigation-bar-height",
        `${mobileNavigateBar.clientHeight}px`
      );

      window.addEventListener("resize", function () {
        document.documentElement.style.setProperty(
          "--mobile-navigation-bar-height",
          `${mobileNavigateBar.clientHeight}px`
        );
      });
    }
    // Footer widget column collapsible
    let accordion = true;
    const footerWidgetAccordion = function () {
      accordion = false;
      document
        .querySelectorAll(".footer__widget_toggle")
        .forEach(function (item) {
          // Special handling for newsletter section on mobile/tablet
          const footerWidget = item.closest('.footer__widget');
          const isNewsletter = footerWidget && footerWidget.classList.contains('footer__widget--newsletter');
          if (isNewsletter && window.outerWidth < 990) {
            // Always open, never closable
            footerWidget.classList.add('active');
            const footerWidgetInner = footerWidget.querySelector('.footer__widget_inner');
            if (footerWidgetInner) {
              footerWidgetInner.style.display = '';
              slideDown(footerWidgetInner);
            }
            // Hide or disable the toggle button
            item.style.display = 'none';
            return;
          }
          // Default accordion behavior for other widgets
          item.addEventListener("click", function () {
            const footerWidget = this.closest(".footer__widget"),
              footerWidgetInner = footerWidget.querySelector(
                ".footer__widget_inner"
              );
            if (footerWidget.classList.contains("active")) {
              footerWidget.classList.remove("active");
              slideUp(footerWidgetInner);
            } else {
              footerWidget.classList.add("active");
              slideDown(footerWidgetInner);
              getSiblings(footerWidget.parentElement).forEach(function (item) {
                const footerWidget = item.querySelector(".footer__widget"),
                  footerWidgetInner = item.querySelector(
                    ".footer__widget_inner"
                  );

                if (
                  footerWidget &&
                  footerWidget.classList.contains("footer__widget--newsletter") &&
                  window.outerWidth < 990
                ) {
                  footerWidget.classList.add("active");
                  if (footerWidgetInner) {
                    footerWidgetInner.style.display = "";
                  }
                  return;
                }

                footerWidget.classList.remove("active");
                slideUp(footerWidgetInner);
              });
            }
          });
        });
    };
    if (accordion) {
      footerWidgetAccordion();
    }
    // On resize, re-apply always-open for newsletter on mobile/tablet
    window.addEventListener("resize", function () {
      document.querySelectorAll('.footer__widget--newsletter').forEach(function (item) {
        if (window.outerWidth < 990) {
          item.classList.add('active');
          const inner = item.querySelector('.footer__widget_inner');
          if (inner) {
            inner.style.display = '';
            slideDown(inner);
          }
          const toggle = item.querySelector('.footer__widget_toggle');
          if (toggle) toggle.style.display = 'none';
        } else {
          const toggle = item.querySelector('.footer__widget_toggle');
          if (toggle) toggle.style.display = '';
        }
      });
    });
    window.addEventListener("resize", function () {
      document.querySelectorAll(".footer__widget").forEach(function (item) {
        if (window.outerWidth >= 990) {
          item.classList.remove("active");
          item.querySelector(".footer__widget_inner").style.display = "";
        }
      });
      if (accordion) {
        footerWidgetAccordion();
      }
    });
  }
  return footer;
})();
