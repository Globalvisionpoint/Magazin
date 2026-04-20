/**
 * Syncs PDP price/compare-at/discount UI from variant JSON (Shopify storefront API shape).
 * Liquid can omit compare_at in some contexts; JSON from product.variants is authoritative.
 */
(function () {
  "use strict";

  function moneyTemplate() {
    var m = window.__SU_MONEY;
    if (!m) return null;
    return m.cc ? m.mfc : m.mf;
  }

  function formatMoney(cents, format) {
    if (cents == null || cents === "") return "";
    var raw =
      typeof cents === "string"
        ? cents.replace(/\./g, "").replace(/\s/g, "")
        : String(cents);
    var n = parseInt(raw, 10);
    if (isNaN(n)) return "";
    var amount = n / 100;
    var f = format || moneyTemplate();
    if (!f || typeof f !== "string") return String(amount);

    var ph = /\{\{\s*(\w+)\s*\}\}/;
    var match = f.match(ph);
    if (!match) return f;

    function fd(val, precision, thousands, decimal) {
      var p = precision != null ? precision : 2;
      var th = thousands || ",";
      var dec = decimal || ".";
      var fixed = val.toFixed(p);
      var parts = fixed.split(".");
      var intPart = parts[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1" + th);
      return parts[1] ? intPart + dec + parts[1] : intPart;
    }

    var out = "";
    switch (match[1]) {
      case "amount_with_comma_separator":
        out = fd(amount, 2, ".", ",");
        break;
      case "amount_no_decimals_with_comma_separator":
        out = fd(amount, 0, ".", ",");
        break;
      case "amount_with_space_separator":
        out = fd(amount, 2, " ", ",");
        break;
      case "amount_with_period_and_space_separator":
        out = fd(amount, 2, " ", ".");
        break;
      case "amount_no_decimals":
        out = fd(amount, 0, ",", ".");
        break;
      case "amount_no_decimals_with_space_separator":
        out = fd(amount, 0, " ");
        break;
      case "amount_with_apostrophe_separator":
        out = fd(amount, 2, "'", ".");
        break;
      case "amount":
      default:
        out = fd(amount, 2, ",", ".");
        break;
    }
    return f.replace(ph, out);
  }

  function getVariants(sectionId) {
    var sel =
      'variant-radios[data-section="' +
      sectionId +
      '"] script[type="application/json"][data-variant], variant-selects[data-section="' +
      sectionId +
      '"] script[type="application/json"][data-variant]';
    var picker = document.querySelector(sel);
    if (picker && picker.textContent) {
      try {
        return JSON.parse(picker.textContent);
      } catch (e) {
        return null;
      }
    }
    var fallback = document.getElementById("SU-variant-prices-" + sectionId);
    if (fallback && fallback.textContent) {
      try {
        return JSON.parse(fallback.textContent);
      } catch (e2) {
        return null;
      }
    }
    return null;
  }

  function findVariant(variants, id) {
    if (!variants || !variants.length) return null;
    var vid = parseInt(id, 10);
    for (var i = 0; i < variants.length; i++) {
      if (parseInt(variants[i].id, 10) === vid) return variants[i];
    }
    return variants[0];
  }

  function syncSection(sectionId) {
    var box = document.getElementById("price-" + sectionId);
    if (!box) return;

    var priceRoot = box.querySelector(".price");
    if (!priceRoot) return;

    var variants = getVariants(sectionId);
    if (!variants || !variants.length) return;

    var form = document.getElementById("product-form-" + sectionId);
    var idInput = form && form.querySelector('input[name="id"]');
    var variant = findVariant(
      variants,
      idInput && idInput.value ? idInput.value : variants[0].id
    );
    if (!variant) return;

    var price = variant.price;
    var cap = variant.compare_at_price;
    var onSale = cap != null && cap > price;
    var fmt = moneyTemplate();

    var reg = priceRoot.querySelector(".price__regular");
    var saleBlock = priceRoot.querySelector(".price__sale");
    var regSpan = reg && reg.querySelector(".price-item--regular");
    var compareEl =
      saleBlock &&
      saleBlock.querySelector(".price__compare .price-item--regular");
    var saleSpan = saleBlock && saleBlock.querySelector(".price-item--sale");

    if (onSale) {
      priceRoot.classList.add("price--on-sale");
      if (reg) reg.style.setProperty("display", "none", "important");
      if (saleBlock) {
        saleBlock.style.setProperty("display", "inline-flex", "important");
      }
      if (compareEl) compareEl.textContent = formatMoney(cap, fmt);
      if (saleSpan) saleSpan.textContent = formatMoney(price, fmt);

      var badge = priceRoot.querySelector(".save__disoucnt");
      if (!badge) {
        badge = document.createElement("div");
        badge.className = "save__disoucnt";
        badge.innerHTML =
          '<span class="discount__sale__text"><span class="sale__save--percent"></span><span class="discount__sale__off">mai ieftin</span></span>';
        priceRoot.appendChild(badge);
      }
      badge.style.display = "";
      var pctNode = badge.querySelector(".sale__save--percent");
      if (pctNode && cap > 0) {
        pctNode.textContent = Math.round(((cap - price) * 100.0) / cap) + "%";
      }
    } else {
      priceRoot.classList.remove("price--on-sale");
      if (reg) reg.style.removeProperty("display");
      if (saleBlock) {
        saleBlock.style.setProperty("display", "none", "important");
      }
      if (regSpan) regSpan.textContent = formatMoney(price, fmt);
      var badge2 = priceRoot.querySelector(".save__disoucnt");
      if (badge2) badge2.style.display = "none";
    }
  }

  function wire(sectionId) {
    var box = document.getElementById("price-" + sectionId);
    if (!box) return;

    var run = function () {
      syncSection(sectionId);
    };
    run();

    document.addEventListener("change", function (e) {
      if (!e.target || e.target.name !== "id") return;
      var form = e.target.closest && e.target.closest("form");
      if (!form || form.id !== "product-form-" + sectionId) return;
      run();
    });

    var obs = new MutationObserver(function () {
      clearTimeout(box._suPriceT);
      box._suPriceT = setTimeout(run, 10);
    });
    obs.observe(box, { childList: true, subtree: true });
  }

  function boot() {
    document.querySelectorAll('[id^="price-"]').forEach(function (el) {
      if (!el.id || el.id.indexOf("price-") !== 0) return;
      var sid = el.id.replace(/^price-/, "");
      if (!sid) return;
      wire(sid);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
