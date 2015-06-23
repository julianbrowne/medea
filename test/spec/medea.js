
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
        expect($(Medea.primToField(9, "nine")).val()).toEqual("9");
        expect($(Medea.primToField(9, "nine")).attr("type")).toEqual("number");
        expect($(Medea.primToField(9, "nine")).attr("name")).toEqual("nine");

        expect($(Medea.primToField("abc", "str")).val()).toEqual("abc");
        expect($(Medea.primToField("abc", "str")).attr("type")).toEqual("text");
        expect($(Medea.primToField("abc", "str")).attr("name")).toEqual("str");

        expect($(Medea.primToField(true, "tf")).val()).toEqual("true");
        expect($(Medea.primToField(true, "tf")).attr("type")).toEqual("checkbox");
        expect($(Medea.primToField(true, "tf")).attr("name")).toEqual("tf");
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
        $("#test").append("<form><input type=\"text\" name=\"iceCream\" data-json-type=\"string\" value=\"99\"></form>");
        var obj = Medea.form2object("form");
        console.log(obj);
        expect(obj).toEqual({ iceCream: '99' });
        medeaHelper.removeTestContainer("test");
    });

});
