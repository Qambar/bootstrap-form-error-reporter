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
        this.init();
    };

    BootstrapFormErrorReporting.prototype = {

        formContainer: '.theme-form',
        formErrorMessage: "There are errors on the form. Please fix them before continuing.",
        fallbackFieldErrorMessage: "Error on %s",
        init: function () {
            var _self = this;
            $('input').on('change', function () {
                _self.validateForm();
            });
        },
        validateForm: function () {
            $('.js-form-flash-message').remove();
            if ($('.form-group.has-error').length > 0) {
                $(this.formContainer).prepend(this.wrapFlashMessage(this.formErrorMessage))
            }
        },
        wrapFlashMessage: function (message) {
            var wrappedMessage = $('<div class="js-form-flash-message alert alert-danger" role="alert">'+message+'</div>');

            return wrappedMessage;
        },
        clearFieldError: function (field) {
            this.validateHTMLElement(field);

            field.setCustomValidity("");

            var fieldFormGroup = $(field).closest('.form-group');
            fieldFormGroup
                .find('.help-block')
                .remove();
            fieldFormGroup.removeClass('has-error');
        },
        highlightFieldError: function (field, customErrorMessage) {
            this.validateHTMLElement(field);

            var fieldFormGroup = $(field).closest('.form-group');
            var fieldLabel = (fieldFormGroup.find('label').text()).replace(/\W/g, '');
            var errorMessage = customErrorMessage;

            fieldFormGroup.addClass('has-error');
            $("<div class='help-block'>" + errorMessage.replace("%s", fieldLabel) + "</div>").insertAfter($(field));
            field.setCustomValidity(errorMessage.replace("%s", fieldLabel));

        },
        setFormErrorMessage: function (errorMessage) {
            this.errorMessage = errorMessage;
            return this;
        },
        setFieldErrorMessage: function (errorMessage) {
            this.errorMessage = errorMessage;
            return this;
        },
        initField: function (field, isValidFieldTester, customErrorMessage) {
            var _self = this;

            //Support for jQuery objects
            if (field instanceof jQuery) {
                field = field[0];
            }

            //Support for selectors
            if (typeof field === "string") {
                field = $(field)[0];
            }

            if (typeof customErrorMessage === 'undefined') {
                customErrorMessage = this.fallbackFieldErrorMessage;
            }

            this.validateHTMLElement(field);

            if (!this.isFunction(isValidFieldTester)) {
                throw new Error("The second parameter should be a function against which this field should be validated");
            }

            var updateFields = function() {
                _self.clearFieldError(field);
                if (!isValidFieldTester($(field))) {
                    _self.highlightFieldError(field, customErrorMessage);
                }
                _self.validateForm();
            };

            $(field).on('propertychange change click keyup input paste', function() {
                updateFields();
            });
            updateFields();


            return this;
        },
        isFunction: function (functionToCheck) {
            var getType = {};
            return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
        },
        validateHTMLElement: function(field) {
            if (!(field instanceof HTMLElement)) {
                throw new Error("The field or first parameter should be an instance of HTMLElement");
            }
        }
    };

    return BootstrapFormErrorReporting;
});