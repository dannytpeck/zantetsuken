import React, { useState, useEffect } from 'react';

import Airtable from 'airtable';
const base = new Airtable({ apiKey: 'keyCxnlep0bgotSrX' }).base('appHXXoVD1tn9QATh');

import Header from './header';
import Footer from './footer';

import updateAllHotTopics from '../helpers/update_all_hot_topics';

function reducer(state, action) {
  return [...state, ...action];
}

/* globals $ */
function App() {
  const [clients, dispatchClients] = React.useReducer(
    reducer,
    [] // initial clients
  );
  const [activities, dispatchActivities] = React.useReducer(
    reducer,
    [] // initial activities
  );

  // When app first mounts, fetch clients
  useEffect(() => {

    base('Clients').select({
      view: 'sorted'
    }).eachPage((records, fetchNextPage) => {
      dispatchClients(records);

      fetchNextPage();
    }, (err) => {
      if (err) {
        console.error(err);
        return;
      }
    });

  }, []); // Pass empty array to only run once on mount

  function getActivities() {

    // Set counter based on # of clients
    $('#counter').html(`<p><span id="finishedUploads">0</span> / ${clients.length}</p>`);

    clients.map(client => {

      if (client.fields['LimeadeAccessToken']) {

        $.ajax({
          url: 'https://api.limeade.com/api/admin/activity',
          type: 'GET',
          dataType: 'json',
          headers: {
            Authorization: 'Bearer ' + client.fields['LimeadeAccessToken']
          },
          contentType: 'application/json; charset=utf-8'
        }).done(result => {

          // Advance the counter
          let count = Number($('#finishedUploads').html());
          $('#finishedUploads').html(count + 1);

          result.Data.map(activity => {
            if (activity.Name.includes('Not Alone: Mental Health')) {
              activity.client = client;
              dispatchActivities([...activities, activity]);
            }
          });

        }).fail((xhr, textStatus, error) => {
          console.error(`${client.fields['Account Name']} - GET ActivityLifecycle has failed`);
        });

      } else {
        console.error(`${client.fields['Account Name']} has no LimeadeAccessToken`);
      }

    });

  }

  function performUpdate(activity) {
    if (activity.AboutChallenge.includes('anxiety_antidote')) {
      console.log('anxiety_antidote found, update not needed');
    } else {

      const employerName = activity.client.fields['Limeade e='];
      const psk = activity.client.fields['Limeade PSK'];

      const csv = createCSV(activity);
      const url = 'https://calendarbuilder.dev.adurolife.com/limeade-upload/';

      const params = {
        e: employerName,
        psk: psk,
        data: csv.join('\n'),
        type: 'IncentiveEvents'
      };

      $.post(url, params).done((response) => {
        $('#' + employerName.replace(/\s*/g, '')).addClass('bg-success text-white');
      }).fail((request, status, error) => {
        $('#' + employerName.replace(/\s*/g, '')).addClass('bg-danger text-white');
        console.error(request.status);
        console.error(request.responseText);
        console.log('Update CIE failed for client ' + employerName);
      });

    }
  }

  function renderActivities() {

    // Sorts the list of activities by client's account name
    const sortedActivities = [...activities];

    sortedActivities.sort((a, b) => {
      const nameA = a.client.fields['Account Name'].toLowerCase();
      const nameB = b.client.fields['Account Name'].toLowerCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

    return sortedActivities.map((activity) => {
      const employerName = activity.client.fields['Limeade e='];
      const domain = activity.client.fields['Domain'];
      const eventId = activity.ChallengeId * -1;

      const hasApp = activity.AboutChallenge.match(/Resources in the Aduro App/g);
      const hasCoaching = activity.AboutChallenge.match(/Connect to coach support/g);

      return (
        <tr id={employerName.replace(/\s*/g, '')} key={employerName}>
          <td>{activity.client.fields['Account Name']}</td>
          <td><a href={`${domain}/Home/?cid=${eventId}`} target="_blank">{activity.Name}</a></td>
          <td>
            {
              hasApp ? 'Coaching + App' :
                hasCoaching ? 'No App' : 'No Coaching'
            }
          </td>
          <td>
            <button type="button" className="btn btn-primary" onClick={() => performUpdate(activity)}>Update</button>
          </td>
        </tr>
      );
    });

  }

  return (
    <div id="app">
      <Header />

      <div className="form-group">
        <button type="button" className="btn btn-primary" onClick={getActivities}>Download Activities</button>
        <div id="counter"></div>
      </div>

      <table className="table table-hover table-striped" id="activities">
        <thead>
          <tr>
            <th scope="col">Account Name</th>
            <th scope="col">Name</th>
            <th scope="col">Type</th>
            <th scope="col">Update</th>
          </tr>
        </thead>
        <tbody>
          {renderActivities()}
        </tbody>
      </table>

      <Footer />

    </div>
  );
}

export default App;
