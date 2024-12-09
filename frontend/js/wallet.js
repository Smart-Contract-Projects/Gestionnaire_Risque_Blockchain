// Global Variables
const walletButton = document.getElementById("connect-wallet");
const walletStatus = document.getElementById("wallet-status");

// Function to check wallet connection on page load
async function checkWalletConnection() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    // Retrieve the stored wallet address from localStorage
    const storedWallet = localStorage.getItem("connectedWallet");
    if (storedWallet) {
      updateWalletUI(storedWallet); // Use the stored wallet address
    } else {
      const accounts = await provider.listAccounts(); // Fetch connected accounts
      if (accounts.length > 0) {
        const walletAddress = accounts[0];
        updateWalletUI(walletAddress); // Update the UI
      } else {
        clearWalletUI(); // No accounts connected
      }
    }
  } else {
    alert("MetaMask is not installed. Please install it to use this application.");
  }
}

// Function to connect wallet manually
async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []); // Trigger MetaMask pop-up
      if (accounts.length > 0) {
        const walletAddress = accounts[0];
        updateWalletUI(walletAddress); // Update the UI with the selected wallet
      } else {
        alert("No account selected. Please select an account in MetaMask.");
      }
    } catch (error) {
      console.error("Wallet connection failed:", error);
      alert("Failed to connect wallet. Please try again.");
    }
  } else {
    alert("MetaMask is not installed. Please install it to use this application.");
  }
}

// Function to update UI for a connected wallet
function updateWalletUI(walletAddress) {
  localStorage.setItem("connectedWallet", walletAddress); // Save wallet to localStorage
  walletStatus.innerText = `Connected: ${walletAddress}`;
  walletStatus.style.backgroundColor = "black";
  walletStatus.style.color = "white";
  walletStatus.style.fontWeight = "bold";
  walletButton.innerText = "Connected";
  walletButton.disabled = true;
}

// Function to clear wallet connection from UI
function clearWalletUI() {
  localStorage.removeItem("connectedWallet"); // Remove wallet from localStorage
  walletStatus.innerText = "Wallet not connected.";
  walletStatus.style.backgroundColor = "black";
  walletStatus.style.color = "white";
  walletStatus.style.fontWeight = "bold";
  walletButton.innerText = "Connect Wallet";
  walletButton.disabled = false;
}

// Function to handle account changes in MetaMask
function handleAccountChange(accounts) {
  if (accounts.length > 0) {
    const walletAddress = accounts[0];
    updateWalletUI(walletAddress); // Update UI with the new account
  } else {
    clearWalletUI(); // Clear UI if no accounts are connected
  }
}

// Event listener for wallet connection button
if (walletButton) {
  walletButton.addEventListener("click", connectWallet);
}

// Listen for MetaMask account changes
if (typeof window.ethereum !== "undefined") {
  window.ethereum.on("accountsChanged", handleAccountChange); // Handle account changes dynamically
}

// Automatically check wallet connection status on page load
document.addEventListener("DOMContentLoaded", () => {
  checkWalletConnection();
});
