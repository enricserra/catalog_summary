function showLoading() {
    // remove existing loaders
    jQuery('.loading-container').remove();
    jQuery('<div id="orrsLoader" class="loading-container"><div><div class="mdl-spinner mdl-js-spinner is-active"></div></div></div>').appendTo("body");

    componentHandler.upgradeElements(jQuery('.mdl-spinner').get());
    setTimeout(function () {
        jQuery('#orrsLoader').css({opacity: 1});
    }, 1);
}

function hideLoading() {
    jQuery('#orrsLoader').css({opacity: 0});
    setTimeout(function () {
        jQuery('#orrsLoader').remove();
    }, 400);
}

function showDialog(options) {
    options = jQuery.extend({
        id: 'orrsDiag',
        title: null,
        text: null,
        negative: false,
        positive: false,
        cancelable: true,
        contentStyle: null,
        onLoaded: false
    }, options);

    // remove existing dialogs
    jQuery('.dialog-container').remove();
    jQuery(document).unbind("keyup.dialog");

    jQuery('<div id="' + options.id + '" class="dialog-container"><div class="mdl-card mdl-shadow--16dp"></div></div>').appendTo("body");
    var dialog = jQuery('#orrsDiag');
    var content = dialog.find('.mdl-card');
    if (options.contentStyle != null) content.css(options.contentStyle);
    if (options.title != null) {
        jQuery('<h5>' + options.title + '</h5>').appendTo(content);
    }
    if (options.text != null) {
        jQuery('<p>' + options.text + '</p>').appendTo(content);
    }
    if (options.negative || options.positive) {
        var buttonBar = jQuery('<div class="mdl-card__actions dialog-button-bar"></div>');
        if (options.negative) {
            options.negative = jQuery.extend({
                id: 'negative',
                title: 'Cancel',
                onClick: function () {
                    return false;
                }
            }, options.negative);
            var negButton = jQuery('<button class="mdl-button mdl-js-button mdl-js-ripple-effect" id="' + options.negative.id + '">' + options.negative.title + '</button>');
            negButton.click(function (e) {
                e.preventDefault();
                if (!options.negative.onClick(e))
                    hideDialog(dialog)
            });
            negButton.appendTo(buttonBar);
        }
        if (options.positive) {
            options.positive = jQuery.extend({
                id: 'positive',
                title: 'OK',
                onClick: function () {
                    return false;
                }
            }, options.positive);
            var posButton = jQuery('<button class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect" id="' + options.positive.id + '">' + options.positive.title + '</button>');
            posButton.click(function (e) {
                e.preventDefault();
                if (!options.positive.onClick(e))
                    hideDialog(dialog)
            });
            posButton.appendTo(buttonBar);
        }
        buttonBar.appendTo(content);
    }
    componentHandler.upgradeDom();
    if (options.cancelable) {
        dialog.click(function () {
            hideDialog(dialog);
        });
        jQuery(document).bind("keyup.dialog", function (e) {
            if (e.which == 27)
                hideDialog(dialog);
        });
        content.click(function (e) {
            e.stopPropagation();
        });
    }
    setTimeout(function () {
        dialog.css({opacity: 1});
        if (options.onLoaded)
            options.onLoaded();
    }, 1);
}

function hideDialog(dialog) {
    jQuery(document).unbind("keyup.dialog");
    dialog.css({opacity: 0});
    setTimeout(function () {
        dialog.remove();
    }, 400);
}