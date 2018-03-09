(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

SupCore.system.registerPlugin("typescriptAPI", "CustomAPI", {
    code: "// Example of a custom function\r\nfunction myFunction(someParameter: number) {\r\n  // Do something...\r\n  return someParameter;\r\n}\r\n// IMPORTANT so what you creates is global\r\nwindow.myFunction = myFunction;\r\n\r\n// Example of a custom class\r\nclass MyClass {\r\n  someProperty: string;\r\n\r\n  constructor() {\r\n    this.someProperty = \"Hello\";\r\n  }\r\n  someMethod(someParameter: string) {\r\n    Sup.log(`${this.someProperty}  ${someParameter}`);\r\n  }\r\n}\r\nwindow.MyClass = MyClass;\r\n",
    defs: "// Example of a custom function\r\ndeclare function myFunction(someParameter: number): number;\r\n\r\n// Example of a custom class\r\ndeclare class MyClass {\r\n  someProperty: string;\r\n\r\n  constructor();\r\n  someMethod(someParameter: string): void;\r\n}\r\n",
});

},{}]},{},[1]);
