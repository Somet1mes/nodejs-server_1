(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){


SupCore.system.registerPlugin("typescriptAPI", "fText", {
  code: "/// <reference path=\"Sup.d.ts\"/>\n\n/* tslint:disable:class-name */\nclass fText extends Sup.Asset {\n\n  /**\n  * Holds the following parsers :<br>\n  * - https://github.com/zaach/jsonlint <br>\n  * - https://github.com/groupon/cson-parser<br>\n  * - https://github.com/component/domify<br>\n  * - https://github.com/evilstreak/markdown-js<br>\n  * - https://github.com/stylus/stylus<br>\n  * - https://github.com/nodeca/js-yaml\n  */\n  static parsers: {\n    jsonlint: any,\n    csonparser: any,\n    domify: (text: string) => any,\n    markdown: any,\n    pug: any,\n    stylus: any,\n    jsyaml: any\n  } = (window as any).fTextParsers;\n  // (window as any).fTextParsers is set in runtime/fText.ts\n\n  /**\n  * The set of instructions which can be found in the asset's content.\n  */\n  private instructions: { [key: string]: string|string[] } = {};\n\n  /**\n  * The asset's extension (if any) found at the end of its name.\n  */\n  private extension: string = \"\";\n\n  // ----------------------------------------\n\n  // called from runtime createdOuterAsset(), or by hand\n  // inner is the asset's pub as defined in the asset's class\n  /**\n  * @param inner - The asset's pub as defined in the asset's class.\n  */\n  constructor(inner: {[key : string]: any; }) {\n    super(inner); // sets inner as the value of this.__inner\n\n    this._parseInstructions();\n\n    // get asset's extension\n    let assetName = this.__inner.name; // 06/09/15 where does this.__inner.name come from ? is it the path ?  it comes from the runtime loadAsset() where entry\n    let extensionMatches = assetName.match(/\\.[a-zA-Z]+$/gi); // look for any letter after a dot at the end of the string\n    if (extensionMatches != null)\n      this.extension = extensionMatches[0].replace(\".\", \"\");\n  }\n\n  /**\n  * Read the [ftext: instruction: value] instructions in the asset's text\n  * then build the this.instructions object.\n  * Called once from the constructor\n  */\n  private _parseInstructions() {\n    let regex = /ftext:([a-zA-Z0-9\\/+-]+)(:([a-zA-Z0-9\\.\\/+-]+))?/ig;\n    let match: any;\n    let instructionsCount = (this.__inner.text.match(/ftext/ig) || []).length; // prevent infinite loop\n    do {\n      match = regex.exec(this.__inner.text);\n      if (match != null && match[1] != null) {\n        let name = match[1].trim().toLowerCase();\n        let value = match[3];\n        if (value != null) value = value.trim();\n        else value = \"\";\n        if (name === \"include\") {\n          if (this.instructions[name] == null) this.instructions[name] = [];\n          (this.instructions[name] as string[]).push(value);\n        }\n        else\n          this.instructions[name] = value.trim().toLowerCase();\n      }\n      instructionsCount--;\n    }\n    while (match != null && instructionsCount > 0);\n  }\n\n  // ----------------------------------------\n\n  /**\n  * Gets the raw content of the asset.\n  */\n  getText(): string {\n    return this.__inner.text;\n  }\n\n  // ----------------------------------------\n\n  /**\n  * Returns the content of the asset, after having parsed and processed it\n  * @param options - An object with options.\n  * @return JavaScript or DOM object, or string.\n  */\n  parse(options?: { include?: boolean }): any {\n    options = options || {};\n    let extension = this.extension;\n\n    let parseFn = (text?: string): string => {\n      if (text == null)\n        text = this.__inner.text;\n\n      let parseFn: Function;\n      switch (extension) {\n        case \"json\":\n          parseFn = fText.parsers.jsonlint.parse;\n          break;\n        case \"cson\":\n          parseFn = fText.parsers.csonparser.parse;\n          break;\n        case \"html\":\n          parseFn = fText.parsers.domify;\n          break;\n        case \"md\":\n          parseFn = fText.parsers.markdown.toHTML;\n          break;\n        case \"pug\":\n          parseFn = fText.parsers.pug.compile(text);\n          break;\n        case \"styl\":\n          parseFn = () => { return; }; // special case\n          break;\n        case \"yml\":\n          parseFn = fText.parsers.jsyaml.safeLoad;\n          break;\n      }\n\n      if (parseFn != null) {\n        try {\n          if (extension === \"styl\")\n            text = fText.parsers.stylus(text).set(\"imports\", []).render();\n          else\n            text = parseFn(text);\n        }\n        catch (e) {\n          console.error(\"fText.parse(): error parsing asset '\" + this.__inner.name + \"' :\");\n          throw e;\n        }\n      }\n      return text;\n    };\n\n    let includeFn = (text?: string): string => {\n      if (text == null)\n        text = this.__inner.text;\n\n      if (this.instructions[\"include\"] != null) {\n        for (let path of this.instructions[\"include\"]) {\n          let asset = Sup.get(path, fText, {ignoreMissing: false}); // note: for some reason, the three arguments are needed here\n          let regexp = new RegExp(\"[<!/*#-]*ftext:include:\" + path.replace(\".\", \"\\\\.\") + \"[>*/-]*\", \"i\");\n          text = text.replace(regexp, asset.parse(options));\n        }\n      }\n      else if (options.include === true)\n        console.log(\"fText.parse(): Nothing to include for asset\", this.__inner.name);\n\n      return text;\n    };\n\n    if (options.include === false)\n      return parseFn();\n    else {\n      if (extension === \"html\" || extension === \"json\" || extension === \"cson\" || extension === \"yml\") {\n        return parseFn(includeFn());\n      }\n      else\n        return includeFn(parseFn());\n    }\n  }\n}\n\n(window as any).fText = fText;\n".replace("<reference path=", ""),
  defs: "// fText plugin\n// https://github.com/florentpoujol/superpowers-game-ftext-plugin\n// Adds a generic text asset of type FText\n\ndeclare class fText extends Sup.Asset {\n  constructor(inner: { [key: string]: any; });\n\n  static parsers: {\n    jsonlint: any,\n    csonparser: any,\n    domify: (text: string) => any,\n    markdown: any,\n    pug: any,\n    stylus: any,\n    jsyaml: any,\n  };\n\n  getText(): string;\n  parse(options?: {\n    include?: boolean,\n  }): any;\n}\n",
});

},{}]},{},[1]);
