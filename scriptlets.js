// The lines below are skipped by the resource parser. Purpose is clean
// jshinting.
(function() {
// >>>> start of private namespace
'use strict';


/// noeval-debug.js
/// alias noeval2.js
(function () {
	const log = console.log.bind(console);
	window.eval = new Proxy(window.eval, { // jshint ignore: line
		apply: function (target, thisArg, args) {
			log(`Document tried to eval...$ {
				args[0]
			}\n`);
			return target.apply(thisArg, args);
		}
	});
})();

/// my_logger.js
/// alias log.js
// https://github.com/uBlockOrigin/uAssets/issues/9123#issuecomment-848255120
(function() {
    const log = console.log.bind(console);
    const token = '{{1}}';
    log('uBO: my_logger("%s")', token);
})();

/// replace-attr.js
/// alias rat.js
(function() {
	'use strict';
    const attribute_destination = '{{1}}';
    if ( attribute_destination === '' || attribute_destination === '{{1}}' ) { return; }
    const attribute_source =  '{{2}}';
    if ( attribute_destination === '' || attribute_destination === '{{2}}' ) { return; }
    let selector = '{{3}}';
    if ( selector === '' || selector === '{{3}}' ) { return; }
    let behavior = '{{4}}';
    let timer;
    const repattr = ( ) => {
        timer = undefined;
        try {
           const nodes = document.querySelectorAll(selector);
            for ( const node of nodes )
			{
				if(node.hasAttribute(attribute_source) && node.hasAttribute(attribute_destination))
				{
					let attribute_value = node.getAttribute(attribute_source);
					node.setAttribute(attribute_destination, attribute_value);
				}
            }
        } catch(ex) { }
    };
    const mutationHandler = mutations => {
        if ( timer !== undefined ) { return; }
        let skip = true;
        for ( let i = 0; i < mutations.length && skip; i++ ) {
            const { type, addedNodes, removedNodes } = mutations[i];
            if ( type === 'attributes' ) { skip = false; }
            for ( let j = 0; j < addedNodes.length && skip; j++ ) {
                if ( addedNodes[j].nodeType === 1 ) { skip = false; break; }
            }
            for ( let j = 0; j < removedNodes.length && skip; j++ ) {
                if ( removedNodes[j].nodeType === 1 ) { skip = false; break; }
            }
        }
        if ( skip ) { return; }
        timer = self.requestIdleCallback(repattr, { timeout: 17 });
    };
    const start = ( ) => {
        repattr();
        if ( /\bstay\b/.test(behavior) === false ) { return; }
        const observer = new MutationObserver(mutationHandler);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: attribute_source,
            childList: true,
            subtree: true,
        });
    };
    if ( document.readyState !== 'complete' && /\bcomplete\b/.test(behavior) ) {
        self.addEventListener('load', start, { once: true });
    } else if ( document.readyState !== 'loading' || /\basap\b/.test(behavior) ) {
        start();
    } else {
        self.addEventListener('DOMContentLoaded', start, { once: true });
    }
})();



// These lines below are skipped by the resource parser.
// <<<< end of private namespace
})();
