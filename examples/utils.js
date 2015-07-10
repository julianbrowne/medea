
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
            $("body").append('<h2>JSON Source</h2>');
            $("body").append('<div id="example-source"></div>');
            $("#example-source").html("<pre><code>" + prettyPrint(json) + "</code></pre>");
        }

    };

}());

$.fn.modalise = function() { 
    return this.each(function(index, element) { 
        $("body").append( 
            '<div id="example-modal" class="modal" role="dialog"> \
                <div class="modal-dialog"><div class="modal-content"> \
                        <div class="modal-header"></div>\
                        <div class="modal-body"></div>\
                        <div class="modal-footer"></div>\
                    </div>\
                </div>\
            </div>'
        );
        $(".modal-body").html($(this).html());
        $(this).remove();
        $("#example-modal").modal();
    });
}
