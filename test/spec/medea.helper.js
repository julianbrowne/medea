describe("Medea", function() { 

    describe("Helper", function() { 

        it("should create and remove an element", function() { 
            medeaHelper.addTestContainer("test");
            expect($("#test").length).toEqual(1);
            medeaHelper.removeTestContainer("test");
            expect($("#test").length).toEqual(0);
        });

        it("should clear bootstrap modals", function() { 
            var modal = $("<div>").attr("class","modal");
            $("body").append(modal);
            expect($(".modal").length).toEqual(1);
            medeaHelper.clearModals();
            expect($(".modal").length).toEqual(0);
        });

    });

});
