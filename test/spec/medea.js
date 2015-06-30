
describe("Medea", function() { 

    it("should have jQuery available", function() { 
        expect(jQuery).toBeDefined();
    });

    it("should exist", function() { 
        expect(jQuery.fn.medea).toBeDefined();
        expect(Medea).toBeDefined();
    });

    it("should error if input is not an object", function() { 
        expect(function() { $("body").medea(999); }).toThrow("not an object");
    });

    it("should turn an empty object into an empty form", function() { 
        medeaHelper.addTestContainer("test");
        expect($("#test").length).toEqual(1);
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

    it("should make a number form", function() { 
        medeaHelper.addTestContainer("test");
        expect($("#test").length).toEqual(1);
        $("#test").medea({ num: 999 });
        expect($("#test div label").html()).toEqual("Num");
        expect($("#test div input").attr("type")).toEqual("number");
        expect($("#test div input").attr("data-json-type")).toEqual("number");
        expect($("#test div input").val()).toEqual("999");
        medeaHelper.removeTestContainer("test");
    });

    it("should make a string form", function() { 
        medeaHelper.addTestContainer("test");
        expect($("#test").length).toEqual(1);
        $("#test").medea({ text: "abc" });
        expect($("#test div label").html()).toEqual("Text");
        expect($("#test div input").attr("type")).toEqual("text");
        expect($("#test div input").attr("data-json-type")).toEqual("string");
        expect($("#test div input").val()).toEqual("abc");
        medeaHelper.removeTestContainer("test");
    });

    it("should make a boolean form", function() { 
        medeaHelper.addTestContainer("test");
        expect($("#test").length).toEqual(1);
        $("#test").medea({ amIRight: true });
        expect($("#test div label").html()).toEqual("Am I Right");
        expect($("#test div input").attr("type")).toEqual("checkbox");
        expect($("#test div input").attr("data-json-type")).toEqual("boolean");
        expect($("#test div input").val()).toEqual("true");
        medeaHelper.removeTestContainer("test");
    });

    it("should make an array form", function() { 
        medeaHelper.addTestContainer("test");
        expect($("#test").length).toEqual(1);
        var list = ["a","b","c"];
        $("#test").medea({list: list});
        expect($("#test div label").html()).toEqual("[0]");
        expect($("#test div input").length).toEqual(3);
        expect($("#test div input").attr("type")).toEqual("text");
        expect($("#test div input").attr("data-json-type")).toEqual("string");
        $("#test div input").each(function(index) {
            expect($(this).val()).toEqual(list[index]);
        });
        medeaHelper.removeTestContainer("test");
    });

    it("should handle multi-level form elements", function() { 
        medeaHelper.addTestContainer("test");
        expect($("#test").length).toEqual(1);
        $("#test").medea({ top: 10, level: { sub: "abc" } });
        expect($("#test form div label").html()).toEqual("Top");
        expect($("#test div input").val()).toEqual("10");
        expect($("#test div input").length).toEqual(2);
        expect($("#test form div.section div div.form-group label").html()).toEqual("Sub");
        expect($("#test form div.section div div input").val()).toEqual("abc");
        medeaHelper.removeTestContainer("test");
    });

    it("should have add, cancel and ok buttons", function() { 
        medeaHelper.addTestContainer("test");
        expect($("#test").length).toEqual(1);
        $("#test").medea({});
        expect($("#test button").length).toEqual(3);
        medeaHelper.removeTestContainer("test");
    });

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

    it("should warn when no selection present", function() { 
        medeaHelper.addTestContainer("test");
        var spy = spyOn(console,"warn");
        var obj = Medea.form2object("#nonexistent");
        expect(obj).toEqual({});
        expect(spy).toHaveBeenCalled();
        medeaHelper.removeTestContainer("test");
    });

    it("should warn when no inputs fields are present", function() { 
        medeaHelper.addTestContainer("test");
        $("#test").html("<form><span></span></form>");
        var spy = spyOn(console,"warn");
        var obj = Medea.form2object("#test");
        expect(obj).toEqual({});
        expect(spy).toHaveBeenCalled();
        medeaHelper.removeTestContainer("test");
    });

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

    it("should respect 'buttons' option", function() { 
        medeaHelper.addTestContainer("test");
        expect($("#test").length).toEqual(1);
        $("#test").medea({});
        expect($("#test button").length).toEqual(3);
        medeaHelper.removeTestContainer("test");
        medeaHelper.addTestContainer("test");
        expect($("#test").length).toEqual(1);
        $("#test").medea({}, {buttons: false});
        expect($("#test button").length).toEqual(0);
        //medeaHelper.removeTestContainer("test");
    });

    it("should respect 'id' option", function() { 
        medeaHelper.addTestContainer("test");
        expect($("#test").length).toEqual(1);
        $("#test").medea({}, {id: "sumner"});
        expect($("#sumner").length).toEqual(1);
        medeaHelper.removeTestContainer("test");
    });

    it("should respect 'labelColumns' option", function() { 
        medeaHelper.addTestContainer("test");
        expect($("#test").length).toEqual(1);
        $("#test").medea({testValue: 10}, {labelColumns: 3});
        expect($("#sumner label").hasClass("col-sm-3")).toEqual(true);
        medeaHelper.removeTestContainer("test");
    });

    it("should respect 'inputColumns' option", function() { 
        medeaHelper.addTestContainer("test");
        expect($("#test").length).toEqual(1);
        $("#test").medea({testValue: 10}, {inputColumns: 8});
        expect($("#sumner div.form-group div").hasClass("col-sm-8")).toEqual(true);
        medeaHelper.removeTestContainer("test");
    });

    it("should respect 'noForm' option", function() { 
        medeaHelper.addTestContainer("test");
        expect($("#test").length).toEqual(1);
        $("#test").medea({testValue: 10}, {noForm: true});
        expect($("form").length).toEqual(0);
        medeaHelper.removeTestContainer("test");
    });

    it("should fire 'submit.medea.form' event on form submit", function() { 
        medeaHelper.addTestContainer("test");
        $("#test").medea({ fieldOne: 55});
        var spy = spyOnEvent($("#test"), "submit.medea.form");
        $("form").trigger("submit");
        expect("submit.medea.form").toHaveBeenTriggeredOn($("#test"));
        expect(spy).toHaveBeenTriggered();
        medeaHelper.removeTestContainer("test");
    });

    it("should not submit form when enter key pressed", function() { 
        medeaHelper.addTestContainer("test");
        $("#test").medea({ fieldOne: 55});
        var spy = spyOnEvent($("#test"), "submit.medea.form");
        expect($("input").length).toEqual(1);
        var e = jQuery.Event( "keypress", { keyCode: 13 } );
        $("input").trigger(e);
        expect("submit.medea.form").not.toHaveBeenTriggeredOn($("#test"));
        expect(spy).not.toHaveBeenTriggered();
        medeaHelper.removeTestContainer("test");
    });

    it("should map form into object even without form tag", function() { 
        medeaHelper.addTestContainer("test");
        $("#test").medea({ one: { two: 55} }, {noForm: true});
        var obj = Medea.form2object(".medea-root");
        expect(obj).toEqual({ one: { two: 55} });
        medeaHelper.removeTestContainer("test");
    });

});
