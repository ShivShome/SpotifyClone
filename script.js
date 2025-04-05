// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Track data for all 5 floors
const floors = [1, 2, 3, 4, 5];
const charts = {};

// Function to fetch occupancy data
floors.forEach(floor => {
    const ref = database.ref(`messOccupancy/floor${floor}`);
    ref.on("value", (snapshot) => {
        const count = snapshot.val();
        document.getElementById(`count${floor}`).innerText = count !== null ? count : "No data";
        addData(`chart${floor}`, new Date().toLocaleTimeString(), count);
    });

    // Initialize chart for each floor
    const ctx = document.getElementById(`chart${floor}`).getContext('2d');
    charts[`chart${floor}`] = new Chart(ctx, {
        type: "line",
        data: {
            labels: [],
            datasets: [{
                label: `Floor ${floor} Occupancy`,
                data: [],
                borderColor: "#ff5722",
                backgroundColor: "rgba(255, 87, 34, 0.2)",
                borderWidth: 2,
                tension: 0.3
            }]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });
});

// Function to update graph
function addData(chartId, time, value) {
    const chart = charts[chartId];
    chart.data.labels.push(time);
    chart.data.datasets[0].data.push(value);
    if (chart.data.labels.length > 10) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }
    chart.update();
}

// Function to switch between floors
function changeFloor(floor) {
    document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
    document.querySelectorAll(".floor-content").forEach(content => content.classList.remove("active-content"));

    document.querySelector(`.tab:nth-child(${floor})`).classList.add("active");
    document.getElementById(`floor${floor}`).classList.add("active-content");
}

// Function to fetch today's menu
function fetchMenu() {
    database.ref("messMenu/today").once("value", (snapshot) => {
        const menu = snapshot.val();
        document.getElementById("menu").innerText = menu ? menu : "Menu not available.";
    });
}
