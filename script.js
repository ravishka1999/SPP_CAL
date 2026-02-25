const firebaseConfig = {
  apiKey: "AIzaSyDVd-8ONSiSP9jvkTMzcuzrKHLy6l9ZtPw",
  authDomain: "sunenergyspp-d4933.firebaseapp.com",
  databaseURL: "https://sunenergyspp-d4933-default-rtdb.firebaseio.com/",
  projectId: "sunenergyspp-d4933",
  storageBucket: "sunenergyspp-d4933.firebasestorage.app",
  messagingSenderId: "841223265619",
  appId: "1:841223265619:web:b8f71c5683d0ef64d255a6"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let previousRU = 0;
let totalUnits = 0;

// 🔥 LOAD LAST DATA FROM FIREBASE
database.ref("sun_energy_data").limitToLast(1).on("value", (snapshot) => {
    snapshot.forEach((child) => {
        previousRU = child.val().currentRU || 0;
        totalUnits = child.val().totalUnits || 0;

        // Show previous RU in input placeholder
        document.getElementById("ru").placeholder = 
            "Previous RU: " + previousRU;
    });
});

function generate() {

    let currentRU = Number(document.getElementById("ru").value);
    let kw = document.getElementById("kw").value;
    let operator = document.getElementById("operator").value;
    let labour = document.getElementById("labour").value;
    let mva = document.getElementById("mva").value;

    if (!currentRU) {
        alert("Please enter Current RU");
        return;
    }

    let units = currentRU - previousRU;
    totalUnits += units;

    let message = 
`☀ SUN ENERGY SPP ☀

PREVIOUS RU - ${previousRU}
CURRENT RU - ${currentRU}
UNITS - ${units}
TOTAL UNITS - ${totalUnits}
KW - ${kw}
EXP MVA - ${mva}
OPERATOR - ${operator}
LABOUR - ${labour}`;

    document.getElementById("output").textContent = message;

    // 🔥 SAVE TO FIREBASE
    database.ref("sun_energy_data").push({
        currentRU: currentRU,
        units: units,
        totalUnits: totalUnits,
        kw: kw,
        mva: mva,
        operator: operator,
        labour: labour,
        timestamp: new Date().toLocaleString()
    })
    .then(() => {
        alert("Data Saved Successfully!");
        previousRU = currentRU;
        document.getElementById("ru").value = "";
    })
    .catch((error) => {
        console.error("Error: ", error);
    });
}
// LOAD FULL HISTORY
database.ref("sun_energy_data").on("value", (snapshot) => {

    const tableBody = document.querySelector("#historyTable tbody");
    tableBody.innerHTML = "";

    let labels = [];
    let unitsData = [];

    snapshot.forEach((child) => {
        const data = child.val();

        // Add row to table
        let row = `
            <tr>
                <td>${data.timestamp}</td>
                <td>${data.currentRU}</td>
                <td>${data.units}</td>
                <td>${data.totalUnits}</td>
            </tr>
        `;
        tableBody.innerHTML += row;

        labels.push(data.timestamp);
        unitsData.push(data.units);
    });

    drawChart(labels, unitsData);
});
let chart;

function drawChart(labels, unitsData) {

    const ctx = document.getElementById("unitsChart").getContext("2d");

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Generated Units",
                data: unitsData,
                borderColor: "orange",
                backgroundColor: "rgba(255,165,0,0.2)",
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}