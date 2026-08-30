const wakeButton = document.getElementById("wake-button");
const connectButton = document.getElementById("connect-button");
const statusText = document.getElementById("status-text");
const statusDot = document.querySelector(".status-dot");
const message = document.getElementById("message");

const API_URL = "";

let statusTimer = null;


function setStatus(status) {
    const labels = {
        sleeping: "Sleeping",
        waking: "Waking",
        online: "Online",
        offline: "Offline"
    };

    statusText.textContent = labels[status] || status;

    statusDot.className = "status-dot";

    if (status === "online") {
        statusDot.classList.add("online");
    }

    if (status === "waking") {
        statusDot.classList.add("waking");
    }

    wakeButton.disabled = status === "waking" || status === "online";
    connectButton.disabled = status !== "online";

    wakeButton.textContent =
        status === "waking" ? "Waking…" :
        status === "online" ? "PC Online" :
        "Wake PC";
}


async function getStatus() {
    try {
        const response = await fetch(`${API_URL}/api/pc/status`);

        if (!response.ok) {
            throw new Error("Status request failed");
        }

        const data = await response.json();

        setStatus(data.status);

        if (data.status === "online") {
            clearInterval(statusTimer);
            message.textContent = "PC is ready.";
        }

    } catch (error) {
        setStatus("offline");
        message.textContent = "Unable to reach PC control service.";
    }
}


async function wakePC() {
    wakeButton.disabled = true;
    message.textContent = "Sending wake request…";

    try {
        const response = await fetch(`${API_URL}/api/pc/wake`, {
            method: "POST"
        });

        if (!response.ok) {
            throw new Error("Wake request failed");
        }

        const data = await response.json();

        setStatus(data.status);
        message.textContent = "PC is waking…";

        clearInterval(statusTimer);
        statusTimer = setInterval(getStatus, 1000);

    } catch (error) {
        setStatus("offline");
        message.textContent = "Unable to send wake request.";
    }
}


wakeButton.addEventListener("click", wakePC);

connectButton.addEventListener("click", () => {
    message.textContent = "Remote connection integration coming next.";
});


getStatus();
