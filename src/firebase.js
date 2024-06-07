import {initializeApp} from "firebase/app";
import {
    createUserWithEmailAndPassword,
    getAuth,
    sendEmailVerification,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth';

import {collection, doc, getDoc, getFirestore, setDoc, updateDoc} from 'firebase/firestore';
import OpenAI from "openai";

/**
 @Author Kedar Abhyankar
 @Email krabhyankar@gmail.com
 */

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGE_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
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
        return {error: false, code: 1, user: result, message: "Logged In!"};
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
        return {error: false, code: 1, user: result, message: "Registered!"};
    } catch (e) {
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
            if (text === "--RESET E272CCB7-0F5C-4714-A1FE-C77519369723") {
                //UUID for token reset
                const date = new Date();
                chatHistory.push("HARD RESET OF TOKENS FOR USER " + getCurrentUser().email);
                chatHistory.push("System: Tokens were reset at " + date.toLocaleDateString() + " " +
                    date.toLocaleTimeString())
                const data = {
                    tokenCount: 0,
                    chatHistory: chatHistory
                }
                await updateDoc(docRef, data);
                return "System: Tokens were reset at " + date.toLocaleDateString() + " " + date.toLocaleTimeString();
            }
            if (tokenCount >= 1000) {
                return "You have exceeded your token usage for today. Try again later.";
            }
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
            if (1000 - tokenCount <= 100) {
                //within 100 of token count
                let updatedMsg = "\nSystem: You've consumed " + tokenCount + " tokens so far. " +
                    "You are nearing your 1000 per day limit.\n";
                updatedMsg += originalText;
                return updatedMsg;
            }
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