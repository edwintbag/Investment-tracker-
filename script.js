document.addEventListener("DOMContentLoaded", () => { let balance = 102.60; const balanceElement = document.getElementById("currentBalance"); const transactionTable = document.getElementById("transactionTable"); const investmentChartCtx = document.getElementById("investmentChart").getContext("2d"); const goalDisplay = document.getElementById("goalDisplay"); let goalAmount = null; let transactions = [];

const investmentChart = new Chart(investmentChartCtx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Balance (KSH)',
            data: [],
            borderColor: 'blue',
            fill: false
        }]
    },
    options: {
        responsive: true,
    }
});

function updateBalance(amount, type) {
    if (type === 'Deposit') balance += amount;
    else if (type === 'Withdraw' && balance >= amount) balance -= amount;
    else return alert("Insufficient balance");
    
    balanceElement.textContent = balance.toFixed(2);
    addTransaction(type, amount);
    updateChart();
}

function addTransaction(type, amount) {
    const date = new Date().toLocaleDateString();
    transactions.push({ date, type, amount });
    const row = `<tr><td>${date}</td><td>${type}</td><td>KSH ${amount.toFixed(2)}</td></tr>`;
    transactionTable.innerHTML += row;
}

function updateChart() {
    investmentChart.data.labels.push(new Date().toLocaleTimeString());
    investmentChart.data.datasets[0].data.push(balance);
    investmentChart.update();
}

document.getElementById("depositBtn").addEventListener("click", () => {
    const amount = parseFloat(document.getElementById("investmentAmount").value);
    if (amount > 0) updateBalance(amount, 'Deposit');
});

document.getElementById("withdrawBtn").addEventListener("click", () => {
    const amount = parseFloat(document.getElementById("investmentAmount").value);
    if (amount > 0) updateBalance(amount, 'Withdraw');
});

document.getElementById("calcForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const principal = parseFloat(document.getElementById("calcPrincipal").value);
    const rate = parseFloat(document.getElementById("calcRate").value) / 100;
    const years = parseFloat(document.getElementById("calcYears").value);
    const futureValue = principal * Math.pow(1 + rate, years);
    document.getElementById("calcResult").textContent = `Future Value: KSH ${futureValue.toFixed(2)}`;
});

document.getElementById("setGoalBtn").addEventListener("click", () => {
    goalAmount = parseFloat(document.getElementById("goalAmount").value);
    goalDisplay.textContent = goalAmount ? `KSH ${goalAmount.toFixed(2)}` : "Not Set";
});

document.getElementById("exportBtn").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("Investment Report", 10, 10);
    let y = 20;
    transactions.forEach(({ date, type, amount }) => {
        doc.text(`${date} - ${type}: KSH ${amount.toFixed(2)}`, 10, y);
        y += 10;
    });
    doc.save("investment_report.pdf");
});

document.getElementById("toggleDarkMode").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

});

function updateGreeting() {
    const greetingElement = document.querySelector(".text-muted");
    const currentHour = new Date().getHours();
    let greeting = "Good morning";

    if (currentHour >= 12 && currentHour < 18) {
        greeting = "Good afternoon";
    } else if (currentHour >= 18) {
        greeting = "Good evening";
    }

    greetingElement.textContent = `${greeting}, EDWIN`;
}

// Call the function on page load
updateGreeting();
