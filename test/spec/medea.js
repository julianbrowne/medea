
describe("Medea", function() { 

    it("should have jQuery available", function() { 
        expect(jQuery).toBeDefined();
    });

    it("should exist", function() { 
        expect(jQuery.fn.medea).toBeDefined();
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
        medeaHelper.addTestContainer("test");
        expect($("#test").length).toEqual(1);
        $("#test").medea({myCamelCaseLabel: 10});
        expect($("#test form").length).toEqual(1);
        expect($("#test div label").html()).toEqual("My Camel Case Label:");
        medeaHelper.removeTestContainer("test");
    });

    it("should make a number form", function() { 
        medeaHelper.addTestContainer("test");
        expect($("#test").length).toEqual(1);
        $("#test").medea({ number: 999 });
        expect($("#test div label").html()).toEqual("Number:");
        expect($("#test div input").attr("type")).toEqual("number");
        expect($("#test div input").attr("data-json-type")).toEqual("number");
        expect($("#test div input").val()).toEqual("999");
        medeaHelper.removeTestContainer("test");
    });

    it("should make a string form", function() { 
        medeaHelper.addTestContainer("test");
        expect($("#test").length).toEqual(1);
        $("#test").medea({ text: "abc" });
        expect($("#test div label").html()).toEqual("Text:");
        expect($("#test div input").attr("type")).toEqual("text");
        expect($("#test div input").attr("data-json-type")).toEqual("string");
        expect($("#test div input").val()).toEqual("abc");
        medeaHelper.removeTestContainer("test");
    });

    it("should make a boolean form", function() { 
        medeaHelper.addTestContainer("test");
        expect($("#test").length).toEqual(1);
        $("#test").medea({ amIRight: true });
        expect($("#test div label").html()).toEqual("Am I Right:");
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
        expect($("#test div label").html()).toEqual("List:");
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
        expect($("#test div label").html()).toEqual("Top:");
        expect($("#test div input").val()).toEqual("10");
        expect($("#test div input").length).toEqual(2);
        expect($("#test div div.childElement label").html()).toEqual("Sub:");
        expect($("#test div div.childElement input").val()).toEqual("abc");
        medeaHelper.removeTestContainer("test");
    });

    it("should have add, cancel and ok buttons", function() { 
        medeaHelper.addTestContainer("test");
        expect($("#test").length).toEqual(1);
        $("#test").medea({});
        expect($("#test button").length).toEqual(3);
        medeaHelper.removeTestContainer("test");
    });

});
