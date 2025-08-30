// Transfer Types
export interface TransferRequest {
  senderAddress: string;
  recipientAddress: string;
  amount: number;
  sourceChain: string;
  destinationChain: string;
  intent: 'standard' | 'maximize_yield' | 'minimize_fees';
  email?: string;
  note?: string;
}

export interface TransferResponse {
  success: boolean;
  transferId: string;
  transferDetails: any;
  routeData: RouteData;
  message: string;
}

export interface RouteData {
  optimalChain: string;
  estimatedFees: number;
  suggestedActions: string[];
  gasData: Record<string, number>;
  yieldData: Record<string, number>;
  liquidityData: Record<string, any>;
}

export interface PostTransferHook {
  type: 'defi_deposit' | 'treasury_rebalancing' | 'liquidity_provision';
  protocol: string;
  chain: string;
  amount: number;
  parameters: Record<string, any>;
}

export interface HookExecutionResult {
  success: boolean;
  hookId: string;
  result: any;
  timestamp: string;
}

// Circle CCTP Types
export interface CCTPTransferRequest {
  amount: string;
  destinationAddress: string;
  destinationDomain: number;
  sourceDomain: number;
  senderAddress: string;
}

export interface CCTPTransferResponse {
  success: boolean;
  transferId?: string;
  txHash?: string;
  message?: string;
  error?: string;
}

export interface CCTPStatusResponse {
  success: boolean;
  status?: string;
  burnTxHash?: string;
  mintTxHash?: string;
  completedAt?: string;
  error?: string;
}

// Webhook Types
export interface WebhookEvent {
  transferId: string;
  status: string;
  destinationTxHash?: string;
  error?: string;
}

// Database Types
export interface TransferDocument {
  transferId: string;
  sender: string;
  recipient: string;
  amount: number;
  sourceChain: string;
  destinationChain: string;
  intent: string;
  status: string;
  estimatedFees: number;
  suggestedActions: string[];
  txHash?: string;
  destinationTxHash?: string;
  cctpTransferId?: string;
  error?: string;
  email?: string;
  note?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  toObject(): any;
} 