
# Medea

Medea loves JSON. Give Medea a JSON object, even one with nested objects, and it will be converted into an HTML form. The form allows fields in the object to be edited, or deleted, or for new ones to be created. The modified object is returned via the submit event.

## Installation

If you have git installed, copy the repository into a local directory:

    git clone https://github.com/julianbrowne/medea.git

Or fetch the zip file from ```https://github.com/julianbrowne/medea/archive/master.zip```

## Usage

Check out the bundled [examples](examples/index.html).

Make sure you have jQuery and Medea included in your app:

    <script src="{path-to}/jquery/jquery-2.1.4.js"></script>
    <script src="{path-to}/medea.js"></script>

Using Medea is a simple as:

    $(jquery-selector).medea(object);

Where ``jquery-selector`` is the identifier of a target container (e.g. div) on the page and ``object`` is the javascript or JSON object you wish to edit.

For example:

    $("body").medea({hello: "world"});

The target element will emit a submit event when the form is submitted with the OK button.

    $(jquery-selector).on("medea.submit", function(updated-json-object) { 
        // do something with updated-json-object here ..
    });

## Events

Events emitted:

*   ``medea.shown``: form rendered onto display
*   ``medea.submit``: form (or parent form) submitted
*   ``medea.cancel``: editing cancelled with cancel button
*   ``medea.add``: new field added
*   ``medea.remove``: existing field deleted

"shown", "submit" and "cancel" events return the JSON object.

## Options

Medea takes a number of options:

    $(selector).medea(object, options);

``options`` is an object with these fields:

*   ``removeOnSubmit`` - true/false: remove the created elements from the DOM when the form is submitted. Default is false.
*   ``buttons`` - Create save and cancel buttons for the form. Default is true.
*   ``labelColumns`` - Number of columns to use for the form labels. Medea uses bootstrap classes, so this just means that field LABEL tags will be classed with ``col-sm-{labelColumns}``. Default is 2.
*   ``inputColums`` - Number of colums to use for the div encapsulating form INPUT tags. Default is 10.
*   ``noForm`` - Replaces the FORM tag with a DIV tag. Useful if a form already exists in the DOM and the generated field sets are just to be inserted into it. Default is false.

@todo

modal
modalId

