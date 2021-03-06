define(["require", "exports", 'Services/Info', 'Site'], function (require, exports, info, site) {
    requirejs(['css!content/Home/NewsList']);
    return function (page) {
        var select_args = { categoryName: '', pageIndex: 0 };
        var scroll_end = false;
        var model = {
            articles: ko.observableArray(),
            currentCategory: ko.observable(),
        };
        page.load.add(function (sender, args) {
            return info.getArticles(select_args).done(function (items) {
                for (var i = 0; i < items.length; i++) {
                    model.articles.push(items[i]);
                }
                select_args.pageIndex = select_args.pageIndex + 1;
                sender.enableScrollLoad = items.length == site.config.pageSize;
            });
        });
        page.viewChanged.add(function () { return ko.applyBindings(model, page.nodes().content); });
    };
});
