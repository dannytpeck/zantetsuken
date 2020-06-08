import React, { useState, useEffect } from 'react';
import moment from 'moment';

import Airtable from 'airtable';
const base = new Airtable({ apiKey: 'keyCxnlep0bgotSrX' }).base('appHXXoVD1tn9QATh');

import Header from './header';
import Footer from './footer';

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
            // Is the EndDate in the future?
            const activityActive = moment() < moment(activity.EndDate);

            if (activity.Name.includes('Not Alone: Mental Health') && activityActive) {
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

  function updateChallenge(activity) {
    const employerName = activity.client.fields['Limeade e='];

    const updatedAboutChallenge = activity.AboutChallenge;

    $.ajax({
      url: 'https://api.limeade.com/api/admin/activity/' + activity.ChallengeId,
      type: 'PUT',
      dataType: 'json',
      data: JSON.stringify({
        'AboutChallenge': updatedAboutChallenge
      }),
      headers: {
        Authorization: 'Bearer ' + activity.client.fields['LimeadeAccessToken']
      },
      contentType: 'application/json; charset=utf-8'
    }).done((result) => {

      // Change row to green on success (and remove red if present)
      $('#' + employerName.replace(/\s*/g, '')).removeClass('bg-danger');
      $('#' + employerName.replace(/\s*/g, '')).addClass('bg-success text-white');

    }).fail((request, status, error) => {
      $('#' + employerName.replace(/\s*/g, '')).addClass('bg-danger text-white');
      console.error(request.status);
      console.error(request.responseText);
      console.log('Update challenge failed for client', activity.client.fields['Limeade e=']);
    });
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

      const hasApp = activity.AboutChallenge.match(/Resources in the Aduro App/g);
      const hasCoaching = activity.AboutChallenge.match(/Connect to coach support/g);

      return (
        <tr id={employerName.replace(/\s*/g, '')} key={employerName}>
          <td>{activity.client.fields['Account Name']}</td>
          <td><a href={`${domain}/Home/?cid=${activity.ChallengeId}`} target="_blank">{activity.Name}</a></td>
          <td><a href={`${domain}/admin/program-designer/activities/activity/${activity.ChallengeId}`} target="_blank">{activity.ChallengeId}</a></td>
          <td>
            {
              hasApp ? 'Coaching + App' :
                hasCoaching ? 'Coaching, No App' : 'Non-Coaching'
            }
          </td>
          <td>
            <button type="button" className="btn btn-primary" onClick={() => updateChallenge(activity)}>Update</button>
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
            <th scope="col">Challenge Id</th>
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
