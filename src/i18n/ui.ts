/**
 * Preact アイランド（クライアント UI）の文言。ロケール別。
 * ページレベル content (`en.ts` / `ja.ts`) とは別に、インタラクティブな
 * アイランドが表示する文字列をここに集約する。
 *
 * 重要: アイランドは locale を PROP で受け取り（SSR 時に存在）、
 * `document` 等から読まない。SSR とクライアントで同一文字列を描画して
 * hydration mismatch を防ぐ。
 *
 * 補間文字列は `{name}` / `{bytes}` などのテンプレートを持ち、
 * アイランド側で `.replace('{name}', x)` する。
 *
 * `errorLocation` の `{message}` は JSON.parse がスローした生のエンジン文言
 * （ブラウザ依存、英語のまま）をそのまま埋め込む。ローカライズ対象は
 * 前後の「行 X、列 Y:」部分のみ — メッセージ自体を翻訳/書き換えしない
 * （エンジンの実際の報告を偽装しないという確約の一部）。
 */
export const ui = {
  en: {
    // FormatJsonTool — input
    inputHeading: 'JSON input',
    inputSubtitle: 'Paste or type JSON, or choose a .json file.',
    inputPlaceholder: '{\n  "example": "value"\n}',
    sizeInput: 'Input: {bytes} bytes',
    loadedFileLabel: 'Loaded: {name}',
    chooseFileButton: 'Choose .json file',
    clearInput: 'Clear',
    errUnsupportedFile: '{name} is not a JSON or text file.',

    // FormatJsonTool — mode / options
    modeLabel: 'Mode',
    modeFormat: 'Format',
    modeMinify: 'Minify',
    modeValidate: 'Validate',
    indentLabel: 'Indent',
    indent2: '2 spaces',
    indent4: '4 spaces',
    indentTab: 'Tab',

    // FormatJsonTool — output
    outputHeading: 'Output',
    outputHintFormat: 'Pretty-printed with the indent above, ready to copy or download.',
    outputHintMinify: 'All insignificant whitespace removed.',
    outputHintValidate: 'Checks whether the input is valid JSON and, if not, where it breaks.',
    outputEmptyHint: 'Paste or type JSON above, or choose a file, to see the result here.',
    errorHeading: 'Invalid JSON',
    errorLocation: 'Line {line}, Column {column}: {message}',
    validOk: 'Valid JSON',
    sizeOutput: 'Output: {bytes} bytes',
    sizeSmaller: '{percent}% smaller',
    sizeLarger: '{percent}% larger',
    sizeSame: 'same size',
    copyOutput: 'Copy',
    copied: 'Copied!',
    copyFailed: 'Could not copy — select the text above and copy it manually.',
    downloadJson: 'Download .json',
    notificationsAria: 'Notifications',

    // InstallPrompt
    installHeading: 'Install app',
    installBody: 'Add to your home screen for quick access.',
    install: 'Install',
    later: 'Later',

    // GlobalDropZone
    dzProcessing: 'Adding {count} file(s)...',
    dzPleaseWait: 'Please wait',
    dzDropTitle: 'Drop a JSON or text file to load it',
    dzDropSub: 'It will replace the current input',

    // ThemeToggle
    themeToLight: 'Switch to light mode',
    themeToDark: 'Switch to dark mode',
    themeLabel: 'Theme',

    // shared
    close: 'Close',
    required: 'Required',
  },
  ja: {
    // FormatJsonTool — input
    inputHeading: 'JSON を入力',
    inputSubtitle: 'JSON を貼り付けるか入力してください。.json ファイルを選択することもできます。',
    inputPlaceholder: '{\n  "example": "value"\n}',
    sizeInput: '入力: {bytes} バイト',
    loadedFileLabel: '読み込み済み: {name}',
    chooseFileButton: '.json ファイルを選択',
    clearInput: 'クリア',
    errUnsupportedFile: '{name} は JSON またはテキストファイルではありません。',

    // FormatJsonTool — mode / options
    modeLabel: 'モード',
    modeFormat: '整形',
    modeMinify: '圧縮',
    modeValidate: '検証',
    indentLabel: 'インデント',
    indent2: 'スペース2つ',
    indent4: 'スペース4つ',
    indentTab: 'タブ',

    // FormatJsonTool — output
    outputHeading: '出力',
    outputHintFormat: '上で選んだインデントで整形します。コピーやダウンロードができます。',
    outputHintMinify: '不要な空白をすべて取り除きます。',
    outputHintValidate: '入力が有効な JSON かどうかを確認します。無効な場合は箇所を表示します。',
    outputEmptyHint: '上に JSON を貼り付けるか入力する、またはファイルを選択すると、ここに結果が表示されます。',
    errorHeading: '無効な JSON です',
    errorLocation: '{line} 行目、{column} 列目: {message}',
    validOk: '有効な JSON です',
    sizeOutput: '出力: {bytes} バイト',
    sizeSmaller: '{percent}% 小さくなりました',
    sizeLarger: '{percent}% 大きくなりました',
    sizeSame: '変化なし',
    copyOutput: 'コピー',
    copied: 'コピーしました！',
    copyFailed: 'コピーできませんでした。上のテキストを選択して手動でコピーしてください。',
    downloadJson: '.json をダウンロード',
    notificationsAria: '通知',

    // InstallPrompt
    installHeading: 'アプリを追加',
    installBody: 'ホーム画面に追加すると、すぐに開けます。',
    install: '追加',
    later: 'あとで',

    // GlobalDropZone
    dzProcessing: '{count} 件のファイルを追加中…',
    dzPleaseWait: 'お待ちください',
    dzDropTitle: 'JSON またはテキストファイルをドロップして読み込む',
    dzDropSub: '現在の入力は置き換わります',

    // ThemeToggle
    themeToLight: 'ライトモードに切り替え',
    themeToDark: 'ダークモードに切り替え',
    themeLabel: 'テーマ',

    // shared
    close: '閉じる',
    required: '必須',
  },
  zh: {
    // FormatJsonTool — input
    inputHeading: '输入 JSON',
    inputSubtitle: '粘贴或输入 JSON，也可以选择一个 .json 文件。',
    inputPlaceholder: '{\n  "example": "value"\n}',
    sizeInput: '输入：{bytes} 字节',
    loadedFileLabel: '已加载：{name}',
    chooseFileButton: '选择 .json 文件',
    clearInput: '清除',
    errUnsupportedFile: '{name} 不是 JSON 或文本文件。',

    // FormatJsonTool — mode / options
    modeLabel: '模式',
    modeFormat: '格式化',
    modeMinify: '压缩',
    modeValidate: '校验',
    indentLabel: '缩进',
    indent2: '2 个空格',
    indent4: '4 个空格',
    indentTab: '制表符',

    // FormatJsonTool — output
    outputHeading: '输出',
    outputHintFormat: '按上面选择的缩进格式化，随时可复制或下载。',
    outputHintMinify: '去除所有不必要的空白字符。',
    outputHintValidate: '检查输入是否为有效 JSON；如果无效，会指出出错位置。',
    outputEmptyHint: '在上方粘贴或输入 JSON，或选择一个文件，结果会显示在这里。',
    errorHeading: '无效的 JSON',
    errorLocation: '第 {line} 行，第 {column} 列：{message}',
    validOk: 'JSON 有效',
    sizeOutput: '输出：{bytes} 字节',
    sizeSmaller: '缩小了 {percent}%',
    sizeLarger: '增大了 {percent}%',
    sizeSame: '大小不变',
    copyOutput: '复制',
    copied: '已复制！',
    copyFailed: '无法复制——请手动选择上方文本并复制。',
    downloadJson: '下载 .json',
    notificationsAria: '通知',

    // InstallPrompt
    installHeading: '安装应用',
    installBody: '添加到主屏幕，方便随时打开。',
    install: '安装',
    later: '以后再说',

    // GlobalDropZone
    dzProcessing: '正在添加 {count} 个文件…',
    dzPleaseWait: '请稍候',
    dzDropTitle: '拖放 JSON 或文本文件以加载',
    dzDropSub: '将替换当前输入',

    // ThemeToggle
    themeToLight: '切换到浅色模式',
    themeToDark: '切换到深色模式',
    themeLabel: '主题',

    // shared
    close: '关闭',
    required: '必填',
  },
  de: {
    // FormatJsonTool — input
    inputHeading: 'JSON-Eingabe',
    inputSubtitle: 'JSON einfügen oder eingeben, oder eine .json-Datei auswählen.',
    inputPlaceholder: '{\n  "beispiel": "wert"\n}',
    sizeInput: 'Eingabe: {bytes} Bytes',
    loadedFileLabel: 'Geladen: {name}',
    chooseFileButton: '.json-Datei auswählen',
    clearInput: 'Leeren',
    errUnsupportedFile: '{name} ist keine JSON- oder Textdatei.',

    // FormatJsonTool — mode / options
    modeLabel: 'Modus',
    modeFormat: 'Formatieren',
    modeMinify: 'Minimieren',
    modeValidate: 'Validieren',
    indentLabel: 'Einrückung',
    indent2: '2 Leerzeichen',
    indent4: '4 Leerzeichen',
    indentTab: 'Tabulator',

    // FormatJsonTool — output
    outputHeading: 'Ausgabe',
    outputHintFormat: 'Formatiert mit der oben gewählten Einrückung — bereit zum Kopieren oder Herunterladen.',
    outputHintMinify: 'Alle unwesentlichen Leerzeichen entfernt.',
    outputHintValidate: 'Prüft, ob die Eingabe gültiges JSON ist, und zeigt bei Fehlern die Stelle.',
    outputEmptyHint: 'Füge oben JSON ein oder tippe es ein, oder wähle eine Datei — das Ergebnis erscheint hier.',
    errorHeading: 'Ungültiges JSON',
    errorLocation: 'Zeile {line}, Spalte {column}: {message}',
    validOk: 'Gültiges JSON',
    sizeOutput: 'Ausgabe: {bytes} Bytes',
    sizeSmaller: '{percent}% kleiner',
    sizeLarger: '{percent}% größer',
    sizeSame: 'gleiche Größe',
    copyOutput: 'Kopieren',
    copied: 'Kopiert!',
    copyFailed: 'Konnte nicht kopiert werden — markiere den Text oben und kopiere ihn manuell.',
    downloadJson: '.json herunterladen',
    notificationsAria: 'Benachrichtigungen',

    // InstallPrompt
    installHeading: 'App installieren',
    installBody: 'Zum Startbildschirm hinzufügen, um es direkt zu öffnen.',
    install: 'Installieren',
    later: 'Später',

    // GlobalDropZone
    dzProcessing: '{count} Datei(en) werden hinzugefügt …',
    dzPleaseWait: 'Bitte warten',
    dzDropTitle: 'JSON- oder Textdatei zum Laden ablegen',
    dzDropSub: 'Ersetzt die aktuelle Eingabe',

    // ThemeToggle
    themeToLight: 'Zum hellen Modus wechseln',
    themeToDark: 'Zum dunklen Modus wechseln',
    themeLabel: 'Design',

    // shared
    close: 'Schließen',
    required: 'Erforderlich',
  },
  es: {
    // FormatJsonTool — input
    inputHeading: 'Entrada JSON',
    inputSubtitle: 'Pega o escribe JSON, o elige un archivo .json.',
    inputPlaceholder: '{\n  "ejemplo": "valor"\n}',
    sizeInput: 'Entrada: {bytes} bytes',
    loadedFileLabel: 'Cargado: {name}',
    chooseFileButton: 'Elegir archivo .json',
    clearInput: 'Borrar',
    errUnsupportedFile: '{name} no es un archivo JSON o de texto.',

    // FormatJsonTool — mode / options
    modeLabel: 'Modo',
    modeFormat: 'Formatear',
    modeMinify: 'Minificar',
    modeValidate: 'Validar',
    indentLabel: 'Sangría',
    indent2: '2 espacios',
    indent4: '4 espacios',
    indentTab: 'Tabulación',

    // FormatJsonTool — output
    outputHeading: 'Salida',
    outputHintFormat: 'Formateado con la sangría de arriba, listo para copiar o descargar.',
    outputHintMinify: 'Se elimina todo el espacio en blanco no significativo.',
    outputHintValidate: 'Comprueba si la entrada es JSON válido y, si no, dónde falla.',
    outputEmptyHint: 'Pega o escribe JSON arriba, o elige un archivo, para ver el resultado aquí.',
    errorHeading: 'JSON no válido',
    errorLocation: 'Línea {line}, columna {column}: {message}',
    validOk: 'JSON válido',
    sizeOutput: 'Salida: {bytes} bytes',
    sizeSmaller: '{percent}% más pequeño',
    sizeLarger: '{percent}% más grande',
    sizeSame: 'mismo tamaño',
    copyOutput: 'Copiar',
    copied: '¡Copiado!',
    copyFailed: 'No se pudo copiar — selecciona el texto de arriba y cópialo manualmente.',
    downloadJson: 'Descargar .json',
    notificationsAria: 'Notificaciones',

    // InstallPrompt
    installHeading: 'Instalar la app',
    installBody: 'Añádela a tu pantalla de inicio para tenerla siempre a mano.',
    install: 'Instalar',
    later: 'Más tarde',

    // GlobalDropZone
    dzProcessing: 'Añadiendo {count} archivo(s)...',
    dzPleaseWait: 'Espera un momento',
    dzDropTitle: 'Suelta un archivo JSON o de texto para cargarlo',
    dzDropSub: 'Reemplazará la entrada actual',

    // ThemeToggle
    themeToLight: 'Cambiar al modo claro',
    themeToDark: 'Cambiar al modo oscuro',
    themeLabel: 'Tema',

    // shared
    close: 'Cerrar',
    required: 'Obligatorio',
  },
} as const;

export type UiStrings = (typeof ui)['en'];
