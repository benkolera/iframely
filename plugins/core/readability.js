var Readability = require('readabilitySAX').Readability;

module.exports = {

    provides: 'self',

    // Disable for now.
    notPlugin: true,

    getData: function(url, htmlparser, cb) {

        // TODO: encode result.

        var readability = new Readability({
            pageURL: url
        });
        // Moved to top, because JSLINT error: Move 'var' declarations to the top of the function.
        var skipLevel;

        var ended = false;

        function onEnd() {

            if (ended) {
                return;
            }

            ended = true;

            for (
                skipLevel = 1;
                readability._getCandidateNode().info.textLength < 250 && skipLevel < 4;
                skipLevel++
                ) {

                readability.setSkipLevel(skipLevel);
                htmlparser.restartFor(readability);
            }

            cb(null, {
                readability: readability
            });
        }

        readability.onend = onEnd;

        htmlparser.addHandler(readability);

        htmlparser.request.response.on('onerror', cb);
    }

};