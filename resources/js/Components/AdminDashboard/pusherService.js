import Pusher from "pusher-js";
const appKey = import.meta.env.VITE_PUSHER_APP_KEY;
const appCluster = import.meta.env.VITE_PUSHER_APP_CLUSTER;

const pusher = new Pusher(appKey, {
    cluster: appCluster,
    encrypted: true,
});

export const subscribeToTransactions = (callback) => {
    const channel = pusher.subscribe("transactions");
    console.log("Subscribed to channel: transactions");

    channel.bind("App\\Events\\TransactionStored", (data) => {
        console.log("Real-time data received:", data); // Pastikan data ini muncul
        callback(data);
    });
};

