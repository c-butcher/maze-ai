$(() => {

    if($('.page-settings').length > 0) {
        $('.page-settings').on('click', function () {
            $(this).parent().toggleClass('show');
            $(this).toggleClass('open');
            $(this).next().toggleClass('show');
        });
    }

    if ($(".color-select").length > 0) {

        let colors = [];
        $('.color-select:first').children().each((id, element) => {
            let color = $(element).data('color');
            colors.push({
                id: color,
                text: color,
                html: `<span class="color mr-2" style="background: ${color}"></span><span>${color}</span>`
            });
        });

        $(".color-select").select2({
            data: colors,
            placeholder: "Select One",
            theme: 'bootstrap',
            templateResult: (result) => {
                return $(result.html);
            },
            templateSelection: (result) => {
                return $(result.html);
            },
            matcher: (params, data) => {
                if ($.trim(params.term).length < 1) {
                    return data;
                }

                if (typeof data.color === 'undefined') {
                    return null;
                }

                if (data.color.indexOf(params.term.toLowerCase()) > -1) {
                    let modifiedData = $.extend({}, data, true);
                    modifiedData.color += ' (matched)';

                    // You can return modified objects from here
                    // This includes matching the `children` how you want in nested data sets
                    return modifiedData;
                }

                return null;
            }
        });
    }
});


/**
 * Converts a hexadecimal color value to a p5.Color object.
 *
 * @param {string} value
 *
 * @returns {p5.Color}
 */
function hexToColor(value) {
    let hexes = value.replace('#', '').match(/.{1,2}/g);
    let digits = unhex(hexes);

    return color(...digits);
}


/**
 * Extending the p5.Color object so it includes a p5.Color.match() method
 * which tells whether two colors are equal.
 *
 * @param color
 * @returns {boolean}
 */
p5.Color.prototype.matches = function(color) {
    if (Array.isArray(color)) {
        return this.levels.toString() === color.toString();
    }

    if (color instanceof p5.Color) {
        return this.levels.toString() === color.levels.toString();
    }

    return false;
};
