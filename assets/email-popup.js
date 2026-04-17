if (!customElements.get('email-popup')) {
  customElements.define('email-popup', class EmailPopup extends HTMLElement {
    constructor() {
      super();

      if (window.location.pathname === "/challenge") {
        return;
      }

      this.popup = this.querySelector(".email__popup--mdoal__content");
      this.closePopup = this.querySelectorAll(".email__popup--toggle, .email-popup-overlay");
      this.hidePopup = this.querySelector('.email__popup--hide');
      this.cookieName = "email-popup";
      this.isTestMode = this.dataset.mode === "test";
      this.isMobileViewport = window.matchMedia("(max-width: 749px)").matches;
      this.openTimeout = null;
      this.fallbackTimeout = null;

      this.closePopup.forEach((item) => {
        item.addEventListener("click", this.close.bind(this));
      });
      this.hidePopup?.addEventListener("click", this.hide.bind(this));

      if (!this.getCookie(this.cookieName) || this.isTestMode) {
        this.init();
      }

      if (window.Shopify && Shopify.designMode) {
        document.addEventListener("shopify:section:load", (event) =>
          editorShopifyEvent(event, this, () => this.open.bind(this))
        );
        document.addEventListener("shopify:section:select", (event) =>
          editorShopifyEvent(event, this, this.open.bind(this))
        );
        document.addEventListener("shopify:section:deselect", (event) =>
          editorShopifyEvent(event, this, this.close.bind(this))
        );
      }
    }

    init() {
      if (window.Shopify && Shopify.designMode) {
        return;
      }

      const configuredDelay = parseInt(this.dataset.delay, 10) || 0;
      const openDelay = this.isTestMode ? configuredDelay * 1000 : (configuredDelay > 0 ? configuredDelay * 1000 : 1500);

      this.queueOpen(openDelay);
    }

    queueOpen(delay) {
      this.clearTimers();

      const scheduleOpen = () => {
        this.openTimeout = window.setTimeout(() => {
          this.open();
        }, delay);
      };

      if (document.hidden) {
        document.addEventListener(
          "visibilitychange",
          () => {
            if (!document.hidden) {
              scheduleOpen();
            }
          },
          { once: true }
        );
        return;
      }

      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(scheduleOpen, { timeout: 2000 });
      } else {
        scheduleOpen();
      }
    }

    removeInteractionListeners() {
      if (!this.interactionEvents) {
        return;
      }

      this.interactionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, this.interactionHandler);
      });

      this.interactionHandler = null;
    }

    clearTimers() {
      window.clearTimeout(this.openTimeout);
      window.clearTimeout(this.fallbackTimeout);
    }

    open() {
      if (!this.popup || this.popup.classList.contains('popup-open')) {
        return;
      }

      document.body.classList.add('email-popup-show');
      this.popup.classList.add('popup-open');
    }

    closePopupState() {
      if (!this.popup) {
        return;
      }

      this.clearTimers();
      document.body.classList.remove('email-popup-show');
      this.popup.classList.add('popup-closing');
      setTimeout(() => {
        this.popup.classList.remove('popup-open');
        this.popup.classList.remove('popup-closing');
      }, 500);
    }

    close() {
      this.closePopupState();

      if (this.isTestMode) {
        this.removeCookie(this.cookieName);
      }
    }

    hide() {
      this.closePopupState();
      this.setCookie(this.cookieName, this.dataset.expire);
    }

    disconnectedCallback() {
      this.clearTimers();
      document.body.classList.remove('email-popup-show');
    }

    getCookie(name) {
      const match = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
      return match ? match[2] : null;
    }

    setCookie(name, expiry) {
      document.cookie = `${name}=true; max-age=${expiry * 24 * 60 * 60}; path=/`;
    }

    removeCookie(name) {
      document.cookie = `${name}=; max-age=0`;
    }
  });
}
