const wakeButton = document.getElementById("wake-button");
const connectButton = document.getElementById("connect-button");
const statusText = document.getElementById("status-text");
const statusDot = document.querySelector(".status-dot");
const message = document.getElementById("message");

wakeButton.addEventListener("click", () => {
    wakeButton.disabled = true;
    wakeButton.textContent = "Waking…";

    statusText.textContent = "Waking";
    message.textContent = "Wake-on-LAN request will be sent once the backend is connected.";

    // Temporary UI simulation.
    // This will be replaced by the Mac mini agent API.
    setTimeout(() => {
        wakeButton.disabled = false;
        wakeButton.textContent = "Wake PC";
    }, 2500);
});
