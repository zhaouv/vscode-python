<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>comment</key>
    <string>TO_BE_REPLACED_GENERATED_NOTICE</string>
    <key>patterns</key>
    <array>
      <dict>
        <key>include</key>
        <string>#comment-markdown-cell-inject-python</string>
      </dict>
    </array>
    <key>repository</key>
    <dict>
      <key>comment-markdown-cell-inject-python</key>
      <dict>
        <key>name</key>
        <string>TO_BE_PUT_SCOPE_NAME_HERE</string>
        <key>begin</key>
        <string>(?&lt;=(?:^|\G)(?:#\s*%%\s*\[markdown\]|#\s*&lt;markdowncell&gt;)\s*)$</string>
        <key>end</key>
        <string>(^|\G)(?=[^#\s]|#\s*%%|\s+\S)</string>

        <!-- <key>while</key>
        <string>(^# |\G# )(?=\s*%%)|(?:^|\G)\s*</string>
        <key>whileCaptures</key>
        <dict>
          <key>0</key>
          <dict>
            <key>name</key>
            <string>SHARP_MARK_1</string>
          </dict>
        </dict> -->

        <key>patterns</key>
        <array>
          <dict>
            <key>include</key>
            <string>#sharpquote</string>
          </dict>
        </array>
      </dict>
      <key>sharpquote</key>
      <dict>
        <key>begin</key>
        <string>(^|\G)(#) ?</string>
        <key>beginCaptures</key>
        <dict>
          <key>2</key>
          <dict>
            <key>name</key>
            <string>SHARP_MARK_1</string>
          </dict>
        </dict>
        <key>patterns</key>
        <array>
          <dict>
            <key>include</key>
            <string>#block</string>
          </dict>
        </array>
        <key>while</key>
        <string>(^|\G)(#) ?</string>
      </dict>




TO_BE_PUT_RULE_HERE






    </dict>
    <key>scopeName</key>
    <string>comment.markdown-cell-inject.python</string>
    <key>injectionSelector</key>
    <string>source.python</string>
    <key>uuid</key>
    <string>CEA6A09F-7810-487F-9167-FEA86CBB9D4D</string>
  </dict>
</plist>