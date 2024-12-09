// Import Contract and Wallet
import { CONTRACT_ADDRESS, ABI } from "./contract.js";

// Update Collateral
document.getElementById("update-collateral-form").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent page refresh

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    const address = document.getElementById("collateral-address").value;
    const newCollateral = document.getElementById("new-collateral").value;

    if (!ethers.utils.isAddress(address)) {
        alert("Invalid address format!");
        return;
    }
    if (isNaN(newCollateral) || newCollateral <= 0) {
        alert("Invalid collateral amount!");
        return;
    }

    try {
        // Scale user input to Wei for storage in the contract
        const scaledCollateral = ethers.utils.parseUnits(newCollateral, "wei");
        const tx = await contract.actualiserGarantie(address, scaledCollateral);
        await tx.wait();
        alert("Collateral updated successfully!");
        fetchAdminCounterparties(); // Refresh the table
    } catch (error) {
        console.error("Error updating collateral:", error);
        alert("Failed to update collateral. Check the console for details.");
    }
});

// Update Exposure
document.getElementById("update-exposure-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    const counterpartyAddress = document.getElementById("exposure-address").value;
    const additionalExposure = document.getElementById("additional-exposure").value;

    if (!ethers.utils.isAddress(counterpartyAddress)) {
        alert("Invalid address format!");
        return;
    }
    if (isNaN(additionalExposure) || additionalExposure <= 0) {
        alert("Invalid exposure amount!");
        return;
    }

    try {
        // Scale user input to Wei for storage in the contract
        const scaledExposure = ethers.utils.parseUnits(additionalExposure, "wei");
        const tx = await contract.actualiserExposition(counterpartyAddress, scaledExposure);
        await tx.wait();
        alert("Exposure updated successfully!");
        fetchAdminCounterparties(); // Refresh the table
    } catch (error) {
        console.error("Error updating exposure:", error);
        alert("Failed to update exposure. Check the console for details.");
    }
});

// Reactivate Counterparty
window.reactivateCounterparty = async function (address) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    try {
        // Fetch counterparty details
        const counterparty = await contract.contreparties(address);

        // Validate exposure and limit
        const exposure = parseInt(counterparty.exposition.toString(), 10);
        const limit = parseInt(counterparty.limite.toString(), 10);

        if (exposure > limit) {
            alert("Cannot reactivate. Exposure exceeds the limit.");
            return;
        }

        // Call the reactivation function
        const tx = await contract.reactiverContrepartie(address);
        await tx.wait();
        alert("Counterparty reactivated successfully!");
        fetchAdminCounterparties(); // Refresh the table
    } catch (error) {
        console.error("Error reactivating counterparty:", error);
        alert("Failed to reactivate counterparty. Check the console for details.");
    }
};

// Fetch and Display Counterparties
async function fetchAdminCounterparties() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    const tableBody = document.getElementById("admin-counterparties-table");

    try {
        const counterparties = await contract.obtenirListeContreparties();
        tableBody.innerHTML = ""; // Clear table rows

        for (let i = 0; i < counterparties.length; i++) {
            const address = counterparties[i];
            const data = await contract.contreparties(address);

            // Scale down values from Wei for display in the UI
            const creditScore = data.creditScore.toString();
            const limit = ethers.utils.formatUnits(data.limite.toString(), "wei"); // Convert Wei to plain number
            const collateral = ethers.utils.formatUnits(data.garantie.toString(), "wei"); // Convert Wei to plain number
            const exposure = ethers.utils.formatUnits(data.exposition.toString(), "wei"); // Convert Wei to plain number
            const isActive = data.estActive;
            const status = isActive ? "🟢 Active" : "🔴 Inactive";

            const actionButton = isActive
                ? ""
                : `<button class="btn btn-warning btn-sm" onclick="reactivateCounterparty('${address}')">Reactivate</button>`;

            const row = `
                <tr>
                  <td>${i + 1}</td>
                  <td>${address}</td>
                  <td>${creditScore}</td>
                  <td>${limit}</td>
                  <td>${collateral}</td>
                  <td>${exposure}</td>
                  <td>${status}</td>
                  <td>${actionButton}</td>
                </tr>
            `;
            tableBody.insertAdjacentHTML("beforeend", row);
        }
    } catch (error) {
        console.error("Error fetching counterparties:", error);
    }
}

// Initialize the admin page
document.addEventListener("DOMContentLoaded", fetchAdminCounterparties);
