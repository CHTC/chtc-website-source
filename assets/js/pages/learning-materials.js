/**
 * Learning materials page: tag filtering (sidebar), keyword search, sorting,
 * and pagination.
 *
 * All materials are rendered by Jekyll and filtered/sorted/paged client side,
 * so the page still works without JavaScript (default order is "recently
 * updated" with every material listed) and search engines see the full list.
 */
const PAGE_SIZE = 12;

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
        this.pagination = root.querySelector("#lm-pagination");

        this.selectedTags = new Set();
        this.searchTerm = "";
        this.page = 1;
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
            this.page = 1;
            this.apply();
        });

        this.sortSelect.addEventListener("change", () => {
            this.featuredFirst = false;
            this.page = 1;
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

        this.page = 1;
        this.apply();
    }

    clearTags() {
        this.selectedTags.clear();
        this.tagCheckboxes.forEach((checkbox) => { checkbox.checked = false; });
        this.page = 1;
        this.apply();
    }

    reset() {
        this.selectedTags.clear();
        this.tagCheckboxes.forEach((checkbox) => { checkbox.checked = false; });
        this.searchTerm = "";
        this.searchInput.value = "";
        this.page = 1;
        this.apply();
    }

    goToPage(page) {
        this.page = page;
        this.apply();
        // The pager sits below the grid, so bring the top of the results back into view.
        this.countText.scrollIntoView({ block: "start", behavior: "smooth" });
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

    /**
     * Which page numbers to show as buttons: first, last, and a window around
     * the current page. `null` marks a gap that renders as an ellipsis.
     */
    pageNumbers(pageCount) {
        if (pageCount <= 7) {
            return Array.from({ length: pageCount }, (_, i) => i + 1);
        }

        const pages = new Set([1, pageCount]);
        for (let p = this.page - 1; p <= this.page + 1; p++) {
            if (p >= 1 && p <= pageCount) pages.add(p);
        }

        const sorted = Array.from(pages).sort((a, b) => a - b);
        const withGaps = [];
        sorted.forEach((p, i) => {
            if (i > 0 && p - sorted[i - 1] > 1) withGaps.push(null);
            withGaps.push(p);
        });
        return withGaps;
    }

    renderPagination(pageCount, matchCount) {
        this.pagination.innerHTML = "";
        this.pagination.hidden = pageCount <= 1;
        if (pageCount <= 1) return;

        const list = document.createElement("ul");
        list.className = "pagination pagination-sm justify-content-center flex-wrap";

        const addItem = ({ label, html, page, disabled = false, active = false, ellipsis = false }) => {
            const item = document.createElement("li");
            item.className = "page-item";
            if (disabled) item.classList.add("disabled");
            if (active) item.classList.add("active");

            if (ellipsis) {
                const span = document.createElement("span");
                span.className = "page-link";
                span.textContent = "\u2026";
                item.classList.add("disabled");
                item.appendChild(span);
            } else {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "page-link";
                if (html) {
                    button.innerHTML = html;
                } else {
                    button.textContent = String(page);
                }
                if (label) button.setAttribute("aria-label", label);
                if (active) button.setAttribute("aria-current", "page");
                if (disabled) button.disabled = true;
                button.addEventListener("click", () => this.goToPage(page));
                item.appendChild(button);
            }

            list.appendChild(item);
        };

        addItem({
            label: "Previous page",
            html: '<i class="bi bi-chevron-left" aria-hidden="true"></i>',
            page: this.page - 1,
            disabled: this.page === 1,
        });

        this.pageNumbers(pageCount).forEach((p) => {
            if (p === null) {
                addItem({ ellipsis: true });
            } else {
                addItem({ label: `Page ${p}`, page: p, active: p === this.page });
            }
        });

        addItem({
            label: "Next page",
            html: '<i class="bi bi-chevron-right" aria-hidden="true"></i>',
            page: this.page + 1,
            disabled: this.page === pageCount,
        });

        const summary = document.createElement("p");
        summary.className = "lm-pagination-summary mb-0";
        summary.textContent = `Page ${this.page} of ${pageCount} (${matchCount} guides)`;

        this.pagination.appendChild(list);
        this.pagination.appendChild(summary);
    }

    apply() {
        const matching = [];
        const hidden = [];
        this.cards.forEach((card) => {
            (this.matches(card) ? matching : hidden).push(card);
        });

        this.sortCards(matching);

        // Clamp the page in case a filter change shrank the result set.
        const pageCount = Math.max(1, Math.ceil(matching.length / PAGE_SIZE));
        this.page = Math.min(Math.max(1, this.page), pageCount);
        const start = (this.page - 1) * PAGE_SIZE;
        const end = Math.min(start + PAGE_SIZE, matching.length);

        matching.forEach((card, index) => {
            card.hidden = index < start || index >= end;
        });
        hidden.forEach((card) => { card.hidden = true; });

        // Re-order the matching cards; non-matching ones are parked at the end.
        matching.forEach((card) => this.grid.appendChild(card));
        hidden.forEach((card) => this.grid.appendChild(card));

        this.root.querySelectorAll("[data-lm-tag-toggle]").forEach((badge) => {
            badge.classList.toggle("active", this.selectedTags.has(badge.dataset.lmTagToggle));
        });

        if (matching.length <= PAGE_SIZE) {
            this.countText.textContent = `Showing ${matching.length} of ${this.cards.length} guides`;
        } else {
            const filtered = this.selectedTags.size > 0 || this.searchTerm !== "";
            const noun = filtered ? "matching guides" : "guides";
            this.countText.textContent =
                `Showing ${start + 1}\u2013${end} of ${matching.length} ${noun}`;
        }
        this.noResults.hidden = matching.length > 0;

        this.renderPagination(pageCount, matching.length);
        this.renderActiveTags();
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("learning-materials");
    if (root) {
        new LearningMaterialsBrowser(root).initialize();
    }
});
