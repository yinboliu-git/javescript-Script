// ==UserScript==
// @name         自动发放腾讯文档
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动发放腾讯文档，解决班级表格填写问题。
// @author       ybliu
// @supportURL   https://github.com/
// @compatible   chrome
// @compatible   firefox
// @license      MIT
// @include      *//docs.qq.com/*

// @run-at       document-start
// @grant        none
// ==/UserScript==

(
    function () {
        /// 暂时无法自动重命名可以通过手动重命名
        var rename = 'yes';  // 是否重命名
        var model_name = "理学院研究生健康日报";  //模板名称
        var input_user_name = "我的小号管理群";   //分享到的群名
        var next_time = 1000 * 60 * 60 * 24 * 1;     // 1000 * 秒 * 分钟 * 小时 * 天  // 这里表示1天后重新发送

        function ones() {
            // alert('ccc');
            console.log("成功执行...");
            var all_model = document.getElementsByClassName("search-list-item");
            var yesno = 0;
            for (var i = 0; i < all_model.length; i++) {
                console.log("遍历中");
                var model_text = all_model.item(i).getElementsByClassName("title").item(0).textContent;
                if (model_text == model_name) {
                    all_model.item(i).getElementsByClassName("title").item(0).click();
                    yesno = 1;
                    break;
                }
            }
            if (yesno == 1) {
                window.setTimeout(() => window.close(), 1000);
            } else {
                console.log("匹配失败...");
                alert('请输入有效的模板名称...');
            }

        }

        function twos() { // 打开sheet表
            var name_id = document.querySelector("#header-top > div.left-container > div.dui-trigger.dui-tooltip.pc-header-title.dui-tooltip-wrapper > div > div > div > input");
            var sheet_name_txt = document.querySelector("#header-top > div.left-container > div.dui-trigger.dui-tooltip.pc-header-title.dui-tooltip-wrapper > div > div > div > span");
            var d = new Date();
            var str = '';
            str += d.getFullYear() + '年'; //获取当前年份
            str += d.getMonth() + 1 + '月'; //获取当前月份（0——11）
            str += d.getDate() + '日';
            
            if( name_id.value.indexOf(model_name)==-1){
                console.log("名字不匹配，不分享");
                return;
            }
            else{
                console.log("匹配成功..");
            
            }

            sheet_name_txt.innerText = str+model_name;
            console.log(sheet_name_txt.textContent);

            name_id.value = sheet_name_txt.textContent;  //表格重命名
            console.log(name_id.value);
            var share_time = 2000;
            if(rename == 'yes'){
                alert( "请重命名" + sheet_name_txt.textContent);
                share_time = 1000 * 30; // 30S

            }

            function share_step() { // 点击分享
                var share_id = document.querySelector("#header-top > div.right-container > button > div");
                share_id.click();

                function edit_all() { // 点击“所有人可编辑”
                    var edit_id = document.querySelector("#doc-sharebox-container > div > div.content-dialog-container > div > div.content-dialog-content > div:nth-child(2) > div:nth-child(2) > ul > li:nth-child(4) > span");
                    edit_id.click();

                    function QQ_share() { // 点击 通过QQ分享
                        var QQ_id = document.querySelector("#doc-sharebox-container > div > div.content-dialog-container > div > div.content-dialog-content > div:nth-child(4) > div > div:nth-child(2) > div:nth-child(1) > div.auth-icon.auth-icon-qq");
                        QQ_id.click();

                        function group_all_func() {  // 点击 群聊
                            var group_all = document.querySelector("#FriendSelectorDialog > div > div.selector_sidebar > div.selector_buddytree > div > div > div:nth-child(2) > div > span.triangle");
                            group_all.click();

                                            var top_value = 0;
                var number = null;
                let time_id = window.setInterval(function () {
                    var scroll_div_id = document.querySelector("#FriendSelectorDialog > div > div.selector_sidebar > div.selector_buddytree > div");
                    var father_div = document.querySelector("#FriendSelectorDialog > div > div.selector_sidebar > div.selector_buddytree > div > div");
                    var list_div = father_div.childNodes;
                    for (var i = 3; i < list_div.length; i++) { // 遍历所有群名
                        var div_one = document.querySelector("#FriendSelectorDialog > div > div.selector_sidebar > div.selector_buddytree > div > div > div:nth-child(" + i + ") > ul > li > div > div.user-unit-name-outer-container.user-unit-inline-block > div");
                        var div_inner = div_one.innerText;
                        console.log(div_inner);
                        var a_str = input_user_name.toString();
                        var b_str = div_inner.toString();
                        if (a_str == b_str) { // 比较 这一群名是否与我们的群名相同
                            console.log("判断成功...");
                            div_one.click();
                            clearInterval(time_id);
                            console.log("清除时间...");
                            window.setTimeout(function () { // 点击 确定提交按钮
                                console.log("执行submit_id");
                                var submit_id = document.querySelector("#FriendSelectorDialog > div > div.txdoc-us-selected > div > button");
                                submit_id.click();
                            }, 2000);
                            break;
                        } else {
                            console.log("判断失败...");
                        }
                    }
                    if (list_div.length >= 1) {
                        top_value = top_value + 200;
                        console.log(top_value);
                        scroll_div_id.scrollTop = top_value;
                    }

                }, 1000);
                        }

                        window.setTimeout(() => group_all_func(), 2000);
                    }

                    window.setTimeout(() => QQ_share(), 2000);
                }

                tiemId = window.setTimeout(() => edit_all(), 2000);

            }

            tiemId = window.setTimeout(() => share_step(), share_time);
        }

        function all_step() {
            var self_href = window.location.href;
            if (self_href.indexOf("craft") > -1) {
                ones();
            } else if (self_href.indexOf("sheet") > -1) {
                twos();
                window.setTimeout(function () {
                    console.log("转回模板");
                    window.location.href = "https://docs.qq.com/mall/profile/craft";
                }, next_time);  // 重新打卡模板文件
            }
        }


        window.onload = function () {
            var timeId = 0;
            for (var i = 0; i < 1; i++) {
                tiemId = window.setTimeout(() => all_step(), 1000);
            }
            window.clearTimeout(timeId);
        };
    }
)();