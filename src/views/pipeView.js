var counter = 0;

defineView('pipeView', {
    items: [],
    layout: new SequentialLayout({
        //direction: 1
    }),
    initView: function (view) {
        view.add(this.layout);
        this.layout.sequenceFrom(this.items);
//        this.items.push(new Surface({
//            size: [undefined, 100],
//            content: '' + counter++
//        }));
    }
});

