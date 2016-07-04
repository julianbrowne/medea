/**
 *  Medea
**/

window.Medea = (function($) { 

    "use strict";

    var options = {};

    var defaults = { 
        removeOnSubmit: false, 
        buttons: true,
        labelColumns: 2,
        inputColumns: 10,
        noForm: false,
        modal: false,
        modalId: "medea-modal"
    };

    var events = { 
        MEDEA_FIELD_ADD: "medea.add",
        MEDEA_SUBMITTED: "medea.submit",
        MEDEA_CANCELLED: "medea.cancel",
        MEDEA_TOGGLE:    "medea.toggle"
    };

    var elements = { 
        container: null,
        form: null
    };

    var css = { 
        formRowClass: "medea-form-data-row",
        buttonRowClass: "medea-form-buttons-row",
    };

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
                            if(!isInteger(currResult)) { 
                                currResult[namePart] = value;
                            }
                            else { 
                                // @todo: raise proper (useful) error event
                                console.error("invalid object");
                            }
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

        var wrapper = $("<div>")
            .addClass("section")
            .addClass("form-group")
            .addClass(css.buttonRowClass);

        var buttonRowWrapper = $("<div>")
            //.addClass("col-sm-offset-" + options.labelColumns + " col-sm-" + options.inputColumns)
            .addClass("form-group");

        var buttonWrapperLeft = $("<div>")
            .addClass("pull-left")
            .addClass("btn-toolbar");

        var addNewFieldButton = button("success")
            .html("+")
            .addClass("pull-left")
            .attr("id", "medea-add-btn");

        $("body").on("click", "#medea-add-btn", function(e) { 
            e.stopPropagation();
            var result = container.triggerHandler(events.MEDEA_FIELD_ADD);
        });

        buttonWrapperLeft.append(addNewFieldButton);

        var buttonWrapperRight = $("<div>")
            .addClass("pull-right")
            .addClass("btn-toolbar");

        var cancelButton = button("default")
            .html("cancel")
            //.addClass("btn-block")
            .attr("id", "medea-cancel-btn");

        $("body").on("click", "#medea-cancel-btn", function(e) { 
            e.stopPropagation();
            var targetFormFields = container.find(".medea-root");
            var processedObject = form2object(elements.form);
            var result = container.triggerHandler(events.MEDEA_CANCELLED, [ processedObject ]);
        });

        buttonWrapperRight.append(cancelButton);

        var okButton = button("primary")
            .html("ok")
            //.addClass("btn-block")
            .attr("id", "medea-ok-btn");

        $("body").on("click", "#medea-ok-btn", function(e) { 
            e.stopPropagation();
            var targetFormFields = container.find(".medea-root");
            var processedObject = form2object(elements.form);
            var result = container.triggerHandler(events.MEDEA_SUBMITTED, [ processedObject ]);
        });

        buttonWrapperRight.append(okButton);

        buttonRowWrapper.append(buttonWrapperLeft);
        buttonRowWrapper.append(buttonWrapperRight);
        wrapper.append(buttonRowWrapper);

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

    function cloneButton() { 

        return icon("duplicate", function() { 

            var formGroup = $(this).closest("div.form-group");
            var inputFieldToClone = formGroup.find("input.form-control");

            var name = inputFieldToClone.attr("name");
            var value = inputFieldToClone.val();
            var type = inputFieldToClone.attr("type");

            formGroup.after(dynamicInputElement(name, value, type));

        }).addClass("text-danger");

    }

    function trashButton() { 
        return icon("trash", function() { 
            $(this).closest("div.form-group").find("input.editor").remove();
            $(this).closest("div.form-group").find("label.control-label").css("text-decoration", "line-through");
            $(this).closest("div.form-group").find("label.control-label").off("click");
            $(this).closest("div.input-group").empty();
        }).addClass("text-danger");
    }

    function togglerButton() { 
        return icon("option-vertical", function(e) { 
            var inputTypes = [ 
                {type: "text", jsonType: "string", value: "", placeholder: "enter new value here"},
                {type: "checkbox", jsonType: "boolean", value: null, placeholder: null}
            ];
            var inputNow = $(e.target).closest("div.input-group").find("input");
            elements.container.triggerHandler(events.MEDEA_TOGGLE, $(this));            
            var typeNow = inputNow.attr("type");
            var indexOfTypeNow = inputTypes.map(function(i) { return i.type; }).indexOf(typeNow);
            var nextType = (indexOfTypeNow + 1 > inputTypes.length - 1) ? 0 : (indexOfTypeNow + 1);
            inputNow.attr("type", inputTypes[nextType].type);
            inputNow.attr("data-json-type", inputTypes[nextType].jsonType);
            inputNow.attr("value", inputTypes[nextType].value);
            inputNow.attr("placeholder", inputTypes[nextType].placeholder);
        }).addClass("text-danger");
    }

    /**
     *  Generates editable <label> element
     *  name is absolute field path, i.e. address.road.number
    **/

    function editableLabelFieldGroup(name) { 

        function saveLabelAndExit(e) { 

            var labelEditInputElement = $(e.target);
            var labelElement = labelEditInputElement && labelEditInputElement.prev();
            var inputFieldElement = $("input").eq($("input").index(this) + 1);

            var fullLabelPath = labelEditInputElement.val();
            var niceLabelText = regularCase(fullLabelPath.split(/\./).pop());

            labelEditInputElement
                //.attr("name", fullLabelPath)
                //.attr("value", fullLabelPath)
                .addClass("hidden");

            labelElement
                .html(niceLabelText)
                .attr("for", fullLabelPath)
                .removeClass("hidden");

            inputFieldElement
                .attr("name", fullLabelPath);

        }

        var label = $("<label>")
            .addClass("col-sm-" + options.labelColumns)
            .addClass("control-label")
            .addClass("editable")
            .attr("for", name)
            .html(regularCase(name.split(/\./).pop()))
            .on("click", function () { 
                $(this).addClass("hidden");
                $(this).next().html($(this).html());
                $(this).next()
                    .removeClass("hidden")
                    .focus()
                    .select();
            });

        var input = $("<input>")
            .addClass("editor")
            .addClass("col-sm-" + options.labelColumns)
            .addClass("control-label")
            .addClass("hidden")
            .attr("type", "text")
            .attr("value", name)
            .focusout(saveLabelAndExit)
            .keyup(function(e) { 
                if((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) { 
                    saveLabelAndExit(e);
                    return false;
                }
                else { 
                    return true;
                }
            });

        return $("<div>").append(label).append(input);

    }

    function inputFieldElement(name, value, type) { 

        var name = name ? name : "name";
        var value = value ? value : "";
        var type = type ? type : "text";

        var inp = $("<input>")
            .addClass("form-control")
            .attr("type", type)
            .attr("data-json-type", $.type(value))
            .attr("name", name)
            .attr("value", value)
            .attr("placeholder", "- new value here -");

        if(type === "checkbox") { 
            inp.prop("checked", value);
        }

        return inp;

    }

    function inputGroup(name, value, type) { 
        var inputGroupHTML = $("<div>").addClass("input-group");
        inputGroupHTML.append(inputFieldElement(name, value, type));
        inputGroupHTML.append(inputGroupAddon(cloneButton()));
        inputGroupHTML.append(inputGroupAddon(togglerButton()));
        inputGroupHTML.append(inputGroupAddon(trashButton()));
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

                    var section = $("<div>")
                        .addClass("section")
                        .addClass(css.formRowClass);

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
                var formGroup = $("<div>")
                    .addClass(css.formRowClass)
                    .addClass("form-group");
                formGroup.append(editableLabelFieldGroup(element.fieldName));
                var inputGroup = $("<div>").addClass("col-sm-" + options.inputColumns);
                inputGroup.append(primToField(element.value, element.fieldName));
                formGroup.append(inputGroup);
                html.append(formGroup);
            }
        }

        return html;

    }

    function medeaStyle() { 
        return $("<style>")
            .attr("id", "medea-style")
            .append(".input-group-addon { padding: 6px 2px; }")
            .append(".input-group-addon { background-color: transparent; }")
            .append(".btn:focus { outline: none; }")
            .append("." + css.buttonRowClass + " { padding: 0px 50px; }\n")
            .append("input.form-control[type='checkbox']{ box-shadow: none; }");
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



    function dynamicInputElement(name, value, type) { 

        var name = name ? name : "newField";
        var value = value ? value : "";
        var type = type ? type : "text";

        var wrapper = $("<div>")
            .addClass("form-group")
            .append(editableLabelFieldGroup(name));

        var inputFieldElementWrapper = $("<div>")
            .addClass("col-sm-" + options.inputColumns)
            .append(inputGroup(name, value, type));

        wrapper.append(inputFieldElementWrapper);

        return wrapper;
    }

    function addEventHandlers(container) { 

        container.on(events.MEDEA_FIELD_ADD, function(e) { 
            var lastRow = elements.form.find("> " + css.formRowClass).last();
            // there's no last row in an empty form
            if(lastRow.length === 0) { 
                lastRow = elements.form.find("div." + css.buttonRowClass);
                lastRow.before(dynamicInputElement());
            }
            else { 
                lastRow.after(dynamicInputElement());
            }
        });

        /** Form field toggle from one form to another **/

        container.on(events.MEDEA_TOGGLE, function(e, obj) { 

        });

        /** POST EVENT HANDLERS **/

        container.on(events.MEDEA_CANCELLED, function(e, obj) { 
            //console.log(e, obj);
        });

        container.on(events.MEDEA_SUBMITTED, function(e, obj) { 
            //console.log(e, obj);
        });        
    }

    function modalise(parent) { 

        if((typeof jQuery === "undefined") || (typeof jQuery.fn.modal === "undefined")) { 
            console.error("medea: modal option used with no jquery/bootstrap");
            return;
        }

        var modal = $("<div>")
            .attr("id", options.modalId)
            .attr("role", "dialog")
            .addClass("fade")
            .addClass("modal");

        var modalDialog = $("<div>")
            .addClass("modal-dialog")
            .addClass("modal-lg");

        var modalContent = $("<div>")
            .addClass("modal-content");

        var modalHeader = $("<div>")
            .addClass("modal-header")
            .append($("<button>")
                .attr("type", "button")
                .addClass("close")
                .attr("data-dismiss", "modal")
                .attr("aria-label", "close")
                .append($("<span>")
                    .attr("aria-hidden", "true")
                    .html("&times")))
            .append($("<h4>")
                .addClass("modal-title")
                .html("Medea Example"));

        var modalBody = $("<div>")
            .addClass("modal-body");

        var modalFooter = $("<div>")
            .addClass("modal-footer");

        modalContent
            .append(modalHeader)
            .append(modalBody)
            .append(modalFooter);

        modalDialog.append(modalContent);

        modal.append(modalDialog);
        $("body").append(modal);
        parent.detach().appendTo(modalBody);
        $("#" + options.modalId).modal();

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

            if($("#medea-style").length === 0) { 
                $("head").append(medeaStyle());
            }

            if(options.id) { 
                insertedContent.attr("id", options.id);
            }

            elements.form = findFormParent(insertedContent);
            elements.container = container;

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

            if(options.modal) { 
                modalise(container); 
            }

        });
    };

    return { 
        regularCase: regularCase,
        primToField: primToField,
        form2object: form2object,
        inputGroup: inputGroup,
        button: button,
        icon: icon,
        isInteger: isInteger,
        generateFieldName: generateFieldName,
        dynamicInputElement: dynamicInputElement
    };

}(jQuery));
