describe("Medea", function() { 

    describe("Helper", function() { 

        it("should create and remove an element", function() { 
            medeaHelper.addTestContainer("test");
            expect($("#test").length).toEqual(1);
            medeaHelper.removeTestContainer("test");
            expect($("#test").length).toEqual(0);
        });

    });

});
