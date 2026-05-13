class PresentationFilterManager {
    constructor() {
        this.selectedEvent = null;
        this.selectedKeywords = new Set();
    }

    initialize() {
        this.buttonEventFilter = document.getElementById("button-filter-event");
        this.buttonEventDropdownItems = document.querySelectorAll("a[data-event-selector]");
        this.keywordCheckboxes = document.querySelectorAll("input[data-keyword-selector]");
        this.resetButton = document.getElementById("button-clear-filters");
        this.cards = document.querySelectorAll(".presentation-card");

        this.originalEventFilterText = this.buttonEventFilter.textContent;
        this.noPresentationsFoundText = document.getElementById("no-presentations-found");
        
        this.initializeEventButtons();
        this.initializeKeywordCheckboxes();
        this.initializeResetButton();
    }

    initializeEventButtons() {
        this.buttonEventDropdownItems.forEach(item => {
            item.addEventListener("click", (e) => {
                e.preventDefault();
                this.selectedEvent = e.target.dataset.eventSelector;
                
                // Update button text to show selected event
                this.buttonEventFilter.textContent = this.selectedEvent;
                
                // Apply filters
                this.filterPresentations();
            });
        });
    }

    initializeKeywordCheckboxes() {
        this.keywordCheckboxes.forEach(checkbox => {
            checkbox.addEventListener("change", (e) => {
                const keyword = e.target.dataset.keywordSelector;
                
                if (e.target.checked) {
                    this.selectedKeywords.add(keyword);
                } else {
                    this.selectedKeywords.delete(keyword);
                }
                
                // Apply filters
                this.filterPresentations();
            });
        });
    }

    initializeResetButton() {
        this.resetButton.addEventListener("click", () => {
            // Reset event filter
            this.selectedEvent = null;
            this.buttonEventFilter.textContent = this.originalEventFilterText;
            
            // Reset keyword filters
            this.selectedKeywords.clear();
            this.keywordCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            
            // Show all presentations
            this.filterPresentations();
            
            // Hide reset button
            this.resetButton.style.display = "none";
        });
    }

    filterPresentations() {
        let anyVisible = false;
        this.cards.forEach(card => {
            let showCard = true;
            
            // Check event filter
            if (this.selectedEvent) {
                const eventText = card.dataset.event || "";
                if (!eventText.includes(this.selectedEvent)) {
                    showCard = false;
                }
            }
            
            // Check keyword filter
            if (this.selectedKeywords.size > 0) {
                const cardKeywords = card.dataset.keywords ? card.dataset.keywords.split(',') : [];
                
                // Check if any selected keyword matches card keywords
                const hasMatchingKeyword = Array.from(this.selectedKeywords).some(keyword => 
                    cardKeywords.includes(keyword)
                );
                
                if (!hasMatchingKeyword) {
                    showCard = false;
                }
            }
            
            anyVisible = anyVisible || showCard;
            // Show or hide the card
            card.style.display = showCard ? "inline-block" : "none";
        });

        this.noPresentationsFoundText.style.display = anyVisible ? "none" : "block";
        this.updateResetButtonVisibility();
    }

    updateResetButtonVisibility() {
        if (this.selectedEvent || this.selectedKeywords.size > 0) {
            this.resetButton.style.display = "inline-block";
        } else {
            this.resetButton.style.display = "none";
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // -- presentations page --

    /**
     * Setup click-to-expand for presentation descriptions that overflow
     * their container.
     */
    function setupDescriptionExpansion() {
        const descriptions = document.querySelectorAll(".presentation-description");

        descriptions.forEach((description) => {
            // individual to each description
            const onDescriptionClick = () => {
                description.classList.toggle("collapsed");
                // if expanded, remove click listener to prevent further toggling
                description.removeEventListener("click", onDescriptionClick);
            };

            // setup function that runs for each description, as well as on window resize
            const setup = (desc) => {
                desc.removeEventListener("click", onDescriptionClick);
                desc.classList.add("collapsed"); // start collapsed

                if (desc.scrollHeight <= desc.clientHeight) {
                    // content fits, disable expansion
                    desc.classList.remove("collapsed");
                } else {
                    // content overflows, enable expansion
                    desc.addEventListener("click", onDescriptionClick);
                }
            }

            // Initial setup
            setup(description);
            // Re-setup on window resize
            window.addEventListener("resize", () => setup(description));
        });
    }

    setupDescriptionExpansion();

    // Initialize filter manager if on presentations page
    if (document.querySelector(".presentation-card")) {
        const filterManager = new PresentationFilterManager();
        filterManager.initialize();
    }
});
