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
        formErrorContainer: null,

        init: function () {
            var _self = this;
            $('input').on('change', function () {
                _self.validateForm();
            });
        },
        validateForm: function () {
            $('.js-form-flash-message').remove();
            if ($('.form-group.has-error').length > 0) {
                var container = this.formErrorContainer || this.formContainer;
                $(container).prepend(this.wrapFlashMessage(this.formErrorMessage))
            }
        },
        wrapFlashMessage: function (message) {
            var wrappedMessage = $('<div class="js-form-flash-message alert alert-danger" role="alert">'+message+'</div>');

            return wrappedMessage;
        },
        clearFieldError: function (field, reference) {
            if (typeof reference == "undefined"){
                reference = "";
            } else {
                reference = "." + reference;
            }

            this.validateHTMLElement(field);

            field.setCustomValidity("");

            var fieldFormGroup = $(field).closest('.form-group');
            fieldFormGroup
                .find('.help-block' + reference)
                .remove();
            if (fieldFormGroup.find('.help-block').length == 0) {
                fieldFormGroup.removeClass('has-error');
            }
        },
        highlightFieldError: function (field, customErrorMessage, reference) {
            if (typeof reference == "undefined"){
                reference = "";
            }

            this.validateHTMLElement(field);

            var fieldFormGroup  = $(field).closest('.form-group');
            var fieldLabel      = this.getLabel(field);
            var errorMessage    = customErrorMessage;

            fieldFormGroup.addClass('has-error');
            $("<div class='help-block "+reference+"'>" + errorMessage.replace("%s", fieldLabel) + "</div>").insertAfter($(field));
            field.setCustomValidity(errorMessage.replace("%s", fieldLabel));

        },
        setFormErrorMessageContainer: function (container) {
            this.formErrorContainer = container;
            return this;
        },
        setFormErrorMessage: function (errorMessage) {
            this.errorMessage = errorMessage;
            return this;
        },
        setFieldErrorMessage: function (errorMessage) {
            this.errorMessage = errorMessage;
            return this;
        },
        initFieldSet: function (fieldSet, isValidFieldSetTester, customErrorMessage, runValidation) {
            var _self = this;

            if (typeof customErrorMessage === 'undefined') {
                customErrorMessage = this.fallbackFieldErrorMessage;
            }

            if (typeof fieldSet.compareWith === 'undefined' || typeof fieldSet.referenceField === 'undefined') {
                throw new Error("Fieldset should have properties `compareWith` and `referenceField`");
            }

            fieldSet = this.convertToJqueryObject(fieldSet);

            var result = isValidFieldSetTester(fieldSet);
            if (result.length != fieldSet.compareWith.length) {
                throw new Error("The result array should be equal to compareWith array as the operation is performed on compareWith. ");
            }

            fieldSet.referenceField.on('propertychange change click keyup input paste', function() {
                _self.runFieldSetValidation(fieldSet, isValidFieldSetTester, customErrorMessage);
            });
            $.each(fieldSet.compareWith, function(i, field2) {
                $(field2).on('propertychange change click keyup input paste', function() {
                    _self.runFieldSetValidation(fieldSet, isValidFieldSetTester, customErrorMessage);
                });
            });

            if (runValidation) {
                _self.runFieldSetValidation(fieldSet, isValidFieldSetTester, customErrorMessage);
            }
        },
        convertToJqueryObject: function(fieldSet) {
            if (typeof fieldSet.referenceField === "string") {
                fieldSet.referenceField = $(fieldSet.referenceField);
            }
            //Convert Fieldset to jQuery objects
            $.each(fieldSet.compareWith, function(i, field2) {
                if (typeof field2 === "string") {
                    fieldSet[i] = $(field2);
                }
            });

            return fieldSet;
        },
        runFieldSetValidation: function(fieldSet, isValidFieldSetTester, customErrorMessage) {
            var _self = this;
            var result = isValidFieldSetTester(fieldSet);
            _self.clearFieldError(fieldSet.referenceField[0]);

            var referenceFieldLabel     = _self.getLabel(fieldSet.referenceField[0]);
            var referenceClass          = _self.getReferenceClass(referenceFieldLabel);

            $.each(fieldSet.compareWith, function(i, field2) {
                _self.clearFieldError(field2[0], referenceClass);
                if (!result[i]) {
                    var field2Label = _self.getLabel(field2[0]);

                    _self.highlightFieldError(fieldSet.referenceField[0], customErrorMessage.replace("%s", field2Label), referenceClass);
                    _self.highlightFieldError(field2[0], customErrorMessage.replace("%s", referenceFieldLabel), referenceClass);
                }
            });
            _self.validateForm();
        },
        initField: function (field, isValidFieldTester, customErrorMessage) {
            var _self = this;

            this.validateFieldParameter();

            if (typeof customErrorMessage === 'undefined') {
                customErrorMessage = this.fallbackFieldErrorMessage;
            }

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
        validateFieldParameter: function(field) {
            //Support for jQuery objects
            if (field instanceof jQuery) {
                field = field[0];
            }

            //Support for selectors
            if (typeof field === "string") {
                field = $(field)[0];
            }

            this.validateHTMLElement(field);
        },
        getLabel: function(field) {
            var fieldFormGroup = $(field).closest('.form-group');
            return (fieldFormGroup.find('label').text()).replace(/\W /g, '');
        },
        isFunction: function (functionToCheck) {
            var getType = {};
            return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
        },
        validateHTMLElement: function(field) {
            if (!(field instanceof HTMLElement)) {
                throw new Error("The field or first parameter should be an instance of HTMLElement");
            }
        },
        getReferenceClass: function(str) {
            return "js-" + str.replace(/\W/g, '-');
        },
        isFormValid: function() {
            return $(this.formContainer).find('.has-error').length == 0;
        }
    };

    return BootstrapFormErrorReporting;
});