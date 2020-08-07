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
.remove('s' + (i++), new RegExp(String.raw`      <key>fenced_code([^u]|u(?!nknown))*([^\n]|\n(?!      </dict>))*^      </dict>`, 'gmi'))
.write()
.remove('s' + (i++), new RegExp(String.raw`(?<=#fenced_code_block)_(?!unknown)([^_]|\n|_(?!unknown))*`, 'gmi'))
.write()
.remove('s' + (i++), new RegExp(String.raw`      <key>frontMatter</key>`, 'gmi'))
.write()
.remove('s' + (i++), new RegExp(String.raw`^      <dict>([^d]|d(?!ict))*frontMatter[\s\S\n]*?^      </dict>`, 'gmi'))
.write()
// 5
.replace('s' + (i++), new RegExp(String.raw`\^\|\\G`, 'gmi'), 'START_MARK_1')
.write()
.replace('s' + (i++), new RegExp(String.raw`(?<!\[)\^`, 'gmi'), 'START_MARK_2')
.write()
.replace('s' + (i++), new RegExp(String.raw`\$\\n`, 'gmi'), 'END_MARK_1')
.write()
.replace('s' + (i++), new RegExp(String.raw`(?<=<string>)[^<]*\.markdown(?=</string>)`, 'gmi'), v => v + '.python')
.write()
// 9 
// add `while` check for `fenced_code_block_unknown`
// to make that no-comment can break it
.replace('s' + (i++), new RegExp(String.raw`<key>fenced_code_block_unknown</key>\n      <dict>`, 'gmi'), v => v + String.raw`        <key>while</key>
        <string>(START_MARK_1)(?!(\2|\s{0,3})(\3)\s*$)</string>
`)
.write()
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
// fix (begin|end|while).*\n.*?<string>.*?START_MARK_1
//      fix match but not captures
re=String.raw`(begin|end|while)(.*\n.*?<string>.*?START_MARK_1.*\n)((?:.(?!\1captures))*\n)`
tmls
.replace('s' + (i++), new RegExp(re, 'gmi'), v => {
    let match = new RegExp(re, 'mi').exec(v)
    return match[1]+match[2]+String.raw`                    <key>${match[1]}Captures</key>
                    <dict>
                      <key>1</key>
                      <dict>
                        <key>name</key>
                        <string>SHARP_MARK_1</string>
                      </dict>
                    </dict>
`+match[3]
})
.write()
//      fix captures but not name
// +3
// 10
.replace('s' + (i++), new RegExp(String.raw`START_MARK_1`, 'gmi'), String.raw`^# |\G# `)
.write()
.replace('s' + (i++), new RegExp(String.raw`START_MARK_2`, 'gmi'), '^# ')
.write()
.replace('s' + (i++), new RegExp(String.raw`END_MARK_1`, 'gmi'), String.raw`$(?:\\n# )`)
.write()
.replace('s' + (i++), new RegExp(String.raw`SHARP_MARK_1`, 'gmi'), 'comment.punctuation.definition.markdown.python')
.write()
// 14
.remove('s' + (i++), new RegExp(String.raw`^.*?encoding="UTF-8"[\s\S\n]*^    <dict>`, 'gmi'))
.write()
.remove('s' + (i++), new RegExp(String.raw`^    </dict>[\s\S\n]*?</plist>`, 'gmi'))
.write()

// fs.writeFileSync(`./syntaxes/tmp/s3.json`, JSON.stringify(tmls.s3), { encoding: 'utf-8' })

let OUTPUT = TPL.replace(/\n{8}/, '\n\n\n\n' + tmls.last + '\n\n\n\n').replace(/\n/g, '\r\n')
''
fs.writeFileSync(`./syntaxes/python.markdown.inject.tmLanguage`, OUTPUT, { encoding: 'utf-8' })