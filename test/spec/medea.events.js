describe("Medea", function() { 

    describe("Events", function() { 

        /**
         *  @todo: 
         *  
         *  medea.add with buttons
         *  medea.add without buttons
         *  medea.submit
         *  medea.cancel
         *  medea.toggle
         *
        **/

        it("should respond to a 'medea.add' event", function() { 
            medeaHelper.addTestContainer("test");
            var container = $("#test");
            container.medea({ abc: 123});
            var match = medeaHelper.matcher();
            expect($("form").length).toEqual(1);
            expect(match.allInputs.length).toEqual(1);
            // add 1 field
            container.trigger("medea.add");
            var match = medeaHelper.matcher();
            expect($("form").length).toEqual(1);
            expect(match.allInputs.length).toEqual(2);
            medeaHelper.removeTestContainer("test");
        });

        it("should fire 'medea.submit' event on form submit", function() { 
            medeaHelper.addTestContainer("test");
            var container = $("#test");
            container.medea({ fieldOne: 55});
            var form = $("form");
            var spy = spyOnEvent(container, "medea.submit");
            var submitHandler = jasmine.createSpy().and.returnValue(false);
            form.submit(submitHandler);
            form.trigger("submit");
            expect("medea.submit").toHaveBeenTriggeredOn(container);
            expect(spy).toHaveBeenTriggered();
            medeaHelper.removeTestContainer("test");
        });

    });

});
