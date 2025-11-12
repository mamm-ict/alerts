// Import the functions you need from the SDKs you need
importScripts("https://www.gstatic.com/firebasejs/12.3.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.3.0/firebase-messaging-compat.js");
importScripts("localforage.min.js");

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyArrnKp3JfRV9HfdkGsfwIbu57YvsRStew",
    authDomain: "mamm-alerts.firebaseapp.com",
    projectId: "mamm-alerts",
    storageBucket: "mamm-alerts.firebasestorage.app",
    messagingSenderId: "812376016079",
    appId: "1:812376016079:web:62e9c74cba6c13ac47a3ba",
    measurementId: "G-FZH66DH45K"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(async (payload) => {
    console.log(
        '[firebase-messaging-sw.js] Received background message ',
        payload
    );

    // localforage.setItem("test", "OK");

    // // Send PayLoad to open tabs to store data
    // clients.matchAll({ type: "window", includeUncontrolled: true }).then(clientList => {
    //     for (const client of clientList) {
    //         client.postMessage(payload.data);
    //     }
    // });

    // Customize notification here
    const notificationTitle = payload.data["title"];
    let notificationIcon = '';
    if (payload.data["type"].toLowerCase() == "up") {
        notificationIcon = 'web/good.png';
    }
    else {
        notificationIcon = 'web/failure.png';
    }

    const notificationOptions = {
        body: payload.data["body"],
        icon: notificationIcon,
        data: {
            url: "/history"
        }
    };

    async function  appendToArrayLocalForage(key, newItem) {
        try{
            let existingArray = await localforage.getItem(key);

            if(!Array.isArray(existingArray)) {
                existingArray = [];
            }

            existingArray.push(newItem);

            await localforage.setItem(key, existingArray);

            console.log("Item", newItem);
            console.log("Item machine", newItem.machine);
            console.log("key", key);
            console.log(`Item "${JSON.stringify(newItem)}" appended to array under key "${key}".`);

        } catch (err){
            console.error("Error appending in localForage: ", err);
        }
        
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
    console.log(payload.data)
    localforage.setItem("Information-History", payload.data);
    appendToArrayLocalForage("Information-History", payload.data)
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    event.waitUntil(
        clients
            .matchAll({ type: 'window', includeUncontrolled: true })
            .then(function (clientList) {
                // Safely get url
                const url = event.notification?.data?.url;
                if (!url) return;

                // Focus on existing tab if it matches
                for (const client of clientList) {
                    console.log(client.url + " : " + url);
                    if (client.url.includes(url) && 'focus' in client) {
                        client.focus();
                        client.navigate(url)
                        return 
                    }
                }

                // Open new tab if no existing tab matches
                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            })
    );
});
