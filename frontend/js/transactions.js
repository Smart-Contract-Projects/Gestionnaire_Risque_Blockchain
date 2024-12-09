// Import Contract and Wallet
import { CONTRACT_ADDRESS, ABI } from "./contract.js";

// DOM Elements
const transactionTable = document.getElementById("transaction-table");
const transactionForm = document.getElementById("transaction-form");
const receiverAddressInput = document.getElementById("receiver-address");
const transactionAmountInput = document.getElementById("transaction-amount");

// Initialize ethers.js
let signer, contract;

async function initializeContract() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    } else {
        alert("MetaMask is not installed. Please install it to use this application.");
    }
}

// Fetch and display transaction history
async function fetchTransactionHistory() {
    try {
        const transactions = await contract.obtenirHistoriqueTransactions();
        transactionTable.innerHTML = ""; // Clear existing rows
        transactions.forEach((tx, index) => {
            // Convert stored Wei values back to user-friendly format
            const displayedValue = ethers.utils.formatUnits(tx.valeur.toString(), "wei"); // Convert Wei to plain number

            const row = document.createElement("tr");
            row.innerHTML = `
                <th scope="row">${index + 1}</th>
                <td>${tx.expediteur}</td>
                <td>${tx.recepteur}</td>
                <td>${displayedValue}</td> <!-- Display scaled-down value -->
                <td>${new Date(tx.horodatage * 1000).toLocaleString()}</td>
            `;
            transactionTable.appendChild(row);
        });
    } catch (error) {
        console.error("Failed to fetch transaction history:", error);
    }
}

// Submit a new transaction
async function submitTransaction(event) {
    event.preventDefault();
    const receiver = receiverAddressInput.value;
    const amount = transactionAmountInput.value;

    if (!ethers.utils.isAddress(receiver)) {
        alert("Invalid receiver address format!");
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        alert("Invalid transaction amount!");
        return;
    }

    try {
        // Convert user input to Wei for storage in the contract
        const weiAmount = ethers.utils.parseUnits(amount, "wei");
        const tx = await contract.enregistrerTransaction(receiver, weiAmount);
        await tx.wait(); // Wait for the transaction to be mined
        alert("Transaction submitted successfully!");
        fetchTransactionHistory(); // Refresh the transaction table
        transactionForm.reset(); // Clear the form
    } catch (error) {
        console.error("Failed to submit transaction:", error);
        alert("Failed to submit transaction. Please try again.");
    }
}

// Initialize page
document.addEventListener("DOMContentLoaded", async () => {
    await initializeContract();
    await fetchTransactionHistory();

    transactionForm.addEventListener("submit", submitTransaction);
});
