/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import FormData from 'form-data';
import {HardhatRuntimeEnvironment} from 'hardhat/types';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import {Readable} from 'stream';

function log(...args: any[]) {
  console.log(...args);
}

function logError(...args: any[]) {
  console.log(chalk.red(...args));
}

function logInfo(...args: any[]) {
  console.log(chalk.yellow(...args));
}

function logSuccess(...args: any[]) {
  console.log(chalk.green(...args));
}

function ensureTrailingSlash(s: string): string {
  const lastChar = s.substr(-1);
  if (lastChar != '/') {
    s = s + '/';
  }
  return s;
}

// const defaultEndpoint = 'https://server.verificationstaging.shardlabs.io/';
const defaultEndpoint = 'https://sourcify.dev/server/';

export async function submitSourcesToSourcify(
  hre: HardhatRuntimeEnvironment,
  config?: {
    endpoint?: string;
    contractName?: string;
    writeFailingMetadata?: boolean;
  }
): Promise<void> {
  config = config || {};
  const chainId = await hre.getChainId();
  const all = await hre.deployments.all();
  const url = config.endpoint
    ? ensureTrailingSlash(config.endpoint)
    : defaultEndpoint;

  async function submit(name: string) {
    const deployment = all[name];
    const {address, metadata: metadataString} = deployment;

    try {
      const checkResponse = await axios.get(
        `${url}checkByAddresses?addresses=${address.toLowerCase()}&chainIds=${chainId}`
      );
      const {data: checkData} = checkResponse;
      if (checkData[0].status === 'perfect') {
        log(`already verified: ${name} (${address}), skipping.`);
        return;
      }
    } catch (e) {
      logError(
        ((e as any).response && JSON.stringify((e as any).response.data)) || e
      );
    }

    if (!metadataString) {
      logError(
        `Contract ${name} was deployed without saving metadata. Cannot submit to sourcify, skipping.`
      );
      return;
    }

    logInfo(`verifying ${name} (${address} on chain ${chainId}) ...`);

    const formData = new FormData();
    formData.append('address', address);
    formData.append('chain', chainId);

    const fileStream = new Readable();
    fileStream.push(metadataString);
    fileStream.push(null);
    formData.append('files', fileStream, 'metadata.json');

    try {
      const submissionResponse = await axios.post(url, formData, {
        headers: formData.getHeaders(),
      });
      if (submissionResponse.data.result[0].status === 'perfect') {
        logSuccess(` => contract ${name} is now verified`);
      } else {
        logError(` => contract ${name} is not verified`);
      }
    } catch (e) {
      if (config && config.writeFailingMetadata) {
        const failingMetadataFolder = path.join('failing_metadata', chainId);
        fs.ensureDirSync(failingMetadataFolder);
        fs.writeFileSync(
          path.join(failingMetadataFolder, `${name}_at_${address}.json`),
          metadataString
        );
      }
      logError(
        ((e as any).response && JSON.stringify((e as any).response.data)) || e
      );
    }
  }

  if (config.contractName) {
    await submit(config.contractName);
  } else {
    for (const name of Object.keys(all)) {
      await submit(name);
    }
  }
}
