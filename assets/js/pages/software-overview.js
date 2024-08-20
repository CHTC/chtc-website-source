---
    layout: blank
---

function showExcerpt(id, sideDividerClass, buttonId) {
    console.log("Button clicked with ID:", id);

    var buttons = document.querySelectorAll('.btn-guide');
    var specificExcerpt = document.getElementById(id);
    var sideDivider = document.querySelector('.' + sideDividerClass);
    var excerpts = document.querySelectorAll('.excerpt');

    // Hide all excerpts
    excerpts.forEach(function(excerpt) {
        excerpt.style.display = 'none';
    });

    // Reset buttons to white after clicking off
    buttons.forEach(function(btn) {
        btn.classList.remove("btn-guide-highlighted");
    });

    // Show specific excerpt with sidebar
    if (specificExcerpt && sideDivider) {
        console.log("Showing excerpt for ID:", id);
        specificExcerpt.style.display = 'block';
        sideDivider.style.display = 'block';
        var btn = document.getElementById(buttonId);
    } else {
        console.log("No excerpt found for ID:", buttonId);
    }
    // Add button colors to clicked button
    event.currentTarget.classList.add("btn-guide-highlighted");
}