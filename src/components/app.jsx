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

    const hasApp = activity.AboutChallenge.match(/Aduro App/g);
    const hasCoaching = activity.AboutChallenge.match(/Connect to coach support/g);

    let updatedAboutChallenge;

    if (hasApp) {
      updatedAboutChallenge = '<p><strong>What is Mental Health?</strong></p><ul><li>Mental health refers to our emotional, psychological, and social well-being.</li><li>Just like physical health, every person has mental health.</li><li>It affects how we think, feel, and act. It determines how we handle stress, relate to others, and make healthy choices.</li></ul><p><strong>Mental Health Support</strong></p><p><strong style="color: #4f81bd;">It\'s normal.</strong> Just like we all have challenges with our physical well-being from time to time, everyone will struggle with their mental health over the course of a lifetime.</p><p><strong style="color: #4f81bd;">It\'s for everyone.</strong> Mental health support is not just for people with mental illness.</p><p><strong style="color: #4f81bd;">It\'s available to you.</strong> It can be difficult to know how or who to ask for help. There are many ways to access support - whether you want to talk to another person, utilize on-demand interactive content, or join a live group discussion.</p><p><strong>Connect to Confidential Human Support</strong></p><p>Aduro coaches support hundreds of people each month with managing emotions, challenging negative thinking patterns, improving relationship skills, reducing stress and anxiety, and more.</p><ul><li><a href="/api/redirect?url=https%3A//wellmetricssurveys.secure.force.com/Calendar/ProgramCalendarV2%3Fe=%5Be%5D%26formType=%26calendarName=Ignite+Your+Life%26participantCode=%5Bparticipantcode%5D" target="_blank" rel="noopener">Connect to coach support quickly</a></li></ul><p><strong>Access Digital Tools and Resources </strong></p><p><a href="/Home/?cid=2351">Register for focused 6-week paths</a></p><p><a href="https://amp.adurolife.com/referral/limeade-signup" target="_blank" rel="noopener">Access on-demand resources through the Aduro App</a></p><p>Topics include:</p><ul><li>Stress</li><li>Anxiety &amp; overwhelm</li><li>Burnout</li><li>Parenting</li><li>Grief &amp; loss</li><li>Compassion fatigue</li><li>Loneliness</li><li>Much more!</li></ul><p><sub><em>Mental health struggles touch us all in some way at some time in our lives. Aduro provides coaching but does not provide licensed therapy or other licensed mental health services, including the diagnosis or treatment of any condition. Aduro Coaches can provide personalized and confidential support to help you build resilience, change patterns, drive change, and overcome obstacles as you work towards your goals. You can connect with a coach 1:1 free of charge by scheduling through your platform, or you can email us with questions at <a href="mailto:coaching@adurolife.com">coaching@adurolife.com</a>.</em></sub></p><p><sub><em>If you think you could benefit from professional mental health therapy or counseling, please reach out to a licensed mental health clinician and/or check with your Human Resource Department to confidentially inquire about if you have an Employee Assistance Programs (EAP). The National Alliance on Mental Illness (NAMI) can also help you find local support. You can find this resource online <a href="http://www.nami.org/find-support" target="_blank" rel="noopener">here</a> or by calling 800-950-NAMI.</em></sub></p><p><sub><em>If you\'re worried about harming yourself or others or are experiencing an emergency, please call 911 or go to your nearest emergency room.</em></sub></p>';
    } else if (hasCoaching) {
      updatedAboutChallenge = '<p><strong>What is Mental Health?</strong></p><ul><li>Mental health refers to our emotional, psychological, and social well-being.</li><li>Just like physical health, every person has mental health.</li><li>It affects how we think, feel, and act. It determines how we handle stress, relate to others, and make healthy choices.</li></ul><p><strong>Mental Health Support</strong></p><p><strong style="color: #4f81bd;">It\'s normal.</strong> Just like we all have challenges with our physical well-being from time to time, everyone will struggle with their mental health over the course of a lifetime.</p><p><strong style="color: #4f81bd;">It\'s for everyone.</strong> Mental health support is not just for people with mental illness.</p><p><strong style="color: #4f81bd;">It\'s available to you.</strong> It can be difficult to know how or who to ask for help. There are many ways to access support - whether you want to talk to another person, utilize on-demand interactive content, or join a live group discussion.</p><p><strong>Connect to Confidential Human Support</strong></p><p>Aduro coaches support hundreds of people each month with managing emotions, challenging negative thinking patterns, improving relationship skills, reducing stress and anxiety, and more.</p><ul><li><a href="/api/redirect?url=https%3A//wellmetricssurveys.secure.force.com/Calendar/ProgramCalendarV2%3Fe=%5Be%5D%26formType=%26calendarName=Ignite+Your+Life%26participantCode=%5Bparticipantcode%5D" target="_blank" rel="noopener">Connect to coach support quickly</a></li></ul><p><strong>Access Tools and Resources </strong></p><p><a href="/Home/?cid=2351">Register for focused 6-week paths</a></p><p><em><sub>Mental health struggles touch us all in some way at some time in our lives. Aduro provides coaching but does not provide licensed therapy or other licensed mental health services, including the diagnosis or treatment of any condition. Aduro Coaches can provide personalized and confidential support to help you build resilience, change patterns, drive change, and overcome obstacles as you work towards your goals. You can connect with a coach 1:1 free of charge by scheduling through your platform, or you can email us with questions at <a href="mailto:coaching@adurolife.com">coaching@adurolife.com</a>.</sub></em></p><p><em><sub>If you think you could benefit from professional mental health therapy or counseling, please reach out to a licensed mental health clinician and/or check with your Human Resource Department to confidentially inquire about if you have an Employee Assistance Programs (EAP). The National Alliance on Mental Illness (NAMI) can also help you find local support. You can find this resource online <a href="http://www.nami.org/find-support" target="_blank" rel="noopener">here</a> or by calling 800-950-NAMI.</sub></em></p><p><em><sub>If you\'re worried about harming yourself or others or are experiencing an emergency, please call 911 or go to your nearest emergency room.</sub></em></p>';
    } else {
      updatedAboutChallenge = activity.AboutChallenge;
      console.log('No coaching or app found, no updated required.');
    }

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

      const hasApp = activity.AboutChallenge.match(/Aduro App/g);
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
