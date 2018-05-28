
describe("Medea", function() { 

    describe("Basics", function() { 

        it("should have jQuery available", function() { 
            expect(jQuery).toBeDefined();
        });

        it("should exist", function() { 
            expect(jQuery.fn.medea).toBeDefined();
            expect(Medea).toBeDefined();
        });

    });

    describe("Utilities", function() { 

        it("should turn an empty object into an empty form", function() { 
            medeaHelper.addTestContainer("test");
            $("#test").medea({});
            expect($("#test form").length).toEqual(1);
            medeaHelper.removeTestContainer("test");
        });

        it("should clean up camelCase", function() { 
            var before = "myCamelCaseLabel";
            Medea.regularCase(before);
            expect(Medea.regularCase(before)).toEqual("My Camel Case Label");
        });

        it("should convert primitives to fields", function() { 
            function makeField(value, name) { 
                return $(Medea.primToField(value, name)).find("input");
            };
            var f = makeField(9, "nine");
            expect(f.val()).toEqual("9");
            expect(f.attr("type")).toEqual("number");
            expect(f.attr("name")).toEqual("nine");

            var f = makeField("abc", "str");
            expect(f.val()).toEqual("abc");
            expect(f.attr("type")).toEqual("text");
            expect(f.attr("name")).toEqual("str");

            var f = makeField(true, "tf");
            expect(f.val()).toEqual("true");
            expect(f.attr("type")).toEqual("checkbox");
            expect(f.attr("name")).toEqual("tf");
        });

        it("should determine integerness", function() { 
            expect(Medea.isInteger(1)).toBe(true);
            expect(Medea.isInteger(11.9)).toBe(false);
            expect(Medea.isInteger("blah")).toBe(false);
        });

    });

    describe("HTML", function() { 

        it("should make a button", function() { 
            var btnHTML = Medea.button("plus")[0].outerHTML;
            expect(btnHTML).toEqual('<button type="button" class="btn btn-plus"></button>');
        });

        it("should make an icon", function() { 
            var iconHTML = Medea.icon("plus", function() {})[0].outerHTML;
            expect(iconHTML).toEqual('<span class="glyphicon glyphicon-plus" aria-hidden="true"></span>');
        });

        it("should generate form field names", function() { 
            expect(Medea.generateFieldName("a", "b")).toEqual("b.a");
            expect(Medea.generateFieldName(99, "b")).toEqual("b[99]");
        });

        it("should make a number form", function() { 
            medeaHelper.addTestContainer("test");
            $("#test").medea({ num: 999 });
            expect(medeaHelper.formLabel().html()).toEqual("Num");
            expect(medeaHelper.formInput().attr("type")).toEqual("number");
            expect(medeaHelper.formInput().attr("data-json-type")).toEqual("number");
            expect(medeaHelper.formInput().val()).toEqual("999");
            medeaHelper.removeTestContainer("test");
        });

        it("should make a string form", function() { 
            medeaHelper.addTestContainer("test");
            $("#test").medea({ text: "abc" });
            expect(medeaHelper.formLabel().html()).toEqual("Text");
            expect(medeaHelper.formInput().attr("type")).toEqual("text");
            expect(medeaHelper.formInput().attr("data-json-type")).toEqual("string");
            expect(medeaHelper.formInput().val()).toEqual("abc");
            medeaHelper.removeTestContainer("test");
        });

        it("should make a boolean form", function() { 
            medeaHelper.addTestContainer("test");
            $("#test").medea({ amIRight: true });
            expect(medeaHelper.formLabel().html()).toEqual("Am I Right");
            expect(medeaHelper.formInput().attr("type")).toEqual("checkbox");
            expect(medeaHelper.formInput().attr("data-json-type")).toEqual("boolean");
            expect(medeaHelper.formInput().val()).toEqual("true");
            medeaHelper.removeTestContainer("test");
        });

        it("should make an array form", function() { 
            medeaHelper.addTestContainer("test");
            var list = ["a","b","c"];
            $("#test").medea({list: list});
            expect(medeaHelper.formLabel().html()).toEqual("List[0]");
            expect(medeaHelper.formInput().length).toEqual(3);
            expect(medeaHelper.formInput().attr("type")).toEqual("text");
            expect(medeaHelper.formInput().attr("data-json-type")).toEqual("string");
            medeaHelper.formInput().each(function(index) {
                expect($(this).val()).toEqual(list[index]);
            });
            medeaHelper.removeTestContainer("test");
        });

        it("should make a dynamic input field", function() { 

            medeaHelper.addTestContainer("test");
            var input = Medea.dynamicInputElement("name", "bob", "text");
            $("#test").append(input);

            var inputField = $("#test input.form-control[type=text]");
            expect(inputField.length).toEqual(1);
            expect(inputField.val()).toEqual("bob");

            // should have three buttons: toggler, delete, duplicate
            var buttons = $("div.input-group-addon");
            expect(buttons.length).toEqual(3);

            // toggle to a checkbox
            var toggleButton=$("span.glyphicon-refresh");
            toggleButton.trigger("click");
            var oldInputField = $("#test input.form-control[type=text]");
            var newInputField = $("#test input.form-control[type=checkbox]");
            expect(oldInputField.length).toEqual(0);
            expect(newInputField.length).toEqual(1);

            medeaHelper.removeTestContainer("test");
        });

        it("should handle multi-level form elements", function() { 
            medeaHelper.addTestContainer("test");
            $("#test").medea({ top: 10, level: { sub: "abc" } });
            var match = medeaHelper.matcher();
            // top level keys
            expect(match.firstLabel.html()).toEqual("Top");
            expect(match.firstInput.val()).toEqual("10");
            expect(match.allInputs.length).toEqual(2);
            expect(match.allLabels.length).toEqual(2);
            // next level keys
            expect(match.allLabels.last().html()).toEqual("Sub");
            expect(match.allInputs.last().val()).toEqual("abc");
            medeaHelper.removeTestContainer("test");
        });

        it("should have add, cancel and ok buttons", function() { 
            medeaHelper.addTestContainer("test");
            $("#test").medea({});
            expect($("#test button").length).toEqual(3);
            medeaHelper.removeTestContainer("test");
        });

    });

    describe("Modals", function() { 

        it("should throw modalise dependecy errors", function() { 
            medeaHelper.addTestContainer("test");
            var spy = spyOn(console,"error");
            var savedModal = $.extend({}, { fn: jQuery.fn.modal });
            jQuery.fn.modal = undefined;
            $("#test").medea({}, {modal: true});
            expect($("div.modal-dialog").length).toEqual(0);
            expect(spy).toHaveBeenCalled();
            jQuery.fn.modal = savedModal.fn;
            medeaHelper.removeTestContainer("test");
        });

        it("should modalise", function() { 
            medeaHelper.addTestContainer("test");
            $("#test").medea({}, {modal: true});
            expect($("div.modal-dialog").length).toEqual(1);
            expect($("#test").length).toEqual(1);
            expect($("#medea-modal").length).toEqual(0);
            medeaHelper.clearModals();
        });

    });

    describe("Conversion", function() { 

        it("should convert string form field to json", function() { 
            medeaHelper.addTestContainer("test");
            $("#test").html("<form><input type=\"text\" name=\"iceCream\" data-json-type=\"string\" value=\"99\"></form>");
            var obj = Medea.form2object("form");
            expect(obj).toEqual({ iceCream: "99" });
            medeaHelper.removeTestContainer("test");
        });

        it("should convert integer form field to json", function() { 
            medeaHelper.addTestContainer("test");
            $("#test").html("<form><input type=\"text\" name=\"iceCream\" data-json-type=\"number\" value=\"99\"></form>");
            var obj = Medea.form2object("form");
            expect(obj).toEqual({ iceCream: 99 });
            medeaHelper.removeTestContainer("test");
        });

        it("should convert array form field to json", function() { 
            medeaHelper.addTestContainer("test");
            $("#test").html("<form><input type=\"text\" name=\"hobbies[0]\" data-json-type=\"string\" value=\"tennis\"><input type=\"text\" name=\"hobbies[1]\" data-json-type=\"string\" value=\"running\"></form>");
            var obj = Medea.form2object("form");
            expect(obj).toEqual({ hobbies: ["tennis", "running"] });
            medeaHelper.removeTestContainer("test");
        });

        it("should convert float form field to json", function() { 
            medeaHelper.addTestContainer("test");
            $("#test").html("<form><input type=\"text\" name=\"pi\" data-json-type=\"number\" value=\"3.14159\"></form>");
            var obj = Medea.form2object("form");
            expect(obj).toEqual({ pi: 3.14159 });
            medeaHelper.removeTestContainer("test");
        });

        it("should convert boolean form field to json", function() { 
            medeaHelper.addTestContainer("test");
            $("#test").html("<form><input type=\"checkbox\" name=\"theCatIsDead\" data-json-type=\"boolean\" value=\"true\" checked></form>");
            var obj = Medea.form2object("form");
            expect(obj).toEqual({ theCatIsDead: true });
            medeaHelper.removeTestContainer("test");
        });

        it("should convert multi boolean form field to json", function() { 
            medeaHelper.addTestContainer("test");
            $("#test").html("<form> \
                <input type=\"checkbox\" name=\"theCatIsAlive\" data-json-type=\"boolean\" checked> \
                <input type=\"checkbox\" name=\"theCatIsDead\" data-json-type=\"boolean\" > \
            </form>");
            var obj = Medea.form2object("form");
            expect(obj).toEqual({ theCatIsAlive: true, theCatIsDead: false });
            medeaHelper.removeTestContainer("test");
        });

    });

    describe("Options", function() { 

        it("should respect 'buttons' option", function() { 
            medeaHelper.addTestContainer("test");
            $("#test").medea({});
            expect($("#test button").length).toEqual(3);
            medeaHelper.removeTestContainer("test");
            medeaHelper.addTestContainer("test");
            $("#test").medea({}, {buttons: false});
            expect($("#test button").length).toEqual(0);
            medeaHelper.removeTestContainer("test");
        });

        it("should respect 'id' option", function() { 
            medeaHelper.addTestContainer("test");
            $("#test").medea({}, {id: "sumner"});
            expect($("#sumner").length).toEqual(1);
            medeaHelper.removeTestContainer("test");
        });

        it("should respect 'labelColumns' option", function() { 
            medeaHelper.addTestContainer("test");
            $("#test").medea({ 
                testValue: 10
            }, 
            { 
                id: "sumner",
                labelColumns: 3
            });
            expect($("#sumner label").hasClass("col-sm-3")).toEqual(true);
            medeaHelper.removeTestContainer("test");
        });

        it("should respect 'inputColumns' option", function() { 
            medeaHelper.addTestContainer("test");
            $("#test").medea({
                testValue: 10
            },
            {
                id: "sumner",
                inputColumns: 8
            });
            expect($("#sumner div.form-group div").hasClass("col-sm-8")).toEqual(true);
            medeaHelper.removeTestContainer("test");
        });

        it("should respect 'noForm' option", function() { 
            medeaHelper.addTestContainer("test");
            $("#test").append($("<form>"));
            $("#test form").medea({testValue: 10}, {noForm: true});
            expect($("form").length).toEqual(1);
            medeaHelper.removeTestContainer("test");
        });

    });

    describe("Interactions", function() { 

        it("should delete a form field", function() { 
            medeaHelper.addTestContainer("test");
            var field = Medea.inputGroup("abc", 99, "text");
            $("#test").html(field);
            var input = $("#test").find("input");
            expect(input.length).toEqual(1);
            var button = $("#test").find("span.glyphicon-trash");
            expect(button.length).toEqual(1);
            button.trigger("click");
            var deleted = $("#test").find("span.glyphicon-trash");
            expect(deleted.length).toEqual(0);
            input = $("#test").find("input");
            expect(input.length).toEqual(0);
            medeaHelper.removeTestContainer("test");
        });

        it("should not submit form when enter key pressed", function() { 
            medeaHelper.addTestContainer("test");
            $("#test").medea({ fieldOne: 12345});
            var spy = spyOnEvent($("#test"), "medea.submit");
            expect($("input").length).toEqual(2);
            var e = jQuery.Event( "keypress", { keyCode: 13 } );
            $("input").trigger(e);
            expect("medea.submit").not.toHaveBeenTriggeredOn($("#test"));
            expect(spy).not.toHaveBeenTriggered();
            medeaHelper.removeTestContainer("test");
        });

        it("should process whole of parent form when noForm used", function(done) { 
            medeaHelper.addTestContainer("test");
            var container = $("#test");
            container.append($("<form>"));
            $("form").append('<label>One</label><br/>');
            $("form").append('<input type="text" data-json-type="number" value="1" name="one"><br/>');
            $("form").append('<label>Two</label><br/>');
            $("form").append('<input type="text" data-json-type="number" value="2" name="two"><br/>');
            $("form").append('<div id="insertion-point"></div>');
            var medeaContent = $("#insertion-point");
            medeaContent.medea({ three: 3, four: 4}, {noForm: true});
            medeaContent.on("medea.submit", function(e, data) { 
                expect(data.one).toEqual(1);
                expect(data.two).toEqual(2);
                expect(data.three).toEqual(3);
                expect(data.four).toEqual(4);
                done();
            });
            $("form").trigger("submit");
            medeaHelper.removeTestContainer("test");
        });

    });

});
