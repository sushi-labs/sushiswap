/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import axios from 'axios';
import qs from 'qs';
import path from 'path';
import {defaultAbiCoder, ParamType} from '@ethersproject/abi';
import {HardhatRuntimeEnvironment} from 'hardhat/types';
import chalk from 'chalk';
import matchAll from 'match-all';

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

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function writeRequestIfRequested(
  write: boolean,
  networkName: string,
  name: string,
  request: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  postData: any
) {
  if (write) {
    try {
      fs.mkdirSync('etherscan_requests');
    } catch (e) {}
    const folder = `etherscan_requests/${networkName}`;
    try {
      fs.mkdirSync(folder);
    } catch (e) {}
    fs.writeFileSync(`${folder}/${name}.formdata`, request);
    fs.writeFileSync(`${folder}/${name}.json`, JSON.stringify(postData));
    fs.writeFileSync(
      `${folder}/${name}_multi-source.json`,
      postData.sourceCode
    );
  }
}

function extractOneLicenseFromSourceFile(source: string): string | undefined {
  const licenses = extractLicenseFromSources(source);
  if (licenses.length === 0) {
    return undefined;
  }
  return licenses[0]; // TODO error out on multiple SPDX ?
}

function extractLicenseFromSources(metadata: string): string[] {
  const regex = /\/\/\s*\t*SPDX-License-Identifier:\s*\t*(.*?)[\s\\]/g;
  const matches = matchAll(metadata, regex).toArray();
  const licensesFound: {[license: string]: boolean} = {};
  const licenses = [];
  if (matches) {
    for (const match of matches) {
      if (!licensesFound[match]) {
        licensesFound[match] = true;
        licenses.push(match);
      }
    }
  }
  return licenses;
}

function getLicenseType(license: string): undefined | number {
  const licenseType = (() => {
    if (license === 'None') {
      return 1;
    }
    if (license === 'UNLICENSED') {
      return 2;
    }
    if (license === 'MIT') {
      return 3;
    }
    if (license === 'GPL-2.0') {
      return 4;
    }
    if (license === 'GPL-3.0') {
      return 5;
    }
    if (license === 'LGPL-2.1') {
      return 6;
    }
    if (license === 'LGPL-3.0') {
      return 7;
    }
    if (license === 'BSD-2-Clause') {
      return 8;
    }
    if (license === 'BSD-3-Clause') {
      return 9;
    }
    if (license === 'MPL-2.0') {
      return 10;
    }
    if (license === 'OSL-3.0') {
      return 11;
    }
    if (license === 'Apache-2.0') {
      return 12;
    }
    if (license === 'AGPL-3.0') {
      return 13;
    }
    if (license === 'BUSL-1.1') {
      return 14;
    }
  })();
  return licenseType;
}

export async function submitSources(
  hre: HardhatRuntimeEnvironment,
  solcInputsPath: string,
  config?: {
    contractName?: string;
    etherscanApiKey?: string;
    license?: string;
    fallbackOnSolcInput?: boolean;
    forceLicense?: boolean;
    sleepBetween?: boolean;
    apiUrl?: string;
    writePostData?: boolean;
  }
): Promise<void> {
  config = config || {};
  const fallbackOnSolcInput = config.fallbackOnSolcInput;
  const licenseOption = config.license;
  const forceLicense = config.forceLicense;
  const etherscanApiKey = config.etherscanApiKey;
  const sleepBetween = config.sleepBetween;
  const all = await hre.deployments.all();
  const networkName = hre.network.name;
  let host = config.apiUrl;
  if (!host) {
    const chainId = await hre.getChainId();
    switch (chainId) {
      case '1':
        host = 'https://api.etherscan.io';
        break;
      case '3':
        host = 'https://api-ropsten.etherscan.io';
        break;
      case '4':
        host = 'https://api-rinkeby.etherscan.io';
        break;
      case '5':
        host = 'https://api-goerli.etherscan.io';
        break;
      case '10':
        host = 'https://api-optimistic.etherscan.io';
        break;
      case '42':
        host = 'https://api-kovan.etherscan.io';
        break;
      case '97':
        host = 'https://api-testnet.bscscan.com';
        break;
      case '56':
        host = 'https://api.bscscan.com';
        break;
      case '69':
        host = 'https://api-kovan-optimistic.etherscan.io';
        break;
      case '70':
        host = 'https://api.hooscan.com';
        break;
      case '77':
        host = 'https://blockscout.com/poa/sokol';
        break;
      case '128':
        host = 'https://api.hecoinfo.com';
        break;
      case '137':
        host = 'https://api.polygonscan.com';
        break;
      case '250':
        host = 'https://api.ftmscan.com';
        break;
      case '256':
        host = 'https://api-testnet.hecoinfo.com';
        break;
      case '588':
        host = 'https://stardust-explorer.metis.io';
        break;
      case '1088':
        host = 'https://andromeda-explorer.metis.io';
        break;
      case '1285':
        host = 'https://api-moonriver.moonscan.io';
        break;
      case '80001':
        host = 'https://api-testnet.polygonscan.com';
        break;
      case '4002':
        host = 'https://api-testnet.ftmscan.com';
        break;
      case '42161':
        host = 'https://api.arbiscan.io';
        break;
      case '421611':
        host = 'https://api-testnet.arbiscan.io';
        break;
      case '43113':
        host = 'https://api-testnet.snowtrace.io';
        break;
      case '43114':
        host = 'https://api.snowtrace.io';
        break;
      default:
        return logError(
          `Network with chainId: ${chainId} not supported. You can specify the url manually via --api-url <url>.`
        );
    }
  }

  async function submit(name: string, useSolcInput?: boolean) {
    const deployment = all[name];
    const {address, metadata: metadataString} = deployment;
    const abiResponse = await axios.get(
      `${host}/api?module=contract&action=getabi&address=${address}&apikey=${etherscanApiKey}`
    );
    const {data: abiData} = abiResponse;
    let contractABI;
    if (abiData.status !== '0') {
      try {
        contractABI = JSON.parse(abiData.result);
      } catch (e) {
        logError(e);
        return;
      }
    }
    if (contractABI && contractABI !== '') {
      log(`already verified: ${name} (${address}), skipping.`);
      return;
    }

    if (!metadataString) {
      logError(
        `Contract ${name} was deployed without saving metadata. Cannot submit to etherscan, skipping.`
      );
      return;
    }
    const metadata = JSON.parse(metadataString);
    const compilationTarget = metadata.settings?.compilationTarget;

    let contractFilepath;
    let contractName;
    if (compilationTarget) {
      contractFilepath = Object.keys(compilationTarget)[0];
      contractName = compilationTarget[contractFilepath];
    }

    if (!contractFilepath || !contractName) {
      return logError(
        `Failed to extract contract fully qualified name from metadata.settings.compilationTarget for ${name}. Skipping.`
      );
    }

    const contractNamePath = `${contractFilepath}:${contractName}`;

    const contractSourceFile = metadata.sources[contractFilepath].content;
    const sourceLicenseType =
      extractOneLicenseFromSourceFile(contractSourceFile);

    let license = licenseOption;
    if (!sourceLicenseType) {
      if (!license) {
        return logError(
          `no license speccified in the source code for ${name} (${contractNamePath}), Please use option --license <SPDX>`
        );
      }
    } else {
      if (license && license !== sourceLicenseType) {
        if (!forceLicense) {
          return logError(
            `mismatch for --license option (${licenseOption}) and the one specified in the source code for ${name}.\nLicenses found in source : ${sourceLicenseType}\nYou can use option --force-license to force option --license`
          );
        }
      } else {
        license = sourceLicenseType;
        if (!getLicenseType(license)) {
          return logError(
            `license :"${license}" found in source code for ${name} (${contractNamePath}) but this license is not supported by etherscan, list of supported license can be found here : https://etherscan.io/contract-license-types . This tool expect the SPDX id, except for "None" and "UNLICENSED"`
          );
        }
      }
    }

    const licenseType = getLicenseType(license);

    if (!licenseType) {
      return logError(
        `license :"${license}" not supported by etherscan, list of supported license can be found here : https://etherscan.io/contract-license-types . This tool expect the SPDX id, except for "None" and "UNLICENSED"`
      );
    }

    let solcInput: {
      language: string;
      settings: any;
      sources: Record<string, {content: string}>;
    };
    if (useSolcInput) {
      const solcInputHash = deployment.solcInputHash;
      let solcInputStringFromDeployment: string | undefined;
      try {
        solcInputStringFromDeployment = fs
          .readFileSync(path.join(solcInputsPath, solcInputHash + '.json'))
          .toString();
      } catch (e) {}
      if (!solcInputStringFromDeployment) {
        logError(
          `Contract ${name} was deployed without saving solcInput. Cannot submit to etherscan, skipping.`
        );
        return;
      }
      solcInput = JSON.parse(solcInputStringFromDeployment);
    } else {
      const settings = {...metadata.settings};
      delete settings.compilationTarget;
      solcInput = {
        language: metadata.language,
        settings,
        sources: {},
      };
      for (const sourcePath of Object.keys(metadata.sources)) {
        const source = metadata.sources[sourcePath];
        // only content as this fails otherwise
        solcInput.sources[sourcePath] = {
          content: source.content,
        };
      }
    }

    // Adding Libraries ....
    if (deployment.libraries) {
      const settings = solcInput.settings;
      settings.libraries = settings.libraries || {};
      for (const libraryName of Object.keys(deployment.libraries)) {
        if (!settings.libraries[contractNamePath]) {
          settings.libraries[contractNamePath] = {};
        }
        settings.libraries[contractNamePath][libraryName] =
          deployment.libraries[libraryName];
      }
    }
    const solcInputString = JSON.stringify(solcInput);

    logInfo(`verifying ${name} (${address}) ...`);

    let constructorArguements: string | undefined;
    if (deployment.args) {
      const constructor: {inputs: ParamType[]} = deployment.abi.find(
        (v) => v.type === 'constructor'
      );
      if (constructor) {
        constructorArguements = defaultAbiCoder
          .encode(constructor.inputs, deployment.args)
          .slice(2);
      }
    } else {
      logInfo(`no args found, assuming empty constructor...`);
    }

    const postData: {
      [fieldName: string]: string | number | void | undefined; // TODO type
    } = {
      apikey: etherscanApiKey,
      module: 'contract',
      action: 'verifysourcecode',
      contractaddress: address,
      sourceCode: solcInputString,
      codeformat: 'solidity-standard-json-input',
      contractname: contractNamePath,
      compilerversion: `v${metadata.compiler.version}`, // see http://etherscan.io/solcversions for list of support versions
      constructorArguements,
      licenseType,
    };

    const formDataAsString = qs.stringify(postData);
    const submissionResponse = await axios.request({
      url: `${host}/api`,
      method: 'POST',
      headers: {'content-type': 'application/x-www-form-urlencoded'},
      data: formDataAsString,
    });
    const {data: submissionData} = submissionResponse;

    let guid: string;
    if (submissionData.status === '1') {
      guid = submissionData.result;
    } else {
      logError(
        `contract ${name} failed to submit : "${submissionData.message}" : "${submissionData.result}"`,
        submissionData
      );
      writeRequestIfRequested(
        config?.writePostData || false,
        networkName,
        name,
        formDataAsString,
        postData
      );
      return;
    }
    if (!guid) {
      logError(`contract submission for ${name} failed to return a guid`);
      writeRequestIfRequested(
        config?.writePostData || false,
        networkName,
        name,
        formDataAsString,
        postData
      );
      return;
    }

    async function checkStatus(): Promise<string | undefined> {
      // TODO while loop and delay :
      const statusResponse = await axios.get(
        `${host}/api?apikey=${etherscanApiKey}`,
        {
          params: {
            guid,
            module: 'contract',
            action: 'checkverifystatus',
          },
        }
      );
      const {data: statusData} = statusResponse;

      // blockscout seems to return status == 1 in case of failure
      // so we check string first
      if (statusData.result === 'Pending in queue') {
        return undefined;
      }
      if (statusData.result !== 'Fail - Unable to verify') {
        if (statusData.status === '1') {
          // console.log(statusData);
          return 'success';
        }
      }
      logError(
        `Failed to verify contract ${name}: ${statusData.message}, ${statusData.result}`
      );

      logError(
        JSON.stringify(
          {
            apikey: 'XXXXXX',
            module: 'contract',
            action: 'verifysourcecode',
            contractaddress: address,
            sourceCode: '...',
            codeformat: 'solidity-standard-json-input',
            contractname: contractNamePath,
            compilerversion: `v${metadata.compiler.version}`, // see http://etherscan.io/solcversions for list of support versions
            constructorArguements,
            licenseType,
          },
          null,
          '  '
        )
      );
      // logError(JSON.stringify(postData, null, "  "));
      // logInfo(postData.sourceCode);
      return 'failure';
    }

    logInfo('waiting for result...');
    let result;
    while (!result) {
      await new Promise((resolve) => setTimeout(resolve, 10 * 1000));
      result = await checkStatus();
    }

    if (result === 'success') {
      logSuccess(` => contract ${name} is now verified`);
    }

    if (result === 'failure') {
      if (!useSolcInput && fallbackOnSolcInput) {
        logInfo(
          'Falling back on solcInput. etherscan seems to sometime require full solc-input with all source files, even though this should not be needed. See https://github.com/ethereum/solidity/issues/9573'
        );
        await submit(name, true);
      } else {
        writeRequestIfRequested(
          config?.writePostData || false,
          networkName,
          name,
          formDataAsString,
          postData
        );
        logInfo(
          'Etherscan sometime fails to verify when only metadata sources are given. See https://github.com/ethereum/solidity/issues/9573. You can add the option --solc-input to try with full solc-input sources. This will include all contract source in the etherscan result, even the one not relevant to the contract being verified'
        );
      }
    } else {
      writeRequestIfRequested(
        config?.writePostData || false,
        networkName,
        name,
        formDataAsString,
        postData
      );
    }
  }

  if (config.contractName) {
    await submit(config.contractName);
  } else {
    for (const name of Object.keys(all)) {
      await submit(name);

      if (sleepBetween) {
        // sleep between each verification so we don't exceed the API rate limit
        await sleep(500);
      }
    }
  }
}
