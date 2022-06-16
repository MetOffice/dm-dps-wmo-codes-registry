/**
 * This function provides a simplified interface for invoking the registry comparison feature for a single entity,
 * and rendering the results as HTML within a containing document.
 * @param {Object} opts                 The block of parameters.
 * @param {Object} opts.selector          The block of CSS selectors which determine the input data and output display. All selectors are required.
 * @param {String} opts.selector.target     The selector for the element to output the results of the comparison.
 * @param {String} opts.selector.error      The selector for the element to output error messages if the comparison fails.
 * @param {String} opts.selector.button     The selector for the button element which triggers the comparison.
 * @param {String} opts.selector.form       The selector for the form element which contains the data to be compared.
 * @param {Object} opts.data              The block of modifiers which alter the data submitted to the API. Optional.
 * @param {Function} opts.data.apply        A function which modifies the supplied set of key-value pairs which will be added to the form data.
 * @param {Function} opts.data.isEdit       A function which determines whether the submitted data contains edits to existing registry items.
 */
var registryCompare = function(opts) {
  var renderError = function(msg) {
    $(opts.selector.error).html("<div class='alert alert-warning'> <button type='button' class='close' data-dismiss='alert'>&times;</button>" + msg + "</div>");
  };

  var onError = function(xhr, status, error) {
    renderError("Action failed: " + error + " - " + xhr.responseText);
  };

  $(opts.selector.button).click(function(event) {
    var form = $(opts.selector.form);
    var target = form.attr('action') + "?compare";
    var data = {
      action: "compare"
    };

    if (opts.data) {
      if (opts.data.apply) {
        opts.data.apply(data);
      }

      if (opts.data.isEdit && opts.data.isEdit()) {
        target += "&compare-edit"
      }
    }

    form.ajaxSubmit({
        type: "post",
        url: target,
        headers: {
          "Accept": "text/html"
        },
        target: opts.selector.target,
        data: data,
        error: onError
    });
  });
};