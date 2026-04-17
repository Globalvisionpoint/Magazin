if (!customElements.get("cart-note")) {
  customElements.define(
    "cart-note",
    class carNote extends HTMLElement {
      constructor() {
        super();
        this.cartNoteData = this.querySelector("#cartNote");
        this.button = this.querySelector("button.button__save");

        this.carInit();
        this.button.addEventListener("click", this.onSave.bind(this));
      }

      carInit() {
        fetch("/cart.js")
          .then((response) => response.json())
          .then((json) => {
            if(json.note !== null){
              this.cartNoteData.value = json.note;
            }
          })
          .catch((err) => console.log(err));
      }

      onSave() {
        let noteUpdate = this.cartNoteData.value;
        this.button.classList.add("loading");
        let body = JSON.stringify({
          note: noteUpdate,
        });
        fetch(`${routes.cart_update_url}`, { ...fetchConfig(), ...{ body } })
          .then((response) => {
            if (response.ok) {
              this.button.classList.remove("loading");
              this.closest("details").removeAttribute("open");
              return response.json();
            }
          })
          .catch((e) => {
            console.error(e);
          });
      }
    }
  );
}

if (!customElements.get("shipping-calculator")) {
  customElements.define(
    "shipping-calculator",
    class ShippingCalculator extends HTMLElement {
      constructor() {
        super();
        this.button = this.querySelector("button.button__save");

        this.shippingCountry = this.querySelector("#all--countries-shipping");
        this.countryState = this.querySelector("#AddressProvince_shipping");
        this.shippingCountryZip = this.querySelector("#ShippingAddressZip");

        this.shippingRatePackage = this.querySelector(".shipping_rate_package");
        this.shippingAddressWrapper = this.querySelector(
          ".shipping_rate_message"
        );
        this.shippingAddressCount = this.querySelector(
          ".shipping_address_count"
        );

        this.initCountries();
        this.button.addEventListener("click", this.onSave.bind(this));
      }

      initCountries() {
        if (this.shippingCountry && this.countryState) {
          if (Shopify && Shopify.CountryProvinceSelector) {
            new Shopify.CountryProvinceSelector(
              "all--countries-shipping",
              "AddressProvince_shipping",
              {
                hideElement: "AddressProvinceContainerNewShiping",
              }
            );
          }
        }
      }

      onSave() {
        this.shippingRatePackage.innerHTML = "";
        if (this.shippingCountry.value !== "---") {
          this.button.classList.add("loading");
          const zip = encodeURIComponent(this.shippingCountryZip.value || "");
          const country = encodeURIComponent(this.shippingCountry.value || "");
          const province = encodeURIComponent(this.countryState.value || "");
          fetch(
            `/cart/shipping_rates.json?shipping_address%5Bzip%5D=${zip}&shipping_address%5Bcountry%5D=${country}&shipping_address%5Bprovince%5D=${province}`
          )
            .then((response) => {
              if (response.ok) {
                return response.json();
              } else {
                throw `${window.shipping.wrong_message}`;
              }
            })
            .then((response) => {
              this.button.classList.remove("loading");

              this.shippingAddressWrapper.classList.remove("no-js-inline");
              this.shippingAddressCount.innerText = `${response.shipping_rates.length}`;
              response.shipping_rates.map((item) => {
                let text = document.createElement("P");
                text.setAttribute("class", "mb-0");
                text.innerText = `${item.name}: ${shopCurrencySymbol}${item.price}`;
                this.shippingRatePackage.appendChild(text);
              });
            })
            .catch((e) => {
              this.button.classList.remove("loading");
              this.shippingAddressWrapper.classList.add("no-js-inline");
              this.shippingRatePackage.textContent = e;
              this.shippingRatePackage.classList.add("error", "mt-15");
            });
        } else {
          this.shippingAddressWrapper.classList.add("no-js-inline");
          this.shippingRatePackage.textContent = window.shipping.country_label;
          this.shippingRatePackage.classList.add("error", "mt-15");
        }
      }
    }
  );
}

if (!customElements.get("discount-code")) {
  customElements.define(
    "discount-code",
    class DiscountCode extends HTMLElement {
      constructor() {
        super();
        this.wrongMessage = this.querySelector(".coupon_wrong_message");
        this.button = this.querySelector("button.button__save");

        this.button.addEventListener("click", this.onSave.bind(this));
        this.couponCodeValue = localStorage.getItem("coupon");
        this.querySelector("#coupon_code").value = this.couponCodeValue;
      }

      onSave() {
        this.couponCode = this.querySelector("#coupon_code").value;
        localStorage.setItem("coupon", this.couponCode);
        if (this.couponCode) {
          this.closest("details").removeAttribute("open");
          this.wrongMessage.classList.add("no-js-inline");
        } else {
          this.wrongMessage.classList.remove("no-js-inline");
        }
      }
    }
  );
}

if (!customElements.get("gift-wrap-message")) {
  customElements.define(
    "gift-wrap-message",
    class GiftMessage extends HTMLElement {
      constructor() {
        super();
        this.giftMessage = this.querySelector("#giftMessage");
        this.button = this.querySelector("button.button__save");

        this.giftMessageInit();
        this.button.addEventListener("click", this.onSave.bind(this));
      }

      giftMessageInit() {
        fetch("/cart.js")
          .then((response) => response.json())
          .then((json) => {
            if(json.attributes.hasOwnProperty('gift_note')){
              this.giftMessage.value = json.attributes.gift_note;
            }  
          })
          .catch((err) => console.log(err));
      }

      onSave() {
        let giftMessageValue = this.giftMessage.value;
        this.button.classList.add("loading");
        let body = JSON.stringify({
          attributes: { gift_note: giftMessageValue },
        });
        fetch(`${routes.cart_update_url}`, { ...fetchConfig(), ...{ body } })
          .then((response) => {
            if (response.ok) {
              this.button.classList.remove("loading");
              this.closest("details").removeAttribute("open");
              return response.json();
            }
          })
          .catch((e) => {
            console.error(e);
          });
      }
    }
  );
}
