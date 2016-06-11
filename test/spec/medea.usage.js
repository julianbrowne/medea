describe("Medea", function() { 

    describe("Usage", function() { 

        it("should inject stylesheet once and only once", function() { 
            medeaHelper.addTestContainer("test");
            $("#test").medea({});
            expect($("#medea-style").length).toEqual(1);
            $("#test").medea({});
            $("#test").medea({});
            expect($("#medea-style").length).toEqual(1);
            medeaHelper.removeTestContainer("test");
        });

        it("should error if input is not an object", function() { 
            expect(function() { $("body").medea(999); }).toThrow("not an object");
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

        it("should map fields into parent element with existing form tag", function() { 
            medeaHelper.addTestContainer("test");
            var container = $("#test");
            container.append($("<form>"));
            var spy = spyOn(console, "error");
            $("#test form").medea({ one: { two: 55} }, {noForm: true});
            expect($("#test form input").length).toEqual(2);
            expect(spy).not.toHaveBeenCalled();
            medeaHelper.removeTestContainer("test");
        });

        it("should error if parent form tag is missing", function() { 
            medeaHelper.addTestContainer("test");
            var spy = spyOn(console, "error");
            $("#test").medea({ one: { two: 55} }, {noForm: true});
            expect($("#test form input").length).toEqual(0);
            expect(spy).toHaveBeenCalled();
            medeaHelper.removeTestContainer("test");
        });

    });

});
