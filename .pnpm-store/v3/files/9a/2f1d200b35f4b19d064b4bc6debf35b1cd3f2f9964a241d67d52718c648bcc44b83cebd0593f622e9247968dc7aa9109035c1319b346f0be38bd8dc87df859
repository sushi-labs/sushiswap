Contributing to Solhint
=======================

_Thanks for considering contributing to Solhint!_

The following is a set of guidelines for contributions. Feel free to suggest
improvements to this document in a pull request.

Issues and feature requests
---------------------------

If you have any issues to report or features to request, please use the
[issue tracker](https://github.com/protofire/solhint/issues).

Development
-----------

### Requirements

In order to develop Solhint, you'll need:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/)

### Getting Started

Clone this repository and install npm dependencies:

    $ git clone git@github.com:protofire/solhint.git
    $ cd solhint
    $ npm install

### Testing changes without re-installing

Since `solhint` is a CLI tool, the best way to test new changes immediately
after they are done is to globally link the module. Go to the repository and
run:

    $ npm link

This will create a symbolic link to `solhint`'s directory. Any changes you make
will be available when you use `solhint` in any terminal.

### Running tests

If you make changes to the existing code, please make sure that all tests are
passing. If you contribute with a new feature, please add tests for it. To run the tests:

    $ npm test

Grammar modifications
---------------------

Solhint uses [ANTLR4](http://www.antlr.org/) to generate the Solidity parser.
The grammar description is taken from
[solidity-antlr4](https://github.com/solidityj/solidity-antlr4). If there is
some language feature that Solhint doesn't support, the first step is to check
if the `Solidity.g4` fil is out of sync with the one in that repo. If that's the
case, the steps to update it are:

1. Copy the `Solidity.g4` file and replace the one in this repo
(`lib/grammar/Solidity.g4`).
2. From the root of the project, execute `scripts/build-grammar.sh`. You will
need to have the Java Runtime Environment (7 or later) installed for this to
work.

Pull Requests
-------------

All code changes happen through pull requests. To create one:

1. Fork the repo and create your branch from `master`.
2. Make the changes you want to do.
3. Ensure the tests are still passing. Please remember to add tests for new features.
4. Create the pull request.


License
-------

By contributing, you agree that your contributions will be licensed under its MIT License.
