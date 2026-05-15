import { Injectable, inject } from '@angular/core';
import {
  createPublicClient,
  createWalletClient,
  custom,
  http,
  defineChain,
  parseEventLogs,
  type Hash,
} from 'viem';
import { EnvService } from './env.service';
import { MetaMaskService } from './metamask.service';
import { ALEJANDRIA_ABI } from '../models/contract-abi';
import type { Publication } from '../models/publication.model';

export interface RegisterParams {
  title: string;
  authorNames: string[];
  authorAddresses: `0x${string}`[];
  pubType: number;
  contentHash: `0x${string}`;
  institution: string;
  doi: string;
  ipfsHash: string;
}

export interface RegisterResult {
  txHash: Hash;
  publicationId: bigint | null;
}

@Injectable({ providedIn: 'root' })
export class ContractService {
  private readonly env = inject(EnvService);
  private readonly metamask = inject(MetaMaskService);

  private readonly chain = defineChain({
    id: this.env.chainId,
    name: 'Localhost',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
      default: { http: [this.env.rpcUrl] },
    },
  });

  private readonly publicClient = createPublicClient({
    chain: this.chain,
    transport: http(this.env.rpcUrl),
  });

  private getWalletClient() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const eth = (window as any).ethereum;
    if (!eth) throw new Error('MetaMask no detectado. Instala la extensión del navegador.');
    return createWalletClient({ chain: this.chain, transport: custom(eth) });
  }

  async getPublication(id: bigint): Promise<Publication> {
    const result = await this.publicClient.readContract({
      address: this.env.contractAddress,
      abi: ALEJANDRIA_ABI,
      functionName: 'getPublication',
      args: [id],
    });
    return result as unknown as Publication;
  }

  async getTotalPublications(): Promise<bigint> {
    const result = await this.publicClient.readContract({
      address: this.env.contractAddress,
      abi: ALEJANDRIA_ABI,
      functionName: 'totalPublications',
    });
    return result as bigint;
  }

  async register(params: RegisterParams): Promise<RegisterResult> {
    const account = this.metamask.account();
    if (!account) throw new Error('Conecta tu wallet antes de registrar.');

    const args = [{
      title: params.title,
      authorNames: params.authorNames,
      authorAddresses: params.authorAddresses,
      pubType: params.pubType,
      contentHash: params.contentHash,
      institution: params.institution,
      doi: params.doi,
      ipfsHash: params.ipfsHash,
    }] as const;

    // Simulate first to surface contract errors before sending tx
    await this.publicClient.simulateContract({
      address: this.env.contractAddress,
      abi: ALEJANDRIA_ABI,
      functionName: 'register',
      args,
      account,
    });

    const wallet = this.getWalletClient();
    const txHash = await wallet.writeContract({
      address: this.env.contractAddress,
      abi: ALEJANDRIA_ABI,
      functionName: 'register',
      account,
      args,
    });

    const receipt = await this.publicClient.waitForTransactionReceipt({ hash: txHash });

    let publicationId: bigint | null = null;
    try {
      const logs = parseEventLogs({
        abi: ALEJANDRIA_ABI,
        eventName: 'PublicationRegistered',
        logs: receipt.logs,
      });
      if (logs.length > 0) {
        publicationId = (logs[0].args as { id: bigint }).id ?? null;
      }
    } catch {
      // ID extraction is best-effort
    }

    return { txHash, publicationId };
  }
}
