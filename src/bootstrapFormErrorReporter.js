if (typeof define !== 'function') { var define = require('amdefine')(module) }

/**
 *  Easy error reporting tool for bootstrap forms using javascript.
 *
 *  - If there is an error display a flash message on the form.
 *  - Report the error on that particular field.
 */

define(function () {

    "use strict";

    var BootstrapFormErrorReporting = function(formContainer) {
        this.formContainer = formContainer;
    };

    BootstrapFormErrorReporting.prototype = {

        formContainer: '.theme-form',
        formErrorMessage: "There are errors on the form. Please fix them before continuing.",
        fieldErrorMessage: "Error on %s",

        init : function() {
            var _self = this;
            $('input').on('change', function() {
                _self.validateForm();
            });
        },
        validateForm: function() {
            if ($('.form-group.has-error').length > 0) {
                $(this.formContainer).prepend(this.wrapFlashMessage(this.formErrorMessage))
            }
        },
        wrapFlashMessage: function(message) {
            var wrappedMessage = $('<div class="alert alert-danger" role="alert"></div>');
            wrappedMessage.text(message);
            return wrappedMessage.html();
        },
        clearFieldError: function(field) {
            field.setCustomValidity("");

            var fieldFormGroup = $(field).closest('.form-group');
            fieldFormGroup
                .find('.help-block')
                .remove();
            fieldFormGroup.removeClass('has-error');
        },
        highlightFieldError: function(field) {
            var fieldLabel = $(field).data('label');


        },
        setFormErrorMessage: function(errorMessage) {
            this.errorMessage = errorMessage;
            return this;
        },
        setFieldErrorMessage: function(errorMessage) {
            this.errorMessage = errorMessage;
            return this;
        },
        //note we are passing actual field not jquery object
        report: function(field){
            if (field instanceof HTMLElement) {
                throw new Error("The field should be an instance of HTMLElement");
            }

            this.clearFieldError(field);
            this.highlightFieldError(field);
            this.validateForm();
            return this;
        }

    };

    return BootstrapFormErrorReporting;
}