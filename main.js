const shanbay = require('./shanbay');
const fs = require('fs');

// 将json数据转为数组
function dataToItems(data) {
    let items = []
    for (const obj of data.objects) {
        const vocabulary = obj.vocabulary
        const sound = obj.vocabulary.sound
        //console.log(vocabulary.word);
        let item = [];
        // 单词
        item.word = vocabulary.word;
        // 中文解释，数量不定
        item.definition = ""
        for (let i = 0; i < vocabulary.senses.length; i++) {
            let s = vocabulary.senses[i];
            // 词性+词意
            item.definition += s.pos + " " + s.definition_cn;
            // 如果不是最后一个要添加换行符
            if (i < vocabulary.senses.length - 1) {
                item.definition += '<br>';
            }
        }
        // 发音
        item.pronunciation_uk = sound.ipa_uk;
        item.pronunciation_us = sound.ipa_us;
        // 保存到集合
        items.push(item);
    }
    return items
}

// 正在学习的生词
let learning_words = [];
async function fetchLearningData(page = 1) {
    // 请求
    let data = await shanbay.learning_items(page);
    // JSON，有需要可以打印出来看看
    const responseData = JSON.parse(data);
    // 如果没有数据，说明已经到页末了。
    if (responseData.objects.length === 0) {
        saveFile("learning", learning_words);
        return;
    }
    // 测试用的，只输出两页
    // if (responseData.page > 2) {
    //     saveFile("learning", learning_words);
    //     return;
    // }
    // 拼接数组
    learning_words = learning_words.concat(dataToItems(responseData))
    // 下一页
    page += 1;
    // 随机延迟500-2000ms执行下一次请求
    setTimeout(function () {
        fetchLearningData(page);
    }, Math.floor(Math.random() * (2000 - 500 + 1) + 500));
}

// 未学习的生词（复制粘贴^_^）
let unlearned_words = [];
async function fetchUnlearnedData(page = 1) {
    let data = await shanbay.unlearned_items(page);
    const responseData = JSON.parse(data);
    if (responseData.objects.length === 0) {
        saveFile("unlearned", unlearned_words);
        return;
    }
    unlearned_words = unlearned_words.concat(dataToItems(responseData))
    page += 1;
    setTimeout(function () {
        fetchUnlearnedData(page);
    }, Math.floor(Math.random() * (2000 - 500 + 1) + 500));
}

function saveFile(filename, words) {
    console.log("done\n saving to the file...");
    // 开头
    let data = "## 生词表\n|  单词 | 发音 | 解释  |\n|  ---- | ---- | ----  |\n";
    for (const item of words) {
        data += `| ${item.word} | ${item.pronunciation_us} | ${item.definition} |\n`;
    }
    data += "## 单词集合\n";
    for (const item of words) {
        data += `${item.word}, `;
    }
    // 删除最后一个逗号
    if (words.length > 0) {
        data = data.slice(0, -2);
    }
    // 判断文件夹是否存在
    const folderPath = "./output"
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }

    // 写到文件
    fs.writeFile(`${folderPath}/${filename}.md`, data, 'utf-8', (err) => {
        if (err) throw err;
        console.log('saved!');
    });
}

fetchLearningData().catch(error => {
    console.error(error);
});;

fetchUnlearnedData().catch(error => {
    console.error(error);
});;

