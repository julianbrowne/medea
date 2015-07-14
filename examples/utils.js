
var utils = (function() { 

    function prettyPrint(obj) { 
        return JSON.stringify(obj, null, 2);
    }

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

        prettyPrintSource: function(json) { 
            if($("#json-source-header").length===0) { 
                $("<h2>").html("JSON Source").attr("id","json-source-header").appendTo($("body"));
            }
            if($("#json-source-contents").length===0) { 
                $("<div>").attr("id","json-source-contents").appendTo($("#json-source-header").after());
            }
            $("#json-source-contents").html("<pre><code>" + prettyPrint(json) + "</code></pre>");
        }

    };

}());

$.fn.modalise = function(id) { 
    return this.each(function(index, element) { 
        $("body").append( 
            '<div id="' + id + '" class="modal" role="dialog"> \
                <div class="modal-dialog"><div class="modal-content"> \
                        <div class="modal-header"></div>\
                        <div class="modal-body"></div>\
                        <div class="modal-footer"></div>\
                    </div>\
                </div>\
            </div>'
        );
        $(this).appendTo(".modal-body");
        $("#"+id).modal();
    });
}
