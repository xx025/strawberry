// ==UserScript==
// @name         Beautiful Coze| Coze 聊天面板美化 |免费GPT4
// @namespace    http://tampermonkey.net/
// @version      0.0.7.3
// @description  👍👍最新适配，超级好用||️Coze 聊天面板美化| 提示栏和插件栏的切换| 聊天面板全屏| Coze chat panel beautification| Switch between prompt bar and plugin bar| Full screen chat panel
// @author       xx025
// @homepage     https://github.com/xx025/strawberry
// @match        https://www.coze.com/*
// @icon         https://mirror.ghproxy.com/https://raw.githubusercontent.com/xx025/strawberry/main/coze_com/icon.png
// @supportURL   https://github.com/xx025/strawberry/issues
// @grant        none
// ==/UserScript==


// 几个按钮的 svg 文本
const switch_btn_svg_text = '<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 17H4M4 17L8 13M4 17L8 21M4 7H20M20 7L16 3M20 7L16 11" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const expend_btn_svg_text = '<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 8L21 3M21 3H16M21 3V8M8 8L3 3M3 3L3 8M3 3L8 3M8 16L3 21M3 21H8M3 21L3 16M16 16L21 21M21 21V16M21 21H16" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
const unexpected_btn_svg_text = '<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 14H10M10 14V20M10 14L3 21M20 10H14M14 10V4M14 10L21 3" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'

// 美化滚动条的css 代码
const beautify_scrollbar_css = '/* 滚动槽 */::-webkit-scrollbar {    width: 6px;    height: 6px;}::-webkit-scrollbar-track {    border-radius: 3px;    background: rgba(0,0,0,0.06);    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.08);}/* 滚动条滑块 */::-webkit-scrollbar-thumb {    border-radius: 3px;    background: rgba(0,0,0,0.12);    -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.2);}'

//  将美化滚动条的css 代码插入到页面中
const style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = beautify_scrollbar_css;
document.getElementsByTagName('head').item(0).appendChild(style);


// 设置一个变量显示 prompt 栏 或者 plugin 栏
// 设置一个变量显示 unexpected_btn_div 元素
// 定义一个对象来存储变量，并为这些变量设置setter和getter
// 使用这个对象设置和获取变量
// 设置变量时，它们的新值会存储到localStorage里面，下一次加载页面时，它们会从localStorage初始化。
const settings = {
    _is_prompt: localStorage.getItem('is_prompt') === null ? true : localStorage.getItem('is_prompt') === 'true',
    _is_expected: localStorage.getItem('is_expected') === null ? false : localStorage.getItem('is_expected') === 'true',

    get is_prompt() {
        return this._is_prompt;
    },
    set is_prompt(value) {
        this._is_prompt = value;
        // 当变量改变时，将其存储到localStorage
        localStorage.setItem('is_prompt', value);
    },
    get is_expected() {
        return this._is_expected;
    },
    set is_expected(value) {
        this._is_expected = value;
        // 当变量改变时，将其存储到localStorage
        localStorage.setItem('is_expected', value);
    }
};

//使用svg文本生成img元素
function generate_img_element(svg_text) {
    const v_img = document.createElement('img');
    v_img.src = 'data:image/svg+xml;base64,' + btoa(svg_text);
    v_img.width = 16;
    v_img.height = 16;
    return v_img
}

//使用img元素生成div元素
function generate_div_element(svg_text, class_names) {
    const v_div = document.createElement('div');
    v_div.appendChild(generate_img_element(svg_text))
    v_div.classList.add('semi-button', 'semi-button-primary', 'semi-button-size-small', 'semi-button-borderless', 'semi-button-with-icon', 'semi-button-with-icon-only')
    v_div.style.cursor = 'pointer';
    class_names.forEach(
        (item) => {
            v_div.classList.add(item);
        }
    )
    return v_div
}


function generateRandomClassName() {
    return 'class-' + Math.random().toString(36).substr(2, 8);
}

const randomClassName = generateRandomClassName();

function main() {


    const panel = document.querySelector(".sidesheet-container");


    const dev_container = panel.children[0]
    const prompt = dev_container.children[1].children[0];
    const skill = dev_container.children[1].children[1];

    const chat = panel.children[1];


    prompt.style.width = '25vw';
    skill.style.width = '25vw';
    chat.style.width = '75vw';



    const dd_header = dev_container.children[0]
    dd_header.children[0].style.display='none' // 隐藏title 标题
    // 为开发栏上方插入一个切换按钮

    const switch_btn=generate_div_element(switch_btn_svg_text, ['switch_btn_div', randomClassName]);
    switch_btn.style.marginLeft= '10px';
    dd_header.children[1].appendChild(switch_btn);

    prompt.children[0].style.height = '95%'
    skill.children[0].style.height = '95%'


    //  全屏按钮
    const exp_btn = generate_div_element(expend_btn_svg_text, ['expend_btn_div', randomClassName, 'expend_btn']);
    const unexp_btn = generate_div_element(unexpected_btn_svg_text, [`unexpected_btn_div`, randomClassName, `expend_btn`]);
    chat.children[0].appendChild(exp_btn);
    chat.children[0].appendChild(unexp_btn);

    // 聊天界面容器
    const chat_box = chat.childNodes[1]
    function render_ui(is_prompt, is_expected) {
        if (is_expected) {
            // 处于展开状态
            // 展示 prompt
            exp_btn.style.display = 'none';
            unexp_btn.style.display = 'block';

            dd_header.style.display = 'none';// 隐藏 dd_header
            prompt.style.display = 'none'; // 将 prompt 和 plugin 的显示都设置为 none
            skill.style.display = 'none';
            // 将 chat 的宽度设置为 100%
            chat.style.width = '100vw';
            chat.style.backgroundColor = 'white';
            chat_box.style.width = '50vw'
            chat_box.style.marginLeft = '25vw'
        } else {

            exp_btn.style.display = 'block';
            unexp_btn.style.display = 'none';
            chat.style.width = '75vw' // 将 chat 的宽度设置为 75%
            dd_header.style.display = ''; // 显示 dd_header
            chat_box.style.width = '' // 将 chat_box 的宽度设置为 ''
            chat_box.style.marginLeft = '' // 将 chat_box 的 marginLeft 设置为 ''
            if (is_prompt) {
                prompt.style.display = 'block';
                skill.style.display = 'none';
            } else {
                prompt.style.display = 'none';
                skill.style.display = 'block';
            }
        }
    }

    // 初始化的时候也要调用一次
    render_ui(settings.is_prompt, settings.is_expected)

    const handel_switch_btn_div = document.querySelectorAll('.switch_btn_div');
    // 为 switch_btn_div 元素添加点击事件
    handel_switch_btn_div.forEach((item) => {

        item.addEventListener('click', function () {
            settings.is_prompt = !settings.is_prompt;
            render_ui(settings.is_prompt, settings.is_expected)
        });
    });
    // 为 expend_btn 元素添加点击事件
    const handel_expend_btn_div = document.querySelectorAll('.expend_btn');
    handel_expend_btn_div.forEach((item) => {
        item.addEventListener('click', function () {
            settings.is_expected = !settings.is_expected;
            render_ui(settings.is_prompt, settings.is_expected)
        });
    });
}


const targetNode = document.body;// 选择要观察的目标节点
const config = {attributes: true, childList: true, subtree: true};// 观察器的配置（需要观察哪些变动）
// 当观察到变动时执行的回调函数
const callback = function (mutationsList, observer) {    // 针对每一个变动进行处理
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {            // 子节点变化
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
        }
    }
};
// 创建一个观察器实例并传入回调函数
const observer = new MutationObserver(callback);
// 以上述配置开始观察目标节点
observer.observe(targetNode, config);

