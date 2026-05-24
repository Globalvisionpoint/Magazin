class loadMoreProduct extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", this.onClickLoadMore);
    this.initialProductsHTML = null;
    this.initialButtonHTML = null;
  }

  setButtonState = (button, expanded) => {
    if (!button) return;

    const labelNode = button.querySelector(".loadMoreBtn__label");
    const iconNode = button.querySelector(".loadMoreBtn__icon");
    const expandLabel = button.dataset.labelExpand || "Vezi toate produsele";
    const collapseLabel = button.dataset.labelCollapse || "Restrange lista";

    button.dataset.state = expanded ? "expanded" : "collapsed";
    button.classList.toggle("is-expanded", expanded);

    if (labelNode) {
      labelNode.textContent = expanded ? collapseLabel : expandLabel;
    }
    if (iconNode) {
      iconNode.textContent = expanded ? "▴" : "▾";
    }
  };

  onClickLoadMore = async (evt) => {
    const loadMoreBtn = evt.target.closest(".loadMoreBtn");
    if (!loadMoreBtn || !this.contains(loadMoreBtn)) return;

    evt.preventDefault();

    const productWrapper = this.querySelector(".collection__product");
    const loadMoreBtnWrapper = this.querySelector(".loadMoreWrapper");

    if (!productWrapper || !loadMoreBtnWrapper) return;

    if (loadMoreBtn.dataset.state === "expanded") {
      if (this.initialProductsHTML) {
        productWrapper.innerHTML = this.initialProductsHTML;
      }
      if (this.initialButtonHTML) {
        loadMoreBtnWrapper.innerHTML = this.initialButtonHTML;
      }
      return;
    }

    if (!this.initialProductsHTML) {
      this.initialProductsHTML = productWrapper.innerHTML;
    }
    if (!this.initialButtonHTML) {
      this.initialButtonHTML = loadMoreBtnWrapper.innerHTML;
    }

    const collectionUrl = loadMoreBtn.dataset.url;
    const sectionId = loadMoreBtn.dataset.sectionId;
    let currentPage = parseInt(loadMoreBtn.dataset.currentPage, 10);

    if (!collectionUrl || !sectionId || Number.isNaN(currentPage)) return;

    loadMoreBtn.classList.add("loading");

    try {
      let hasMore = true;
      while (hasMore) {
        const nextPage = currentPage + 1;
        const response = await fetch(
          `${collectionUrl}?page=${nextPage}&section_id=${sectionId}`
        );
        const resText = await response.text();

        const loadedDoc = new DOMParser().parseFromString(resText, "text/html");
        const loadedProducts = loadedDoc.querySelector(".collection__product");
        if (!loadedProducts) break;

        productWrapper.insertAdjacentHTML("beforeend", loadedProducts.innerHTML);

        const nextButton = loadedDoc.querySelector(".loadMoreWrapper .loadMoreBtn");
        if (nextButton) {
          currentPage = parseInt(nextButton.dataset.currentPage, 10);
          if (Number.isNaN(currentPage)) {
            hasMore = false;
          }
        } else {
          hasMore = false;
        }
      }

      this.setButtonState(loadMoreBtn, true);
    } catch (error) {
      console.log("error", error);
    } finally {
      loadMoreBtn.classList.remove("loading");
    }
  };
}
customElements.define("load-more-product", loadMoreProduct);
