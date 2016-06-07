
var utils = (function() { 

    return { 

        testObject: { 
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
        },

        prettyPrint: function(obj) { 
            return JSON.stringify(obj, null, 2);
        },

        prettyPrintSource: function(obj, target) { 

            var target = (target === undefined) ? "json-source" : target;
            var selector = "#" + target;

            if($(selector).length===0) { 
                $("<div>")
                    .attr("id",target)
                    .appendTo($("body"));
            }

            $(selector).empty();

            $("<div>")
                .attr("id", "json-source-contents")
                .appendTo(selector);

            $("#json-source-contents")
                .html("<pre><code>" + JSON.stringify(obj, null, 2) + "</code></pre>");
        }

    };

}());
