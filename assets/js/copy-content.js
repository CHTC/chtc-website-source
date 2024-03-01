async function copyCode(div, button) {
    let code = div.querySelector("code");
    let text = code.innerText;
    let previousButtonText = button.innerText;

    await navigator.clipboard.writeText(text);

    // Creating "code copied" text to appear after the button is pressed
    button.innerText = "Code Copied";
    setTimeout(() => {
        button.innerText = previousButtonText;
    }, 1000);
}

function createButton() {
    let copyButtonLabel = "Copy Code";

    // Get all divs named copy
    let divs = document.getElementsByClassName("copy");

    // Loop through each div
    Array.from(divs).forEach((div) => {
        // Creating button, styling and placing in top right corner
        let button = document.createElement("button");
        button.innerText = copyButtonLabel;
        button.style.display = "none";
        button.style.position = "absolute";
        button.style.top = "7px";
        button.style.right = "7px";
        button.style.borderRadius = "8px";
        button.style.padding = "3.5px";
        
        // Appending button to the div
        div.appendChild(button);

        // Adding styles to the div
        div.style.position = "relative";
        div.style.margin = "5px 0";
        div.style.padding = "1rem 0 1rem 1rem";

        // Adding event listeners to show/hide button on hover
        div.addEventListener("mouseenter", function () {
            button.style.display = "block";
        });

        div.addEventListener("mouseleave", function () {
            button.style.display = "none";
        });

        // Adding event listener to copy code when button is clicked
        button.addEventListener("click", async () => {
            await copyCode(div, button);
        });
    });
}

createButton();


