var medeaHelper = { 

    addTestContainer: function(id) { 
        var container = $("<div>").attr("id",id);
        return $("body").append(container);
    },

    removeTestContainer: function(id) { 
        $("#"+id).remove();
    }

};