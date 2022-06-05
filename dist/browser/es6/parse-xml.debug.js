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

	function processTag(string) {
		const openTagStartIndex = string.charAt(1) === '?' ? 2 : 1;
		const openTagEndIndex = string.indexOf('>');
		const isContainer = (openTagStartIndex === 1 && string.charAt(openTagEndIndex - 1) !== '/')
			|| (openTagStartIndex === 2 && string.charAt(openTagEndIndex - 1) !== '?');
		const openTagContentEndIndex = isContainer ? openTagEndIndex : openTagEndIndex - 1;
		const tagContent = string.substring(openTagStartIndex, openTagContentEndIndex);

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

		if (openTagStartIndex === 2) {
			node.isDeclaration = true;
		}

		if (tagItems.length !== 0) {
			node.attributes = tagItems.reduce((acc, cur) => {
				const [name, value] = cur.split('=');
				acc[name] = value.substring(1, value.length - 1);
				return acc;
			}, {});
		}

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

	function processChildren(string) {
		const nodes = [];

		while (string.length > 0 && !(string.charAt(0) === '<' && string.charAt(1) === '/')) {
			const { node, string: newString } = string.charAt(0) === '<'
				? processTag(string)
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

/* exported parseXml */
