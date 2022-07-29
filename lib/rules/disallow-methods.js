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
    function getVars(refName) {
        return context.getScope().variables
            .filter(v => v.defs.some(def => {
                var name = def.node.init.name;
                return refName === name //|| getVars(name).includes(refName);
            }))
            .map(v => v.name);
    }
   
    return {
        "CallExpression": function (node) {
            var varsOfObjects = [];
            disallowedMethods
                .filter(disallowedMethod => disallowedMethod.object !== '*')
                .forEach(disallowedMethod => varsOfObjects.push(...getVars(disallowedMethod.object)));
            disallowedMethods.forEach(function(disallowedMethod) {
                var calledObject = node.callee.object && node.callee.object.name;
                var calledMethod = node.callee.property && node.callee.property.name;

                if (calledObject
                    && (
                        disallowedMethod.object === '*'
                        || calledObject === disallowedMethod.object
                        || varsOfObjects.includes(calledObject)
                    ) &&
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