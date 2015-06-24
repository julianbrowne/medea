
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

    it("should convert form to json", function() { 
        // @todo: extend test with sophisticated forms
        medeaHelper.addTestContainer("test");
        $("#test").html("<form><input type=\"text\" name=\"iceCream\" data-json-type=\"string\" value=\"99\"></form>");
        var obj = Medea.form2object("form");
        expect(obj).toEqual({ iceCream: '99' });
        $("#test").html("<form><input type=\"text\" name=\"my.deep.field\" data-json-type=\"string\" value=\"99\"></form>");
        obj = Medea.form2object("form");
        expect(obj).toEqual({my:{deep:{field:'99'}}});
        medeaHelper.removeTestContainer("test");
    });

    it("should delete a form field", function() { 
        medeaHelper.addTestContainer("test");
        var field = Medea.inputGroup("abc", 99, "text");
        $("#test").html(field);
        var input = $("#test").find("input");
        expect(input.length).toEqual(1);
        var button = $("#test").find("span.glyphicon-remove");
        expect(button.length).toEqual(1);
        button.trigger("click");
        var deleted = $("#test").find("span.glyphicon-remove");
        expect(deleted.length).toEqual(0);
        input = $("#test").find("input");
        expect(input.length).toEqual(0);
        medeaHelper.removeTestContainer("test");
    });

});
