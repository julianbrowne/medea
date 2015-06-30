/**
 *  Medea
 *
**/

window.Medea = (function($) { 

    "use strict";

    function defaultValue(value, def) { 
        return (typeof value === "undefined") ? def : value;
    }

    function regularCase(str) { 
        if(str === null) { return ""; }
        return str
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .replace(/\b([A-Z]+)([A-Z])([a-z])/, "$1 $2$3")
            .replace(/^./, function(s){ return s.toUpperCase(); });
    }

    function form2object(selector, delimiter) { 
        var form = $(selector);
        if(form.length === 0) { return {}; }
        delimiter = delimiter || ".";
        var formValues = form.serializeArray();
        var result = {};
        var arrays = {};
        for(var i = 0; i < formValues.length; i++) { 
          var value = formValues[i].value;
          if (value === "") { continue; }
          var name = formValues[i].name;
          var nameParts = name.split(delimiter);
          var currResult = result;
          for (var j = 0; j < nameParts.length; j++) { 
                var namePart = nameParts[j];
                var arrName;
                if(namePart.indexOf("[]") > -1 && j === nameParts.length - 1) { 
                      arrName = namePart.substr(0, namePart.indexOf("["));
                      if (!currResult[arrName]) { currResult[arrName] = []; }
                      currResult[arrName].push(value);
                }
                else { 
                    if(namePart.indexOf("[") > -1) { 
                        arrName = namePart.substr(0, namePart.indexOf("["));
                        var arrIdx = namePart.replace(/^[a-z]+\[|\]$/gi, "");
                        if(!arrays[arrName]) { 
                            arrays[arrName] = {};
                        }
                        if(!currResult[arrName]) { 
                            currResult[arrName] = [];
                        }
                        if(j === nameParts.length - 1) { 
                            currResult[arrName].push(value);
                        }
                        else { 
                            if(!arrays[arrName][arrIdx]) { 
                                currResult[arrName].push({});
                                arrays[arrName][arrIdx] = currResult[arrName][currResult[arrName].length - 1];
                            }
                        }
                        currResult = arrays[arrName][arrIdx];
                    }
                    else { 
                        if(j < (nameParts.length - 1)) { 
                            if (!currResult[namePart]) { currResult[namePart] = {}; }
                            currResult = currResult[namePart];
                        }
                        else { 
                            currResult[namePart] = value;
                        }
                    }
                }
            }
        }
        return result;
    }

    function button(context) { 
        var b = $("<button>").attr("type", "button").addClass("btn");
        if(context) { 
            b.addClass("btn-" + context);
        }
        return b;
    }

    function buttons(element) { 
        var container = $("<div>").addClass("form-group");
        var subContainer = $("<div>").addClass("col-sm-offset-" + options.labelColumns + " col-sm-" + options.inputColumns);
        subContainer.append(button("info").html("add").on("click", function(e) { 
            e.preventDefault();
            $(element).trigger("add");
        }));
        subContainer.append(button("warning").html("cancel").on("click", function(e) { 
            e.preventDefault();
            $(element).trigger("cancel", [ form2object($(element).find("form")) ]);
            $(element).empty();
        }));
        subContainer.append(button("primary").html("ok").on("click", function(e) { 
            e.preventDefault();
            $(element).trigger("submit");
        }));
        container.append(subContainer);
        return container;
    }

    function isInteger(inty) { 
        if(inty === null || inty === undefined) { return false; }
        return ((inty - 0) === parseInt(inty));
    }

    function generateFieldName(field, parentField) { 
        if(isInteger(field)) { 
            return (parentField) ? parentField + "[" + field + "]" : "[" + field + "]";
        }
        else { 
            return (parentField) ? parentField + "." + field : field;
        }
    }

    function guid(prefix) { 
        if(typeof prefix === "undefined") { prefix = "id-"; }
        var fourChars = function() { return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1).toUpperCase(); };
        return (prefix + fourChars() + fourChars() + "-" + fourChars() + "-" + fourChars() + "-" + fourChars() + "-" + fourChars() + fourChars() + fourChars());
    }

    function Folder(obj, field) { 
        this.id = guid("key-");
        this.parent = obj;
        this.name = field;
        this.value = obj[field];
        this.type = $.type(this.value);
        switch(this.type) { 
            case "object":
                this.key = isInteger(this.name) ? "{}" : this.name;
                break;
            case "array":
                this.key = isInteger(this.name) ? "[]" : this.name;
                break;
            default:
                this.key = this.type;
        }
    }

    function emptyFolder(folder) { 
        var fieldset = $("<fieldset>");
        var legend = $("<legend>").html(folder.key);
        var folderText = (folder.type === "array") ? "[]" : "{}";
        var div = $("<div>").html(folderText);
        fieldset.append(legend);
        fieldset.append(div);
        return fieldset;
    }

    function generateMarker(key, value) { 
        var div = $("<div>");
        var span1 = $("<span>").html(key);
        var span2 = $("<span>").html(":");        
        var span3 = $("<span>").html(value);
        div.append(span1);
        div.append(span2);
        div.append(span3);
        return div;
    }

    function inputGroupAddon(content) { 
        return $("<div>").addClass("input-group-addon").html(content);
    }

    function icon(glyph, func) {
        var iconHTML = $("<span>")
            .addClass("glyphicon")
            .addClass("glyphicon-" + glyph)
            .attr("aria-hidden", "true");
        if(typeof func !== "undefined") { 
            iconHTML.on("click", func);
        }
        return iconHTML;
    }

    function inputGroup(name, value, inputType) { 
        inputType = (typeof inputType === "undefined") ? "text" : inputType;
        var inputGroupHTML = $("<div>").addClass("input-group");
        var f = $("<input>")
            .addClass("form-control")
            .attr("type", inputType)
            .attr("data-json-type", $.type(value))
            .attr("name", name)
            .attr("value", value);
        if(inputType === "checkbox") { 
            f.prop("checked", value);
        }
        var b = icon("trash", function() { 
            $(this).closest("div.input-group").html("-deleted-"); 
        }).addClass("text-danger");
        return inputGroupHTML
            .append(f)
            .append(inputGroupAddon(b));
    }

    function primToField(obj, name) { 

        var type = $.type(obj);

        switch(type) { 

            case "string":  return inputGroup(name, obj, "text");
            case "number":  return inputGroup(name, obj, "number");
            case "boolean": return inputGroup(name, obj, "checkbox");

            case "array": 
                var container = $("<div>")
                    .addClass("form-inline");
                obj.forEach(function(element, index) { 
                    var field = primToField(element, index);
                    container.append(field);
                });
                return container;

            default: 
                //console.log("No element found for type of " + type);
                return $("<div>")
                    .html("-- could not parse field --");
        }

    }

    function objToForm(jsObj, parentField, level) { 

        level = defaultValue(level, 0);
        parentField = defaultValue(parentField, null);
        var formTag = options.noForm ? $("<div>") : $("<form>");
        var html = (level === 0) ? formTag.addClass("form-horizontal") : $("<div>");

        //console.log("object: %s: %s", level, JSON.stringify(jsObj));

        for(var field in jsObj) { 

            var fieldValue = jsObj[field];
            var fieldType = $.type(fieldValue);
            var fieldName = generateFieldName(field, parentField);

            //console.log("field: %s/%s/%s", fieldValue, fieldType, fieldName);

            if(fieldType === "object" || fieldType === "array") { 
                var folder = new Folder(jsObj, field);
                if(Object.keys(folder.value).length === 0) { 
                    html.append(emptyFolder(folder));
                }
                else { 
                    //console.log("field type: %s", fieldType);
                    var section = $("<div>")
                        .addClass("section")
                        .addClass("col-sm-offset-" + options.labelColumns);
                    var sectionTitle = $("<div>")
                        .addClass("section-title")
                        .html(regularCase(fieldName));
                    section.append(sectionTitle);
                    section.append(objToForm(fieldValue, fieldName, ++level));
                    html.append(section);
                }
            }
            else { 
                var element = {};
                var ctr = ++ctr || 0;
                element.type = fieldType;
                element.key = isInteger(field) ? "[" + ctr + "]" : field;
                element.value = fieldValue;
                element.fieldName = fieldName;
                element.src = generateMarker(regularCase(element.key), element.value);

                var formGroup = $("<div>").addClass("form-group");
                var label = $("<label>")
                    .addClass("col-sm-" + options.labelColumns)
                    .addClass("control-label")
                    .attr("for", element.fieldName)
                    .html(regularCase(element.key));
                formGroup.append(label);
                var inputGroup = $("<div>").addClass("row col-sm-" + options.inputColumns);
                inputGroup.append(primToField(element.value, element.fieldName));
                formGroup.append(inputGroup);
                html.append(formGroup);
            }
        }

        return html;

    }

    var options = {};

    var defaults = { 
        removeOnSubmit: false, 
        buttons: true,
        labelColumns: 2,
        inputColums: 10,
        noForm: false
    };

    $.fn.medea = function(object, opts) { 
        $.extend(options, defaults, (opts||{}) );
        if($.type(object) !== "object") { 
            throw "not an object";
        }
        return this.each(function(index, element) { 
            //console.log(element);
            var container = $(this);
            var form = objToForm(object);

            if(options.buttons) { form.append(buttons(element)); }
            if(options.id) { form.attr("id", options.id); }

            container.html(form);
            container.on("submit", function(e) { 
                e.preventDefault();
                container.trigger("submit.medea.form", [ form2object($(element).find("form")) ]);
                if(options.removeOnSubmit) { 
                    container.empty();
                }
            });
        });
    };

    return { 
        regularCase: regularCase,
        primToField: primToField,
        form2object: form2object,
        inputGroup: inputGroup
    };

}(jQuery));
