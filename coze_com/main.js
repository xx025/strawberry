// ==UserScript==
// @name         Beautiful Coze| Coze 聊天面板美化
// @namespace    http://tampermonkey.net/
// @version      0.0.2
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
    const expend_btn_svg_text = '<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 8L21 3M21 3H16M21 3V8M8 8L3 3M3 3L3 8M3 3L8 3M8 16L3 21M3 21H8M3 21L3 16M16 16L21 21M21 21V16M21 21H16" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    const unexpected_btn_svg_text = '<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 14H10M10 14V20M10 14L3 21M20 10H14M14 10V4M14 10L21 3" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'


    // 设置一个变量显示 prompt 栏 或者 plugin 栏
    let is_prompt = true;
    // 设置一个变量显示 unexpected_btn_div 元素
    let is_expected = false;

    function generate_img_element(svg_text) {
        const v_img = document.createElement('img');
        v_img.src = 'data:image/svg+xml;base64,' + btoa(svg_text);
        v_img.width = 20;
        v_img.height = 20;
        return v_img
    }

    function generate_div_element(svg_text, class_names) {
        const v_div = document.createElement('div');
        v_div.appendChild(generate_img_element(svg_text))
        v_div.style.cursor = 'pointer';
        class_names.forEach(
            (item) => {
                v_div.classList.add(item);
            }
        )
        return v_div
    }

    // 获取panel 的三个孩子，他们分别是 提示栏 、插件栏、聊天栏
    const panel = document.querySelector(".sidesheet-container");
    const prompt = panel.children[0];
    const plugin = panel.children[1];
    const chat = panel.children[2];
    prompt.style.width = '25vw';
    plugin.style.width = '25vw';
    chat.style.width = '75vw';


    const dd_header = document.querySelector(".semi-spin-children").childNodes[0]


    // 获取 prompt 和 plugin 的 herder div
    const prompt_header = prompt.childNodes[0]
    const plugin_header = plugin.childNodes[0]
    const chat_header = chat.childNodes[0]


    const switch_btn_div = generate_div_element(switch_btn_svg_text, ['switch_btn_div', randomClassName]);
    prompt_header.appendChild(switch_btn_div);
    plugin_header.appendChild(switch_btn_div.cloneNode(true));


    const expend_btn_div = generate_div_element(expend_btn_svg_text, ['expend_btn_div', randomClassName, 'expend_btn']);
    const unexpected_btn_div = generate_div_element(unexpected_btn_svg_text, [`unexpected_btn_div`, randomClassName, `expend_btn`]);

    // 将unexpected_btn_div 隐藏
    unexpected_btn_div.style.display = 'none';
    chat_header.appendChild(expend_btn_div);
    chat_header.appendChild(unexpected_btn_div);

    function control_panel_view(handel_target = 'switch_btn') {
        if (handel_target === 'switch_btn') {
            if (is_prompt) {
                prompt.style.display = 'block';
                plugin.style.display = 'none';
            } else {
                prompt.style.display = 'none';
                plugin.style.display = 'block';
            }
            is_prompt = !is_prompt;
        } else if (handel_target === 'expend_btn') {
            if (!is_expected) {
                // 如果是展开状态，则隐藏展开按钮，显示收起按钮
                unexpected_btn_div.style.display = 'block';
                expend_btn_div.style.display = 'none';
                dd_header.style.display = 'none';
            } else {
                unexpected_btn_div.style.display = 'none';
                expend_btn_div.style.display = 'block';
                dd_header.style.display = '';
            }
            // 将 is_expected 取反
            is_expected = !is_expected;
        }

    }

    // 初始化的时候也要调用一次
    control_panel_view();

    const handel_switch_btn_div = document.querySelectorAll('.switch_btn_div');
    // 为 switch_btn_div 元素添加点击事件
    handel_switch_btn_div.forEach((item) => {
        item.addEventListener('click', function () {
            control_panel_view('switch_btn');
        });
    });

    // 为 expend_btn 元素添加点击事件
    const handel_expend_btn_div = document.querySelectorAll('.expend_btn');
    handel_expend_btn_div.forEach((item) => {
        item.addEventListener('click', function () {
            control_panel_view('expend_btn');
            console.log('click')
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

