'use strict';

var antlr4 = require('./antlr4/index');

function toText(ctx) {
  if (ctx !== null) {
    return ctx.getText();
  }
  return null;
}

function mapCommasToNulls(children) {
  if (children.length === 0) {
    return [];
  }

  var values = [];
  var comma = true;

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var el = _step.value;

      if (comma) {
        if (toText(el) === ',') {
          values.push(null);
        } else {
          values.push(el);
          comma = false;
        }
      } else {
        if (toText(el) !== ',') {
          throw new Error('expected comma');
        }
        comma = true;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  if (comma) {
    values.push(null);
  }

  return values;
}

function isBinOp(op) {
  var binOps = ['+', '-', '*', '/', '**', '%', '<<', '>>', '&&', '||', '&', '|', '^', '<', '>', '<=', '>=', '==', '!=', '=', '|=', '^=', '&=', '<<=', '>>=', '+=', '-=', '*=', '/=', '%='];
  return binOps.includes(op);
}

var transformAST = {
  SourceUnit: function SourceUnit(ctx) {
    // last element is EOF terminal node
    return {
      children: this.visit(ctx.children.slice(0, -1))
    };
  },
  EnumDefinition: function EnumDefinition(ctx) {
    return {
      name: toText(ctx.identifier()),
      members: this.visit(ctx.enumValue())
    };
  },
  EnumValue: function EnumValue(ctx) {
    return {
      name: toText(ctx.identifier())
    };
  },
  UsingForDeclaration: function UsingForDeclaration(ctx) {
    var typeName = null;
    if (toText(ctx.getChild(3)) !== '*') {
      typeName = this.visit(ctx.getChild(3));
    }

    return {
      typeName: typeName,
      libraryName: toText(ctx.identifier())
    };
  },
  PragmaDirective: function PragmaDirective(ctx) {
    return {
      name: toText(ctx.pragmaName()),
      value: toText(ctx.pragmaValue())
    };
  },
  ContractDefinition: function ContractDefinition(ctx) {
    var name = toText(ctx.identifier());
    var kind = toText(ctx.getChild(0));

    this._currentContract = name;

    return {
      name: name,
      baseContracts: this.visit(ctx.inheritanceSpecifier()),
      subNodes: this.visit(ctx.contractPart()),
      kind: kind
    };
  },
  InheritanceSpecifier: function InheritanceSpecifier(ctx) {
    var exprList = ctx.expressionList();
    var args = exprList != null ? this.visit(exprList.expression()) : [];

    return {
      baseName: this.visit(ctx.userDefinedTypeName()),
      arguments: args
    };
  },
  ContractPart: function ContractPart(ctx) {
    return this.visit(ctx.children[0]);
  },
  FunctionDefinition: function FunctionDefinition(ctx) {
    var _this = this;

    var isConstructor = false;
    var isFallback = false;
    var isReceiveEther = false;
    var name = null;
    var parameters = [];
    var returnParameters = null;
    var visibility = 'default';

    var block = null;
    if (ctx.block()) {
      block = this.visit(ctx.block());
    }

    var modifiers = ctx.modifierList().modifierInvocation().map(function (mod) {
      return _this.visit(mod);
    });

    var stateMutability = null;
    if (ctx.modifierList().stateMutability(0)) {
      stateMutability = toText(ctx.modifierList().stateMutability(0));
    }

    // see what type of function we're dealing with
    switch (toText(ctx.functionDescriptor().getChild(0))) {
      case 'constructor':
        parameters = this.visit(ctx.parameterList());

        if (ctx.returnParameters() && ctx.returnParameters().parameterList().parameter().length > 0) {
          throw new Error('Constructors cannot have return parameters');
        }

        // error out on incorrect function visibility
        if (ctx.modifierList().InternalKeyword(0)) {
          visibility = 'internal';
        } else if (ctx.modifierList().PublicKeyword(0)) {
          visibility = 'public';
        } else {
          throw new Error('Constructors have to be declared either "public" or "internal"');
        }

        isConstructor = true;
        break;
      case 'fallback':
        if (ctx.parameterList().parameter().length > 0) {
          throw new Error('Fallback functions cannot have parameters');
        }

        if (ctx.returnParameters() && ctx.returnParameters().parameterList().parameter().length > 0) {
          throw new Error('Fallback functions cannot have return parameters');
        }

        // error out on incorrect function visibility
        if (!ctx.modifierList().ExternalKeyword(0)) {
          throw new Error('Fallback functions have to be declared "external"');
        }
        visibility = 'external';

        isFallback = true;
        break;
      case 'receive':
        if (ctx.parameterList().parameter().length > 0) {
          throw new Error('Receive Ether functions cannot have parameters');
        }

        if (ctx.returnParameters() && ctx.returnParameters().parameterList().parameter().length > 0) {
          throw new Error('Receive Ether functions cannot have return parameters');
        }

        // error out on incorrect function visibility
        if (!ctx.modifierList().ExternalKeyword(0)) {
          throw new Error('Receive Ether functions have to be declared "external"');
        }
        visibility = 'external';

        // error out on incorrect function payability
        if (!ctx.modifierList().stateMutability(0) || !ctx.modifierList().stateMutability(0).PayableKeyword(0)) {
          throw new Error('Receive Ether functions have to be declared "payable"');
        }

        isReceiveEther = true;
        break;
      case 'function':
        name = ctx.functionDescriptor().identifier(0) ? toText(ctx.functionDescriptor().identifier(0)) : '';

        parameters = this.visit(ctx.parameterList());
        returnParameters = this.visit(ctx.returnParameters());

        // parse function visibility
        if (ctx.modifierList().ExternalKeyword(0)) {
          visibility = 'external';
        } else if (ctx.modifierList().InternalKeyword(0)) {
          visibility = 'internal';
        } else if (ctx.modifierList().PublicKeyword(0)) {
          visibility = 'public';
        } else if (ctx.modifierList().PrivateKeyword(0)) {
          visibility = 'private';
        }

        isConstructor = name === this._currentContract;
        isFallback = name === '';
        break;
    }

    return {
      name: name,
      parameters: parameters,
      returnParameters: returnParameters,
      body: block,
      visibility: visibility,
      modifiers: modifiers,
      isConstructor: isConstructor,
      isReceiveEther: isReceiveEther,
      isFallback: isFallback,
      stateMutability: stateMutability
    };
  },
  ModifierInvocation: function ModifierInvocation(ctx) {
    var exprList = ctx.expressionList();

    var args = void 0;
    if (exprList != null) {
      args = this.visit(exprList.expression());
    } else if (ctx.children.length > 1) {
      args = [];
    } else {
      args = null;
    }

    return {
      name: toText(ctx.identifier()),
      arguments: args
    };
  },
  TypeNameExpression: function TypeNameExpression(ctx) {
    var typeName = ctx.elementaryTypeName();
    if (typeName === null) {
      typeName = ctx.userDefinedTypeName();
    }
    return {
      typeName: this.visit(typeName)
    };
  },
  TypeName: function TypeName(ctx) {
    if (ctx.children.length > 2) {
      var length = null;
      if (ctx.children.length === 4) {
        length = this.visit(ctx.getChild(2));
      }

      return {
        type: 'ArrayTypeName',
        baseTypeName: this.visit(ctx.typeName()),
        length: length
      };
    }
    if (ctx.children.length === 2) {
      return {
        type: 'ElementaryTypeName',
        name: toText(ctx.getChild(0)),
        stateMutability: toText(ctx.getChild(1))
      };
    }
    return this.visit(ctx.getChild(0));
  },
  FunctionTypeName: function FunctionTypeName(ctx) {
    var _this2 = this;

    var parameterTypes = ctx.functionTypeParameterList(0).functionTypeParameter().map(function (typeCtx) {
      return _this2.visit(typeCtx);
    });

    var returnTypes = [];
    if (ctx.functionTypeParameterList(1)) {
      returnTypes = ctx.functionTypeParameterList(1).functionTypeParameter().map(function (typeCtx) {
        return _this2.visit(typeCtx);
      });
    }

    var visibility = 'default';
    if (ctx.InternalKeyword(0)) {
      visibility = 'internal';
    } else if (ctx.ExternalKeyword(0)) {
      visibility = 'external';
    }

    var stateMutability = null;
    if (ctx.stateMutability(0)) {
      stateMutability = toText(ctx.stateMutability(0));
    }

    return {
      parameterTypes: parameterTypes,
      returnTypes: returnTypes,
      visibility: visibility,
      stateMutability: stateMutability
    };
  },
  ReturnStatement: function ReturnStatement(ctx) {
    var expression = null;
    if (ctx.expression()) {
      expression = this.visit(ctx.expression());
    }

    return { expression: expression };
  },
  EmitStatement: function EmitStatement(ctx) {
    return {
      eventCall: this.visit(ctx.functionCall())
    };
  },
  FunctionCall: function FunctionCall(ctx) {
    var _this3 = this;

    var args = [];
    var names = [];

    var ctxArgs = ctx.functionCallArguments();
    if (ctxArgs.expressionList()) {
      args = ctxArgs.expressionList().expression().map(function (exprCtx) {
        return _this3.visit(exprCtx);
      });
    } else if (ctxArgs.nameValueList()) {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = ctxArgs.nameValueList().nameValue()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var nameValue = _step2.value;

          args.push(this.visit(nameValue.expression()));
          names.push(toText(nameValue.identifier()));
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }

    return {
      expression: this.visit(ctx.expression()),
      arguments: args,
      names: names
    };
  },
  StructDefinition: function StructDefinition(ctx) {
    return {
      name: toText(ctx.identifier()),
      members: this.visit(ctx.variableDeclaration())
    };
  },
  VariableDeclaration: function VariableDeclaration(ctx) {
    var storageLocation = null;
    if (ctx.storageLocation()) {
      storageLocation = toText(ctx.storageLocation());
    }

    return {
      typeName: this.visit(ctx.typeName()),
      name: toText(ctx.identifier()),
      storageLocation: storageLocation,
      isStateVar: false,
      isIndexed: false
    };
  },
  EventParameter: function EventParameter(ctx) {
    var storageLocation = null;
    if (ctx.storageLocation(0)) {
      storageLocation = toText(ctx.storageLocation(0));
    }

    return {
      type: 'VariableDeclaration',
      typeName: this.visit(ctx.typeName()),
      name: toText(ctx.identifier()),
      storageLocation: storageLocation,
      isStateVar: false,
      isIndexed: !!ctx.IndexedKeyword(0)
    };
  },
  FunctionTypeParameter: function FunctionTypeParameter(ctx) {
    var storageLocation = null;
    if (ctx.storageLocation()) {
      storageLocation = toText(ctx.storageLocation());
    }

    return {
      type: 'VariableDeclaration',
      typeName: this.visit(ctx.typeName()),
      name: null,
      storageLocation: storageLocation,
      isStateVar: false,
      isIndexed: false
    };
  },
  WhileStatement: function WhileStatement(ctx) {
    return {
      condition: this.visit(ctx.expression()),
      body: this.visit(ctx.statement())
    };
  },
  DoWhileStatement: function DoWhileStatement(ctx) {
    return {
      condition: this.visit(ctx.expression()),
      body: this.visit(ctx.statement())
    };
  },
  IfStatement: function IfStatement(ctx) {
    var trueBody = this.visit(ctx.statement(0));

    var falseBody = null;
    if (ctx.statement().length > 1) {
      falseBody = this.visit(ctx.statement(1));
    }

    return {
      condition: this.visit(ctx.expression()),
      trueBody: trueBody,
      falseBody: falseBody
    };
  },
  TryStatement: function TryStatement(ctx) {
    var _this4 = this;

    var returnParameters = null;
    if (ctx.returnParameters()) {
      returnParameters = this.visit(ctx.returnParameters());
    }

    var catchClauses = ctx.catchClause().map(function (exprCtx) {
      return _this4.visit(exprCtx);
    });

    return {
      expression: this.visit(ctx.expression()),
      returnParameters: returnParameters,
      body: this.visit(ctx.block()),
      catchClauses: catchClauses
    };
  },
  CatchClause: function CatchClause(ctx) {
    var parameters = null;
    if (ctx.parameterList()) {
      parameters = this.visit(ctx.parameterList());
    }

    if (ctx.identifier() && toText(ctx.identifier()) !== 'Error') {
      throw new Error('Expected "Error" identifier in catch clause');
    }

    return {
      isReasonStringType: !!(ctx.identifier() && toText(ctx.identifier()) === 'Error'),
      parameters: parameters,
      body: this.visit(ctx.block())
    };
  },
  UserDefinedTypeName: function UserDefinedTypeName(ctx) {
    return {
      namePath: toText(ctx)
    };
  },
  ElementaryTypeName: function ElementaryTypeName(ctx) {
    return {
      name: toText(ctx)
    };
  },
  Block: function Block(ctx) {
    return {
      statements: this.visit(ctx.statement())
    };
  },
  ExpressionStatement: function ExpressionStatement(ctx) {
    return {
      expression: this.visit(ctx.expression())
    };
  },
  NumberLiteral: function NumberLiteral(ctx) {
    var number = toText(ctx.getChild(0));
    var subdenomination = null;

    if (ctx.children.length === 2) {
      subdenomination = toText(ctx.getChild(1));
    }

    return {
      number: number,
      subdenomination: subdenomination
    };
  },
  Mapping: function Mapping(ctx) {
    return {
      keyType: this.visit(ctx.elementaryTypeName()),
      valueType: this.visit(ctx.typeName())
    };
  },
  ModifierDefinition: function ModifierDefinition(ctx) {
    var parameters = null;
    if (ctx.parameterList()) {
      parameters = this.visit(ctx.parameterList());
    }

    return {
      name: toText(ctx.identifier()),
      parameters: parameters,
      body: this.visit(ctx.block())
    };
  },
  Statement: function Statement(ctx) {
    return this.visit(ctx.getChild(0));
  },
  SimpleStatement: function SimpleStatement(ctx) {
    return this.visit(ctx.getChild(0));
  },
  Expression: function Expression(ctx) {
    var _this5 = this;

    var op = void 0;

    switch (ctx.children.length) {
      case 1:
        // primary expression
        return this.visit(ctx.getChild(0));

      case 2:
        op = toText(ctx.getChild(0));

        // new expression
        if (op === 'new') {
          return {
            type: 'NewExpression',
            typeName: this.visit(ctx.typeName())
          };
        }

        // prefix operators
        if (['+', '-', '++', '--', '!', '~', 'after', 'delete'].includes(op)) {
          return {
            type: 'UnaryOperation',
            operator: op,
            subExpression: this.visit(ctx.getChild(1)),
            isPrefix: true
          };
        }

        op = toText(ctx.getChild(1));

        // postfix operators
        if (['++', '--'].includes(op)) {
          return {
            type: 'UnaryOperation',
            operator: op,
            subExpression: this.visit(ctx.getChild(0)),
            isPrefix: false
          };
        }
        break;

      case 3:
        // treat parenthesis as no-op
        if (toText(ctx.getChild(0)) === '(' && toText(ctx.getChild(2)) === ')') {
          return {
            type: 'TupleExpression',
            components: [this.visit(ctx.getChild(1))],
            isArray: false
          };
        }

        // if square parenthesis are present it can only be
        // a typename expression
        if (toText(ctx.getChild(1)) === '[' && toText(ctx.getChild(2)) === ']') {
          return {
            "type": "TypeNameExpression",
            "typeName": {
              "type": "ArrayTypeName",
              "baseTypeName": this.visit(ctx.getChild(0)),
              "length": null
            }
          };
        }

        op = toText(ctx.getChild(1));

        // tuple separator
        if (op === ',') {
          return {
            type: 'TupleExpression',
            components: [this.visit(ctx.getChild(0)), this.visit(ctx.getChild(2))],
            isArray: false
          };
        }

        // member access
        if (op === '.') {
          return {
            type: 'MemberAccess',
            expression: this.visit(ctx.getChild(0)),
            memberName: toText(ctx.getChild(2))
          };
        }

        if (isBinOp(op)) {
          return {
            type: 'BinaryOperation',
            operator: op,
            left: this.visit(ctx.getChild(0)),
            right: this.visit(ctx.getChild(2))
          };
        }
        break;

      case 4:
        // function call
        if (toText(ctx.getChild(1)) === '(' && toText(ctx.getChild(3)) === ')') {
          var args = [];
          var names = [];

          var ctxArgs = ctx.functionCallArguments();
          if (ctxArgs.expressionList()) {
            args = ctxArgs.expressionList().expression().map(function (exprCtx) {
              return _this5.visit(exprCtx);
            });
          } else if (ctxArgs.nameValueList()) {
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = ctxArgs.nameValueList().nameValue()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var nameValue = _step3.value;

                args.push(this.visit(nameValue.expression()));
                names.push(toText(nameValue.identifier()));
              }
            } catch (err) {
              _didIteratorError3 = true;
              _iteratorError3 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                  _iterator3.return();
                }
              } finally {
                if (_didIteratorError3) {
                  throw _iteratorError3;
                }
              }
            }
          }

          return {
            type: 'FunctionCall',
            expression: this.visit(ctx.getChild(0)),
            arguments: args,
            names: names
          };
        }

        // index access
        if (toText(ctx.getChild(1)) === '[' && toText(ctx.getChild(3)) === ']') {
          return {
            type: 'IndexAccess',
            base: this.visit(ctx.getChild(0)),
            index: this.visit(ctx.getChild(2))
          };
        }
        break;

      case 5:
        // ternary operator
        if (toText(ctx.getChild(1)) === '?' && toText(ctx.getChild(3)) === ':') {
          return {
            type: 'Conditional',
            condition: this.visit(ctx.getChild(0)),
            trueExpression: this.visit(ctx.getChild(2)),
            falseExpression: this.visit(ctx.getChild(4))
          };
        }

        // index range access
        if (toText(ctx.getChild(1)) === '[' && toText(ctx.getChild(2)) === ':' && toText(ctx.getChild(4)) === ']') {
          return {
            type: 'IndexRangeAccess',
            base: this.visit(ctx.getChild(0)),
            indexStart: null,
            indexEnd: this.visit(ctx.getChild(3))
          };
        } else if (toText(ctx.getChild(1)) === '[' && toText(ctx.getChild(3)) === ':' && toText(ctx.getChild(4)) === ']') {
          return {
            type: 'IndexRangeAccess',
            base: this.visit(ctx.getChild(0)),
            indexStart: this.visit(ctx.getChild(2)),
            indexEnd: null
          };
        }
        break;

      case 6:
        // index range access
        if (toText(ctx.getChild(1)) === '[' && toText(ctx.getChild(3)) === ':' && toText(ctx.getChild(5)) === ']') {
          return {
            type: 'IndexRangeAccess',
            base: this.visit(ctx.getChild(0)),
            indexStart: this.visit(ctx.getChild(2)),
            indexEnd: this.visit(ctx.getChild(4))
          };
        }
        break;
    }

    throw new Error('Unrecognized expression');
  },
  StateVariableDeclaration: function StateVariableDeclaration(ctx) {
    var type = this.visit(ctx.typeName());
    var iden = ctx.identifier();
    var name = toText(iden);

    var expression = null;
    if (ctx.expression()) {
      expression = this.visit(ctx.expression());
    }

    var visibility = 'default';
    if (ctx.InternalKeyword(0)) {
      visibility = 'internal';
    } else if (ctx.PublicKeyword(0)) {
      visibility = 'public';
    } else if (ctx.PrivateKeyword(0)) {
      visibility = 'private';
    }

    var isDeclaredConst = false;
    if (ctx.ConstantKeyword(0)) {
      isDeclaredConst = true;
    }

    var decl = this.createNode({
      type: 'VariableDeclaration',
      typeName: type,
      name: name,
      expression: expression,
      visibility: visibility,
      isStateVar: true,
      isDeclaredConst: isDeclaredConst,
      isIndexed: false
    }, iden);

    return {
      variables: [decl],
      initialValue: expression
    };
  },
  ForStatement: function ForStatement(ctx) {
    var conditionExpression = this.visit(ctx.expressionStatement());
    if (conditionExpression) {
      conditionExpression = conditionExpression.expression;
    }
    return {
      initExpression: this.visit(ctx.simpleStatement()),
      conditionExpression: conditionExpression,
      loopExpression: {
        type: 'ExpressionStatement',
        expression: this.visit(ctx.expression())
      },
      body: this.visit(ctx.statement())
    };
  },
  PrimaryExpression: function PrimaryExpression(ctx) {
    if (ctx.BooleanLiteral()) {
      return {
        type: 'BooleanLiteral',
        value: toText(ctx.BooleanLiteral()) === 'true'
      };
    }

    if (ctx.HexLiteral()) {
      return {
        type: 'HexLiteral',
        value: toText(ctx.HexLiteral())
      };
    }

    if (ctx.StringLiteral()) {
      var text = toText(ctx);
      var singleQuotes = text[0] === "'";
      var textWithoutQuotes = text.substring(1, text.length - 1);
      var value = singleQuotes ? textWithoutQuotes.replace(new RegExp("\\\\'", 'g'), "'") : textWithoutQuotes.replace(new RegExp('\\\\"', 'g'), '"');
      return {
        type: 'StringLiteral',
        value: value
      };
    }

    if (ctx.TypeKeyword()) {
      return {
        type: 'Identifier',
        name: 'type'
      };
    }

    if (ctx.children.length == 3 && toText(ctx.getChild(1)) === '[' && toText(ctx.getChild(2)) === ']') {
      var node = this.visit(ctx.getChild(0));
      if (node.type === 'Identifier') {
        node = {
          type: 'UserDefinedTypeName',
          namePath: node.name
        };
      } else if (node.type == 'TypeNameExpression') {
        node = node.typeName;
      } else {
        node = {
          type: 'ElementaryTypeName',
          name: toText(ctx.getChild(0))
        };
      }

      var typeName = {
        type: 'ArrayTypeName',
        baseTypeName: node,
        length: null
      };

      return {
        type: 'TypeNameExpression',
        typeName: typeName
      };
    }

    return this.visit(ctx.getChild(0));
  },
  Identifier: function Identifier(ctx) {
    return {
      name: toText(ctx)
    };
  },
  TupleExpression: function TupleExpression(ctx) {
    var _this6 = this;

    // remove parentheses
    var children = ctx.children.slice(1, -1);
    var components = mapCommasToNulls(children).map(function (expr) {
      // add a null for each empty value
      if (expr === null) {
        return null;
      }
      return _this6.visit(expr);
    });

    return {
      components: components,
      isArray: toText(ctx.getChild(0)) === '['
    };
  },
  IdentifierList: function IdentifierList(ctx) {
    var _this7 = this;

    // remove parentheses
    var children = ctx.children.slice(1, -1);
    return mapCommasToNulls(children).map(function (iden) {
      // add a null for each empty value
      if (iden === null) {
        return null;
      }

      return _this7.createNode({
        type: 'VariableDeclaration',
        name: toText(iden),
        storageLocation: null,
        typeName: null,
        isStateVar: false,
        isIndexed: false
      }, iden);
    });
  },
  VariableDeclarationList: function VariableDeclarationList(ctx) {
    var _this8 = this;

    // remove parentheses
    return mapCommasToNulls(ctx.children).map(function (decl) {
      // add a null for each empty value
      if (decl === null) {
        return null;
      }

      var storageLocation = null;
      if (decl.storageLocation()) {
        storageLocation = toText(decl.storageLocation());
      }

      return _this8.createNode({
        type: 'VariableDeclaration',
        name: toText(decl.identifier()),
        typeName: _this8.visit(decl.typeName()),
        storageLocation: storageLocation,
        isStateVar: false,
        isIndexed: false
      }, decl);
    });
  },
  VariableDeclarationStatement: function VariableDeclarationStatement(ctx) {
    var variables = void 0;
    if (ctx.variableDeclaration()) {
      variables = [this.visit(ctx.variableDeclaration())];
    } else if (ctx.identifierList()) {
      variables = this.visit(ctx.identifierList());
    } else if (ctx.variableDeclarationList()) {
      variables = this.visit(ctx.variableDeclarationList());
    }

    var initialValue = null;
    if (ctx.expression()) {
      initialValue = this.visit(ctx.expression());
    }

    return {
      variables: variables,
      initialValue: initialValue
    };
  },
  ImportDirective: function ImportDirective(ctx) {
    var pathString = toText(ctx.StringLiteral());
    var unitAlias = null;
    var symbolAliases = null;

    if (ctx.importDeclaration().length > 0) {
      symbolAliases = ctx.importDeclaration().map(function (decl) {
        var symbol = toText(decl.identifier(0));
        var alias = null;
        if (decl.identifier(1)) {
          alias = toText(decl.identifier(1));
        }
        return [symbol, alias];
      });
    } else if (ctx.children.length === 7) {
      unitAlias = toText(ctx.getChild(3));
    } else if (ctx.children.length === 5) {
      unitAlias = toText(ctx.getChild(3));
    }

    return {
      path: pathString.substring(1, pathString.length - 1),
      unitAlias: unitAlias,
      symbolAliases: symbolAliases
    };
  },
  EventDefinition: function EventDefinition(ctx) {
    return {
      name: toText(ctx.identifier()),
      parameters: this.visit(ctx.eventParameterList()),
      isAnonymous: !!ctx.AnonymousKeyword()
    };
  },
  EventParameterList: function EventParameterList(ctx) {
    return ctx.eventParameter().map(function (paramCtx) {
      var type = this.visit(paramCtx.typeName());
      var name = null;
      if (paramCtx.identifier()) {
        name = toText(paramCtx.identifier());
      }

      return this.createNode({
        type: 'VariableDeclaration',
        typeName: type,
        name: name,
        isStateVar: false,
        isIndexed: !!paramCtx.IndexedKeyword(0)
      }, paramCtx);
    }, this);
  },
  ReturnParameters: function ReturnParameters(ctx) {
    return this.visit(ctx.parameterList());
  },
  ParameterList: function ParameterList(ctx) {
    var _this9 = this;

    return ctx.parameter().map(function (paramCtx) {
      return _this9.visit(paramCtx);
    });
  },
  Parameter: function Parameter(ctx) {
    var storageLocation = null;
    if (ctx.storageLocation()) {
      storageLocation = toText(ctx.storageLocation());
    }

    var name = null;
    if (ctx.identifier()) {
      name = toText(ctx.identifier());
    }

    return {
      type: 'VariableDeclaration',
      typeName: this.visit(ctx.typeName()),
      name: name,
      storageLocation: storageLocation,
      isStateVar: false,
      isIndexed: false
    };
  },
  InlineAssemblyStatement: function InlineAssemblyStatement(ctx) {
    var language = null;
    if (ctx.StringLiteral()) {
      language = toText(ctx.StringLiteral());
      language = language.substring(1, language.length - 1);
    }

    return {
      language: language,
      body: this.visit(ctx.assemblyBlock())
    };
  },
  AssemblyBlock: function AssemblyBlock(ctx) {
    var _this10 = this;

    var operations = ctx.assemblyItem().map(function (it) {
      return _this10.visit(it);
    });

    return { operations: operations };
  },
  AssemblyItem: function AssemblyItem(ctx) {
    var text = void 0;

    if (ctx.HexLiteral()) {
      return {
        type: 'HexLiteral',
        value: toText(ctx.HexLiteral())
      };
    }

    if (ctx.StringLiteral()) {
      text = toText(ctx.StringLiteral());
      return {
        type: 'StringLiteral',
        value: text.substring(1, text.length - 1)
      };
    }

    if (ctx.BreakKeyword()) {
      return {
        type: 'Break'
      };
    }

    if (ctx.ContinueKeyword()) {
      return {
        type: 'Continue'
      };
    }

    return this.visit(ctx.getChild(0));
  },
  AssemblyExpression: function AssemblyExpression(ctx) {
    return this.visit(ctx.getChild(0));
  },
  AssemblyCall: function AssemblyCall(ctx) {
    var _this11 = this;

    var functionName = toText(ctx.getChild(0));
    var args = ctx.assemblyExpression().map(function (arg) {
      return _this11.visit(arg);
    });

    return {
      functionName: functionName,
      arguments: args
    };
  },
  AssemblyLiteral: function AssemblyLiteral(ctx) {
    var text = void 0;

    if (ctx.StringLiteral()) {
      text = toText(ctx);
      return {
        type: 'StringLiteral',
        value: text.substring(1, text.length - 1)
      };
    }

    if (ctx.DecimalNumber()) {
      return {
        type: 'DecimalNumber',
        value: toText(ctx)
      };
    }

    if (ctx.HexNumber()) {
      return {
        type: 'HexNumber',
        value: toText(ctx)
      };
    }

    if (ctx.HexLiteral()) {
      return {
        type: 'HexLiteral',
        value: toText(ctx)
      };
    }
  },
  AssemblySwitch: function AssemblySwitch(ctx) {
    var _this12 = this;

    return {
      expression: this.visit(ctx.assemblyExpression()),
      cases: ctx.assemblyCase().map(function (c) {
        return _this12.visit(c);
      })
    };
  },
  AssemblyCase: function AssemblyCase(ctx) {
    var value = null;
    if (toText(ctx.getChild(0)) === 'case') {
      value = this.visit(ctx.assemblyLiteral());
    }

    var node = { block: this.visit(ctx.assemblyBlock()) };
    if (value !== null) {
      node.value = value;
    } else {
      node.default = true;
    }

    return node;
  },
  AssemblyLocalDefinition: function AssemblyLocalDefinition(ctx) {
    var names = ctx.assemblyIdentifierOrList();
    if (names.identifier()) {
      names = [this.visit(names.identifier())];
    } else {
      names = this.visit(names.assemblyIdentifierList().identifier());
    }

    return {
      names: names,
      expression: this.visit(ctx.assemblyExpression())
    };
  },
  AssemblyFunctionDefinition: function AssemblyFunctionDefinition(ctx) {
    var args = ctx.assemblyIdentifierList();
    args = args ? this.visit(args.identifier()) : [];

    var returnArgs = ctx.assemblyFunctionReturns();
    returnArgs = returnArgs ? this.visit(returnArgs.assemblyIdentifierList().identifier()) : [];

    return {
      name: toText(ctx.identifier()),
      arguments: args,
      returnArguments: returnArgs,
      body: this.visit(ctx.assemblyBlock())
    };
  },
  AssemblyAssignment: function AssemblyAssignment(ctx) {
    var names = ctx.assemblyIdentifierOrList();
    if (names.identifier()) {
      names = [this.visit(names.identifier())];
    } else {
      names = this.visit(names.assemblyIdentifierList().identifier());
    }

    return {
      names: names,
      expression: this.visit(ctx.assemblyExpression())
    };
  },
  LabelDefinition: function LabelDefinition(ctx) {
    return {
      name: toText(ctx.identifier())
    };
  },
  AssemblyStackAssignment: function AssemblyStackAssignment(ctx) {
    return {
      name: toText(ctx.identifier())
    };
  },
  AssemblyFor: function AssemblyFor(ctx) {
    return {
      pre: this.visit(ctx.getChild(1)),
      condition: this.visit(ctx.getChild(2)),
      post: this.visit(ctx.getChild(3)),
      body: this.visit(ctx.getChild(4))
    };
  },
  AssemblyIf: function AssemblyIf(ctx) {
    return {
      condition: this.visit(ctx.assemblyExpression()),
      body: this.visit(ctx.assemblyBlock())
    };
  }
};

function ASTBuilder(options) {
  antlr4.tree.ParseTreeVisitor.call(this);
  this.options = options;
}

ASTBuilder.prototype = Object.create(antlr4.tree.ParseTreeVisitor.prototype);
ASTBuilder.prototype.constructor = ASTBuilder;

ASTBuilder.prototype._loc = function (ctx) {
  var sourceLocation = {
    start: {
      line: ctx.start.line,
      column: ctx.start.column
    },
    end: {
      line: ctx.stop.line,
      column: ctx.stop.column
    }
  };
  return { loc: sourceLocation };
};

ASTBuilder.prototype._range = function (ctx) {
  return { range: [ctx.start.start, ctx.stop.stop] };
};

ASTBuilder.prototype.meta = function (ctx) {
  var ret = {};
  if (this.options.loc) {
    Object.assign(ret, this._loc(ctx));
  }
  if (this.options.range) {
    Object.assign(ret, this._range(ctx));
  }
  return ret;
};

ASTBuilder.prototype.createNode = function (obj, ctx) {
  return Object.assign(obj, this.meta(ctx));
};

ASTBuilder.prototype.visit = function (ctx) {
  if (ctx == null) {
    return null;
  }

  if (Array.isArray(ctx)) {
    return ctx.map(function (child) {
      return this.visit(child);
    }, this);
  }

  var name = ctx.constructor.name;
  if (name.endsWith('Context')) {
    name = name.substring(0, name.length - 'Context'.length);
  }

  var node = { type: name };

  if (name in transformAST) {
    var visited = transformAST[name].call(this, ctx);
    if (Array.isArray(visited)) {
      return visited;
    }
    Object.assign(node, visited);
  }

  return this.createNode(node, ctx);
};

module.exports = ASTBuilder;