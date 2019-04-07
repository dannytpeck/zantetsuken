import React, { Component } from 'react';

import Header from './header';
import Footer from './footer';
import UploadModal from './upload_modal';

import updateAllHotTopics from '../helpers/update_all_hot_topics';

/* globals $ */
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clients: []
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

  render() {
    return (
      <div id="app">
        <Header />

        <button type="button" className="btn btn-primary" onClick={() => this.getActivityLifecycle()}>ActivityLifecycle API</button>
        <p>(pulls everything - past, present, and future - Even legacy CIEs)</p>
        <p>(good for mass updates to entire platforms, calendar builder, etc)</p>

        <button type="button" className="btn btn-primary" onClick={() => this.getActivities()}>Activities API</button>
        <p>(what's visible in the platform)</p>
        <p>(could be useful for seeing a list of currently visible content or building your own UI)</p>

        <Footer />
        <UploadModal />
      </div>
    );
  }
}

export default App;
