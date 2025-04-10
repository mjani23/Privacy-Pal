document.addEventListener("DOMContentLoaded", () => {
    // Correct element references
    const curInput = document.getElementById("currentUrl");
    const OldInput = document.getElementById("weekAgoUrl");
  
    const curButton = document.getElementById("fetchCurrentBtn");
    const oldButton = document.getElementById("fetchWeekAgoBtn");
    const curLink = document.getElementById("currentResults");
    const OldLink = document.getElementById("weekAgoResults");
  
    // grabs links from prev page
    const savedCurrent = localStorage.getItem("currentSnapshot");
    const savedWeekAgo = localStorage.getItem("weekAgoSnapshot");
    if (savedCurrent) curInput.value = savedCurrent;
    if (savedWeekAgo) OldInput.value = savedWeekAgo;
  
    // Fetch privacy links helper
    async function fetchPrivacyLinks(url, list) {
      list.innerHTML = "<li>Searching...</li>";
  
        // grabs the privacy links using my extract-privacy 
        const res = await fetch("/extract-privacy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ snapshot_url: url })
        });
  
        const data = await res.json();
        list.innerHTML = "";
  
        if (data.error) {
          list.innerHTML = `<li>Error: ${data.error}</li>`;
          return;
        }
  
        if (data.privacy_links && data.privacy_links.length > 0) {
            data.privacy_links.forEach(link => {
                const li = document.createElement("li");
                const a = document.createElement("a");
                a.href = link;
                a.textContent = link;
                a.target = "_blank";
                li.appendChild(a);
                list.appendChild(li);
            });
            //saves links
            if (list.id === "currentResults") {
                localStorage.setItem("currentPrivacyLink", data.privacy_links[0]);
            } else if (list.id === "weekAgoResults") {
                localStorage.setItem("weekAgoPrivacyLink", data.privacy_links[0]);
            }
        } else {
            list.innerHTML = "<li>No privacy links found.</li>";
        }
    
    }
  
    // Button listeners
    curButton.addEventListener("click", () => {
        const url = curInput.value.trim();
        fetchPrivacyLinks(url, curLink);
    });
  
    oldButton.addEventListener("click", () => {
        const url = OldInput.value.trim();
        fetchPrivacyLinks(url, OldLink);
    });
  
    // auto grab if already exitsts 
    if (savedCurrent) fetchPrivacyLinks(savedCurrent, curLink);
    if (savedWeekAgo) fetchPrivacyLinks(savedWeekAgo, OldLink);
  });