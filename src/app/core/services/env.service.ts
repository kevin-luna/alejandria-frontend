import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EnvService {
  readonly contractAddress: `0x${string}` = environment.contractAddress;
  readonly rpcUrl: string = environment.rpcUrl;
  readonly chainId: number = environment.chainId;
  readonly pinataJwt: string = environment.pinataJwt;
  readonly pinataGatewayUrl: string = environment.pinataGatewayUrl;

  get chainIdHex(): `0x${string}` {
    return `0x${this.chainId.toString(16)}`;
  }
}
