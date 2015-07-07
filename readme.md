
# Medea

Medea loves JSON. Give Medea a JSON object, even one with nested objects, and it will be converted into an HTML form. The form allows fields in the object to be edited, or deleted, or for new ones to be created. The modified object is returned via the submit event.

## Installation

If you have git installed copy the repository into a local directory:

    git clone https://github.com/julianbrowne/medea.git

Or fetch the zip file from ```https://github.com/julianbrowne/medea/archive/master.zip```

## Usage

Check out the bundled example in examples.

Make sure you have jQuery and Medea included in your app:

    <script src="{path-to}/jquery/jquery-2.1.4.js"></script>
    <script src="{path-to}/medea.js"></script>

Using Medea is a simple as:

    $(jquery-selector).medea(json-object);

Where `jquery-selector` is the identifier of a target container (e.g. div) on the page and `json-object` is the object you wish to edit. The target element will emit a submit event when the form is submitted with the OK button.

    $(jquery-selector).on("submit", function(updated-json-object) { 
        // do something with updated-json-object here ..
    });

## Events

Events emitted:

*   "shown"   - form rendered
*   "submit"  - form submitted with OK button
*   "cancel"  - form editing cancelled with cancel button
*   "add"     - new field added
*   "remove"  - field deleted

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

