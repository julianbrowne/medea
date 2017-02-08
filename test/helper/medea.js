var medeaHelper = { 

    addTestContainer: function(id) { 
        var container = $("<div>").attr("id",id);
        return $("body").append(container);
    },

    removeTestContainer: function(id) { 
        $("#"+id).remove();
    },

    clearModals: function() { 
        $(".modal").remove();
        $(".modal-backdrop").remove();
    },

    formLabel: function() {
        return $("div.form-group").find("label");
    },

    formInput: function() { 
        return $("div.form-group").find("input.form-control");
    },

    matcher: function() { 
        return { 
            form: $("div.form-group"),
            firstInput: $("div.form-group").find("input.form-control").first(),
            allInputs:  $("div.form-group").find("input.form-control"),
            firstLabel: $("div.form-group").find("label").first(),
            allLabels:  $("div.form-group").find("label")
        }
    }

};
