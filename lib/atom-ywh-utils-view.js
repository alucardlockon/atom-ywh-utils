'use babel';

export default class AtomYwhUtilsView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('atom-ywh-utils');
    
    // Create message element
    const message = document.createElement('div');
    message.textContent = 'Ywh test';
    message.classList.add('message');
    this.element.appendChild(message);
    
    
    iframe=document.createElement('iframe');
    url="http://wap.baidu.com/";
    iframe.setAttribute("src",url);
    iframe.setAttribute("id","ywh-web-view-frame");
    //iframe.setAttribute("allowTransparency","true");
    this.element.appendChild(iframe);

  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }
  
  

}
