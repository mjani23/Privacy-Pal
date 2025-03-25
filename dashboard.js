import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCBPoOtQOB7keoaTGM8BRiM62O5fkOjaCM",
    authDomain: "dataprivacytracker.firebaseapp.com",
    projectId: "dataprivacytracker",
    storageBucket: "dataprivacytracker.appspot.com",
    messagingSenderId: "477432653296",
    appId: "1:477432653296:web:3dd325a0a093ad4222e935"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const appNameInput = document.getElementById("appName");
const addAppButton = document.getElementById("addApp");
const appList = document.getElementById("appList");
const logoutButton = document.getElementById("logout");

let currentUser;


//check logib 
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        loadApplications();
    } else {
        window.location.href = "login.html"; 
    }
});

//add application
addAppButton.addEventListener("click", async () => {
    if (!currentUser) {
        alert("No user detected. Please log in again.");
        return;
    }

    const appName = appNameInput.value.trim();
    if (!appName) {
        alert("Enter an application name.");
        return;
    }

    try {
        await addDoc(collection(db, "users", currentUser.uid, "applications"), { name: appName });
        appNameInput.value = ""; 
        loadApplications(); 
    } catch (error) {
        console.error("Error adding application:", error);
    }
});

//loads applications
async function loadApplications() {
    if (!currentUser) {
        return;
    }

    appList.innerHTML = ""; 

    try {
        const querySnapshot = await getDocs(collection(db, "users", currentUser.uid, "applications"));

        if (querySnapshot.empty) {
            return;
        }

        querySnapshot.forEach((doc) => {
            const appData = doc.data();
            
            // **Ignore placeholder document**
            if (doc.id === "placeholder" || !appData.name) {
                return;
            }

            const li = document.createElement("li");
            li.innerHTML = `${appData.name} <button class="delete-btn" data-id="${doc.id}">X</button>`;
            appList.appendChild(li);
        });

        // Add delete button event listeners
        document.querySelectorAll(".delete-btn").forEach((btn) => {
            btn.addEventListener("click", async (event) => {
                const docId = event.target.getAttribute("data-id");
                await deleteDoc(doc(db, "users", currentUser.uid, "applications", docId));
                loadApplications();
            });
        });

    } catch (error) {
        console.error("Error loading applications:", error);
    }
}

//logout
logoutButton.addEventListener("click", () => {
    signOut(auth).then(() => {
        window.location.href = "login.html"; 
    }).catch((error) => {
        console.error("Error logging out: ", error);
    });
});

const snapshotGrabberButton = document.getElementById("snapshotGrabber");
snapshotGrabberButton.addEventListener("click", () => {
    window.location.href = "snapshot.html";
});