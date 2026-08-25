/**
 * Main JS file for general behavior
 */

/**
 * For all headers, if they have a id attribute, add a link icon to the right and make it clickable
 */
document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]').forEach(function(element) {
		let link = document.createElement('a');
		link.href = '#' + element.id;
		link.innerHTML = '<i class="bi bi-link-45deg"></i>';
		link.classList.add('header-link');
		element.appendChild(link);

		// Add a click listener to copy the link to the clipboard
	  link.addEventListener('click', async function(e) {

			await navigator.clipboard.writeText(window.location.href.split('#')[0] + '#' + element.id);

			// Change the icon to a checkmark
			link.innerHTML = '<i class="bi bi-check2"></i>';

			// Change the icon back to a link after 1 second
			setTimeout(function() {
				link.innerHTML = '<i class="bi bi-link-45deg"></i>';
			}, 500);
		});

		// Add click effect to the header as well
	  element.addEventListener('click', function() {
			link.click();
		});
});

/**
 * Simple hash function to hash a string to a number.
 */
function generateStringHash(value) {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
        hash = value.charCodeAt(i) + ((hash << 5) - hash);
    }

    return hash;
}

/**
 * Fill in badge colors based on tag text.
 */
function fillBadgeColors() {
    const badges = document.querySelectorAll(".tag-badge");
    badges.forEach(badge => {
        const tagText = badge.textContent.trim();
        let hue = generateStringHash(tagText) % 360;
        if (hue >= 60 && hue <= 140) {
            hue = (hue + 80) % 360; // avoid ugly colors
        }

        badge.style.backgroundColor = `hsl(${hue}, 70%, 40%)`;
        badge.style.color = "#fff";
    });
}

fillBadgeColors();

/**
 * Track when users expand or collapse <details> elements in Matomo.
 */
document.addEventListener('toggle', function(e) {
    if (!(e.target instanceof HTMLDetailsElement)) return;

    const summary = e.target.querySelector('summary');
    const label = (summary ? summary.textContent.trim() : 'No Summary') + ' | ' + window.location.pathname;

    window._paq = window._paq || [];
    window._paq.push(['trackEvent', 'Details', e.target.open ? 'Open' : 'Close', label]);
}, true);

/**
 * Track clicks on elements marked up with data-track-action in Matomo. Matomo's
 * automatic link tracking only covers outlinks and downloads, so internal links
 * and mailto: links need an explicit event.
 *
 *   <a href="..." data-track-category="Facilitation" data-track-action="Meeting Request">
 */
document.addEventListener('click', function(e) {
    if (!(e.target instanceof Element)) return;

    const element = e.target.closest('[data-track-action]');
    if (!element) return;

    const category = element.dataset.trackCategory || 'Link';
    const name = (element.dataset.trackName || element.textContent.trim()) + ' | ' + window.location.pathname;

    window._paq = window._paq || [];
    window._paq.push(['trackEvent', category, element.dataset.trackAction, name]);
}, true);
