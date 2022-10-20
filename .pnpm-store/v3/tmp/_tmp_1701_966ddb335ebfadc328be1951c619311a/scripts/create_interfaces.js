function renderInput(input, contracts) {
    let line;
    if (input.internalType.startsWith("contract ")) {
        let newContract = input.internalType.substr(9);
        if (contracts.indexOf(newContract) == -1) {
            contracts.push(newContract);
        }
        line = newContract;
    } else {
        line = input.internalType;
    }
    if (input.type == 'string' || input.type == "bytes" || input.type.endsWith("[]")) {
        line += " calldata";
    }
    if (input.name) {
        line += " " + input.name
    }
    return line;
}

function renderOutput(input, contracts) {
    let line;
    if (input.internalType.startsWith("contract ")) {
        let newContract = input.internalType.substr(9);
        if (contracts.indexOf(newContract) == -1) {
            contracts.push(newContract);
        }
        line = newContract;
    } else {
        line = input.internalType;
    }
    if (input.type == 'string' || input.type == "bytes" || input.type.endsWith("[]")) {
        line += " memory";
    }
    if (input.name) {
        line += " " + input.name
    }
    return line;
}

function createInterface(name) {
    fs = require('fs');
    fs.readFile('./build/abi/' + name + '.json', 'utf8', function (err, data) {
        let abi = JSON.parse(data);
        let lines = [];
        let header = [];
        let contracts = [];
        header.push("// SPDX-License-Identifier: MIT");
        header.push("pragma solidity 0.6.12;");
        lines.push("");
        lines.push("interface I" + name + " {");
        for (let i in abi) {
            let item = abi[i];
            if (item.type == "function") {
                let line = "    function " + item.name + "(";
                line += item.inputs.map(input => renderInput(input, contracts)).join(", ");
                line += ") external";
                if (item.stateMutability != 'nonpayable') {
                    line += " " + item.stateMutability;
                }
                if (item.outputs.length) {
                    line += " returns (";
                    line += item.outputs.map(output => renderOutput(output, contracts)).join(", ");
                    line += ")";
                }
                line += ";";
                lines.push(line);
            } else if (item.type == "event") {
                let line = "    event " + item.name + "(";
                line += item.inputs.map(input => input.type + (input.indexed ? " indexed" : "") + (input.name ? " " + input.name : "")).join(", ");
                line += ");";
                lines.push(line);
            } else {
                console.log(item);
            }
        }
        lines.push("}");
        for (let i in contracts) {
            if (contracts[i] == "IOracle") {
                header.push('import "./IOracle.sol";');
            }
            if (contracts[i] == "ILendingPair") {
                header.push('import "./ILendingPair.sol";');
            }
        }
        console.log(header.join("\r\n") + "\r\n" + lines.join("\r\n"));
        fs.writeFile('./contracts/interfaces/genI' + name + ".sol",
            header.join("\r\n") + "\r\n" + lines.join("\r\n"),
            function (err) { });
    });
}

createInterface("KashiPairMediumRiskV1");
