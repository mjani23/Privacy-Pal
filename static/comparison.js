document.addEventListener("DOMContentLoaded", () => { 
  const box = document.getElementById("compaison_box");
  const combinedText = localStorage.getItem("summaryCurrent") + "\n\n" + localStorage.getItem("summaryWeek");
  set_comparison(combinedText, box);

  async function set_comparison(text, comparison_box) {
 
    comparison_box.innerHTML = "<p>Your comparison will be out in a moment...</p>";
    
    const response = await fetch("/comparison", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
    });

    const data = await response.json();
    
    comparison_box.innerHTML = "";
    comparison_box.textContent = "";


    if (data.html) {
      comparison_box.innerHTML = data.html;  
    }
  }



});