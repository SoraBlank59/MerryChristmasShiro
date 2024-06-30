// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB68RbTnRg-Xzy8IueM7786vUSsWU5Vz0w",
    authDomain: "shiroproject-9f886.firebaseapp.com",
    projectId: "shiroproject-9f886",
    storageBucket: "shiroproject-9f886.appspot.com",
    messagingSenderId: "860287986858",
    appId: "1:860287986858:web:d4bcb3c38386aecc6f34d3",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.getElementById('guestbook-form').addEventListener('submit', submitForm);

function submitForm(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;

    // Save to Firestore
    db.collection('guestbook').add({
        name: name,
        message: message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        document.getElementById('guestbook-form').reset();
        loadEntries();
    }).catch(error => {
        console.error('Error adding document: ', error);
    });
}

function loadEntries() {
    db.collection('guestbook').orderBy('timestamp', 'desc').get().then(querySnapshot => {
        const entriesDiv = document.getElementById('guestbook-entries');
        entriesDiv.innerHTML = '';

        querySnapshot.forEach(doc => {
            const entry = doc.data();
            const entryDiv = document.createElement('div');
            entryDiv.classList.add('entry');

            const entryName = document.createElement('div');
            entryName.classList.add('entry-name');
            entryName.textContent = entry.name;

            const entryMessage = document.createElement('div');
            entryMessage.classList.add('entry-message');
            entryMessage.textContent = entry.message;

            entryDiv.appendChild(entryName);
            entryDiv.appendChild(entryMessage);
            entriesDiv.appendChild(entryDiv);
        });
    });
}

// Load entries when the page loads
document.addEventListener('DOMContentLoaded', loadEntries);