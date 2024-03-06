// ==UserScript==
// @name         Beautiful Coze| Coze 聊天面板美化
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description   Coze 聊天面板美化
// @author       xx025
// @homepage     https://github.com/xx025/strawberry
// @match        https://www.coze.com/*
// @icon         https://github.com/xx025/strawberry/assets/71559822/ca1d8156-972b-4d95-9e24-732c906e4335
// @grant        none
// ==/UserScript==


function generateRandomClassName() {
    return 'class-' + Math.random().toString(36).substr(2, 8);
}

const randomClassName = generateRandomClassName();

function main() {
    const switch_btn_svg_text = '<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 17H4M4 17L8 13M4 17L8 21M4 7H20M20 7L16 3M20 7L16 11" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    // 获取panel 的三个孩子，他们分别是 提示栏 、插件栏、聊天栏
    const panel = document.querySelector(".sidesheet-container");
    const prompt = panel.children[0];
    const plugin = panel.children[1];
    const chat = panel.children[2];

    //  设置prompt 和 plugin 的 占比 25% 和 75%
    prompt.style.width = '25vw';
    plugin.style.width = '25vw';
    chat.style.width = '75vw';

    // 设置一个变量显示 prompt 栏 或者 plugin 栏
    let is_prompt = true;

    // 获取 prompt 和 plugin 的 herder div
    const prompt_header = prompt.childNodes[0]
    const plugin_header = plugin.childNodes[0]

    //根据 switch_btn 生成一个 div 元素 class name 为 switch_btn_div

    //  通过原生js 创建一个 div 元素
    const switch_btn_div = document.createElement('div');

    // 设置switch_btn_div 的样式 鼠标为小手样式
    switch_btn_div.style.cursor = 'pointer';
    // 创建一个图片元素
    const switch_btn = document.createElement('img');
    // 设置图片的 src 属性
    switch_btn.src = 'data:image/svg+xml;base64,' + btoa(switch_btn_svg_text);
    // 设置 图片 高和宽都为 20px
    switch_btn.width = 20;
    switch_btn.height = 20;
    // 将图片元素添加到 div 元素中
    switch_btn_div.appendChild(switch_btn);
    // 为 div 元素添加 class name
    switch_btn_div.classList.add('switch_btn_div');
    switch_btn_div.classList.add(randomClassName); //将作为监听元素的 class name


    // 将 div 元素添加到 prompt_header 中
    prompt_header.appendChild(switch_btn_div);
    // 将 div 元素添加到 plugin_header 中
    plugin_header.appendChild(switch_btn_div.cloneNode(true));
    // 再次通过 class name 获取 switch_btn_div 元素，防止因为 cloneNode 导致的引用错误
    const handel_switch_btn_div = document.querySelectorAll('.switch_btn_div');

    function control_panel_view() {
        // 如果 is_prompt 为 true 则将 prompt 隐藏，plugin 显示，否则将 prompt 显示，plugin 隐藏
        if (is_prompt) {
            prompt.style.display = 'block';
            plugin.style.display = 'none';
        } else {
            prompt.style.display = 'none';
            plugin.style.display = 'block';
        }
        // 将 is_prompt 取反
        is_prompt = !is_prompt;
    }

    // 初始化的时候也要调用一次
    control_panel_view();
    // 为 switch_btn_div 元素添加点击事件
    handel_switch_btn_div.forEach((item) => {
        item.addEventListener('click', function () {
            control_panel_view();
        });
    });
}

//  创建一个定时器等待 panel 出现

let timer = setInterval(function () {
    //监听sidesheet-container是否出现
    const container = document.querySelector(".sidesheet-container");
    if (container) {
        const insert_ok = document.querySelector(`.${randomClassName}`);
        if (!insert_ok) {
            try {
                main()
            } catch (e) {
                console.log(e)
            }
        } else {
            console.log('already insert')
        }
    } else {
        console.log('waiting for sidesheet-container')
    }
}, 1000);

