// Import Contract and Wallet
import { CONTRACT_ADDRESS, ABI } from "./contract.js";

document.getElementById("add-counterparty-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

  const address = document.getElementById("counterparty-address").value;
  const creditScore = parseInt(document.getElementById("credit-score").value, 10);
  const limit = parseInt(document.getElementById("limit").value, 10);

  // Validate Inputs
  if (!ethers.utils.isAddress(address)) {
    alert("Invalid counterparty address.");
    return;
  }
  if (isNaN(creditScore) || creditScore <= 0) {
    alert("Invalid credit score.");
    return;
  }
  if (isNaN(limit) || limit <= 0) {
    alert("Invalid limit.");
    return;
  }

  try {
    // Verify if connected account is the admin
    const adminAddress = await contract.administrateur();
    const accounts = await provider.listAccounts();
    if (accounts[0].toLowerCase() !== adminAddress.toLowerCase()) {
      alert("You must connect with the administrator account.");
      return;
    }

    // Estimate gas and send transaction
    const gasLimit = await contract.estimateGas.ajouterContrepartie(address, creditScore, limit);
    console.log("Gas Limit:", gasLimit.toString());
    const tx = await contract.ajouterContrepartie(address, creditScore, limit, { gasLimit });
    console.log("Transaction Sent:", tx);
    await tx.wait();

    alert("Counterparty added successfully!");
    fetchCounterparties();
  } catch (error) {
    if (error.code === 4001) {
      alert("Transaction was rejected by the user.");
    } else if (error.code === -32603) {
      alert("Internal JSON-RPC error. Ensure you're using the admin account.");
    } else {
      console.error("Failed to add counterparty:", error);
      alert("An error occurred. Check the console for details.");
    }
  }
});

// Function to fetch and display counterparties in the table
async function fetchCounterparties() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
  const tableBody = document.getElementById("counterparties-table");

  try {
    const counterparties = await contract.obtenirListeContreparties();
    tableBody.innerHTML = ""; // Clear the table

    for (let i = 0; i < counterparties.length; i++) {
      const address = counterparties[i];
      try {
        // Fetch data from contract (or other sources if needed)
        const counterpartyData = await contract.contreparties(address);

        // Format values for UI consistency
        const collateral = parseFloat(ethers.utils.formatUnits(counterpartyData.garantie, "ether"));
        const exposure = parseFloat(ethers.utils.formatUnits(counterpartyData.exposition, "ether"));
        const limit = parseFloat(ethers.utils.formatUnits(counterpartyData.limite, "ether"));

        // Calculate ratio and risk dynamically
        const ratio = exposure === 0 ? 100 : ((collateral / exposure) * 100).toFixed(2);
        const risk = exposure > 0 && limit > 0 ? ((exposure / limit) * 100).toFixed(2) : 0;

        // Determine trust badge
        let badge = "🟢 High Trust";
        if (risk > 50) badge = "🟡 Moderate Trust";
        if (risk > 100) badge = "🔴 Low Trust";

        // Add row to the table
        const row = `
          <tr>
            <td>${i + 1}</td>
            <td>${address}</td>
            <td>${ratio}%</td>
            <td>${risk}%</td>
            <td>${badge}</td>
          </tr>
        `;
        tableBody.insertAdjacentHTML("beforeend", row);
      } catch (error) {
        console.warn(`Error fetching data for counterparty ${address}:`, error);
      }
    }
  } catch (error) {
    console.error("Error fetching counterparties:", error);
  }
}

// Initialize counterparty fetching on page load
document.addEventListener("DOMContentLoaded", fetchCounterparties);
