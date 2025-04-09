import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";


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
const resetPassword = document.getElementById('reset-password'); // Reset password button
const login = document.getElementById('login');

//login
login.addEventListener('click', async function(event){
    event.preventDefault(); //when you click doesnt refresh the page

    //input fields
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;

        //save to local storage
        localStorage.setItem("user", JSON.stringify({uid: user.uid, email: user.email}));
        window.location.href = "/snapshot";
    })
    .catch((error) => {
        const errorMessage = error.message;
        alert('Login Failed: ' + errorMessage);
    });

})

//reset password
resetPassword.addEventListener('click', async function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value.trim();

    if (!email) {
        alert("Please enter your email to reset the password.");
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset email sent! Check your inbox.");
    } catch (error) {
        console.log("Error:", error);
        alert("Error sending reset email: " + error.message);
    }
});