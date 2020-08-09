# it is a prototype

# inject

do the following steps to the markdown tmLanguage file, and inject to source.python

https://github.com/microsoft/vscode-markdown-tm-grammar/blob/master/syntaxes/markdown.tmLanguage

specifically, this version  
https://github.com/microsoft/vscode-markdown-tm-grammar/blob/4be9cb335581f3559166c319607dac9100103083/syntaxes/markdown.tmLanguage

-> `syntaxes/python.cell.markdown.tmLanguage.raw.xml`

remove fenced code except `unknown`, because it is impossible to fix including other language with pure textmate rule

remove frontMatter

change scope name

`^`->`^# `, `\G`=>`\G# `, (`\n`->`\n# `)?

**difficult part**: to make it possible to change the color of `#`

---

todo
+ [ ] fix multi level list
+ [ ] fix not stopping fenced code
+ [x] fix quote

