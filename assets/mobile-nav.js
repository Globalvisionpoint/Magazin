theme.headerSection = (function () {
  function header() {
    /* Mobile Menu Function */
    const MobileMenu = function () {
      const offcanvasOpen = document.querySelector(
          ".header__actions_btn--menu"
        ),
        offcanvasClose = document.querySelector(".offcanvas__close_btn"),
        offcanvasHeader = document.querySelector(".offcanvas-header"),
        offcanvasMenuAll = document.querySelectorAll(".offcanvas__menu"),
        body = document.querySelector("body");

      /* Open/Close Menu On Click Toggle Button */
      offcanvasOpen.addEventListener("click", function (e) {
        e.preventDefault();
        offcanvasHeader.classList.add("open");
        body.style.overflowY = "hidden";
      });
      offcanvasClose.addEventListener("click", function (e) {
        e.preventDefault();
        offcanvasHeader.classList.remove("open");
        body.style.overflowY = null;
      });
      /* Open/Close Sub Menu On Click Toggle Button */

      if (offcanvasMenuAll.length > 0) {
        offcanvasMenuAll.forEach((offcanvasMenu) => {
          /* Add a Button For SubMenu Toggle */
          offcanvasMenu
            .querySelectorAll(".offcanvas__sub_menu")
            .forEach(function (ul) {
              if (!ul.nextElementSibling || !ul.nextElementSibling.classList.contains("offcanvas__sub_menu_toggle")) {
                const subMenuToggle = document.createElement("button");
                subMenuToggle.classList.add("offcanvas__sub_menu_toggle");
                subMenuToggle.setAttribute("aria-label", "menu collapse");
                ul.parentNode.appendChild(subMenuToggle);
              }

              if (offcanvasMenu.classList.contains("mobile__categories--list")) {
                const subMenuChildren = Array.from(ul.children).filter(
                  (item) => item.classList.contains("offcanvas__sub_menu_li")
                );

                if (!ul.querySelector(".offcanvas__sub_menu_close_li")) {
                  const closeLi = document.createElement("li");
                  closeLi.className = "offcanvas__sub_menu_li offcanvas__sub_menu_close_li";
                  closeLi.innerHTML = '<button type="button" class="offcanvas__sub_menu_close_btn">Inchide</button>';
                  ul.insertBefore(closeLi, ul.firstChild);
                }

                if (subMenuChildren.length > 6 && !ul.querySelector(".offcanvas__see_all_li")) {
                  subMenuChildren.forEach((item, index) => {
                    if (index >= 6) {
                      item.classList.add("offcanvas__sub_menu_item--hidden");
                    }
                  });

                  const seeAllLi = document.createElement("li");
                  seeAllLi.className = "offcanvas__sub_menu_li offcanvas__see_all_li";
                  seeAllLi.innerHTML = '<button type="button" class="offcanvas__see_all_btn">Vezi tot</button>';
                  ul.appendChild(seeAllLi);
                }
              }
            });

          /* Submenu toggle */
          offcanvasMenu
            .querySelectorAll(".offcanvas__sub_menu_toggle")
            .forEach(function (toggle) {
              toggle.addEventListener("click", function (e) {
                e.preventDefault();
                const parent = this.parentElement;
                if (parent.classList.contains("active")) {
                  this.classList.remove("active");
                  parent.classList.remove("active");
                  parent
                    .querySelectorAll(".offcanvas__sub_menu")
                    .forEach(function (subMenu) {
                      subMenu.parentElement.classList.remove("active");
                      subMenu.nextElementSibling.classList.remove("active");
                      slideUp(subMenu);
                    });
                } else {
                  this.classList.add("active");
                  parent.classList.add("active");
                  slideDown(this.previousElementSibling);
                  getSiblings(parent).forEach(function (item) {
                    item.classList.remove("active");
                    item
                      .querySelectorAll(".offcanvas__sub_menu")
                      .forEach(function (subMenu) {
                        subMenu.parentElement.classList.remove("active");
                        subMenu.nextElementSibling.classList.remove("active");
                        slideUp(subMenu);
                      });
                  });
                }
              });
            });

            if (offcanvasMenu.classList.contains("mobile__categories--list")) {
              offcanvasMenu
                .querySelectorAll(".offcanvas__sub_menu_close_btn")
                .forEach(function (closeBtn) {
                  closeBtn.addEventListener("click", function (e) {
                    e.preventDefault();
                    const subMenu = this.closest(".offcanvas__sub_menu");
                    if (!subMenu) return;

                    subMenu.classList.remove("is-expanded");
                    const seeAllBtn = subMenu.querySelector(".offcanvas__see_all_btn");
                    if (seeAllBtn) {
                      seeAllBtn.textContent = "Vezi tot";
                    }

                    const parent = subMenu.parentElement;
                    const toggle = parent.querySelector(":scope > .offcanvas__sub_menu_toggle");
                    if (toggle) {
                      toggle.classList.remove("active");
                    }
                    parent.classList.remove("active");
                    slideUp(subMenu);
                  });
                });

              offcanvasMenu
                .querySelectorAll(".offcanvas__see_all_btn")
                .forEach(function (seeAllBtn) {
                  seeAllBtn.addEventListener("click", function (e) {
                    e.preventDefault();
                    const subMenu = this.closest(".offcanvas__sub_menu");
                    if (!subMenu) return;

                    subMenu.classList.toggle("is-expanded");
                    const isExpanded = subMenu.classList.contains("is-expanded");
                    this.textContent = isExpanded ? "Vezi mai putin" : "Vezi tot";
                  });
                });
            }
        });
      }

      document.addEventListener("click", function (event) {
        if (
          !event.target.closest(".header__actions_btn--menu") &&
          !event.target.classList.contains(
            ".header__actions_btn--menu".replace(/\./, "")
          )
        ) {
          if (
            !event.target.closest(".offcanvas-header") &&
            !event.target.classList.contains(
              ".offcanvas-header".replace(/\./, "")
            )
          ) {
            offcanvasHeader.classList.remove("open");
            body.style.overflowY = null;
          }
        }
      });

      /* Remove Mobile Menu Open Class & Hide Mobile Menu When Window Width in More Than 991 */
      const onMobileMenuResize = function () {
        if (window.outerWidth >= 992) {
          offcanvasHeader.classList.remove("open");
          body.style.overflowY = null;
        }
      };

      if (window.__themeMobileMenuResizeHandler) {
        window.removeEventListener("resize", window.__themeMobileMenuResizeHandler);
      }
      window.__themeMobileMenuResizeHandler = onMobileMenuResize;
      window.addEventListener("resize", window.__themeMobileMenuResizeHandler);
    };
    /* Mobile Menu Active */
    MobileMenu();

    /* Menu toggle buttons */
    const mobileMenuToggleButtons = document.querySelectorAll(
      ".mobile--menu-header-button"
    );
    const mobileMainMenu = document.querySelector(".mobile__main-menu--list");
    const mobileVerticalMenu = document.querySelector(
      ".mobile__categories--list"
    );
    if (mobileMenuToggleButtons.length > 0) {
      mobileMenuToggleButtons.forEach((button) => {
        button?.addEventListener("click", function (e) {
          mobileMenuToggleButtons.forEach((childButton) => {
            childButton.classList.remove("active");
          });
          if (button.classList.contains("mobile__main--menu")) {
            button.classList.add("active");
            if (mobileMainMenu.classList.contains("d-none")) {
              mobileMainMenu.classList.remove("d-none");
            }
            mobileVerticalMenu.classList.add("d-none");
          }
          if (button.classList.contains("mobile__categories--menu")) {
            button.classList.add("active");
            if (mobileVerticalMenu.classList.contains("d-none")) {
              mobileVerticalMenu.classList.remove("d-none");
            }
            mobileMainMenu.classList.add("d-none");
          }
        });
      });
    }
  }

  return header;
})();
