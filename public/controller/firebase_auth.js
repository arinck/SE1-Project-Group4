import { 
    getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
    onAuthStateChanged, signOut 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { app } from "./firebase_core.js";
import { DEV } from "../model/constants.js";
import { homePageView } from "../view/home_page.js";
import { signinPageView } from "../view/signin_page.js";
import { routePathnames, routing } from "../controller/route_controller.js";
import { userInfo } from "../view/elements.js";

const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

export let currentUser = null;

// Handle user sign-in
export async function signinFirebase(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        if (DEV) console.log("Signed in successfully:", userCredential.user);
    } catch (error) {
        if (DEV) console.log("Signin error:", error);
        alert('Signin Error: ' + error.message);
    }
}

// Handle user sign-out
export async function signOutFirebase() {
    try {
        await signOut(auth);
        if (DEV) console.log("User signed out successfully.");
    } catch (error) {
        if (DEV) console.log("Sign-out error:", error);
        alert('Sign Out Error: ' + error.message);
    }
}

// Attach observer for auth state changes
export function attachAuthStateChangeObserver() {
    onAuthStateChanged(auth, onAuthStateChangedListener);
}

// Update UI based on user auth state
function onAuthStateChangedListener(user) {
    currentUser = user;
    if (user) {
        userInfo.textContent = user.email;
        const postAuth = document.getElementsByClassName('myclass-postauth');
        for (let i = 0; i < postAuth.length; i++) {
            postAuth[i].classList.replace('d-none', 'd-block');
        }
        const preAuth = document.getElementsByClassName('myclass-preauth');
        for (let i = 0; i < preAuth.length; i++) {
            preAuth[i].classList.replace('d-block', 'd-none');
        }
        const pathname = window.location.pathname;
        const hash = window.location.hash;
        routing(pathname, hash);
    } else {
        userInfo.textContent = 'No User';
        const postAuth = document.getElementsByClassName('myclass-postauth');
        for (let i = 0; i < postAuth.length; i++) {
            postAuth[i].classList.replace('d-block', 'd-none');
        }
        const preAuth = document.getElementsByClassName('myclass-preauth');
        for (let i = 0; i < preAuth.length; i++) {
            preAuth[i].classList.replace('d-none', 'd-block');
        }
        history.pushState(null, null, routePathnames.HOME);
        signinPageView();
    }
}

// Function to create a new user
export async function createNewUser(email, password) {
    try {
        const auth = getAuth(app);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('User created successfully:', userCredential.user);
        // You can add additional logic here, like saving user information to Firestore
        return userCredential.user;
    } catch (error) {
        console.error('Error creating new user:', error.code, error.message);
        throw error;
    }
}
