import { readFileSync } from 'fs';
import { join } from 'path';
import { groth16 } from 'snarkjs';
import { ethers } from 'ethers';

interface ZKInput {
  [key: string]: string;
  sigHash: string;
  artHash: string;
}

export class ZKUtils {
  private static readonly CIRCUIT_PATH = join(process.cwd(), 'circom/author_proof_js/author_proof.wasm');
  private static readonly ZKEY_PATH = join(process.cwd(), 'circom/author_proof.zkey');
  private static readonly VERIFICATION_KEY_PATH = join(process.cwd(), 'circom/verification_key.json');

  static async generateZKProof(input: ZKInput) {
    const { proof, publicSignals } = await groth16.fullProve(
      input,
      this.CIRCUIT_PATH,
      this.ZKEY_PATH
    );
    return { proof, publicSignals };
  }

  static async verifyProof(proof: any, publicSignals: any[]) {
    const vKey = JSON.parse(readFileSync(this.VERIFICATION_KEY_PATH, 'utf-8'));
    return await groth16.verify(vKey, publicSignals, proof);
  }

  static generateKeyPair() {
    const wallet = ethers.Wallet.createRandom();
    return {
      privateKey: wallet.privateKey,
      publicKey: wallet.address
    };
  }

  static signMessage(message: string, privateKey: string) {
    const wallet = new ethers.Wallet(privateKey);
    return wallet.signMessage(message);
  }

  static verifySignature(message: string, signature: string, publicKey: string) {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === publicKey.toLowerCase();
  }
}
