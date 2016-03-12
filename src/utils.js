function createEmptySurface(props) {
    return new Surface({
        size: [undefined, undefined],
        properties: props
    });
}

function createInvisibleSurface(props) {
    return new Surface({
        size: [0, 0],
        properties: props
    });
}

function defineView(name, config) {
    window[name] = function (args) {
        View.apply(this, config);
        config.initView.call(config, this);
    };

    window[name].prototype = Object.create(View.prototype);
    window[name].prototype.constructor = window[name];
    window[name].DEFAULT_OPTIONS = [];
}

//var boxColors = ['aqua', 'blue', 'fuchsia', 'gray', 'green', 'lime',
//    'maroon', 'navy', 'olive', 'orange', 'purple', 'red', 'silver', 'teal', 'white', 'yellow'];

var boxColors = ['#09F7E3', '#EF0B5F', '#07F71B', '#F7FF0F', '#FF9411'];


function getRandomColor() {
    return getRandomItem(boxColors);
}

function getRandomItem(arr) {
    var index = randomInt(arr.length);
    return arr[index];
}

function randomInt(i) {
    return Math.floor(Math.random() * i);
}

function createBox(boxSize, x, y) {
    var view = new View();

    var bgColor = getRandomColor();
    var colors = arrayCopy(boxColors);
    arrayRemove(colors, bgColor);
    var leftColor = getRandomItem(colors);
    arrayRemove(colors, leftColor);
    var topColor = getRandomItem(colors);
    arrayRemove(colors, topColor);
    var rightColor = getRandomItem(colors);
    arrayRemove(colors, rightColor);
    var bottomColor = getRandomItem(colors);

    var box = new Surface({
        size: [boxSize, boxSize],
        properties: {
            borderTopStyle: 'outset',
            borderLeftStyle: 'outset',
            borderRightStyle: 'inset',
            borderBottomStyle: 'inset',
            borderWidth: '1px',
            borderRadius: '5px',
            backgroundColor: bgColor
//            ,
//            borderTopColor: topColor,
//            borderLeftColor: leftColor,
//            borderRightColor: rightColor,
//            borderBottomColor: bottomColor
        }
    });

    box.bgColor = bgColor;
    box.leftColor = leftColor;
    box.topColor = topColor;
    box.rightColor = rightColor;
    box.bottomColor = bottomColor;
    box.parentView = view;

    var modifier = new StateModifier({
        size: [boxSize, boxSize * 10],
        align: [0, 1]
    });
    view.refreshContent = function () {
//        box.setContent(box.xPos + ',' + box.yPos);
    };
    view.setX = function (x) {
        box.xPos = x;
        this.refreshContent();
    };
    view.setY = function (y) {
        box.yPos = y;
        this.refreshContent();
    };
    view.setX(x);
    view.setY(y);

    view.add(modifier).add(box);
    view.box = box;
    view.animate = function () {
        modifier.setOpacity(0, {duration: 800}, function () {
            modifier.setSize([boxSize, 0], {duration: 200}, function () {
                arrayRemove(gameblocks[box.xPos], view);
            });
        });
    };
    view.initAnimation = function () {
        modifier.setSize([boxSize, boxSize], {duration: 500});
        modifier.setAlign([0, 0], {duration: 500});
    };
    view.shake = function () {
        modifier.setAlign([0.2, 0], {duration: 0});
        modifier.setOrigin([0.2, 0], {
            duration: 100
        });
        modifier.setOrigin([0, 0], {
            duration: 100
        });
        modifier.setAlign([0, 0], {duration: 100});
    };
    view.initAnimation();
    return view;
}

function arrayCopy(arr) {
    var new_arr = arr.slice(0);
    for (var i = new_arr.length; i--; )
        if (new_arr[i] instanceof Array)
            new_arr[i] = arrayCopy(new_arr[i]);
    return new_arr;
}

function arrayRemove(arr, value) {
    for (var i = arr.length; i--; ) {
        if (arr[i] === value) {
            arr.splice(i, 1);
            break;
        }
    }

}