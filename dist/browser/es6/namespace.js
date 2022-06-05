const Namespace = (() => {
function foo(bar) {
	console.log(bar == null ? 'Hello World' : bar);
}

return {
	foo
};
})();

/* exported HtmlFactory */
