import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore, doc, setDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

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

const submit = document.getElementById('submit');
submit.addEventListener('click', async function(event){
    event.preventDefault();

    //input fields
    const firstname = document.getElementById('firstname').value; 
    const lastname = document.getElementById('lastname').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // create user document in firestore
        await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            uid: user.uid,
            firstname: firstname,
            lastname: lastname,
            displayName: username,
        });

        await setDoc(doc(db, "users", user.uid, "applications", "placeholder"), { empty: true });
        window.location.href = "dashboard"; 
    } catch (error) {
        alert(error.message);
    }
});




/*
https://firebase.google.com/docs/auth/web/password-auth
https://firebase.google.com/docs/firestore/quickstart


*/