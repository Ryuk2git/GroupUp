import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyCns0jxTP_KXLiMHHZ7iDDEvENsGBrOyXE",
    authDomain: "group-up-7bd4f.firebaseapp.com",
    projectId: "group-up-7bd4f",
    storageBucket: "group-up-7bd4f.appspot.com",
    messagingSenderId: "862237898408",
    appId: "1:862237898408:web:e0a3b465b6681cba06b49d",
    measurementId: "G-RBF64R5C0K"
  };
  
  // Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export const sendMessage = (senderId, receiverId, content) => {
  const messageId = Date.now().toString(); // Unique ID for the message
  set(ref(database, 'messages/' + messageId), {
      senderId,
      receiverId,
      content,
      timestamp: Date.now()
  });
};

// Function to listen for new messages
export const listenForMessages = (callback) => {
  const messagesRef = ref(database, 'messages');
  onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      callback(data ? Object.values(data) : []); // Send the messages array
  });
};