document.addEventListener("DOMContentLoaded", () => {
    //refrences to the elements in the DOM
    const button = document.getElementById("findPrivacyButton");
    const input = document.getElementById("snapshotUrl");
    const list = document.getElementById("privacyResults");

    // Event listener for the button click
    button.addEventListener("click", async () => {
        const url = input.value.trim();
        if (!url) {
            alert("Enter a snapshot URL.");
            return;
        }

        list.innerHTML = "<li>Searching...</li>";

        // Validate URL format
        try {
            const res = await fetch("/extract-privacy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ snapshot_url: url })
            });

            const data = await res.json();
            list.innerHTML = "";
            
            // Check for errors in the response
            if (data.error) {
                list.innerHTML = `<li>Error: ${data.error}</li>`;
                return;
            }

            // If privacy links are found, show them as links
            if (data.privacy_links && data.privacy_links.length > 0) {
                
                // go through all the links
                data.privacy_links.forEach(link => {
                    //create list elements and links
                    const li = document.createElement("li");
                    const a = document.createElement("a");

                    //set the link's destination and display text
                    a.href = link;
                    a.textContent = link;

                    //open in a new tab
                    a.target = "_blank";

                    //add the link to the list
                    li.appendChild(a);
                    list.appendChild(li);
                });
            //no links found
            } else {
                list.innerHTML = "<li>No privacy links found.</li>";
            }
        } catch (err) {
            list.innerHTML = `<li>Request failed: ${err.message}</li>`;
        }
    });
});


