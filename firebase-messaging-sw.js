// Import the functions you need from the SDKs you need
importScripts("https://www.gstatic.com/firebasejs/12.3.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.3.0/firebase-messaging-compat.js");

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

messaging.onBackgroundMessage((payload) => {
    console.log(
        '[firebase-messaging-sw.js] Received background message ',
        payload
    );

    // Send PayLoad to open tabs to store data
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(clientList => {
        for (const client of clientList) {
        client.postMessage(payload.data);
        }
    });

    // Customize notification here
    const notificationTitle = payload.data["title"];
    let notificationIcon = '';
                if(payload.data["type"].toLowerCase() == "up"){
                    notificationIcon = 'web/good.png' ;
                }
                else{
                    notificationIcon = 'web/failure.png';
                }
                
                const notificationOptions = {
                    body: payload.data["body"],
                    icon: notificationIcon,
                    data: {
                        url: "/history"
                    }
                };

    self.registration.showNotification(notificationTitle, notificationOptions);
                console.log(payload.data)
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    // Check existing tab to focus on
    event.waitUntil(
        clients
            // https://developer.mozilla.org/en-US/docs/Web/API/Clients/matchAll
            .matchAll({ type: 'window', includeUncontrolled: true })
            .then(function (clientList) {
                const url = event.notification.data.url;
                if (!url) return;

                // Focus on existing tab
                for (const client of clientList) {
                    console.log(client.url + ":" + url);
                    if (client.url.includes(url) && 'focus' in client) {
                        return client.focus();
                    }
                }

                if (clients.openWindow) {
                    return clients.openWindow(url);
                }
            })
    );
});
