/**
 * @fileoverview Rule to disallow specified object methods
 * @author Will Klein
 * @copyright 2015 Will Klein. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {
    var disallowedMethods = context.options[0];
   
    return {
        "CallExpression": function (node) {
            var varsOfObjects = context.getScope().variables
                .filter(v => disallowedMethods.some(disallowedMethod => v.defs.some(def => disallowedMethod.object === def.node.init.name)))
                .map(v => v.name);
            disallowedMethods.forEach(function(disallowedMethod) {
                var calledObject = node.callee.object && node.callee.object.name;
                var calledMethod = node.callee.property && node.callee.property.name;

                if (calledObject && (calledObject === disallowedMethod.object || varsOfObjects.includes(calledObject)) &&
                        calledMethod && calledMethod === disallowedMethod.method) {
                    context.report(node, "Calling " + disallowedMethod.object + "." + disallowedMethod.method + "() is disallowed");
                }
            });
        }
    };
};
/*
module.exports.schema = {
    type: "array",
    items: {
        type: "object",
        "properties": {
            "object": {
                "type": "string"
            },
            "method": {
                "type": "string"
            }
        },
        "additionalProperties": false
    }
};
*/