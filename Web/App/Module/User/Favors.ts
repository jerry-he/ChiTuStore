﻿import shopping = require('Services/Shopping')
import c = require('ui/ScrollLoad');
requirejs(['css!content/User/Favors'], function () { });

export = function (page: chitu.Page) {
    var config = {
        pullDown: {}
    }
    //c.scrollLoad(page, config);

    var model = {
        favors: ko.observableArray(),
        loading: ko.observable(),
        unfavor: (item) => {
            shopping.unFavorProduct(item.ProductId).done(() => {
                item.Status('UnFavor');
            });
        },
        showProduct: (item) => {
            window.location.href = '#Home_Product_' + ko.unwrap(item.ProductId);
        }
    }

    page.load.add(function () {
        model.loading(true);
        return shopping.getFavorProducts()
            .done((data) => {
                for (var i = 0; i < data.length; i++) {
                    data[i].Status = ko.observable('Favor');
                    model.favors.push(data[i]);
                }
            })
            .always(() => {
                model.loading(false);
            });
    });

    page.viewChanged.add(() => ko.applyBindings(model, page.node()));
} 