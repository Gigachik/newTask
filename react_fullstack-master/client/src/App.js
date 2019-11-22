import React, { Component } from "react";
import axios from "axios";

class App extends Component {
  state = {
    data: [],
    id: 0,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null,
  };
  
  componentDidMount() {
   
    this.getDataFromDb();
    /*if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    } */
  }

  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  getDataFromDb = () => {
    fetch("http://localhost:3001/api/getData")
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }));

  };

  putDataToDB = message => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }
    const newData = { 
      id: idToBeAdded,
      message: message
    }
    axios.post("http://localhost:3001/api/putData", newData)
      .then( (res) => {
        this.setState((state) => {
        return {
          data: [...state.data, res.data.data]
        }
    })});
    
    };
  
  deleteFromDB = idTodelete => {
    const delData = {
      data: {
        id: idTodelete
      }
    }
   
    axios.delete("http://localhost:3001/api/deleteData", delData).then(res => {
      console.log('THEN DELETE', res);
    this.setState( state => ({
      data: state.data.filter(item => +item.id !== +idTodelete)
    }))})
  };

  updateDB = (idToUpdate, updateToApply) => {
    const updData = {
      id: idToUpdate,
      update: { message: updateToApply }
    } 
    axios.post("http://localhost:3001/api/updateData", updData)
    .then(res => {
    console.log('THEN UPDATE', res);

    this.setState(state => ({
      data: state.data.map(item => {    
        if(+idToUpdate === +item.id){
          console.log(item.id + ' ' + updateToApply);
          return {
            ...item, message: updateToApply
          }
        }
        return {
          ...item
        }
      })
    }))})
  };

  render() {
    const { data } = this.state;
    return (
      <div>
        <ul> 
          {data.length <= 0 ? "NO DB ENTRIES YET" : data.map(dat => (
            <li style={{ padding: "10px" }} key={dat.id}>
              <span style={{ color: "gray" }}> id: </span> {dat.id} <br />
              <span style={{ color: "gray" }}> data: </span>
              {dat.message}
            </li>
          ))}
        </ul>
        <div style={{ padding: "10px" }}>
          <input
            type="text"
            onChange={e => this.setState({ message: e.target.value })}
            placeholder="add something in the database"
            style={{ width: "200px" }}
          />
          <button onClick={() => this.putDataToDB(this.state.message)}>
            ADD
          </button>
        </div>
        <div style={{ padding: "10px" }}>
          <input
            type="text"
            style={{ width: "200px" }}
            onChange={e => this.setState({ idToDelete: e.target.value })}
            placeholder="put id of item to delete here"
          />
          <button onClick={() => this.deleteFromDB(this.state.idToDelete)}>
            DELETE
          </button>
        </div>
        <div style={{ padding: "10px" }}>
          <input
            type="text"
            style={{ width: "200px" }}
            onChange={e => this.setState({ idToUpdate: e.target.value })}
            placeholder="id of item to update here"
          />
          <input
            type="text"
            style={{ width: "200px" }}
            onChange={e => this.setState({ updateToApply: e.target.value })}
            placeholder="put new value of the item here"
          />
          <button
            onClick={() =>
              this.updateDB(this.state.idToUpdate, this.state.updateToApply)
            }
          >
            UPDATE
          </button>
        </div>
      </div>
    );
  }
}

export default App;
