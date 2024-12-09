// Import Contract and Wallet
import { CONTRACT_ADDRESS, ABI } from "./contract.js";

// Function to fetch and update dashboard metrics
async function updateDashboard() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

    try {
      // Fetch counterparties
      const counterparties = await contract.obtenirListeContreparties();
      document.getElementById("total-counterparties").innerText = counterparties.length;

      // Fetch transactions
      const transactions = await contract.obtenirHistoriqueTransactions();
      document.getElementById("total-transactions").innerText = transactions.length;

      // Calculate total exposure dynamically based on displayed values
      let totalExposure = 0; // Initialize total exposure
      for (const address of counterparties) {
        const counterparty = await contract.contreparties(address);
        const displayedExposition = parseFloat(ethers.utils.formatUnits(counterparty.exposition, "wei"));
        totalExposure += displayedExposition; // Sum exposures
      }

      // Format total exposure for UI
      document.getElementById("total-exposure").innerText = `${totalExposure.toLocaleString()} ETH`;

      // Update counterparty details
      await updateCounterpartyDetails(contract, counterparties);

      // Generate donut chart
      generateBarChartWithLogScale(counterparties.length, transactions.length, totalExposure);
    } catch (error) {
      console.error("Failed to update dashboard metrics:", error);
    }
  } else {
    alert("MetaMask is not installed. Please install it to use this application.");
  }
}

// Function to fetch and display individual counterparty data
async function updateCounterpartyDetails(contract, counterparties) {
  const tableBody = document.getElementById("counterparties-table");
  tableBody.innerHTML = ""; // Clear table

  let index = 1; // Row numbering

  for (const address of counterparties) {
    try {
      const counterparty = await contract.contreparties(address);

      // Convert contract-stored values to match UI format
      const displayedExposition = parseFloat(ethers.utils.formatUnits(counterparty.exposition, "wei")); // Exposure
      const displayedGarantie = parseFloat(ethers.utils.formatUnits(counterparty.garantie, "wei"));    // Collateral
      const displayedLimite = parseFloat(ethers.utils.formatUnits(counterparty.limite, "wei"));        // Limit

      // Calculate Guarantee Ratio and Risk dynamically
      const guaranteeRatio = displayedExposition === 0 ? 100 : ((displayedGarantie / displayedExposition) * 100).toFixed(2);
      const riskLevel = displayedExposition > 0 && displayedLimite > 0
        ? ((displayedExposition / displayedLimite) * 100).toFixed(2)
        : 0;

      // Determine trust badge based on recalculated Risk Level
      let badge = "🟢 High Trust";
      if (riskLevel > 50) badge = "🟡 Moderate Trust";
      if (riskLevel > 100) badge = "🔴 Low Trust";

      // Add row to the table
      const row = `
        <tr>
          <td>${index++}</td>
          <td>${address}</td>
          <td>${guaranteeRatio}%</td>
          <td>${riskLevel}%</td>
          <td>${badge}</td>
        </tr>
      `;
      tableBody.insertAdjacentHTML("beforeend", row);
    } catch (error) {
      console.warn(`Error fetching data for counterparty ${address}:`, error);
    }
  }
}

// Function to generate donut chart for key metrics
function generateBarChartWithLogScale(counterparties, transactions, exposure) {
  const ctx = document.getElementById("log-bar-chart").getContext("2d");

  if (!ctx) {
    console.error("Canvas element for the bar chart not found!");
    return;
  }

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Counterparties", "Transactions", "Exposure"],
      datasets: [
        {
          label: "Metrics",
          data: [counterparties, transactions, exposure],
          backgroundColor: ["#4caf50", "#2196f3", "#ff9800"],
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              const value = tooltipItem.raw.toLocaleString();
              return `${tooltipItem.label}: ${value}`;
            }
          }
        }
      },
      scales: {
        y: {
          type: "logarithmic", // Use a logarithmic scale
          title: {
            display: true,
            text: "Value (Log Scale)"
          },
          ticks: {
            callback: function (value) {
              return value.toLocaleString(); // Format ticks for readability
            }
          },
          beginAtZero: true
        },
        x: {
          title: {
            display: true,
            text: "Metrics"
          }
        }
      }
    }
  });
}

// Call this function in `updateDashboard`
document.addEventListener("DOMContentLoaded", async () => {
  await updateDashboard();
});
