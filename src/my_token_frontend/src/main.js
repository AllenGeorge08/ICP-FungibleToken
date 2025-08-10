import { my_token_backend } from "../../declarations/my_token_backend";
import { Principal } from "@dfinity/principal";

let actor = my_token_backend;

// Convert your principal string to proper Principal object
const currentUser = Principal.fromText("ud2uu-gpjc4-a7y2f-qp2bu-7yp56-lqpen-ngv6i-uif2h-4tm6j-v5w2o-cqe");

// Load initial data
window.addEventListener('load', async () => {
    await loadTokenInfo();
    await checkBalance();
    
    // Add event listeners for buttons
    document.getElementById('refreshBalanceBtn').addEventListener('click', checkBalance);
    document.getElementById('transferBtn').addEventListener('click', transferTokens);
    document.getElementById('mintBtn').addEventListener('click', mintTokens);
    document.getElementById('checkBalanceBtn').addEventListener('click', checkOtherBalance);
});

async function loadTokenInfo() {
    try {
        const info = await actor.tokenInfo();
        document.getElementById('tokenName').textContent = info.name;
        document.getElementById('tokenSymbol').textContent = info.symbol;
        document.getElementById('totalSupply').textContent = info.totalSupply.toLocaleString();
    } catch (error) {
        console.error('Error loading token info:', error);
        document.getElementById('totalSupply').textContent = 'Error loading';
    }
}

async function checkBalance() {
    try {
        const balance = await actor.balanceOf(currentUser);
        document.getElementById('userBalance').textContent = balance.toLocaleString();
    } catch (error) {
        console.error('Error checking balance:', error);
        document.getElementById('userBalance').textContent = 'Error';
    }
}

async function transferTokens() {
    const to = document.getElementById('transferTo').value;
    const amount = parseInt(document.getElementById('transferAmount').value);
    const resultDiv = document.getElementById('transferResult');

    if (!to || !amount) {
        showResult(resultDiv, 'Please fill in all fields', 'error');
        return;
    }

    try {
        const result = await actor.transfer(Principal.fromText(to), amount);
        if (result.Ok) {
            showResult(resultDiv, result.Ok, 'success');
            await checkBalance();
            await loadTokenInfo();
            document.getElementById('transferTo').value = '';
            document.getElementById('transferAmount').value = '';
        } else {
            showResult(resultDiv, result.Err, 'error');
        }
    } catch (error) {
        showResult(resultDiv, 'Transfer failed: ' + error.message, 'error');
    }
}

async function mintTokens() {
    const to = document.getElementById('mintTo').value;
    const amount = parseInt(document.getElementById('mintAmount').value);
    const resultDiv = document.getElementById('mintResult');

    if (!to || !amount) {
        showResult(resultDiv, 'Please fill in all fields', 'error');
        return;
    }

    try {
        const result = await actor.mint(Principal.fromText(to), amount);
        if (result.Ok) {
            showResult(resultDiv, result.Ok, 'success');
            await checkBalance();
            await loadTokenInfo();
            document.getElementById('mintTo').value = '';
            document.getElementById('mintAmount').value = '';
        } else {
            showResult(resultDiv, result.Err, 'error');
        }
    } catch (error) {
        showResult(resultDiv, 'Mint failed: ' + error.message, 'error');
    }
}

async function checkOtherBalance() {
    const principal = document.getElementById('checkPrincipal').value;
    const resultDiv = document.getElementById('balanceResult');

    if (!principal) {
        showResult(resultDiv, 'Please enter a principal ID', 'error');
        return;
    }

    try {
        const balance = await actor.balanceOf(Principal.fromText(principal));
        showResult(resultDiv, `Balance: ${balance.toLocaleString()} NEON`, 'success');
    } catch (error) {
        showResult(resultDiv, 'Error checking balance: ' + error.message, 'error');
    }
}

function showResult(element, message, type) {
    element.textContent = message;
    element.className = `result ${type}`;
    element.style.display = 'block';
    setTimeout(() => {
        element.style.display = 'none';
    }, 3000);
}