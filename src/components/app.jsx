import React, { Component } from 'react';

import Header from './header';
import Footer from './footer';
import Modal from './modal';
import Tile from './tile';

import updateAllHotTopics from '../helpers/update_all_hot_topics';

/* globals $ */
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clients: [],
      selectedClient: null,
      tiles: []
    };
  }

  componentDidMount() {
    $.getJSON('https://api.airtable.com/v0/appHXXoVD1tn9QATh/Clients?api_key=keyCxnlep0bgotSrX&view=sorted').done(data => {
      let records = data.records;

      if (data.offset) {
        $.getJSON(`https://api.airtable.com/v0/appHXXoVD1tn9QATh/Clients?api_key=keyCxnlep0bgotSrX&view=sorted&offset=${data.offset}`).done(data => {
          this.setState({
            clients: [...records, ...data.records]
          });
        });
      } else {
        this.setState({
          clients: records
        });
      }

    });
  }

  getActivityLifecycle() {
    this.state.clients.forEach(client => {
      if (client.fields['LimeadeAccessToken']) {
        console.log('Getting all activities for ' + client.fields['Account Name']);
        $.ajax({
          url: 'https://api.limeade.com/api/admin/activity',
          type: 'GET',
          dataType: 'json',
          headers: {
            Authorization: 'Bearer ' + client.fields['LimeadeAccessToken']
          },
          contentType: 'application/json; charset=utf-8'
        }).done(result => {
          const tiles = result.Data;

          // Place mass updater function(s) here
          updateAllHotTopics(client, tiles);

        }).fail((xhr, textStatus, error) => {
          console.error(`${client.fields['Account Name']} - GET ActivityLifecycle has failed`);
        });

      } else {
        console.error(`${client.fields['Account Name']} has no LimeadeAccessToken`);
      }
    });
  }

  getActivities() {
    this.state.clients.forEach(client => {
      if (client.fields['LimeadeAccessToken']) {
        console.log('Getting all activities for ' + client.fields['Account Name']);
        $.ajax({
          url: 'https://api.limeade.com/api/activities/?types=5&status=1&attributes=1&contents=32319',
          type: 'GET',
          dataType: 'json',
          headers: {
            Authorization: 'Bearer ' + client.fields['LimeadeAccessToken']
          },
          contentType: 'application/json; charset=utf-8'
        }).done(result => {
          const tiles = result.Data;

          // Place mass updater function(s) here

          function isItAnHpTile(tile) {
            return tile.Title.includes('Health &') ||
                   tile.Title.includes('Growth &') ||
                   tile.Title.includes('Money &') ||
                   tile.Title.includes('Contribution &');
          }

          const filteredTiles = tiles.filter(isItAnHpTile);

          console.log(client.fields['Account Name'], filteredTiles);

        }).fail((xhr, textStatus, error) => {
          console.error(`${client.fields['Account Name']} - GET Activities has failed`);
        });

      } else {
        console.error(`${client.fields['Account Name']} has no LimeadeAccessToken`);
      }
    });
  }

  getActivitiesForOneClient(client) {
    if (client) {
      if (client.fields['LimeadeAccessToken']) {
        console.log('Getting visible Home page activities for ' + client.fields['Account Name']);
        $.ajax({
          url: 'https://api.limeade.com/api/activities/?types=5&status=1&attributes=1&contents=32319',
          type: 'GET',
          dataType: 'json',
          headers: {
            Authorization: 'Bearer ' + client.fields['LimeadeAccessToken']
          },
          contentType: 'application/json; charset=utf-8'
        }).done(result => {
          const tiles = result.Data;

          // Place mass updater function(s) here
          console.log(tiles);
          this.setState({ tiles: tiles });

        }).fail((xhr, textStatus, error) => {
          console.error(`${client.fields['Account Name']} - GET Activities has failed`);
        });

      } else {
        console.error(`${client.fields['Account Name']} has no LimeadeAccessToken`);
      }
    } else {
      console.log('No client has been selected');
    }
  }

  setSelectedClient(e) {
    this.state.clients.forEach((client) => {
      if (client.fields['Limeade e='] === e.target.value) {
        this.setState({ selectedClient: client });
      }
    });
  }

  renderEmployerNames() {
    return this.state.clients.map((client) => {
      return <option key={client.id}>{client.fields['Limeade e=']}</option>;
    });
  }

  renderTiles() {
    return this.state.tiles.map((tile) => {
      return <Tile key={tile.Id} tile={tile} />;
    });
  }

  render() {
    return (
      <div id="app">
        <Header />

        <section id="massUpdater">
          <button type="button" className="btn btn-primary" onClick={() => this.getActivityLifecycle()}>Mass Update - ActivityLifecycle API</button>
          <p>(pulls everything - past, present, and future - Even legacy CIEs)</p>

          <button type="button" className="btn btn-primary" onClick={() => this.getActivities()}>Mass Update - Activities API</button>
          <p>(what's visible in the platform)</p>
        </section>

        <div className="form-group">
          <label htmlFor="employerName">EmployerName</label>
          <select id="employerName" className="form-control custom-select" onChange={(e) => this.setSelectedClient(e)}>
            <option defaultValue>Select Employer</option>
            {this.renderEmployerNames()}
          </select>
        </div>

        <button type="button" className="btn btn-primary" onClick={() => this.getActivitiesForOneClient(this.state.selectedClient)}>What on My Home Page?</button>
        <p>(show's the home page as seen by the Admin)</p>

        <div id="tileContainer">
          {this.renderTiles()}
        </div>

        <Footer />
        <Modal />
      </div>
    );
  }
}

export default App;
