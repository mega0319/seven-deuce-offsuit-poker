import React from 'react'
import Codemirror from 'react-codemirror'
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/xml/xml');
require('codemirror/mode/markdown/markdown');
require('codemirror/lib/codemirror.css')

export default class CodeApp extends React.Component{

  constructor(){
    super()

    this.state = {
      code: "",
      readOnly: false,
			mode: 'javascript'
    }
  }

  updateCode(newCode){
    this.setState({
      code: newCode
    })
  }

  changeMode(mode){
    this.setState({
      mode: mode
    })
    console.log(this.state.mode)
  }

  toggleReadOnly () {
		this.setState({
			readOnly: !this.state.readOnly
		}, () => this.refs.editor.focus());
	}

  render(){
    let options = {
			lineNumbers: true,
			readOnly: this.state.readOnly,
			mode: this.state.mode
		};

    return(
      <div>
        <Codemirror ref="editor" value={this.state.code} onChange={this.updateCode.bind(this)} options={options} autoFocus={true} />
        <div style={{ marginTop: 10 }}>
          <select onChange={this.changeMode.bind(this)} value={this.state.mode}>
            <option value="markdown">Markdown</option>
            <option value="javascript">JavaScript</option>
          </select>
          <button onClick={this.toggleReadOnly}>Toggle read-only mode (currently {this.state.readOnly ? 'on' : 'off'})</button>
        </div>
      </div>
    )
  }
}
