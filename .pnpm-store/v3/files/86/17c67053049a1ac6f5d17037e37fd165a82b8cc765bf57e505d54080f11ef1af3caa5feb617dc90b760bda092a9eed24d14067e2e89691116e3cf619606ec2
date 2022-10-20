'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/* babel-plugin-inline-import './lib/Solidity.tokens' */var tokens = 'T__0=1\nT__1=2\nT__2=3\nT__3=4\nT__4=5\nT__5=6\nT__6=7\nT__7=8\nT__8=9\nT__9=10\nT__10=11\nT__11=12\nT__12=13\nT__13=14\nT__14=15\nT__15=16\nT__16=17\nT__17=18\nT__18=19\nT__19=20\nT__20=21\nT__21=22\nT__22=23\nT__23=24\nT__24=25\nT__25=26\nT__26=27\nT__27=28\nT__28=29\nT__29=30\nT__30=31\nT__31=32\nT__32=33\nT__33=34\nT__34=35\nT__35=36\nT__36=37\nT__37=38\nT__38=39\nT__39=40\nT__40=41\nT__41=42\nT__42=43\nT__43=44\nT__44=45\nT__45=46\nT__46=47\nT__47=48\nT__48=49\nT__49=50\nT__50=51\nT__51=52\nT__52=53\nT__53=54\nT__54=55\nT__55=56\nT__56=57\nT__57=58\nT__58=59\nT__59=60\nT__60=61\nT__61=62\nT__62=63\nT__63=64\nT__64=65\nT__65=66\nT__66=67\nT__67=68\nT__68=69\nT__69=70\nT__70=71\nT__71=72\nT__72=73\nT__73=74\nT__74=75\nT__75=76\nT__76=77\nT__77=78\nT__78=79\nT__79=80\nT__80=81\nT__81=82\nT__82=83\nT__83=84\nT__84=85\nT__85=86\nT__86=87\nT__87=88\nT__88=89\nT__89=90\nT__90=91\nT__91=92\nT__92=93\nT__93=94\nInt=95\nUint=96\nByte=97\nFixed=98\nUfixed=99\nBooleanLiteral=100\nDecimalNumber=101\nHexNumber=102\nNumberUnit=103\nHexLiteral=104\nReservedKeyword=105\nAnonymousKeyword=106\nBreakKeyword=107\nConstantKeyword=108\nContinueKeyword=109\nLeaveKeyword=110\nExternalKeyword=111\nIndexedKeyword=112\nInternalKeyword=113\nPayableKeyword=114\nPrivateKeyword=115\nPublicKeyword=116\nPureKeyword=117\nTypeKeyword=118\nViewKeyword=119\nConstructorKeyword=120\nFallbackKeyword=121\nReceiveKeyword=122\nIdentifier=123\nStringLiteral=124\nVersionLiteral=125\nWS=126\nCOMMENT=127\nLINE_COMMENT=128\n\'pragma\'=1\n\';\'=2\n\'^\'=3\n\'~\'=4\n\'>=\'=5\n\'>\'=6\n\'<\'=7\n\'<=\'=8\n\'=\'=9\n\'as\'=10\n\'import\'=11\n\'*\'=12\n\'from\'=13\n\'{\'=14\n\',\'=15\n\'}\'=16\n\'abstract\'=17\n\'contract\'=18\n\'interface\'=19\n\'library\'=20\n\'is\'=21\n\'(\'=22\n\')\'=23\n\'using\'=24\n\'for\'=25\n\'struct\'=26\n\'modifier\'=27\n\'virtual\'=28\n\'function\'=29\n\'returns\'=30\n\'event\'=31\n\'enum\'=32\n\'[\'=33\n\']\'=34\n\'address\'=35\n\'.\'=36\n\'mapping\'=37\n\'=>\'=38\n\'memory\'=39\n\'storage\'=40\n\'calldata\'=41\n\'if\'=42\n\'else\'=43\n\'try\'=44\n\'catch\'=45\n\'while\'=46\n\'assembly\'=47\n\'do\'=48\n\'return\'=49\n\'throw\'=50\n\'emit\'=51\n\'var\'=52\n\'bool\'=53\n\'string\'=54\n\'byte\'=55\n\'++\'=56\n\'--\'=57\n\'new\'=58\n\':\'=59\n\'+\'=60\n\'-\'=61\n\'after\'=62\n\'delete\'=63\n\'!\'=64\n\'**\'=65\n\'/\'=66\n\'%\'=67\n\'<<\'=68\n\'>>\'=69\n\'&\'=70\n\'|\'=71\n\'==\'=72\n\'!=\'=73\n\'&&\'=74\n\'||\'=75\n\'?\'=76\n\'|=\'=77\n\'^=\'=78\n\'&=\'=79\n\'<<=\'=80\n\'>>=\'=81\n\'+=\'=82\n\'-=\'=83\n\'*=\'=84\n\'/=\'=85\n\'%=\'=86\n\'let\'=87\n\':=\'=88\n\'=:\'=89\n\'switch\'=90\n\'case\'=91\n\'default\'=92\n\'->\'=93\n\'override\'=94\n\'anonymous\'=106\n\'break\'=107\n\'constant\'=108\n\'continue\'=109\n\'leave\'=110\n\'external\'=111\n\'indexed\'=112\n\'internal\'=113\n\'payable\'=114\n\'private\'=115\n\'public\'=116\n\'pure\'=117\n\'type\'=118\n\'view\'=119\n\'constructor\'=120\n\'fallback\'=121\n\'receive\'=122\n';


var TYPE_TOKENS = ['var', 'bool', 'address', 'string', 'Int', 'Uint', 'Byte', 'Fixed', 'UFixed'];

function rsplit(str, value) {
  var index = str.lastIndexOf(value);
  return [str.substring(0, index), str.substring(index + 1, str.length)];
}

function normalizeTokenType(value) {
  if (value.endsWith("'")) {
    value = value.substring(0, value.length - 1);
  }
  if (value.startsWith("'")) {
    value = value.substring(1, value.length);
  }
  return value;
}

function getTokenType(value) {
  if (value === 'Identifier' || value === 'from') {
    return 'Identifier';
  } else if (value === 'TrueLiteral' || value === 'FalseLiteral') {
    return 'Boolean';
  } else if (value === 'VersionLiteral') {
    return 'Version';
  } else if (value === 'StringLiteral') {
    return 'String';
  } else if (TYPE_TOKENS.includes(value)) {
    return 'Type';
  } else if (value === 'NumberUnit') {
    return 'Subdenomination';
  } else if (value === 'DecimalNumber') {
    return 'Numeric';
  } else if (value === 'HexLiteral') {
    return 'Hex';
  } else if (value === 'ReservedKeyword') {
    return 'Reserved';
  } else if (/^\W+$/.test(value)) {
    return 'Punctuator';
  } else {
    return 'Keyword';
  }
}

function getTokenTypeMap() {
  return tokens.split('\n').map(function (line) {
    return rsplit(line, '=');
  }).reduce(function (acum, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        value = _ref2[0],
        key = _ref2[1];

    acum[parseInt(key, 10)] = normalizeTokenType(value);
    return acum;
  }, {});
}

function buildTokenList(tokens, options) {
  var tokenTypes = getTokenTypeMap();

  return tokens.map(function (token) {
    var type = getTokenType(tokenTypes[token.type]);
    var node = { type: type, value: token.text };
    if (options.range) {
      node.range = [token.start, token.stop + 1];
    }
    if (options.loc) {
      node.loc = {
        start: { line: token.line, column: token.column },
        end: { line: token.line, column: token.column + token.text.length }
      };
    }
    return node;
  });
}

exports.buildTokenList = buildTokenList;