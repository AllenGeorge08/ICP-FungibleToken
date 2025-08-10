# EduCoin Token - Deploy Instructions

## Prerequisites
1. Install Node.js (version 16+)
2. Install DFX: `sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"`

## Deploy Steps

1. **Clone and setup**
   ```bash
   # Get the project files
   cd my_token
   
   # Start local ICP network
   dfx start --background
   ```

2. **Get your principal ID**
   ```bash
   dfx identity get-principal
   ```
   Copy this ID (something like: `ud2uu-gpjc4-a7y2f-qp2bu-7yp56-lqpen-ngv6i-uif2h-4tm6j-v5w2o-cqe`)

3. **Update the code with YOUR principal ID**
   
   **In `src/my_token_backend/main.mo`** - Replace ALL 3 instances:
   ```motoko
   private let creator = Principal.fromText("YOUR_PRINCIPAL_HERE");
   let caller = Principal.fromText("YOUR_PRINCIPAL_HERE");
   let caller = Principal.fromText("YOUR_PRINCIPAL_HERE");
   ```
   
   **In `src/my_token_frontend/src/main.js`** - Replace:
   ```javascript
   const currentUser = Principal.fromText("YOUR_PRINCIPAL_HERE");
   ```

4. **Deploy**
   ```bash
   dfx deploy
   ```

5. **Open your app**
   Use the URL from deploy output, something like:
   ```
   http://CANISTER_ID.localhost:4943/
   ```

## What You Get
- ✅ 1,000,000 EDU tokens (given to you as creator)
- ✅ Transfer tokens to others
- ✅ Mint new tokens (creator only)  
- ✅ Check any user's balance
- ✅ Web UI for all operations

## Test It
1. Your balance should show 1,000,000 EDU
2. Try minting tokens to yourself
3. Try transferring tokens (use another principal ID)

## Troubleshooting
- If deployment fails: `dfx stop && dfx start --clean --background && dfx deploy`
- Make sure you replaced ALL placeholder principal IDs with your real one
- Check browser console (F12) for errors

That's it! You have a working fungible token on ICP.