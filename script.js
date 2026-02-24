// Load previous saved values
let previousRU = localStorage.getItem("previousRU") || 0;
let totalUnits = localStorage.getItem("totalUnits") || 0;

function generate() {

    let currentRU = Number(document.getElementById("ru").value);
    let kw = document.getElementById("kw").value;
    let operator = document.getElementById("operator").value;
    let labour = document.getElementById("labour").value;
    let mva = document.getElementById("mva").value;

    let units = currentRU - previousRU;
    totalUnits = Number(totalUnits) + units;

    // Save new values
    localStorage.setItem("previousRU", currentRU);
    localStorage.setItem("totalUnits", totalUnits);

    previousRU = currentRU;

    let message = 
`☀ *_SUN ENERGY SPP_* ☀

*UNITS* - ${units}
*TOTAL UNITS* - ${totalUnits}
*KW* - ${kw}
*EXP MVA* - ${mva}
*OPERATOR* - ${operator}
*LABOUR* - ${labour}`;

    document.getElementById("output").textContent = message;
}