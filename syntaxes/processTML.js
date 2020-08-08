const fs = require('fs')
let re = ''
let rawTML = fs.readFileSync('./syntaxes/python.cell.markdown.tmLanguage.raw.xml', { encoding: 'utf-8' }).replace(/(\r?\n|\r\n?)/g, '\n')
let TPL = fs.readFileSync('./syntaxes/python.markdown.inject.tmLanguage.tpl', { encoding: 'utf-8' }).replace(/(\r?\n|\r\n?)/g, '\n')
let tmls = {
  /** @type {String} */
  last: rawTML,
  /** @type {String} */
  lastName: 'rawTML',
  /** @type {(String)=>Object} */
  write: function (name) {
    fs.writeFileSync(`./syntaxes/tmp/${name || this.lastName}.xml`, this.last, { encoding: 'utf-8' })
    return this
  },
  /** @type {(String,RegExp,Any)=>Object} */
  replace: function (name, re, target) {
    let next = this.last.replace(re, target)
    this[name] = next
    this.last = next
    this.lastName = name
    return this
  },
  /** @type {(String,RegExp)=>Object} */
  remove: function (name, re) {
    return this.replace(name, re, '')
  },
}
let i = 1;
tmls
// 1
.remove('s' + (i++), new RegExp(String.raw`^.*?encoding="UTF-8"[\s\S\n]*^    <dict>`, 'gmi'))
.write()
.remove('s' + (i++), new RegExp(String.raw`^    </dict>[\s\S\n]*?</plist>`, 'gmi'))
.write()
// 3
.remove('s' + (i++), new RegExp(String.raw`      <key>fenced_code([^u]|u(?!nknown))*([^\n]|\n(?!      </dict>))*^      </dict>`, 'gmi'))
.write()
.remove('s' + (i++), new RegExp(String.raw`(?<=#fenced_code_block)_(?!unknown)([^_]|\n|_(?!unknown))*`, 'gmi'))
.write()
.remove('s' + (i++), new RegExp(String.raw`      <key>frontMatter</key>`, 'gmi'))
.write()
.remove('s' + (i++), new RegExp(String.raw`^      <dict>([^d]|d(?!ict))*frontMatter[\s\S\n]*?^      </dict>`, 'gmi'))
.write()
// 7
.replace('s' + (i++), new RegExp(String.raw`\^\|\\G`, 'gmi'), 'START_MARK_1')
.write()
.replace('s' + (i++), new RegExp(String.raw`(?<!\[)\^`, 'gmi'), 'START_MARK_2')
.write()
.replace('s' + (i++), new RegExp(String.raw`\$\\n`, 'gmi'), 'END_MARK_1')
.write()
.replace('s' + (i++), new RegExp(String.raw`(?<=<string>)[^<]*\.markdown(?=</string>)`, 'gmi'), v => v + '.python')
.write()
// 11 
// add `while` check for `fenced_code_block_unknown`
// to make that no-comment can break it <- it seems do not work, to be fixed
.replace('s' + (i++), new RegExp(String.raw`<key>fenced_code_block_unknown</key>[\s\S\n]*?(?=^        <key>end</key>)`, 'gmi'), v => v + String.raw`        <key>while</key>
        <string>(START_MARK_1)(?!(\2|\s{0,3})(\3)\s*$)</string>
`)
.write()
// 12
// fix match.*\n.*?<string>.*?START_MARK_1
//      <key>separator</key>
.replace('s' + (i++), new RegExp(String.raw`match.*\n.*?<string>\(START_MARK_1.*\n`, 'gmi'), v => v + String.raw`        <key>captures</key>
        <dict>
          <key>1</key>
          <dict>
            <key>name</key>
            <string>SHARP_MARK_1</string>
          </dict>
        </dict>
`)
.write()
// 13
//      <key>heading</key>
.replace('s' + (i++), new RegExp(String.raw`^.*?match.*\n.*?<string>\(.+?START_MARK_1(.*\n){4}`, 'gmi'), v => String.raw`        <key>match</key>
        <string>(START_MARK_1)[ ]{0,3}(#{1,6}\s+(.*?)(\s+#{1,6})?\s*)$</string>
        <key>captures</key>
        <dict>
          <key>1</key>
          <dict>
            <key>name</key>
            <string>SHARP_MARK_1</string>
          </dict>
          <key>2</key>
`)
.write()
// 14
// fix (begin|end|while).*\n.*?<string>.*?START_MARK_1
//      fix match but not captures
re=String.raw`^(.*)(begin|end|while)(.*\n.*?<string>.*?START_MARK_1.*\n)((?:.(?!\2captures))*\n)`
tmls
.replace('s' + (i++), new RegExp(re, 'gmi'), v => {
  let match = new RegExp(re, 'mi').exec(v)
  let indent = /^\ */.exec(match[1])[0]
  return match[1]+match[2]+match[3]+String.raw`${indent}<key>${match[2]}Captures</key>
${indent}<dict>
${indent}  <key>1</key>
${indent}  <dict>
${indent}    <key>name</key>
${indent}    <string>SHARP_MARK_1</string>
${indent}  </dict>
${indent}</dict>
`+match[4]
})
.write()
// 15
//      fix captures but not name
re=String.raw`^(.*(?:begin|end|while).*\n.*?<string>.*?START_MARK_1(?:.*\n){3})(.*<key>(?:[^1]|1\d+)</key>)`
tmls
.replace('s' + (i++), new RegExp(re, 'gmi'), v => {
  let match = new RegExp(re, 'mi').exec(v)
  let indent = /^\ */.exec(match[1])[0]
  return match[1]+String.raw`${indent}  <key>1</key>
${indent}  <dict>
${indent}    <key>name</key>
${indent}    <string>SHARP_MARK_1</string>
${indent}  </dict>
`+match[2]
})
.write()
// 16
// fix START_MARK_2 (total 7 lines)
//    2*  <string>START_MARK_2.*END_MARK_1\?\)</string>
re=String.raw`START_MARK_2(.*END_MARK_1\?\).*)\n(.*)\n(.*)\n`
tmls
.replace('s' + (i++), new RegExp(re, 'gmi'), v => {
  let match = new RegExp(re, 'mi').exec(v)
  return String.raw`(START_MARK_2)${match[1]}
            <key>captures</key>
            <dict>
              <key>1</key>
              <dict>
                <key>name</key>
                <string>SHARP_MARK_1</string>
              </dict>
              <key>2</key>
              <dict>
    ${match[2]}
    ${match[3]}
              </dict>
            </dict>
`
})
.write()
// 17
//    3*  <key>while</key>.*\n.*<string>(?:\(\?i\))?START_MARK_2
re=String.raw`(^.*<key>while</key>.*)\n(.*<string>(?:\(\?i\))?)START_MARK_2(.*)\n`
tmls
.replace('s' + (i++), new RegExp(re, 'gmi'), v => {
  let match = new RegExp(re, 'mi').exec(v)
  let indent = /^\ */.exec(match[1])[0]
  return v + String.raw`${indent}<key>whileCaptures</key>
${indent}<dict>
${indent}  <key>0</key>
${indent}  <dict>
${indent}    <key>name</key>
${indent}    <string>SHARP_MARK_1</string>
${indent}  </dict>
${indent}</dict>
`})
.write()
// 18
//    2*  `<string>((START_MARK_1)([ ]{2,4}|\t))|(START_MARK_2[ \t]*$)</string>`
.replace('s' + (i++), new RegExp(String.raw`<string>\(\(START_MARK_1\)\(\[ \]\{2,4\}\|\\t\)\)\|\(START_MARK_2\[ \\t\]\*\$\)</string>`, 'gmi'), v => '<string>(((START_MARK_1)([ ]{2,4}|\t))|(START_MARK_2[ \t]*$))</string>')
.write()
// 19
// fix the bold # before markup.heading.markdown
.replace('s' + (i++), new RegExp(String.raw`^.*\n.*\n.*\n.*markup.heading.markdown.*\n`, 'gmi'), v => {
  let u=v.split('\n')
  return ['    ',u[2],'\n    ',u[3],'\n',u[0],'\n',u[1],'\n'].join('')
})
.write()


// all END_MARK_1 used in negative lookahead, need not fixed

.replace('s' + (i++), new RegExp(String.raw`START_MARK_1`, 'gmi'), String.raw`(?:^# )|(?:\G# )`)
.replace('s' + (i++), new RegExp(String.raw`START_MARK_2`, 'gmi'), '(?:^# )')
.replace('s' + (i++), new RegExp(String.raw`END_MARK_1`, 'gmi'), String.raw`$(?:\n# )`)
.replace('s999', '', '')
.write()





let OUTPUT = TPL
.replace('TO_BE_PUT_RULE_HERE', tmls.last)
.replace(/TO_BE_REPLACED_GENERATED_NOTICE/g, 'Generated by syntaxes/processTML.js - Youwei Zhao "zhaouv@github"')
.replace(/TO_BE_PUT_SCOPE_NAME_HERE/g, 'text.html.markdown.python')
.replace(/SHARP_MARK_1/g, 'comment.punctuation.definition.comment.python')
.replace(/\n/g, '\r\n')



fs.writeFileSync('./syntaxes/python.markdown.inject.tmLanguage', OUTPUT, { encoding: 'utf-8' })