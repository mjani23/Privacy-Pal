document.addEventListener("DOMContentLoaded", () => {
	// Correct element references
    const currentBox = document.querySelector(".snapshot-box:nth-child(1)");
    const weekAgoBox = document.querySelector(".snapshot-box:nth-child(2)");
    const fetchButton = document.getElementById("fetchButton");
  
    const currentInput = document.getElementById("currentUrl");
    const weekAgoInput = document.getElementById("weekAgoUrl");
  
    //grabs links from prev page 
    const storedCurrent = localStorage.getItem("currentPrivacyLink");
    const storedWeekAgo = localStorage.getItem("weekAgoPrivacyLink");
    if (storedCurrent) currentInput.value = storedCurrent;
    if (storedWeekAgo) weekAgoInput.value = storedWeekAgo;
    
    //grabs the html and converts it to text 
    async function fetchSummary(url, targetBox) {
        
        targetBox.innerHTML = "<p>Loading...</p>";
        const response = await fetch("/fetch_html", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url })
        });
  
      const data = await response.json();
      targetBox.innerHTML = "";
      targetBox.textContent = "";
  
        if (data.html) {
          targetBox.innerHTML = data.html;  
        } else {
            targetBox.innerHTML = `<p style="color:red;">Error: ${data.error}</p>`;
        }
    }
  
    fetchButton.addEventListener("click", () => {
      const currentUrl = currentInput.value.trim();
      const weekAgoUrl = weekAgoInput.value.trim();
  
      if (currentUrl && weekAgoUrl) {
        fetchSummary(currentUrl, currentBox);
        fetchSummary(weekAgoUrl, weekAgoBox);
      } else {
        alert("Please enter both URLs.");
      }
    });
  
    // Optionally trigger auto-fetch if both values exist
    if (storedCurrent && storedWeekAgo) {
      fetchSummary(storedCurrent, currentBox);
      fetchSummary(storedWeekAgo, weekAgoBox);
    }
  });