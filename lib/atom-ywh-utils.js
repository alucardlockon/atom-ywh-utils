'use babel';

import atomYwhUtilsView from './atom-ywh-utils-view';
import atomYwhUtilsView2 from './atom-ywh-utils-view2';
import {
    CompositeDisposable
} from 'atom';

export default {

    atomYwhUtilsView: null,
    modalPanel: null,
    modalPanel2: null,
    subscriptions: null,

    activate(state) {

        this.atomYwhUtilsView = new atomYwhUtilsView(state.atomYwhUtilsViewState);
        this.modalPanel = atom.workspace.addModalPanel({
            item: this.atomYwhUtilsView.getElement(),
            visible: false
        });
        this.atomYwhUtilsView2 = new atomYwhUtilsView2(state.atomYwhUtilsViewState);
        this.modalPanel2 = atom.workspace.addModalPanel({
            item: this.atomYwhUtilsView2.getElement(),
            visible: false
        });

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        // Register command that toggles this view

        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'atom-ywh-utils:toggle': () => this.toggle(),
            'atom-ywh-utils:scrollUp10rows': () => this.scrollUp10rows(),
            'atom-ywh-utils:scrollDown10rows': () => this.scrollDown10rows(),
            'atom-ywh-utils:repeateByTimes': () => this.repeateByTimes(),
            'atom-ywh-utils:evalSelected': () => this.evalSelected(),
            'atom-ywh-utils:insertTwoSide': () => this.insertTwoSide(),
            'atom-ywh-utils:pasteAfter': () => this.pasteAfter(),
            'atom-ywh-utils:pasteWithJson': () => this.pasteWithJson(),
            'atom-ywh-utils:pasteWithArray': () => this.pasteWithArray(),
        }));

        // iframe=document.getElementById('ywh-web-view-frame');
        // iframe.contentWindow.document.body.backcolor="#000000";

    },

    deactivate() {
        this.modalPanel.destroy();
        this.subscriptions.dispose();
        this.atomYwhUtilsView.destroy();
    },

    serialize() {
        return {
            atomYwhUtilsViewState: this.atomYwhUtilsView.serialize()
        };
    },

    toggle() {
        if (this.modalPanel.isVisible) {
            editor = atom.workspace.getActiveTextEditor();
            searchText = editor.getSelectedText();
            iframe = document.getElementById('ywh-web-view-frame');
            if (searchText != null) {
                iframe.src = encodeURI("http://wap.baidu.com/s?word=" + searchText);
            }
        }

        return (
            this.modalPanel.isVisible() ?
            this.modalPanel.hide() :
            this.modalPanel.show()
        );
    },

    scrollUp10rows() {
        atom.workspace.getActiveTextEditor().moveUp(10);
    },

    scrollDown10rows() {
        atom.workspace.getActiveTextEditor().moveDown(10);
    },

    //Repeate Text By Times
    repeateByTimes() {
        editor = atom.workspace.getActiveTextEditor();
        textSelected = editor.getSelectedText();
        str = '';
        if (textSelected.indexOf('*') > 0) {
            val = textSelected.split('*')[0].toString();
            times = parseInt(textSelected.split('*')[1]);
            for (i = 0; i < times; i++) {
                str += val;
            }
        }
        editor.insertText(str);
    },
    evalSelected() {
        editor = atom.workspace.getActiveTextEditor();
        textSelected = editor.getSelectedText();
        str = eval(textSelected);
        editor.insertText(str);
    },
    // insert a string into other string's side 
    insertTwoSide() {
        return (
            this.modalPanel2.isVisible() ?
            this.modalPanel2.hide() :
            this.modalPanel2.show()
        );
    },
    // 在一行后粘贴
    pasteAfter() {
      editor = atom.workspace.getActiveTextEditor()
      textSelected = editor.getSelectedText()
      clipText = atom.clipboard.read()
      arr = clipText.split('\r\n')
      arr2 = textSelected.split('\r\n')
      result = ''
      arr2.forEach((lineStr, index)=>{
        if(index<arr.length){
          result += lineStr+arr[index]+'\r\n';
        }else{
          result += lineStr+'\r\n';
        }
      })
      editor.insertText(result.trimRight('\r\n'))
    },
    // 根据json内容在行内将特定字符粘贴,格式为:{{字符串}}
    pasteWithJson() {
      editor = atom.workspace.getActiveTextEditor()
      textSelected = editor.getSelectedText()
      clipText = atom.clipboard.read()
      arr = JSON.parse('{"data": '+clipText+' }')
      arr2 = textSelected.split('\r\n')
      result = ''
      arr2.forEach((lineStr, index)=>{
        arr.data.forEach((arrLines,index2)=>{
          if(index === index2){
            for (let arrIndex in arrLines){
              let reg = new RegExp('{{'+arrIndex+'}}','g')
              lineStr = lineStr.replace(reg,arrLines[arrIndex])
            }
          }
        })
        result += lineStr+'\r\n'
      })
      editor.insertText(result.trimRight('\r\n'))
    },
    // 根据字符串数组内容(用逗号分隔),内容在行内将特定字符粘贴,格式为:{*}
    pasteWithArray() {
      editor = atom.workspace.getActiveTextEditor()
      textSelected = editor.getSelectedText()
      clipText = atom.clipboard.read()
      arr = clipText.split('\r\n')
      arr2 = textSelected.split('\r\n')
      result = ''
      //new RegExp('\{\*\}')
      let reg = /\{\*\}/
      arr2.forEach((lineStr, index)=>{
        arr.forEach((arrLines,index2)=>{
          if(index === index2){
            let items = arrLines.split(',')
            for (let item of items){
              let tempItem = item.trim()
              lineStr = tempItem===''?lineStr:lineStr.replace(reg,tempItem)
            }
          }
        })
        result += lineStr+'\r\n'
      })
      editor.insertText(result.trimRight('\r\n'))
    }

};