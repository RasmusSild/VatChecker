/**
 * Created by Rasmus Sild
 * 24.09.2018
 **/
import React, { Component } from 'react';
import axios from 'axios';
import {Grid, Segment, Form, Table, Button, Message} from 'semantic-ui-react'

class App extends Component {

    state = {
        vatNumber: null,
        data: null,
        requestLoading: false,
        hasError: false,
        errorMessage: null
    };

    checkVatNumber = () => {
        const {vatNumber} = this.state;

        this.setState({
            requestLoading: true,
            data: null,
            hasError: false,
            errorMessage: null
        });

        axios.get('https://vat.erply.com/numbers?vatNumber=' + vatNumber)
            .then((response) => {
                this.setState({
                    requestLoading: false,
                    data: response.data
                });
        })
            .catch((error) => {
                this.setState({
                    requestLoading: false,
                    data: null,
                    hasError: true,
                    errorMessage: error.response.data.error
                });
        })
    };

    renderError = () => {
        const {hasError, errorMessage} = this.state;

        if (hasError) {
            return <Message negative>{errorMessage}</Message>
        } else return null;
    };

    render() {

        const {requestLoading, data} = this.state;

        let renderTableRows = null;

        if (data) {
            renderTableRows = Object.keys(data).map((key) => {
                return <Table.Row key={key}>
                    <Table.Cell>
                        {key}
                    </Table.Cell>
                    <Table.Cell>
                        {data[key].toString()}
                    </Table.Cell>
                </Table.Row>
            });
        }

        return (
          <div className="App">
              <Grid className="app-container">
                  <Grid.Row>
                      <Grid.Column width={2} />
                      <Grid.Column width={12}>

                          <Segment>
                              <Form onSubmit={this.checkVatNumber}>
                                  <Form.Field>
                                      <label>VAT number</label>
                                      <input onChange={(e) => {e.preventDefault(); this.setState({vatNumber: e.target.value})}}/>
                                  </Form.Field>
                                  <Button primary type='submit' loading={requestLoading}>Check</Button>
                              </Form>
                          </Segment>

                          {!!data &&
                              <Segment>
                                  <Table celled>

                                      <Table.Header>
                                          <Table.Row>
                                              <Table.HeaderCell>Field</Table.HeaderCell>
                                              <Table.HeaderCell>Value</Table.HeaderCell>
                                          </Table.Row>
                                      </Table.Header>

                                      <Table.Body>
                                          {renderTableRows}
                                      </Table.Body>
                                  </Table>
                              </Segment>
                          }

                          {this.renderError()}

                      </Grid.Column>
                      <Grid.Column width={2} />
                  </Grid.Row>
              </Grid>
          </div>
        );
    }
}

export default App;
