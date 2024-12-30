const webAppURL = "https://script.google.com/macros/s/AKfycbzTO6uFrZiyBARs6KQcGk-KDHAqjK6V56840uYZDpkfrRAsx4liGycAoTpaVrvhl7ByvA/exec"; // Replace with your Google Apps Script Web App URL
let telegramUserID = null;

// Initialize Telegram Web App
window.Telegram.WebApp.ready();

(async function getTelegramID() {
    // Get Telegram ID from Telegram Web Apps API
    try {
        telegramUserID = Telegram.WebApp.initDataUnsafe.user?.id;

        if (!telegramUserID) {
            alert("Unable to retrieve Telegram ID. Please try again.");
        } else {
            console.log("Telegram ID:", telegramUserID);
        }
    } catch (error) {
        console.error("Error retrieving Telegram ID:", error);
    }
})();

async function populateGroups() {
    const level = document.getElementById("level").value; // Get the selected level
    const groupDropdown = document.getElementById("group");

    if (!level) {
        alert("Please select a level first.");
        return;
    }

    try {
        // Fetch groups from the Google Sheets Web App
        const response = await fetch(`${webAppURL}?action=getGroups&level=${level}`);
        const groups = await response.json();

        // Clear existing options in the group dropdown
        groupDropdown.innerHTML = `
            <option value="" disabled selected>Select Group</option>
        `;

        // Populate the dropdown with the fetched groups
        groups.forEach(group => {
            const option = document.createElement("option");
            option.value = group;
            option.textContent = group;
            groupDropdown.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching groups:", error);
        alert("Failed to load groups. Please try again.");
    }
}

async function registerUser() {
    const name = document.getElementById("name").value;
    const surname = document.getElementById("surname").value;
    const level = document.getElementById("level").value;
    const group = document.getElementById("group").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;

    if (!name || !surname || !level || !group || !phone || !email) {
        alert("Please fill in all the fields.");
        return;
    }

    if (!telegramUserID) {
        alert("Unable to retrieve Telegram ID. Please refresh the page and try again.");
        return;
    }

    try {
        const response = await fetch(`${webAppURL}?action=register`, {
            method: "POST",
            body: JSON.stringify({
                telegramID: telegramUserID,
                name,
                surname,
                level,
                group,
                phone,
                email,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.text();

        if (result === "Registration successful") {
            alert(result);
            window.location.href = "https://www.youtube.com"; // Redirect to YouTube
        } else {
            alert("Registration failed: " + result);
        }
    } catch (error) {
        console.error("Error registering user:", error);
        alert("Failed to connect to the server. Please try again.");
    }
}
