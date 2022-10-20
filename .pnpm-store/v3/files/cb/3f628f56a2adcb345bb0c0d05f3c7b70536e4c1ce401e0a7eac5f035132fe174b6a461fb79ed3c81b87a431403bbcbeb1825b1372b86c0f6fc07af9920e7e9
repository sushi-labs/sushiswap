var yaml = require('js-yaml');

module.exports =
function buildYamlSchema() {

	var types = ['scalar', 'mapping', 'sequence'];
	function functionTag(functionName) {
		var splitFunctionName = functionName.split('::');
		return splitFunctionName[splitFunctionName.length - 1];
	}
	function buildYamlType(fnName, type) {
		var tagName = functionTag(fnName);
		var tag = "!" + tagName;
		var constructFn = (fnName === 'Fn::GetAtt')
			? function (data) { return ({ 'Fn::GetAtt': Array.isArray(data) ? data : data.split('.') }); }
			: function (data) {
				return (_a = {}, _a[fnName] = data, _a);
				var _a;
			};
		return new yaml.Type(tag, {
			kind: type,
			construct: constructFn
		});
	}
	function buildYamlTypes(fnName) {
		return types.map(function (type) { return buildYamlType(fnName, type); });
	}

	var spread = function () {
		for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(read(arguments[i]));
		return ar;
	};
	var read = function (o, n) {
		var m = typeof Symbol === "function" && o[Symbol.iterator];
		if (!m) return o;
		var i = m.call(o), r, ar = [], e;
		try {
			while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
		}
		catch (error) {
			e = { error: error };
		}
		finally {
			/*eslint no-unsafe-finally: "off"*/
			try {
				if (r && !r.done && (m = i["return"])) m.call(i);
			}
			finally {
				if (e) throw e.error;
			}
		}
		return ar;
	};
	var intrinsic_functions = {
		"Ref": {}
	};
	var yamlTypes = [];
	for (var fn in intrinsic_functions) {
		yamlTypes.push.apply(yamlTypes, spread(
			buildYamlTypes(fn)

		));
	}
	return yaml.Schema.create(yaml.CORE_SCHEMA, yamlTypes);
};
