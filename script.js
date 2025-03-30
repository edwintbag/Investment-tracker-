document.addEventListener("DOMContentLoaded", function () {
      let balance = 102.60;
      const balanceElement = document.getElementById("currentBalance");
      const transactionTable = document.getElementById("transactionTable");
      const investmentChartCtx = document.getElementById("investmentChart");
      const toggleDarkMode = document.getElementById("toggleDarkMode");
      let history = [{ time: new Date().toLocaleTimeString(), value: balance }];
      
      function updateBalance() {
        balanceElement.textContent = balance.toFixed(2);
      }
      
      function addTransaction(type, amount) {
        const date = new Date().toLocaleDateString();
        const row = `<tr><td>${date}</td><td>${type}</td><td>KSH ${amount.toFixed(2)}</td></tr>`;
        transactionTable.innerHTML = row + transactionTable.innerHTML;
        history.push({ time: new Date().toLocaleTimeString(), value: balance });
        updateChart();
      }
      
      document.getElementById("depositBtn").addEventListener("click", function () {
        const amount = parseFloat(document.getElementById("investmentAmount").value);
        if (!isNaN(amount) && amount > 0) {
          balance += amount;
          updateBalance();
          addTransaction("Deposit", amount);
        }
      });
      
      document.getElementById("withdrawBtn").addEventListener("click", function () {
        const amount = parseFloat(document.getElementById("investmentAmount").value);
        if (!isNaN(amount) && amount > 0 && amount <= balance) {
          balance -= amount;
          updateBalance();
          addTransaction("Withdrawal", amount);
        }
      });
      
      let chart = new Chart(investmentChartCtx, {
        type: 'line',
        data: {
          labels: history.map(entry => entry.time),
          datasets: [{
            label: "Investment Trend",
            data: history.map(entry => entry.value),
            borderColor: "#007bff",
            fill: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: { x: { display: true }, y: { display: true } }
        }
      });
      
      function updateChart() {
        chart.data.labels = history.map(entry => entry.time);
        chart.data.datasets[0].data = history.map(entry => entry.value);
        chart.update();
      }
      
      // Timeframe filter function
      window.updateChartTimeframe = function(days) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        const filteredHistory = history.filter(h => new Date("1970/01/01 " + h.time) >= cutoff);
        chart.data.labels = filteredHistory.map(h => h.time);
        chart.data.datasets[0].data = filteredHistory.map(h => h.value);
        chart.update();
      };
      
      toggleDarkMode.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
        toggleDarkMode.textContent = document.body.classList.contains("dark-mode") ? "Light Mode" : "Dark Mode";
      });
      
      // Investment Calculator Functionality
      document.getElementById("calcForm").addEventListener("submit", function(e) {
        e.preventDefault();
        const principal = parseFloat(document.getElementById("calcPrincipal").value);
        const ratePercent = parseFloat(document.getElementById("calcRate").value);
        const years = parseFloat(document.getElementById("calcYears").value);
        const rate = ratePercent / 100;
        // Compound interest formula assuming annual compounding (n=1)
        const futureValue = principal * Math.pow(1 + rate, years);
        document.getElementById("calcResult").textContent = 
          `Future Value: KSH ${futureValue.toFixed(2)}`;
      });
    });