/**
 * Learning materials page: tag filtering (sidebar), keyword search, and sorting.
 *
 * All materials are rendered by Jekyll and filtered/sorted client side, so the
 * page still works without JavaScript (default order is "recently updated").
 */
class LearningMaterialsBrowser {

    constructor(root) {
        this.root = root;
        this.grid = root.querySelector("#lm-grid");
        this.cards = Array.from(root.querySelectorAll(".lm-card-col"));
        this.tagCheckboxes = Array.from(root.querySelectorAll("input[data-lm-tag]"));
        this.searchInput = root.querySelector("#lm-search-input");
        this.sortSelect = root.querySelector("#lm-sort-select");
        this.countText = root.querySelector("#lm-count");
        this.activeTagContainer = root.querySelector("#lm-active-tags");
        this.clearTagsButton = root.querySelector("#lm-clear-tags");
        this.resetButton = root.querySelector("#lm-reset-all");
        this.noResults = root.querySelector("#lm-no-results");

        this.selectedTags = new Set();
        this.searchTerm = "";
        // Featured materials lead the list until the visitor picks a sort order.
        this.featuredFirst = true;

        // Cache the values we filter and sort on.
        this.cards.forEach((card) => {
            card.lmTags = (card.dataset.tags || "").split("|").filter(Boolean);
            card.lmSearch = (card.dataset.search || "").toLowerCase();
            card.lmTitle = (card.dataset.title || "").toLowerCase();
            card.lmUpdated = card.dataset.updated || "";
            card.lmFeatured = card.dataset.featured === "true";
        });
    }

    initialize() {
        this.tagCheckboxes.forEach((checkbox) => {
            checkbox.addEventListener("change", () => {
                this.setTag(checkbox.dataset.lmTag, checkbox.checked);
            });
        });

        // Tags on the cards themselves double as filter shortcuts.
        this.root.querySelectorAll("[data-lm-tag-toggle]").forEach((badge) => {
            badge.addEventListener("click", () => {
                const tag = badge.dataset.lmTagToggle;
                this.setTag(tag, !this.selectedTags.has(tag));
            });
        });

        this.searchInput.addEventListener("input", () => {
            this.searchTerm = this.searchInput.value.trim().toLowerCase();
            this.apply();
        });

        this.sortSelect.addEventListener("change", () => {
            this.featuredFirst = false;
            this.apply();
        });
        this.clearTagsButton.addEventListener("click", () => this.clearTags());
        this.resetButton.addEventListener("click", () => this.reset());

        this.apply();
    }

    setTag(tag, selected) {
        if (selected) {
            this.selectedTags.add(tag);
        } else {
            this.selectedTags.delete(tag);
        }

        this.tagCheckboxes.forEach((checkbox) => {
            checkbox.checked = this.selectedTags.has(checkbox.dataset.lmTag);
        });

        this.apply();
    }

    clearTags() {
        this.selectedTags.clear();
        this.tagCheckboxes.forEach((checkbox) => { checkbox.checked = false; });
        this.apply();
    }

    reset() {
        this.selectedTags.clear();
        this.tagCheckboxes.forEach((checkbox) => { checkbox.checked = false; });
        this.searchTerm = "";
        this.searchInput.value = "";
        this.apply();
    }

    matches(card) {
        // A card matches if it carries at least one of the selected tags.
        if (this.selectedTags.size > 0) {
            const hasTag = card.lmTags.some((tag) => this.selectedTags.has(tag));
            if (!hasTag) return false;
        }

        if (this.searchTerm && !card.lmSearch.includes(this.searchTerm)) {
            return false;
        }

        return true;
    }

    sortCards(cards) {
        const mode = this.sortSelect.value;
        const featuredFirst = this.featuredFirst;
        const byTitle = (a, b) => a.lmTitle.localeCompare(b.lmTitle);
        // Undated materials sort last, whichever direction the dates run.
        const byDate = (a, b) => {
            if (a.lmUpdated === b.lmUpdated) return byTitle(a, b);
            if (!a.lmUpdated) return 1;
            if (!b.lmUpdated) return -1;
            return a.lmUpdated < b.lmUpdated ? -1 : 1;
        };

        let compare;
        switch (mode) {
            case "updated-asc": compare = byDate; break;
            case "title-asc": compare = byTitle; break;
            case "title-desc": compare = (a, b) => byTitle(b, a); break;
            case "updated-desc":
            default: compare = (a, b) => byDate(b, a); break;
        }

        if (featuredFirst) {
            const withinGroup = compare;
            compare = (a, b) => {
                if (a.lmFeatured !== b.lmFeatured) return a.lmFeatured ? -1 : 1;
                return withinGroup(a, b);
            };
        }

        return cards.sort(compare);
    }

    renderActiveTags() {
        this.activeTagContainer.innerHTML = "";

        this.selectedTags.forEach((tag) => {
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = "lm-active-tag";
            chip.innerHTML = `<span>${tag}</span><i class="bi bi-x-lg" aria-hidden="true"></i>`;
            chip.setAttribute("aria-label", `Remove ${tag} filter`);
            chip.addEventListener("click", () => this.setTag(tag, false));
            this.activeTagContainer.appendChild(chip);
        });

        this.clearTagsButton.hidden = this.selectedTags.size === 0;
    }

    apply() {
        const visible = [];
        const hidden = [];
        this.cards.forEach((card) => {
            (this.matches(card) ? visible : hidden).push(card);
        });

        hidden.forEach((card) => { card.hidden = true; });
        visible.forEach((card) => { card.hidden = false; });

        // Re-order the visible cards; hidden ones are parked at the end.
        this.sortCards(visible).forEach((card) => this.grid.appendChild(card));
        hidden.forEach((card) => this.grid.appendChild(card));

        this.root.querySelectorAll("[data-lm-tag-toggle]").forEach((badge) => {
            badge.classList.toggle("active", this.selectedTags.has(badge.dataset.lmTagToggle));
        });

        this.countText.textContent =
            `Showing ${visible.length} of ${this.cards.length} guides`;
        this.noResults.hidden = visible.length > 0;

        this.renderActiveTags();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("learning-materials");
    if (root) {
        new LearningMaterialsBrowser(root).initialize();
    }
});
