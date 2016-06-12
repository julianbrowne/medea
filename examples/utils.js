
var utils = (function() { 

    function prettyPrint(obj) { 
        return JSON.stringify(obj, null, 2);
    }

    function parseEventName(e) { 
        return e.type + ":" + e.namespace;
    }

    function prepContainerForCode(elementName) { 
        var wrapper = $("#" + elementName);
        wrapper.append($("<pre>"));
        wrapper.find("pre").append($("<code>"));
        return wrapper;
    }

    function findAndPrepTargetElement(elementName) { 
        var wrapper = $("#" + elementName);
        if(wrapper.find("pre").length === 0) { 
            prepContainerForCode(elementName);
        }
        return wrapper.find("code");
    }

    function logEvent(container) { 
        var target = findAndPrepTargetElement(container);
        return function(e) { 
            target.append(parseEventName(e) + "\n");
        }
    }

    function logObjectChangeEvent(container) { 
        var target = findAndPrepTargetElement(container);
        return function(e, obj) { 
            target.html(prettyPrint(obj));
        }
    }

    function prettyPrintSource(obj, container) { 
        var target = findAndPrepTargetElement(container);
        target.html(prettyPrint(obj));
    }

    var simpleObject = { 
        firstName: "John",
        lastName: "Smith"
    };

    var testObject = { 
        name: { 
            firstName: "John",
            lastName: "Smith"
        },
        personal: { 
            age: 42,
            likesIceCream: true
        },
        hobbies: [ 
            "football",
            "golf"
        ],
        address: { 
            road: { number: "1", street: "the street" },
            town: "townington",
            county: "Shireshire"
        }
    };

    return { 
        logEvent: logEvent,
        logObjectChangeEvent: logObjectChangeEvent,
        prettyPrint: prettyPrint,
        testObject: testObject,
        simpleObject: simpleObject,
        prettyPrintSource: prettyPrintSource
    };

}());
