function foo(bar) {
	if (!(bar == null || typeof bar !== 'object')) {
		throw 'Argument "bar" is invalid.';
	}

	console.log(bar == null ? 'Hello World' : bar);
}

export {
	foo
};
