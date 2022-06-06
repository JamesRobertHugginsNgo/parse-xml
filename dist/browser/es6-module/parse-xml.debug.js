const parseXml = (() => {
	function processText(string) {
		const index = string.indexOf('<');

		if (index === -1) {
			return {
				node: string,
				string: ''
			};
		}

		return {
			node: string.substring(0, index),
			string: string.substring(index)
		};
	}

	function processTagContent(tagContent) {
		const spaceIndexes = [];
		let quote = null;
		for (let index = 0, length = tagContent.length; index < length; index++) {
			const char = tagContent.charAt(index);
			if (char === '"' || char === '\'') {
				if (quote === null) {
					quote = char;
				} else if (quote === char) {
					quote = null;
				}
			}
			if (quote === null && char === ' ') {
				spaceIndexes.push(index);
			}
		}
		spaceIndexes.push(-1);

		const tagItems = [];
		let lastSpaceIndex = 0;
		for (let index = 0, length = spaceIndexes.length; index < length; index++) {
			const nextSpaceIndex = spaceIndexes[index];
			if (nextSpaceIndex === -1) {
				tagItems.push(tagContent.substring(lastSpaceIndex));
			} else {
				tagItems.push(tagContent.substring(lastSpaceIndex, nextSpaceIndex));
				lastSpaceIndex = nextSpaceIndex + 1;
			}
		}

		const node = {
			name: tagItems.shift()
		};

		if (tagItems.length !== 0) {
			node.attributes = tagItems.reduce((acc, cur) => {
				const [name, value] = cur.split('=');
				acc[name] = value.substring(1, value.length - 1);
				return acc;
			}, {});
		}

		return node;
	}

	function processTag(string) {
		const openTagEndIndex = string.indexOf('>');
		const isContainer = string.charAt(openTagEndIndex - 1) !== '/';
		const openTagContentEndIndex = isContainer ? openTagEndIndex : openTagEndIndex - 1;
		const node = processTagContent(string.substring(1, openTagContentEndIndex));

		string = string.substring(openTagEndIndex + 1);

		if (isContainer) {
			const { nodes, string: newString } = processChildren(string);
			node.children = nodes;
			string = newString.substring(newString.indexOf('>') + 1);
		}

		return {
			node,
			string
		};
	}

	function processDeclaration(string) {
		const openTagEndIndex = string.indexOf('>');
		return {
			node: {
				...processTagContent(string.substring(2, openTagEndIndex - 1)),
				isDeclaration: true
			},
			string: string.substring(openTagEndIndex + 1)
		};
	}

	function processChildren(string) {
		const nodes = [];
		while (string.length > 0 && !(string.charAt(0) === '<' && string.charAt(1) === '/')) {
			const { node, string: newString } = string.charAt(0) === '<'
				? string.charAt(1) === '?'
					? processDeclaration(string)
					: processTag(string)
				: processText(string);

			nodes.push(node);
			string = newString;
		}
		return { nodes, string };
	}

	return function (string) {
		if (!(typeof string === 'string')) {
			throw 'Argument "string" is invalid.';
		}

		return processChildren(string).nodes;
	};
})();

export default parseXml;
