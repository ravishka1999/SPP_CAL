// 🔥 Firebase Config
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

// Load last record
database.ref("sun_energy_data").limitToLast(1).on("value", (snapshot) => {
    snapshot.forEach((child) => {
        previousRU = child.val().currentRU || 0;
        totalUnits = child.val().totalUnits || 0;
        document.getElementById("ru").placeholder = "Previous RU: " + previousRU;
        document.getElementById("cardTotal").innerText = totalUnits;
        document.getElementById("cardUnits").innerText = previousRU;
    });
});

function generate() {

    let currentRU = Number(document.getElementById("ru").value);
    let kw = document.getElementById("kw").value;
    let operator = document.getElementById("operator").value;
    let labour = document.getElementById("labour").value;
    let mva = document.getElementById("mva").value;

    if (document.getElementById("ru").value === "") {
        alert("Please enter Current RU");
        return;
    }

    if (currentRU < previousRU) {
        alert("Current RU cannot be less than Previous RU!");
        return;
    }

    let units = currentRU - previousRU;
    totalUnits += units;

    document.getElementById("cardUnits").innerText = previousRU;
    document.getElementById("cardTotal").innerText = totalUnits;
    document.getElementById("cardKW").innerText = units;

    let now = new Date();

    let message = 
`☀ SUN ENERGY SPP ☀

UNITS - ${units}
TOTAL UNITS - ${totalUnits}
KW - ${kw}
EXP MVA - ${mva}
OPERATOR - ${operator}
LABOUR - ${labour}`;

    document.getElementById("output").textContent = message;

    database.ref("sun_energy_data").push({
        currentRU,
        previousRU,
        units,
        totalUnits,
        kw,
        mva,
        operator,
        labour,
        timestamp: Date.now()
    });

    previousRU = currentRU;
    document.getElementById("ru").value = "";
}
function copyMessage() {

    let text = document.getElementById("output").textContent;

    if (!text.trim()) {
        alert("No report to copy!");
        return;
    }

    navigator.clipboard.writeText(text)
        .then(() => {
            alert("Report Copied Successfully!");
        })
        .catch(() => {
            alert("Copy Failed!");
        });
}
function deleteLastRecord() {

    database.ref("sun_energy_data")
        .limitToLast(1)
        .once("value", function(snapshot) {

            if (!snapshot.exists()) {
                alert("No records found!");
                return;
            }

            snapshot.forEach(function(child) {

                let confirmDelete = confirm("Are you sure you want to delete the last record?");

                if (confirmDelete) {

                    child.ref.remove()
                        .then(() => {
                            alert("Last record deleted successfully!");

                            // Reload page to refresh previousRU and totals
                            location.reload();
                        })
                        .catch((error) => {
                            console.error(error);
                            alert("Delete failed!");
                        });

                }

            });

        });

}