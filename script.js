class Model {
    constructor() {
        this.Schema = JSON.parse(localStorage.getItem('Schema')) || []
    }
    bindSchemaChanged(callback) {
        console.log('bindSchema');
        this.onSchemaChanged = callback
      }
    _commit(Schema) {
        console.log('-commit');
        this.onSchemaChanged(Schema)
        localStorage.setItem('Schema', JSON.stringify(Schema))
      }
    addSchema(schema){
        console.log('addSchema');
        const Schema={"id":1,"text":schema}
        this.Schema=Schema;
        this._commit(this.Schema)
    }
    
  }
  
  class View {
    constructor() {
      this.app = this.getElement('#root')
      this.form = this.createElement('form')
      this.input = this.createElement('input')
      this.input.type = 'text'
      this.input.placeholder = 'Add JSON Schema'
      this.input.name = 'textEditor'
      this.submitButton = this.createElement('button')
      this.submitButton.textContent = 'Submit'
      this.form.append(this.input, this.submitButton)
      this.title = this.createElement('h1')
      this.title.textContent = 'TextEditor'
      this.textEditor = this.createElement('div')
      this.app.append(this.title, this.form, this.textEditor)
    }
    get _newSchema() {
        console.log('_inputText');
        return this.input.value
      }
      
      _resetInput() {
        this.input.value = ''
        console.log('resetinput');
      }
  
    createElement(tag, className) {
      const element = document.createElement(tag)
  
      if (className) element.classList.add(className)
      console.log('createElement');
      return element
    }
  
    getElement(selector) {
      const element = document.querySelector(selector)
        console.log('getElement');
      return element
    }
    displayEditor(schema)
    {   
        var data = JSON.parse(schema.text);
        console.log(data)
        this.setMenu(data.menus);
        this.setButtons(data.buttons)
    }


    bindAddSchema(handler){
        this.form.addEventListener('submit',event=>{
            event.preventDefault()
            console.log(handler);
            if(this._newSchema)
            {
                handler(this._newSchema)
                console.log('bindAddSchema');
                //this._resetInput()
            }
        })
    }

    setMenu(data) {
        console.log(data)
        for(var d in data) {
           
            var select = document.createElement("select");
            var dataValues = data[d].values;
            for(var optionInD in dataValues) {
                var option = document.createElement("option");
                option.innerHTML = optionInD;
                option.setAttribute("value", dataValues[optionInD]);
                select.appendChild(option);
                // console.log(dataValues[optionInD])
            }
            select.addEventListener("change", (e)=>{
                var targetNode = e.target;
                document.execCommand(data[d].command,false, targetNode.value);
            })
            this.textEditor.appendChild(select);
            

        }
        
    }

    setButtons(data) {
        for(var d in data) {
            var dataValues = data[d];
            var button = document.createElement("button");
            button.innerHTML = dataValues.text;
            button.setAttribute("id", dataValues.command);
            button.addEventListener("click", (e) => {
                var targetNode = e.target;
                var command = targetNode.id;
                document.execCommand(command,false, null);
            });
            this.textEditor.append(button)
        }
    }


}
  
  class Controller {
    constructor(model, view) {
      this.model = model
      this.view = view

      this.onSchemaChanged(this.model.Schema)
      this.view.bindAddSchema(this.handleAddSchema)
      this.model.bindSchemaChanged(this.onSchemaChanged)
    }
    onSchemaChanged=(Schema)=>{
        console.log('onSchemaChanged')
        this.view.displayEditor(Schema)
    }
    handleAddSchema=(newSchema)=>{
        console.log('handleAddSchema')
        this.model.addSchema(newSchema) 
    }


  }
  
  const app = new Controller(new Model(), new View())