
var mainContext = Engine.createContext();
var points = 0;
var ROW_COUNT = 10;
var MAX_SIZE = Math.min(window.innerHeight, window.innerWidth);
var TOP_MARGIN = 100;
var SIDE_MARGIN = 40;
var BLOCK_SIZE = Math.floor((MAX_SIZE - (SIDE_MARGIN * 2)) / ROW_COUNT);
if (window.innerHeight - (BLOCK_SIZE * ROW_COUNT) < (TOP_MARGIN * 2)) {
    BLOCK_SIZE = Math.floor((MAX_SIZE - (TOP_MARGIN * 2)) / ROW_COUNT);
}

var gameblocks = [];

var inputCatcher = new Surface({
    size: [undefined, undefined],
    classes: ['inputCatcher'],
    properties: {
        zIndex: -1
    }
});
inputCatcher.on('click', function () {
    //alert('test');
});

function disableEvents(value) {
    var zIndex = value ? 9999 : -1;
    inputCatcher.setProperties({
        zIndex: zIndex
    });
//    var classList = inputCatcher.getClassList();
//    if (value) {
//        arrayRemove(classList, 'disabled');
//    } else {
//        classList.push('disabled');
//    }
//    inputCatcher.setClasses(classList);
}

function handleBoxClick() {
    disableEvents(true);
    var count = markItemsToRemove(this.bgColor, this.xPos, this.yPos);
    var duration = 0;
    if (count > 2) {
        animateBoxesToRemove();
        duration = 1200;
    } else {
        this.parentView.shake();
        duration = 0;
    }
//    removeMatchingItems();
    setTimeout(function () {
        fixIndexes();
        if (!ifGameOver()) {
            disableEvents(false);
        }
    }, duration);

    return false;
}

function ifGameOver() {
    var gameOver = true;
    for (var i = 0; i < ROW_COUNT; i++) {
        for (var j = 0; j < ROW_COUNT; j++) {
            var view = gameblocks[i][j];
            var box = view.box;
            markItemsToRemove(box.bgColor, box.xPos, box.yPos, {
                value: 0
            });
            if (gameOver && view.fakeRemove.value > 2) {
                gameOver = false;
            }
        }
    }
    ;
    //cleanup
    for (var i = 0; i < ROW_COUNT; i++) {
        for (var j = 0; j < ROW_COUNT; j++) {
            var view = gameblocks[i][j];
            delete view.fakeRemove;
        }
    }
    ;
    if (gameOver) {
        disableEvents(true);
        inputCatcher.setContent('<div class="content">GAME OVER</div>');
        var counter = 0;
        centerModifier.transformFrom(function () {
            return Transform.rotateZ(Math.PI / 180 * counter++);
        });
    }
    return gameOver;
}

function animateBoxesToRemove() {
    var newPoints = 0;
    for (var i = 0; i < ROW_COUNT; i++) {
        for (var j = 0; j < ROW_COUNT; j++) {
            var view = gameblocks[i][j];
            if (view && view.toRemove === true) {
                //tutaj trzeba zliczać punkty
                view.animate();
                newPoints++;
            }
        }
    }
    updatePoints(newPoints);
}

function markItemsToRemove(color, x, y, fakeRemove) {
    var sum = 0;
    if (x < 10 && x >= 0 && y < 10 && y >= 0) {
        var view = gameblocks[x][y];
        if (fakeRemove) {
            if (view.box.bgColor === color) {
                if (!view.fakeRemove) {
                    fakeRemove.value = fakeRemove.value + 1;
                    view.fakeRemove = fakeRemove;
                    markItemsToRemove(color, x - 1, y, fakeRemove);
                    markItemsToRemove(color, x + 1, y, fakeRemove);
                    markItemsToRemove(color, x, y - 1, fakeRemove);
                    markItemsToRemove(color, x, y + 1, fakeRemove);
                }
            }
        } else {
            if (view.box.bgColor === color && view.toRemove !== true) {
                view.toRemove = true;
                sum++;
                sum += markItemsToRemove(color, x - 1, y);
                sum += markItemsToRemove(color, x + 1, y);
                sum += markItemsToRemove(color, x, y - 1);
                sum += markItemsToRemove(color, x, y + 1);
            }
        }
    }
    return sum;
}

function removeMatchingItems() {
    for (var i = 0; i < ROW_COUNT; i++) {
        var toRemove = [];
        for (var j = 0; j < ROW_COUNT; j++) {
            var view = gameblocks[i][j];
            if (view && view.toRemove === true) {
                toRemove.push(view);
            }
        }
        points += 2 ^ toRemove.length;
        for (var b = 0; b < toRemove.length; b++) {
            arrayRemove(gameblocks[i], toRemove[b]);
        }
        animatePoints();
    }
}

function fixIndexes() {
    for (var i = 0; i < ROW_COUNT; i++) {
        for (var j = 0; j < ROW_COUNT; j++) {
            var view = gameblocks[i][j];
            if (view) {
                delete view.toRemove;
                view.setX(i);
                view.setY(j);
            } else {
                addNewBox(BLOCK_SIZE, i, j);
            }
        }
    }
}

function addNewBox(BLOCK_SIZE, i, j) {
    var view = createBox(BLOCK_SIZE, i, j);
    view.box.on('click', handleBoxClick);
    gameblocks[i].push(view);
    return view;
}


for (var i = 0; i < ROW_COUNT; i++) {
    gameblocks.push([]);
    for (var j = 0; j < ROW_COUNT; j++) {
        addNewBox(BLOCK_SIZE, i, j);
    }
}
//
//$.each(gameblocks, function(i, a){
//    $.each(a, function(j, view){
//       view.initAnimation(); 
//    });
//});

var centerModifier = new Modifier({
    origin: [0.5, 0.5],
    align: [0.5, 0.5]
});

var screenLayout = new FlexibleLayout({
    ratios: [1, 10, 1]
});

var mainSurfaces = [];

//first surface
var es = createEmptySurface();

mainSurfaces.push(es);

var mainLayout = new FlexibleLayout({
    ratios: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
});

var verticalSurfaces = [];

mainLayout.sequenceFrom(verticalSurfaces);
for (var i = 0; i < 10; i++) {
    verticalSurfaces.push(createNewView(i));
}

function createNewView(i) {
    var view = new View();
    var layout = new SequentialLayout({
        direction: 1
    });
    view['layout'] = layout;
//    var modifier = new Modifier({
//        align: [0, 1],
//        origin: [0, 1]
//                //transform: Transform.rotateZ(Math.PI)
//    }); //.add(modifier)
    view.add(layout);
    var items = gameblocks[i];
    view['items'] = items;
    layout.sequenceFrom(items);
//    items.push(createEmptySurface({
//        backgroundColor: '#' + i + '' + i + '' + i
//    }));
//    var viewEventSurface = createEmptySurface({
////        zIndex: 1
//    });
//    viewEventSurface.on('click', function () {
//        console.log('surface clicked');
//        var box = createBox(BLOCK_SIZE, BLOCK_SIZE);
////        items.push(box);
//        items.splice(0, 0, box);
//    });
//    view.add(viewEventSurface);
    return view;
}
//Timer.every(function () {
//    var pipe = randomInt(10);
//    es.setContent(pipe);
//    verticalSurfaces[pipe].items.splice(0,0,createBox(BLOCK_SIZE,BLOCK_SIZE));
//    var itemsToRemove = verticalSurfaces[randomInt(10)].items;
//    itemsToRemove.splice(itemsToRemove.length - 1,1);
//}, 5);

//mainSurfaces.push(mainLayout);

mainSurfaces.push(createEmptySurface());

screenLayout.sequenceFrom(mainSurfaces);

var sizeModifier = new StateModifier({
    size: [BLOCK_SIZE * 10, BLOCK_SIZE * 10],
    transform: Transform.rotateZ(Math.PI)
});

var pointsModifier = new StateModifier({
    size: [BLOCK_SIZE * 10, TOP_MARGIN],
    origin: [0.5, 0],
    align: [.5, 0]
});

var POINTS_TEXT = 'Points: ';

function updatePoints(value) {
    points += (3 * (value - 2)) + value - 3;
    pointsSurface.setContent(POINTS_TEXT + points);
    var animDuration = 200;
    //pointsModifier.set

//    pointsModifier.setProportions([0,1], {duration : animDuration}, function(){
//        pointsModifier.setProportions([0,0], {duration : animDuration});
//    });
    pointsModifier.setOrigin([0.60, 0], {duration: animDuration});
    pointsModifier.setTransform(Transform.scale(1.2, 1.2), {duration: animDuration}, function () {
        pointsModifier.setOrigin([0.5, 0], {duration: animDuration});
        pointsModifier.setTransform(Transform.scale(1, 1), {duration: animDuration});
    });
}

var pointsSurface = new Surface({
    content: POINTS_TEXT + points,
    size: [BLOCK_SIZE * 10, TOP_MARGIN],
    classes: ['points'],
    properties: {
    }
});
mainContext.add(inputCatcher);
var screenLayout = mainContext.add(centerModifier);
screenLayout.add(sizeModifier).add(mainLayout);
mainContext.add(pointsModifier).add(pointsSurface);

