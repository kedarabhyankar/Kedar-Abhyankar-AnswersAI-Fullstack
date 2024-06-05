import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    signOut
} from 'firebase/auth';

import {
    getFirestore,
    setDoc,
    collection,
    doc
} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAh1elqiKsQcoZ4Gz1o4AmvZw3Xd6sJ7mk",
    authDomain: "answersai-fullstack-interview.firebaseapp.com",
    projectId: "answersai-fullstack-interview",
    storageBucket: "answersai-fullstack-interview.appspot.com",
    messagingSenderId: "245794171815",
    appId: "1:245794171815:web:acc1ae827271a8e8afa482",
    measurementId: "G-HF9FBXDVL3"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const usersDB = collection(db, "users");

export async function login(email, password) {
    if (!email || !password) {
        return {error: true, message: "Please input all fields!"};
    }
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return {error: false, code: 1, user: null, message: "Logged In!"};
    } catch (e) {
        let errorMessage = "";
        if (e.message === "Firebase: Error (auth/wrong-password).") {
            errorMessage = "Error: Incorrect password."
        }
        return {error: true, code: e.code, message: errorMessage};
    }
}

export async function registerUser(email, password) {
    if (!email || !password) {
        return {error: true, code: 0, message: "Please input all fields!"};
    }

    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        return {error: false, code: 1, user: null, message: "Registered!"};
    } catch (e) {
        let errorMessage = "";
        return {error: true, code: e.code, message: e.code}
    }
}

export async function completeRegistration(email, firstName, lastName, apiToken) {
    if (!email || !firstName || !lastName) {
        return {error: true, code: 0, message: "Please input all mandatory fields!"}
    }

    if (!apiToken) {
        apiToken = "";
    }

    try {
        const data = {
            firstName: firstName,
            lastName: lastName,
            apiToken: apiToken,
            verified: false
        }
        const docRef = doc(usersDB, email);
        await setDoc(docRef, data);
        sendEmailVerification(auth.currentUser)
        return {error: false, code: 1, message: "Successfully registered!"};
    } catch (e) {
        return {error: true, code: e.code, message: e.message};
    }
}

export async function performLogOut() {
    await signOut(auth).then(() => {
        return {error: false, code: 1, message: "Logged Out"};
    }).catch((e) => {
        return {error: true, code: 0, message: e.message};
    });
}
