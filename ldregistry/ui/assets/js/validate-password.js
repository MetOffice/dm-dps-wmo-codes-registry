// Plugin method for passwordvalidation
$(function() {

    jQuery.validator.addMethod(
        "pwcomplex", 
        function(value, element) {
            return this.optional(element) || (
                /.*[0-9].*/.test(value) && /.*[a-z].*/.test(value) && /.*[A-Z].*/.test(value) && !/.*\s.*/.test(value)
            );
        }, 
        "Password must have lower case, upper case and digits");

    // Validate an validating forms
    $('.form-validated').validate( );

});
