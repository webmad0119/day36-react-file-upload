import React, { Component } from 'react';
import api from './api';
import Axios from 'axios';

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      file: null,
      photos: [],
      username: null
    }
  }
  
  //cuando el componente está montado, pedimos el userid de nuestra base de datos
  //tú tendrás que extraerlo via tu session
  componentDidMount() {
    api.getUserdata("5c7524a58ca56f4edf5e52c9").
    then(userDataInfo => {
      //aquí introducimos en el state de este componente el nombre real del usuario con la id 5c7524a58ca56f4edf5e52c9
      //al inyectar esta información que viene de mi expressm en el state, provocamos un re render con la información
      //correcta de este
      this.setState({
        ...this.state,
        username: userDataInfo.username
      })
    })
  }

  handleChange(e) {
    this.setState({
      ...this.state,
      file: e.target.files[0]
    })
  }

  handleChangeUsername(e) {
    this.setState({
      ...this.state,
      username: e.target.value
    })
  }

  //esta función maneja qué pasa cuando hago submit en el formulario de actualización de username
  handleSubmitUpdateUsername(e) {
    e.preventDefault()

    //pedimos actualizar a nuestra api de front con el nuevo dato que nos han escrito en el campo de texto
    //y que ahora está en el state
    api.updateUsername(this.state.username).then(usernameUpdateConfirmation =>{
      //extraemos el state y a partir de aqui, inyectamos en el state del componente el nuevo nombre de usuario
      //que desde el back nos viene newUsername
      let newState = {
        ...this.state,
        username: usernameUpdateConfirmation.newUsername
      }

      //verificamos que userUpdated tiene un valor de true y si es así, introducmos en el state un nuevo campo showTickOk a true
      //que nos permitirá mostrar un mensaje de que la actualización del nombre de usuario ha tenido éxito
      if (usernameUpdateConfirmation.userUpdated) {
        newState.showTickOk = true
      }
      
      //al re establecer el state, provocamos un re-render
      this.setState(newState)
    })
  }

  //esta función maneja qué pasa cuando hago submit en el formulario de subida de imágenes
  handleSubmit(e) {
    e.preventDefault()
    // Reuse of the method "addPicture" from the file '../api'
    api.addPicture(this.state.file).then(photoData => {
      let newPhotos = [...this.state.photos]
      newPhotos.push(photoData)

      this.setState({
        ...this.state,
        photos: newPhotos
      })
    })
  }
  render() {                
    return (
      <div className="Home">
        <h2>Photo Upload</h2>

        {(this.state.showTickOk) ? <p>updated ok</p> : ""}

        <form onSubmit={(e)=>this.handleSubmitUpdateUsername(e)}>
          <input type="text" value={this.state.username} onChange={(e)=>this.handleChangeUsername(e)} />
          <button type="submit">Update user</button>
        </form>

        <form onSubmit={(e)=>this.handleSubmit(e)}>
          <input type="file" onChange={(e)=>this.handleChange(e)} /> <br/>
          <button type="submit">Upload photo</button>
        </form>

        {this.state.photos.map(photo => <img key={photo.url} src={photo.url} alt="" />)}
      </div>
    );
  }
}

export default Home;