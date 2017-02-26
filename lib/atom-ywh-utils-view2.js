'use babel';

export default class AtomYwhUtilsView2 {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('atom-ywh-utils');
    
    // Create message element
    const message = document.createElement('div');
    message.textContent = "Please insert your first string <input type='text' id='text1' />";
    message.innerHtml="Text1: <input type='text' id='text1' /> Text2: <input type='text' id='text2' />";
    message.classList.add('message');
    this.element.appendChild(message);

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
