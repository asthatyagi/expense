import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-awesome-modal';
import axios from 'axios';

class App extends Component {

  state = {
    expenses: [],
    modal: false,
    addModal: false,
    newTitle: '',
    newAuthor: '',
    newCOST: '',
    editTitle: '',
    editAuthor: '',
    editCOST: '',
    editID: ''
  };

  componentDidMount() {
    this.fetchAllExpenses()
  }

  renderExpensesList() {
    return this.state.expenses.map(({_id, cost, title, author}) =>
      <tr key={_id}>
        <td><Link to={`/show/${_id}`}>{cost}</Link></td>
        <td>{title}</td>
        <td>{author}</td>
        <td style={{width:"175px"}}><button className="btn btn-info" onClick={() => this.openModal(_id, cost, title, author)} >EDIT</button> <button className="btn btn-danger" onClick={() => this.deleteExpense(_id)}>DELETE</button></td>
      </tr>
    )
  }

  openModal(id, cost, title, author) {
    console.log('Open Modal')
    this.setState({
      modal : true,
      editID: id,
      editTitle: title,
      editAuthor: author,
      editCOST: cost
    });

  }

  closeModal() {
    console.log('Close Modal')
    this.setState({
      modal : false
    });
  }

  openAddModal(id, cost, title, author) {
    console.log('Open Modal')
    this.setState({
      addModal : true
    });

  }

  closeAddModal() {
    console.log('Close Modal')
    this.setState({
      addModal : false
    });
  }


  fetchAllExpenses() {
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
    axios.get('http://localhost:5000/api/expense')
      .then(res => {
        this.setState({ expenses: res.data });
        console.log(this.state.expenses);
      })
      .catch((error) => {
        if(error.response.status === 401) {
          this.props.history.push("/login");
        }
      });
  }

  logout = () => {
    localStorage.removeItem('jwtToken');
    window.location.reload();
  }

  createExpense = (event) => {
    event.preventDefault();
    const expensedata = {
      title: this.state.newTitle,
      author: this.state.newAuthor,
      cost: this.state.newCOST
    }
    axios.post('http://localhost:5000/api/expense', expensedata)
    this.fetchAllExpenses();
    this.setState({ newTitle: '', newAuthor: '', newCOST: '' })
    this.closeAddModal();
    this.fetchAllExpenses();
  }

  updateExpense = (event) => {
    event.preventDefault();
    const expenseData = {
      title: this.state.editTitle,
      author: this.state.editAuthor,
      cost: this.state.editCOST,
      id: this.state.editID
    }
    axios.put('http://localhost:5000/api/expense', expenseData)
    this.closeModal();
    this.setState({ editTitle: '', editAuthor: '', editCOST: '' })
    this.fetchAllExpenses();
  }

  deleteExpense = async (id) => {
    console.log({id})
    console.log('Delete clicked')
    await axios.delete('http://localhost:5000/api/expense/', { data: { id: id } })
    this.fetchAllExpenses()
  }

  handleTitleChange = (event) => {
    this.setState({ newTitle: event.target.value });
  };

  handleAuthorChange = (event) => {
    this.setState({ newAuthor: event.target.value });
  };

  handleCOSTChange = (event) => {
    this.setState({ newCOST: event.target.value });
  };

  handleEditTitleChange = (event) => {
    this.setState({ editTitle: event.target.value });
  };

  handleEditAuthorChange = (event) => {
    this.setState({ editAuthor: event.target.value });
  };

  handleEditCOSTChange = (event) => {
    this.setState({ editCOST: event.target.value });
  };

  render() {
    return (
      <div className="container">
        <Modal 
            visible={this.state.modal}
            width="550"
            height="375"
            effect="fadeInUp"
            onClickAway={() => this.closeModal()}
        >
          <div className="container">
              <h1>Edit Expense</h1>
              <form onSubmit={this.updateExpense}>
              Item Title:<br />
              <input class="form-control" type="text" onChange={this.handleEditTitleChange} name="title" value={this.state.editTitle} placeholder="Laptop"/>
              <br />
              Person:<br />
              <input type="text" class="form-control" onChange={this.handleEditAuthorChange} name="author" value={this.state.editAuthor} placeholder="HR"/>
              <br/>
              COST:<br />
              <input type="text" class="form-control" onChange={this.handleEditCOSTChange} name="author" value={this.state.editCOST} placeholder="57000"/>
              <br/>
              <div>
              <input className="btn btn-info" type="submit" value="Update Expense" />
              <button className="btn btn-danger float-right" onClick={() => this.closeModal()}>Close</button>
              </div>
            </form> 
          </div>
        </Modal>


        <Modal 
            visible={this.state.addModal}
            width="550"
            height="375"
            effect="fadeInUp"
            onClickAway={() => this.closeAddModal()}
        >
          <div className="container">
              <h1>Add Expense</h1>
              <form onSubmit={this.createExpense}>
              Item Title:<br />
              <input type="text" class="form-control" onChange={this.handleTitleChange} name="title" value={this.state.newTitle} placeholder="Laptop"/>
              Person:<br />
              <input type="text" class="form-control" onChange={this.handleAuthorChange} name="author" value={this.state.newAuthor} placeholder="HR"/>
              COST:<br />
              <input type="text" class="form-control" onChange={this.handleCOSTChange} name="author" value={this.state.newCOST} placeholder="57000"/>
              <input className="btn btn-success" type="submit" value="Create Expense" />
            </form> 
          </div>
        </Modal>



        <div className="panel panel-default">
          <div className="mb-5 panel-heading">
            <h3 className="panel-title">
              Expense Catalog &nbsp;
              {localStorage.getItem('jwtToken') &&
                <button className="btn btn-primary float-right" onClick={this.logout}>Logout</button>
              }
              <button onClick={() => this.openAddModal()} className="btn btn-success float-right mr-2">Add Expense</button>
            </h3>
          </div>
          <div className="panel-body">
            <table className="table table-stripe">
              <thead>
                <tr>
                  <th>COST</th>
                  <th>Description</th>
                  <th>Person</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {this.renderExpensesList()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
