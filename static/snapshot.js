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
  
	//sets the default date to today 
	const today = new Date().toLocaleDateString("en-CA");
	dateInput.value = today;
  
	//grab the elements
    const curSnapshot = document.getElementById("currentSnapshotList");
    const OldSnapshot = document.getElementById("weekAgoSnapshotList");
    const logoutButton = document.getElementById("logout");
  
	//logout button
    logoutButton.addEventListener("click", () => {
        signOut(auth).then(() => {
            window.location.href = "/login";
        }).catch((error) => {
            console.error("Error logging out: ", error);
        });
    });
  
	//grabs the url
    grabButton.addEventListener("click", async () => {
        const url = websiteUrlInput.value.trim();
        const date = dateInput.value.trim();
    
        if (!url) {
            alert("Please enter a website URL.");
            return;
        }
    
        curSnapshot.innerHTML = "<li>Scraping Snapshots...</li>";
        OldSnapshot.innerHTML = "<li>Scraping Snapshots...</li>";
    
		// Function to fetch snapshots
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
        weekAgoDate.setDate(weekAgoDate.getDate() - 365);
        const weekAgoStr = weekAgoDate.toISOString().split("T")[0];
    
        document.getElementById("enteredDateLabel").textContent = `Entered Date (${date})`;
        document.getElementById("weekAgoDateLabel").textContent = `Month Ago (${weekAgoStr})`;
        try {
        const [currData, weekAgoData] = await Promise.all([
            getSnapshots(url, date),
            getSnapshots(url, weekAgoStr)
        ]);
  
		//this generates the link for the date and a week ago 
        const renderLinks = (container, data) => {
		container.innerHTML = "";
		if (data.error) {
			container.innerHTML = `<li>Error: ${data.error}</li>`;
		} else if (data.length === 0) {
			container.innerHTML = "<li>No snapshots found.</li>";
		} else {
            if (data.length > 0) {
				//we only want to grab most recent link
                const mostRecentLink = data[0];  
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
  
		// Clear previous results and use new links
        renderLinks(curSnapshot, currData);
        renderLinks(OldSnapshot, weekAgoData);

		//store links in local storage 
		if (currData.length > 0) {
			localStorage.setItem("currentSnapshot", currData[0]);
		}
		if (weekAgoData.length > 0) {
			localStorage.setItem("weekAgoSnapshot", weekAgoData[0]);
		}
  
	} catch (err) {
		curSnapshot.innerHTML = `<li>Request failed: ${err.message}</li>`;
		OldSnapshot.innerHTML = `<li>Request failed: ${err.message}</li>`;
	}
    });
  });