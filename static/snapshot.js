import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCBPoOtQOB7keoaTGM8BRiM62O5fkOjaCM",
    authDomain: "dataprivacytracker.firebaseapp.com",
    projectId: "dataprivacytracker",
    storageBucket: "dataprivacytracker.appspot.com",
    messagingSenderId: "477432653296",
    appId: "1:477432653296:web:3dd325a0a093ad4222e935"
};

// Initialize Firebase and Auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", () => {
    const grabButton = document.getElementById("grabButton");
    const websiteUrlInput = document.getElementById("websiteUrl");
    const dateInput = document.getElementById("dateInput");
  
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;
  
    const currentSnapshotList = document.getElementById("currentSnapshotList");
    const weekAgoSnapshotList = document.getElementById("weekAgoSnapshotList");
    const logoutButton = document.getElementById("logout");
  
    logoutButton.addEventListener("click", () => {
        signOut(auth).then(() => {
            window.location.href = "/login";
        }).catch((error) => {
            console.error("Error logging out: ", error);
        });
    });
  
    grabButton.addEventListener("click", async () => {
        const url = websiteUrlInput.value.trim();
        const date = dateInput.value.trim();
    
        if (!url) {
            alert("Please enter a website URL.");
            return;
        }
    
        currentSnapshotList.innerHTML = "<li>Scraping Snapshots...</li>";
        weekAgoSnapshotList.innerHTML = "<li>Scraping Snapshots...</li>";
    
        const getSnapshots = async (url, date) => {
            const response = await fetch("/snapshots", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url, date }),
            });
            return await response.json();
        };
  
      // Calculate week-ago date
        const weekAgoDate = new Date(date);
        weekAgoDate.setDate(weekAgoDate.getDate() - 7);
        const weekAgoStr = weekAgoDate.toISOString().split("T")[0];
    
        document.getElementById("enteredDateLabel").textContent = `Entered Date (${date})`;
        document.getElementById("weekAgoDateLabel").textContent = `Week Ago (${weekAgoStr})`;
        try {
        const [currData, weekAgoData] = await Promise.all([
            getSnapshots(url, date),
            getSnapshots(url, weekAgoStr)
        ]);
  
        const renderLinks = (container, data) => {
          container.innerHTML = "";
          if (data.error) {
            container.innerHTML = `<li>Error: ${data.error}</li>`;
          } else if (!Array.isArray(data)) {
            container.innerHTML = "<li>Unexpected response format</li>";
          } else if (data.length === 0) {
            container.innerHTML = "<li>No snapshots found.</li>";
          } else {
            if (data.length > 0) {
                const mostRecentLink = data[0];  // assume the most recent snapshot is first
                const li = document.createElement("li");
                const a = document.createElement("a");
                a.href = mostRecentLink;
                a.textContent = mostRecentLink;
                a.target = "_blank";
                li.appendChild(a);
                container.appendChild(li);
            } else {
            container.innerHTML = "<li>No snapshots found.</li>";
            }
          }
        };
  
        renderLinks(currentSnapshotList, currData);
        renderLinks(weekAgoSnapshotList, weekAgoData);
  
      } catch (err) {
        currentSnapshotList.innerHTML = `<li>Request failed: ${err.message}</li>`;
        weekAgoSnapshotList.innerHTML = `<li>Request failed: ${err.message}</li>`;
      }
    });
  });