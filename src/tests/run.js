
// ------------------------------------------------------------------------------------------------
// IMPORTS
// ------------------------------------------------------------------------------------------------
var path 	= require('path');
var runner 	= require('qunit');

// ------------------------------------------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------------------------------------------

function abspath(p) {
  return path.join(__dirname, p)
}

// ------------------------------------------------------------------------------------------------
// RUN
// ------------------------------------------------------------------------------------------------

runner.run({
    code: abspath("../endpoints.js"),
    tests: abspath("./tests.js")
});

// ------------------------------------------------------------------------------------------------
// END
// ------------------------------------------------------------------------------------------------