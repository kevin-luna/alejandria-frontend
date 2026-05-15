import { Injectable, computed, inject, signal } from '@angular/core';
import { createEVMClient, MetamaskConnectEVM } from '@metamask/connect-evm';
import { EnvService } from './env.service';

export type WalletStatus = 'disconnected' | 'connecting' | 'connected';

@Injectable({ providedIn: 'root' })
export class MetaMaskService {
  private readonly env = inject(EnvService);

  private client: MetamaskConnectEVM | null = null;
  private initPromise: Promise<MetamaskConnectEVM> | null = null;

  readonly account = signal<`0x${string}` | null>(null);
  readonly chainId = signal<`0x${string}` | null>(null);
  readonly status = signal<WalletStatus>('disconnected');
  readonly isConnected = computed(() => this.status() === 'connected');

  private async getClient(): Promise<MetamaskConnectEVM> {
    if (this.client) return this.client;
    if (this.initPromise) return this.initPromise;

    this.initPromise = createEVMClient({
      dapp: {
        name: 'Alejandría',
        iconUrl: `${window.location.origin}/favicon.ico`,
      },
      api: {
        supportedNetworks: {
          [this.env.chainIdHex]: this.env.rpcUrl,
        } as Record<`0x${string}`, string>,
      },
      ui: { headless: false },
      eventHandlers: {
        accountsChanged: (accounts: `0x${string}`[]) => {
          this.account.set(accounts[0] ?? null);
          if (!accounts[0]) this.status.set('disconnected');
        },
        chainChanged: (chainId: `0x${string}`) => {
          this.chainId.set(chainId);
        },
        disconnect: () => {
          this.account.set(null);
          this.chainId.set(null);
          this.status.set('disconnected');
        },
      },
    }).then((client) => {
      this.client = client;
      if (client.selectedAccount) {
        this.account.set(client.selectedAccount as `0x${string}`);
        this.status.set('connected');
      }
      if (client.selectedChainId) {
        this.chainId.set(client.selectedChainId as `0x${string}`);
      }
      return client;
    });

    return this.initPromise;
  }

  async connect(): Promise<`0x${string}` | null> {
    try {
      this.status.set('connecting');
      const client = await this.getClient();
      const { accounts, chainId } = await client.connect({
        chainIds: [this.env.chainIdHex as `0x${string}`],
        forceRequest: true,
      });
      const account = (accounts[0] ?? null) as `0x${string}` | null;
      this.account.set(account);
      this.chainId.set(chainId as `0x${string}`);
      this.status.set(account ? 'connected' : 'disconnected');
      return account;
    } catch (e) {
      console.error('[MetaMask] Connection failed:', e);
      this.status.set('disconnected');
      return null;
    }
  }

  async disconnect(): Promise<void> {
    try {
      const client = await this.getClient();
      await client.disconnect();
    } catch (e) {
      console.error('[MetaMask] Disconnect error:', e);
    } finally {
      this.account.set(null);
      this.chainId.set(null);
      this.status.set('disconnected');
    }
  }

  formatAddress(address: `0x${string}`): string {
    return `${address.slice(0, 6)}…${address.slice(-4)}`;
  }
}
