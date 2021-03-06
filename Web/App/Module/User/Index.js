define(["require", "exports", 'Application', 'Services/Account', 'Services/Member', 'Services/Service'], function (require, exports, app, account, member, services) {
    requirejs(['css!content/User/Index']);
    return function (page) {
        /// <param name="page" type="chitu.Page"/>
        var model = {
            groups: [],
            showItemPage: function (item) {
                if (item.url == 'User_Logout') {
                    return app.redirect('Home_Index');
                }
                return app.redirect(item.url);
            },
            member: {
                Score: ko.observable(),
                Level: ko.observable(),
                UserName: ko.observable(),
                Banlance: ko.observable(0)
            },
            notPaidCount: account.orderInfo.notPaidCount,
            toReceiveCount: account.orderInfo.toReceiveCount,
            evaluateCount: account.orderInfo.evaluateCount,
            username: ko.observable(),
            balance: ko.observable(),
            headImageUrl: member.currentUserInfo.HeadImageUrl,
            nickName: member.currentUserInfo.NickName,
        };
        var score_menu_item = { name: '我的积分', url: '#User_ScoreList', value: ko.observable() };
        var i = 0;
        model.groups[i++] = [
            { name: '收货地址', url: '#User_ReceiptList', value: ko.observable() },
            { name: '我的收藏', url: '#User_Favors', value: ko.observable() },
            score_menu_item,
            { name: '我的优惠券', url: '#User_Coupon', value: ko.observable() },
        ];
        model.groups[i++] = [
            { name: '账户安全', url: '#User_AccountSecurity_Index', value: '' },
        ];
        if (!services['weixin']) {
            model.groups[model.groups.length - 1].push({ name: '退出', url: '#User_Index_Logout', value: ko.observable() });
        }
        page.load.add(function (sender, args) {
            if ((args.type || '') == 'Logout') {
                member.logout();
                app.redirect('Home_Index');
                return;
            }
            var result = account.userInfo().done(function (result) {
                model.notPaidCount(result.NotPaidCount);
                model.toReceiveCount(result.SendCount);
                model.evaluateCount(result.ToEvaluateCount);
                model.username(result.UserName);
                model.balance(result.Balance);
                score_menu_item.value(result.Score);
            });
            return result;
        });
        page.viewChanged.add(function () { return ko.applyBindings(model, page.nodes().content); });
    };
});
