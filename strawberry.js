// ==UserScript==
// @name         arXiv论文一键有道翻译
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  arXiv论文一键直达有道翻译，免去来回复制
// @author       xx025
// @homepage     https://github.com/xx025/strawberry
// @match        https://arxiv.org/abs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arxiv.org
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
    'use strict';


    // 获取要在其后添加新元素的元素
    const list = document.querySelector(".full-text ul");

    // 创建新的 li 元素
    const newLi = document.createElement("li");
    newLi.style.color = "black";

    // 创建 a 元素，并设置其 href 和 class 属性
    const newLink = document.createElement("a");
    newLink.href = `https://fanyi.youdao.com/trans/#/home?keyfrom=fanyiweb&url=${location.href}&type=undefined`
    newLink.className = "abs-button download-format";
    newLink.target = "_blank";// 在新标签中打开链接
    newLink.style.color = "#8cbd18";

    // 设置 a 元素的文本内容
    const linkText = document.createTextNode("🐉一键翻译");
    newLink.appendChild(linkText);

    // 将 a 元素添加到新的 li 元素中
    newLi.appendChild(newLink);

    // 将新的 li 元素添加到列表中
    list.appendChild(newLi);


})();