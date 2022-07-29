/**
 * @fileoverview Tests for disallow-methods rule.
 * @author Will Klein
 * @copyright 2015 Will Klein. All rights reserved.
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/disallow-methods");
var RuleTester = require("eslint").RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("disallow-methods", rule, {
    valid: [{
        code: "someObject.someMethod()",
        options: [[{
            object: "someObject",
            method: "disallowedMethod"
        }]]
    }, {
        code: "anotherObject.disallowedMethod()",
        options: [[{
            object: "someObject",
            method: "disallowedMethod"
        }]]
    }],

    invalid: [{
        code: "someObject.disallowedMethod()",
        options: [[{
            object: "someObject",
            method: "disallowedMethod"
        }]],
        errors: [{
            message: "Calling someObject.disallowedMethod() is disallowed",
            type: "CallExpression"
        }]
    }, {
        code: "someObject.disallowedMethod(); anotherObject.anotherDisallowedMethod()",
        options: [[{
            object: "someObject",
            method: "disallowedMethod"
        }, {
            object: "anotherObject",
            method: "anotherDisallowedMethod"
        }]],
        errors: [{
            message: "Calling someObject.disallowedMethod() is disallowed",
            type: "CallExpression"
        }, {
            message: "Calling anotherObject.anotherDisallowedMethod() is disallowed",
            type: "CallExpression"
        }]
        }, {
            code: "Math.hypot(3, 4)",
            options: [[{
                object: "Math",
                method: "hypot"
            }]],
            errors: [{
                message: "Calling Math.hypot() is disallowed",
                type: "CallExpression"
            }]
        }, {
            code: "var m = Math; m.hypot(3, 4);",
            options: [[{
                object: "Math",
                method: "hypot"
            }]],
            errors: [{
                message: "Calling Math.hypot() is disallowed",
                type: "CallExpression"
            }]
        }, {
            code: "var m; m.hypot(3, 4);",
            options: [[{
                object: "*",
                method: "hypot"
            }]],
            errors: [{
                message: "Calling *.hypot() is disallowed",
                type: "CallExpression"
            }]
        }, {
            code: "var m = Math; var c = m; c.hypot(3, 4)",
            options: [[{
                object: "Math",
                method: "hypot"
            }]],
            errors: [{
                message: "Calling Math.hypot() is disallowed",
                type: "CallExpression"
            }]
        }]
});
