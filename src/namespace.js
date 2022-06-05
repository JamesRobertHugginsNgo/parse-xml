/* @if TARGET="BROWSER_ES6" || TARGET="BROWSER_ES5" **
const Namespace = (() => {
/* @endif */
function foo(bar) {
	/* @if DEBUG */
	if (!(bar == null || typeof bar !== 'object')) {
		throw 'Argument "bar" is invalid.';
	}

	/* @endif */
	console.log(bar == null ? 'Hello World' : bar);
}

/* @if TARGET="NODE" */
module.exports = {
	foo
};
/* @endif */
/* @if TARGET="BROWSER_ES6_MODULE" **
export {
	foo
};
/* @endif */
/* @if TARGET="BROWSER_ES6" || TARGET="BROWSER_ES5" **
return {
	foo
};
})();

/* exported HtmlFactory */
/* @endif */
