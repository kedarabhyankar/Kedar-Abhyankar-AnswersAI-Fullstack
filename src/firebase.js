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
    doc,
    getDoc,
    updateDoc
} from 'firebase/firestore';
import OpenAI from "openai";

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
let openAIClient;
let openAIInitialRequestMade = false;

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
            verified: false,
            chatHistory: [],
            tokenCount: 0
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

export async function updateAPIToken(apiToken) {
    const data = {
        apiToken: apiToken
    };

    const docRef = await doc(usersDB, getCurrentUser().email);
    await updateDoc(docRef, data);
    return {error: false, code: 1, message: "Successfully updated API Token!"};
}

export function getCurrentUser() {
    return auth.currentUser;
}

export async function submitTextFromChatScreen(text, originalText) {
    const docRef = await doc(usersDB, getCurrentUser().email);
    const snap = await getDoc(docRef);
    const userFirstName = snap.data().firstName;
    const apiToken = snap.data().apiToken;
    let verifiedStatus = snap.data().verified;
    let chatHistory = snap.data().chatHistory;
    let tokenCount = snap.data().tokenCount;
    if (!openAIInitialRequestMade) {
        //no initial request made, re-initialize to set API key
        openAIClient = new OpenAI({
            apiKey: apiToken,
            dangerouslyAllowBrowser: true
        })
        openAIInitialRequestMade = true;
    }
    if (getCurrentUser().emailVerified && !verifiedStatus) {
        //marked as not verified in firebase, but auth says it's verified
        verifiedStatus = true;
        const data = {
            verified: true
        };
        await updateDoc(docRef, data);
    }

    if (verifiedStatus) {
        originalText += "\n";
        originalText += userFirstName + ": " + text;
        if (text !== "--token") {
            const completion = await openAIClient.chat.completions.create({
                messages: [{role: "system", content: text}],
                model: "gpt-3.5-turbo",
            });
            originalText += "\nOpenAI: " + completion.choices[0].message.content;
            originalText += "\n";
            chatHistory.push(userFirstName + ": " + text);
            chatHistory.push("AI: " + completion.choices[0].message.content);
            tokenCount += completion.usage.total_tokens;
            const data = {
                chatHistory: chatHistory,
                tokenCount: tokenCount
            };
            await updateDoc(docRef, data);
            return originalText;
        } else {
            //checking for token count
            const tokensLeft = 1000 - tokenCount;
            const tokenText = "System: You've consumed " + tokenCount + " tokens today. You have " + tokensLeft +
                " tokens available left.";
            chatHistory.push(userFirstName + ": " + text);
            chatHistory.push(tokenText);
            const data = {
                chatHistory: chatHistory,
                tokenCount: tokenCount
            };
            await updateDoc(docRef, data);
            return tokenText;
        }

    } else {
        return "AI: You aren't verified yet. Before you can make a query, you have to verify yourself."
    }

}