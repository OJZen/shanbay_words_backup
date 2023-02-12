# 扇贝生词导出脚本

此程序绝大部分代码由ChatGPT生成，本人略懂`JavaScript`，但没有学过Node.js，所以不清楚代码是否存在潜在性的重大Bug。

它仅仅只是“能用”

## 如何使用

两个步骤：

1. 在`shanbay.js`文件中，把自己账号的Cookie填入。（只需`auth_token`字段）
2. 在项目目录，执行`node ./main.js`

程序会在`output`文件夹中生成两个文件：`learning.md`与`unlearned.md`，分别是正在学和未学习的生词。

## 导出内容

默认导出`Markdown`格式的文件。

由两个部分组成，生词与词意的列表与单个生词集合。

![生词与词意列表](https://github.com/OJZen/shanbay_words_backup/blob/main/img/1.png?raw=true)

![单个生词集合](https://github.com/OJZen/shanbay_words_backup/blob/main/img/2.png?raw=true)

## 为什么使用Node.js

扇贝的api中需要使用一段已混淆的js代码来解密数据，所以Node是低成本，最自然的选择。

## 关于

可能是担心用户流失，很多英语APP都没有导出生词文本的功能，扇贝APP的导出功能仅能导出PDF文件，主要是用于打印。

最近经常在玩ChatGPT，想了个绝妙的背单词方式，那就是通过单词生成小故事，单词有了上下文，记起来就特别轻松。打算将扇贝所有生词导出来试试，于是就有了这个程序。

