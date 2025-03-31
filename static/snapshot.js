document.addEventListener("DOMContentLoaded", () => {
    const grabButton = document.getElementById("grabButton");
    const websiteUrlInput = document.getElementById("websiteUrl");
    const dateInput = document.getElementById("dateInput");
    const snapshotList = document.getElementById("snapshotList");

    grabButton.addEventListener("click", async () => {
        const url = websiteUrlInput.value.trim();
        const date = dateInput.value.trim();

        // Validate URL format
        if (!url) {
            alert("Please enter a website URL.");
            return;
        }
        snapshotList.innerHTML = "<li>Loading snapshots...</li>";

        
        try {
            
            const response = await fetch("/snapshots", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url, date }), 
            });

            const data = await response.json();
            snapshotList.innerHTML = "";

            if (data.error) {
                snapshotList.innerHTML = `<li>Error: ${data.error}</li>`;
                return;
            }

            if (!Array.isArray(data)) {
                snapshotList.innerHTML = "<li>Unexpected response format</li>";
                return;
            }

            data.forEach(link => {
                const li = document.createElement("li");
                const a = document.createElement("a");
                a.href = link;
                a.textContent = link;
                a.target = "_blank";
                li.appendChild(a);
                snapshotList.appendChild(li);
            });
        } catch (err) {
            snapshotList.innerHTML = `<li>Request failed: ${err.message}</li>`;
        }
    });
});
