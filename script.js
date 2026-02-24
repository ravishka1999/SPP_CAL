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