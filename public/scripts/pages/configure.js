let canvas = null;
let img = null;
let width = 0;
let height = 0;
let url = null;
let colors = [];

function rgbToHex (r, g, b) {
    let hex = '#';

    let red = r.toString(16);
    let green = g.toString(16);
    let blue = b.toString(16);

    hex += red.length < 2 ? '0' + red : red;
    hex += green.length < 2 ? '0' + green : green;
    hex += blue.length < 2 ? '0' + blue : blue;

    return hex;
}

/**
 * Toggle the visibility of the loading screen.
 *
 * @param {boolean} isVisible
 */
function showLoadingScreen(isVisible = null) {
    if (isVisible === null) {
        $('#loading-screen').toggle();

    } else if (isVisible) {
        $('#loading-screen').show();

    } else {
        $('#loading-screen').hide()
    }
}



function preload() {
    showLoadingScreen(true);

    url = $('#maze-container').data('url');
    width = $('#maze-container').data('width');
    height = $('#maze-container').data('height');

    img = loadImage(url);
}

function setup() {

    this.canvas = createCanvas(width, height);
    this.canvas.canvas.style.display = 'none';

    image(img, 0, 0, width, height);

    // Load the Pixels
    loadPixels();

    colors = {};
    for (let w = 0; w < width; w++) {
        for (let h = 0; h < height; h++) {
            let pixel = get(w, h);
            if (colors[pixel] === undefined) {
                colors[pixel] = {
                    count: 0,
                    color: pixel,
                };
            }

            colors[pixel].count++;
        }
    }

    colors = Object.entries(colors)
                   .reduce((accumulator, value, index, array) => {
                       value = value[1];
                       value.id    = value.color;
                       value.color = rgbToHex(value.color[0], value.color[1], value.color[2]);
                       value.html  = `<span class="color" style="background: ${value.color}; padding: 10px; margin-right: 10px; vertical-align: middle; display: inline-block;"></span><span style="display: inline-block">${value.color.toUpperCase()}</span>`;

                       accumulator.push(value);
                       return accumulator
                   }, [])
                   .sort((a,b) => {
                       if (a.count === b.count) {
                           return 0;
                       }
                       return b.count - a.count;
                   });

    $(() => {

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
    });

    showLoadingScreen(false);

    noLoop();
}

function draw() {

}
