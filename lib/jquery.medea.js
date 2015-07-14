/**
 *  Medea
 *
**/

window.Medea = (function($) { 

    "use strict";

    var options = {};

    var defaults = { 
        removeOnSubmit: false, 
        buttons: true,
        labelColumns: 2,
        inputColums: 10,
        noForm: false
    };

    var events = { 
        MEDEA_SUBMITTED: "medea.submit",
        MEDEA_FIELD_ADDED: "medea.add",
        MEDEA_CANCELLED: "medea.cancel"
    }

    var elements = { 
        container: null,
        form: null
    }

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
        if(form.length === 0) { 
            console.warn("medea.form2object: no form found at %s", selector);
            return {}; 
        }
        delimiter = delimiter || ".";
        var formValues = form.find(":input").serializeArray();
        var checkBoxValues = form.find("input[type=checkbox]:not(:checked)")
            .map(function() { 
                return { "name": this.name, "value": $(this).is(":checked") } 
            }).get();
        formValues = formValues.concat(checkBoxValues);
        if(formValues.length === 0) {
            console.warn("medea.form2object: no input fields found at %s", selector);
            return {}; 
        }
        var result = {};
        var arrays = {};
        for(var i = 0; i < formValues.length; i++) { 
            var value = formValues[i].value;
            var inputField = form.find("input[name='" + formValues[i].name + "']");
            //console.log(inputField.length);
            if(inputField.attr("data-json-type")==="number") { 
                if( (value % 1) !== 0) { 
                    value = parseFloat(value);
                }
                else { 
                    value = parseInt(value);
                }
            }
            if(inputField.attr("data-json-type")==="boolean") { 
                var lc = value.toString().toLowerCase();
                value = (lc === "true"||lc === "on") ? true : false;
            }
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
        var btn = $("<button>")
            .attr("type", "button")
            .addClass("btn");
        if(context) { btn.addClass("btn-" + context); }
        return btn;
    }

    function buttons(container) { 

        var wrapper = $("<div>").addClass("form-group");
        var subContainer = $("<div>").addClass("col-sm-offset-" + options.labelColumns + " col-sm-" + options.inputColumns);

        var addButton = button("info").html("add").attr("id", "medea-add-btn");
        $("body").on("click", "#medea-add-btn", function(e) { 
            e.stopPropagation();
            var result = container.triggerHandler(events.MEDEA_FIELD_ADDED);
        });
        subContainer.append(addButton);

        var cancelButton = button("warning").html("cancel").attr("id", "medea-cancel-btn");
        $("body").on("click", "#medea-cancel-btn", function(e) { 
            e.stopPropagation();
            var targetFormFields = container.find(".medea-root");
            var processedObject = form2object(elements.form);
            var result = container.triggerHandler(events.MEDEA_CANCELLED, [ processedObject ]);
            //container.empty();
        });
        subContainer.append(cancelButton);

        var okButton = button("primary").html("ok").attr("id", "medea-ok-btn");
        $("body").on("click", "#medea-ok-btn", function(e) { 
            e.stopPropagation();
            var targetFormFields = container.find(".medea-root");
            var processedObject = form2object(elements.form);
            var result = container.triggerHandler(events.MEDEA_SUBMITTED, [ processedObject ]);
        });
        subContainer.append(okButton);

        wrapper.append(subContainer);
        return wrapper;
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

    function inputGroup(name, value, inputType, trash) { 
        inputType = (typeof inputType === "undefined") ? "text" : inputType;
        trash = (typeof trash === "undefined") ? true : false;
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
        inputGroupHTML.append(f)
        if(trash) inputGroupHTML.append(inputGroupAddon(b));
        return inputGroupHTML;
    }

    function inputTogglerGroup(name, value, inputType) { 
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
        var b = icon("option-vertical", function(e) { 
            var inputTypes = [ 
                {type: "text", jsonType: "string", value: "", placeholder: "enter new value here"},
                {type: "checkbox", jsonType: "boolean", value: null, placeholder: null}
            ];
            var inputNow = $(e.target).parent().prev();
            var typeNow = inputNow.attr("type");
            var indexOfTypeNow = inputTypes.map(function(i) { return i.type; }).indexOf(typeNow);
            var nextType = (indexOfTypeNow + 1 > inputTypes.length - 1) ? 0 : (indexOfTypeNow + 1);
            inputNow.attr("type", inputTypes[nextType].type);
            inputNow.attr("data-json-type", inputTypes[nextType].jsonType);
            inputNow.attr("value", inputTypes[nextType].value);
            inputNow.attr("placeholder", inputTypes[nextType].placeholder);
        }).addClass("text-danger");
        inputGroupHTML.append(f)
        inputGroupHTML.append(inputGroupAddon(b));
        return inputGroupHTML;
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
        var html = (level === 0) ? formTag.addClass("medea-root").addClass("form-horizontal") : $("<div>");

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
                        .addClass("section");
                    // indent as per level within the original object
                    section.addClass("col-sm-offset-" + options.labelColumns+level);
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
                var inputGroup = $("<div>").addClass("col-sm-" + options.inputColumns);
                inputGroup.append(primToField(element.value, element.fieldName));
                formGroup.append(inputGroup);
                html.append(formGroup);
            }
        }

        return html;

    }

    function findFormParent(content) { 

        if(options.noForm) { 
            var pageFormContainer = content.closest("form"); 
        }
        else { 
            var pageFormContainer = content;
        }

        if(pageFormContainer.length === 0) { 
            console.error("no FORM tag found. Events will not work.");
            return null;
        }
        return pageFormContainer;
    }

    function dynamicInputElement() { 

        function saveAndExit(e) { 
            var editor = $(e.target);
            var label = editor && editor.prev();
            label.text(editor.val());
            editor.addClass("hidden");
            label.removeClass("hidden");
            var input = $("input").eq($("input").index(this) + 1);
            input.attr("name", editor.val());
        }

        var formGroup = $("<div>").addClass("form-group");
        var inputName = inputGroup("name", "value", "text", false);
        var label = $("<label>")
            .addClass("col-sm-" + options.labelColumns)
            .addClass("control-label")
            .addClass("editable")
            .html("click-and-edit-me")
            .on("click", function () { 
                $(this).addClass("hidden");
                $(this).next().removeClass("hidden").focus();
            });
        var editor = $("<input>")
            .addClass("editor")
            .addClass("col-sm-" + options.labelColumns)
            .addClass("control-label")
            .addClass("hidden")
            .attr("type", "text")
            .focusout(saveAndExit)
            .keyup(function(e) { 
                if((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) { 
                    saveAndExit(e);
                    return false;
                }
                else { 
                    return true;
                }
            });
        formGroup.append(label);
        formGroup.append(editor);
        var inputValueWrapper = $("<div>").addClass("col-sm-" + options.inputColumns);
        var inputTextBox = inputTogglerGroup("name", "", "text");
        inputTextBox.find("input").attr("placeholder", "new field value here")
        inputValueWrapper.append(inputTextBox);
        formGroup.append(inputValueWrapper);
        return formGroup;
    }

    function addEventHandlers(container) { 
        container.on(events.MEDEA_FIELD_ADDED, function(e) { 
            elements.form.prepend(dynamicInputElement());
        });

        container.on(events.MEDEA_CANCELLED, function(e, obj) { 
            // internal handler for edit cancel
        });

        container.on(events.MEDEA_SUBMITTED, function(e, obj) { 
            // internal handler for form submit
        });        
    }

    $.fn.medea = function(object, opts) { 

        $.extend(options, defaults, (opts||{}) );

        if($.type(object) !== "object") { 
            throw "not an object";
        }

        return this.each(function(index, element) { 

            var container = $(this);
            addEventHandlers(container);
            var medeaFieldsHTML = objToForm(object);
            var insertedContent = container.html(medeaFieldsHTML).find(".medea-root");

            if(options.id) { 
                insertedContent.attr("id", options.id);
            }

            elements.form = findFormParent(insertedContent);

            if(elements.form!==null) { 

                elements.form.on("submit", function(e) { 
                    e.preventDefault();
                    var targetFormFields = container.find(".medea-root");
                    var processedObject = form2object(elements.form);
                    var result = container.triggerHandler(events.MEDEA_SUBMITTED, [ processedObject ]);
                });

                if(options.buttons) { 
                    var buttonRow = buttons(container);
                    insertedContent.append(buttonRow);
                }

            }

        });
    };

    return { 
        regularCase: regularCase,
        primToField: primToField,
        form2object: form2object,
        inputGroup: inputGroup,
        button: button,
        isInteger: isInteger,
        generateFieldName: generateFieldName
    };

}(jQuery));
