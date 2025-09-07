const globals = require("globals");

module.exports = [
	{
		ignores: [
			"assets/**",
			"node_modules/**",
			"coverage/**",
			"shipitfile.js",
			"tmp/**"
		]
	},
	{
		languageOptions: {
			ecmaVersion: 2021,
			globals: Object.assign(
				{},
				globals.node,
				globals.mocha,
				globals.es2017
			)
		},
		rules: {
			"comma-dangle": 2,
			"no-underscore-dangle": 0,
			"no-else-return": 2,
			"no-self-compare": 2,
			"no-throw-literal": 2,
			"wrap-iife": [2, "outside"],
			"no-catch-shadow": 2,
			"indent": [2, "tab"],
			"consistent-this": [2, "self"],
			"func-names": 2,
			"no-inline-comments": 2,
			"max-nested-callbacks": [2, 3],
			"new-cap": 2,
			"new-parens": 2,
			"no-array-constructor": 2,
			"no-multiple-empty-lines": 2,
			"no-nested-ternary": 2,
			"one-var": [2, "never"],
			"operator-assignment": [2, "always"],
			"quotes": [2, "double", "avoid-escape"],
			"semi": [2, "always"],
			"spaced-comment": [1, "always"],
			"keyword-spacing": 2,
			"space-infix-ops": 2,
			"space-in-parens": [2, "never"],
			"space-before-function-paren": [2, "never"],
			"space-before-blocks": [2, "always"],
			"no-var": 2,
			"prefer-const": 1,
			"prefer-template": 1,
			"require-await": 1,
			"arrow-spacing": 2,
			"generator-star-spacing": [2, "after"],
			"no-confusing-arrow": 2,
			"no-const-assign": 2
		}
	}
];
