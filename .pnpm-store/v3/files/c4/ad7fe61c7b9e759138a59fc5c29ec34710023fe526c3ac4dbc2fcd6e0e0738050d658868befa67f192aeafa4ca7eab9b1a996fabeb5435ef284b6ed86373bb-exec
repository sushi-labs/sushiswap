#!env node
const { loadRules } = require('../lib/load-rules')
const fs = require('fs');
const { exec, mkdir } = require("shelljs");
const semver = require('semver');
const path = require('path');
const table = require('markdown-table');
const { ruleSeverityEnum } = require('../lib/doc/utils');

/**
 * Borrowed from https://github.com/eslint/eslint/blob/master/Makefile.js
 */
class GitHelper {
    static getAuthorName() {
        return GitHelper.execSilent('git config user.name').trim();
    }

    static getAuthorEmail() {
        return GitHelper.execSilent('git config user.email').trim();
    }

    /**
     * Gets the tag name where a given file was introduced first.
     * @param {string} filePath The file path to check.
     * @returns {string} The tag name.
     */
    static getFirstVersionOfFile(filePath) {
        const firstCommit = GitHelper.getFirstCommitOfFile(filePath);
        let tags = GitHelper.execSilent(`git tag --contains ${firstCommit}`);

        tags = GitHelper.splitCommandResultToLines(tags);
        return tags.reduce((list, version) => {
            const validatedVersion = semver.valid(version.trim());

            if (validatedVersion) {
                list.push(validatedVersion);
            }
            return list;
        }, []).sort(semver.compare)[0];
    }

    /**
     * Gets the first commit sha of the given file.
     * @param {string} filePath The file path which should be checked.
     * @returns {string} The commit sha.
     */
    static getFirstCommitOfFile(filePath) {
        let commits = GitHelper.execSilent(`git rev-list HEAD -- ${filePath}`);

        commits = GitHelper.splitCommandResultToLines(commits);
        return commits[commits.length - 1].trim();
    }

    /**
     * Splits a command result to separate lines.
     * @param {string} result The command result string.
     * @returns {Array} The separated lines.
     */
    static splitCommandResultToLines(result) {
        return result.trim().split("\n");
    }

    /**
     * Executes a command and returns the output instead of printing it to stdout.
     * @param {string} cmd The command string to execute.
     * @returns {string} The result of the executed command.
     */
    static execSilent(cmd) {
        return exec(cmd, {silent: true}).stdout;
    }
}

function generateRuleDoc(rule) {
    const date = new Date().toUTCString();
    const authorName = GitHelper.getAuthorName();
    const authorEmail = GitHelper.getAuthorEmail();
    const isDefault = !rule.meta.deprecated && rule.meta.isDefault;
    const isRecommended = !rule.meta.deprecated && rule.meta.recommended;
    const isDeprecated = rule.meta.deprecated;
    const version = GitHelper.getFirstVersionOfFile(rule.file);
    const defaultSeverity = getDefaultSeverity(rule);

    return `---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "${rule.ruleId} | Solhint"
date:        "${date}"
author:      "${authorName} <${authorEmail}>"
---

# ${rule.ruleId}
${[
    recommendedBadge(isRecommended),
    deprecatedBadge(isDeprecated),
    categoryBadge(rule.meta.docs.category),
    defaultSeverityBadge(defaultSeverity),
    isDefault ? '> The {"extends": "solhint:default"} property in a configuration file enables this rule.\n' : '',
    isRecommended ? '> The {"extends": "solhint:recommended"} property in a configuration file enables this rule.\n' : '',
    isDeprecated ? '> This rule is **deprecated**\n' : ''
].filter(s => s !== '').join("\n")}

## Description
${rule.meta.docs.description}

## Options
${loadOptions(rule)}

### Example Config
${loadExampleConfig(rule)}

## Examples
${loadExamples(rule)}

## Version
${linkToVersion(version)}

## Resources
- [Rule source](${linkToSource(rule)})
- [Document source](${linkToDocumentSource(rule)})
- [Test cases](${linkToTestCase(rule)})
`
}

function categoryBadge(category) {
    return `![Category Badge](https://img.shields.io/badge/-${encodeURIComponent(category)}-informational)`;
}

function recommendedBadge(isRecommended) {
    return isRecommended ? `![Recommended Badge](https://img.shields.io/badge/-Recommended-brightgreen)` : '';
}

function deprecatedBadge(isDeprecated) {
    return isDeprecated ? `![Deprecated Badge](https://img.shields.io/badge/-Deprecated-yellow)` : '';
}

function defaultSeverityBadge(severity) {
    const colors = {
        'warn': 'yellow',
        'error': 'red'
    };
    return `![Default Severity Badge ${severity}](https://img.shields.io/badge/Default%20Severity-${severity}-${colors[severity]})`;
}

function loadOptions(rule) {
    if (Array.isArray(rule.meta.defaultSetup)) {
        const optionsTable = [['Index', 'Description', 'Default Value']];
        rule.meta.docs.options.forEach((option, index) => {
            optionsTable.push([index, option.description, option.default]);
        });
        return `This rule accepts an array of options:

${table(optionsTable)}
`;
    } else if (typeof rule.meta.defaultSetup === 'string') {
        return `This rule accepts a string option of rule severity. Must be one of ${ruleSeverityEnum}. Default to ${rule.meta.defaultSetup}.`
    } else {
        throw new Error(`Unhandled type of rule.meta.defaultSetup from rule ${rule.ruleId}`);
    }
}

function loadExampleConfig(rule) {
    return `\`\`\`json
{
  "rules": {
    "${rule.ruleId}": ${JSON.stringify(rule.meta.defaultSetup)}
  }
}
\`\`\`
`
}

function linkToVersion(version) {
    if (version) {
        return `This rule was introduced in [Solhint ${version}](https://github.com/protofire/solhint/tree/v${version})`;
    } else {
        return `This rule is introduced in the latest version.`;
    }
}

function linkToSource(rule) {
    const link = rule.file.replace(path.resolve(path.join(__dirname, '..')), '');
    return `https://github.com/protofire/solhint/tree/master${link}`;
}

function linkToDocumentSource(rule) {
    const link = rule.file.replace(path.resolve(path.join(__dirname, '..')), '').replace("lib/rules", "docs/rules").replace(/\.js$/, ".md");
    return `https://github.com/protofire/solhint/tree/master${link}`;
}

function linkToTestCase(rule) {
    const link = rule.file.replace(path.resolve(path.join(__dirname, '..', 'lib', 'rules')), '');
    return `https://github.com/protofire/solhint/tree/master/test/rules${link}`;
}

function loadExamples(rule) {
    if (!rule.meta.docs.examples) {
        return "This rule does not have examples.";
    }

    const examples = [loadCorrectExample(rule), loadIncorrectExample(rule)].filter(s => s !== '').join('\n\n');
    return examples === '' ? 'This rule does not have examples.' : examples;
}

function loadIncorrectExample(rule) {
    if (rule.meta.docs.examples.bad && rule.meta.docs.examples.bad.length) {
        return `### 👎 Examples of **incorrect** code for this rule

${rule.meta.docs.examples.bad.map(ex => `#### ${ex.description}\n\n\`\`\`solidity\n${ex.code}\n\`\`\``).join("\n\n")}`;
    } else {
        return '';
    }
}

function loadCorrectExample(rule) {
    if (rule.meta.docs.examples.good && rule.meta.docs.examples.good.length) {
        return `### 👍 Examples of **correct** code for this rule

${rule.meta.docs.examples.good.map(ex => `#### ${ex.description}\n\n\`\`\`solidity\n${ex.code}\n\`\`\``).join("\n\n")}`;
    } else {
        return '';
    }
}

function getDefaultSeverity(rule) {
    if (Array.isArray(rule.meta.defaultSetup)) {
        return rule.meta.defaultSetup[0];
    } else {
        return rule.meta.defaultSetup;
    }
}

function generateRuleIndex(rulesIndexed) {
    const date = new Date().toUTCString();
    const authorName = GitHelper.getAuthorName();
    const authorEmail = GitHelper.getAuthorEmail();

    const contents = Object.keys(rulesIndexed).map(category => {
        const rows = [["Rule Id", "Error", "Recommended"]];
        rulesIndexed[category].map(rule => [`[${rule.ruleId}](./rules/${rule.meta.type}/${rule.ruleId}.md)`, rule.meta.docs.description, (rule.meta.recommended && !rule.meta.deprecated) ? '✔️' : '']).forEach(row => rows.push(row));
        return `## ${category}

${table(rows)}
        `;
    }).join("\n\n");

    return `---
warning:     "This is a dynamically generated file. Do not edit manually."
layout:      "default"
title:       "Rule Index of Solhint"
date:        "${date}"
author:      "${authorName} <${authorEmail}>"
---

${contents}

## References

- [ConsenSys Guide for Smart Contracts](https://consensys.github.io/smart-contract-best-practices/recommendations/)
- [Solidity Style Guide](http://solidity.readthedocs.io/en/develop/style-guide.html)
`;
}

function main() {
    const program = require('commander');
    program.option('--rule-id <rule-id>', 'rule id');
    program.option('--index-only', 'only generate rule index');
    program.parse(process.argv);

    const rules = loadRules();
    if (!program.indexOnly) {
        let ruleIds = [];
        if (program.ruleId) {
            ruleIds = program.ruleId.split(",");
        }

        rules.filter(rule => {
            if (ruleIds.length) {
                return ruleIds.includes(rule.ruleId);
            } else {
                return true;
            }
        }).forEach(rule => {
            const ruleDoc = generateRuleDoc(rule);
            const dir = path.resolve(path.join(__dirname, '..', 'docs', 'rules', rule.meta.type));
            const fileName = `${rule.ruleId}.md`;
            const filePath = path.resolve(path.join(dir, fileName));
            mkdir('-p', dir);
            fs.writeFile(filePath, ruleDoc, function (err) {
                if (err) {
                    console.error(err);
                } else {
                    console.log(`Wrote ${filePath}`)
                }
            });
        });
    }

    const rulesIndexed = {};
    rules.forEach(rule => {
        if (!rulesIndexed[rule.meta.docs.category]) {
            rulesIndexed[rule.meta.docs.category] = [rule];
        } else {
            rulesIndexed[rule.meta.docs.category].push(rule);
        }
    });
    const ruleIndexDoc = generateRuleIndex(rulesIndexed);
    const ruleIndexDocPath = path.resolve(path.join(__dirname, '..', 'docs', 'rules.md'));
    fs.writeFile(ruleIndexDocPath, ruleIndexDoc, function (err) {
        if (err) {
            console.error(err);
        } else {
            console.log(`Wrote ${ruleIndexDocPath}`)
        }
    });
}

main();
