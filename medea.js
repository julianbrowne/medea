/**
 *  medea
 *
 *  form = $.medea(object)
 *
 *  $(selector)
 *      .medea(object)
 *      .on("submit", function(object) { 
 *          // do something with object
 *      });
 *
 *  events: shown, submit, add, delete
 *  <form>
 *      <row>
 *          <label>key</label><input/><button delete/>
 *      </row>
 *      <row>
 *        <button add/>
 *        <button cancel/>
 *        <button ok/>
 *      </row>
 *  </form>
 *
**/

(function($) { 

    var form = function() { return $("<form>"); };
    var row = function() { return $("<row>"); };
 
    $.fn.medea = function(object, options) { 
        var t = $.type(object);
        if(t!=="object") throw("not an object");
        return this.each(function(index, element) { 
            var container = $(this);
            var form = objToForm(object, options);
            form.append(buttons(element));
            container.html(form);
        });
    };

    function buttons(element) { 
        function button() { return $("<button>"); }
        var container = $("<div>").addClass("buttons");
        container.append(button().html("add"));
        container.append(button().html("cancel"));
        container.append(button().html("ok").on("click", function(e) { 
            e.preventDefault();
            $(element).trigger("submit")
            console.log(element);            
        }));
        return container;
    };

    function objToForm(obj, options) { 
        if(typeof obj === "undefined") return "";
        var options = (options === undefined) ? {} : options;
        var form = options.noForm ? $("<div>").addClass("childElement"): $("<form>");
        Object.keys(obj).forEach(function(k) { 
            var group = $("<div>").addClass("form-group");
            var label = $("<label>")
                .addClass("col-sm-3")
                .addClass("control-label")
                .addClass("text-right")
                .html(regularCase(k)+":");
            var field = (options[k] === undefined) ? primToField(obj[k], k) : primToField(options[k].data, k);
            if(field!==null) { 
                group.append(label);
                group.append(field);
                form.append(group);
            }
        });
        return form;
    };

    function regularCase(str) { 
        return str
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/\b([A-Z]+)([A-Z])([a-z])/, '$1 $2$3')
            .replace(/^./, function(str){ return str.toUpperCase(); })
    }

    function primToField(obj, name) { 

        var type = $.type(obj);

        if(type === "object") { 
            return objToForm(obj, {noForm: true});
        }

        switch(type) { 

            case "string":
                return $("<input>")
                    .addClass("col-sm-8")
                    .attr("type", "text")
                    .attr("data-json-type", type)
                    .attr("name", name)
                    .attr("value", obj);
                break;
            
            case "number": 
                return $("<input>")
                    .addClass("col-sm-8")
                    .attr("type", "number")
                    .attr("data-json-type", type)
                    .attr("name", name)
                    .attr("value", obj);
                break;
              
            case "array": 
                var container = $("<div>")
                    .addClass("form-inline")
                obj.forEach(function(element, index) { 
                    var field = primToField(element, index);
                    field.addClass("col-sm-4");
                    container.append(field);
                });
                return container;
                break;

            case "boolean": 
                return $("<input>")
                    .attr("type", "checkbox")
                    .attr("data-json-type", type)
                    .attr("name", name)
                    .attr("value", obj)
                    .prop("checked", obj);
                break;

            default: 
                console.log("No element found for type of " + type);
                return $("<div>")
                    .html("-- could not parse field --");
        }

    };

}(jQuery));
