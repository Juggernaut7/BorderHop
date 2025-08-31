# 🚀 BorderHop Contract Deployment Guide

## ✅ Step 1: Environment Setup

### 1.1 Get Infura Project ID
1. Go to [https://infura.io/](https://infura.io/)
2. Sign up/Login
3. Create a new project
4. Go to **Settings > Keys**
5. Copy the **Project ID**

### 1.2 Get Your Private Key
1. Open MetaMask
2. Go to **Account Details > Export Private Key**
3. Enter your password
4. Copy the private key

### 1.3 Create .env File
Create a file called `.env` in the contracts directory with:

```env
PRIVATE_KEY=your_private_key_here
INFURA_PROJECT_ID=your_infura_project_id_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

## ✅ Step 2: Deploy Contracts

### 2.1 Compile Contracts
```bash
npm run compile
```

### 2.2 Deploy to Sepolia
```bash
npm run deploy:simple
```

## ✅ Step 3: Verify Deployment

After successful deployment, you'll see:
- Contract address
- Transaction hash
- Network information

## 🔧 Troubleshooting

### "Invalid project id" Error
- Make sure your Infura Project ID is correct
- Check that you're using the right project (not mainnet)

### "Invalid private key" Error
- Make sure your private key starts with `0x`
- Don't include quotes around the private key

### Node.js Version Warning
- This is just a warning, deployment should still work
- Consider using Node.js v18 for best compatibility

## 📋 Required Values

| Variable | Description | Example |
|----------|-------------|---------|
| `PRIVATE_KEY` | Your wallet private key | `0x1234...abcd` |
| `INFURA_PROJECT_ID` | Infura project ID | `abc123def456` |
| `ETHERSCAN_API_KEY` | Etherscan API key (optional) | `ABC123DEF456` |

## 🎯 Quick Commands

```bash
# Navigate to contracts
cd contracts

# Install dependencies
npm install

# Compile
npm run compile

# Deploy
npm run deploy:simple
```

## 🚀 Success!

Once deployed, your BorderHopHook contract will be ready to:
- Execute CCTP V2 hooks
- Handle cross-chain USDC transfers
- Manage DeFi integrations
- Optimize treasury operations 