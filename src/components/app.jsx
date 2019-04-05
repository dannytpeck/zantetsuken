import React, { Component } from 'react';
import Header from './header';
import Footer from './footer';
import UploadModal from './upload_modal';

/* global $ */

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {}

  getActivityLifecycle() {
    $.ajax({
      url: 'https://api.limeade.com/api/admin/activity',
      type: 'GET',
      dataType: 'json',
      headers: {
        Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IlNTZ2w4Zzg1ZDNELUlVaFY3dXB5bkQzMEVYTSIsImtpZCI6IlNTZ2w4Zzg1ZDNELUlVaFY3dXB5bkQzMEVYTSJ9.eyJjbGllbnRfaWQiOiJpbnRlcm5hbGNsaWVudCIsInNjb3BlIjpbImFwaWFjY2VzcyIsIm9wZW5pZCIsInBpaWlkZW50aXR5Il0sInN1YiI6IjU3NDU4NDAiLCJhbXIiOiJwYXNzd29yZCIsImF1dGhfdGltZSI6MTU1NDM2NDA1MiwiaWRwIjoiaWRzcnYiLCJuYW1lIjoiTGltZWFkZWRlbW9yYkFkbWluIiwibGltZWFkZV9hY2NvdW50X2lkIjoiNTc0NTg0MCIsImVtcGxveWVyaWQiOiIxMDY2ODciLCJlbXBsb3llcl9pZCI6IjEwNjY4NyIsInJvbGUiOlsiQWRtaW4iLCJQcm9ncmFtQWRtaW4iXSwiZW1wbG95ZXJuYW1lIjoiTGltZWFkZWRlbW9yYiIsImdpdmVuX25hbWUiOiJMaW1lYWRlZGVtb3JiIiwiZmFtaWx5X25hbWUiOiJBZG1pbiIsImVtYWlsIjoiTGltZWFkZWRlbW9yYkFkbWluQGFkdXJvbGlmZS5jb20iLCJpc3MiOiJ3d3cubGltZWFkZS5jb20iLCJhdWQiOiJ3d3cubGltZWFkZS5jb20vcmVzb3VyY2VzIiwiZXhwIjoxNTg1OTAwMDUyLCJuYmYiOjE1NTQzNjQwNTJ9.lBxDcJISpOztmrO89W1rSFyNBjWHYBXbvSd1rQCQ8MzWVK-4XYghZ5_Cvm2we0c8PaAOHd0tZMVKc00R_s0-88adaXv0KkxA4VVjKoSQOXopFccuHyzPPxktFqNidVfJMr3_GL38eozqA0p336LHIEH6vWTqtXoptNagcxUw-vipyXKGfx7OAoqwu27T7XmPTjTR_yZqYEkFF1wUg4T0Z5mXgflzACW-XXihFH9_8E5_UzdD3_qoAq6ZABcjFfs3wEXwHHZTvC0S0EeoSPPkwxxVYMOqe4btwGY5HWz1a7hJBu2tFxPcg6xm_TZS2kFJlHywS9UIuQ-jgLyiwvSX-Q'
      },
      contentType: 'application/json; charset=utf-8',
      success: function (result) {
        const tiles = result.Data;
        console.log(tiles);

        function isItA2019HotTopic(tile) {
          return tile.Name.includes('Hot Topics') && tile.StartDate.includes('2019');
        }

        const filteredTiles = tiles.filter(isItA2019HotTopic);

        console.log(filteredTiles);

        let tile5 = filteredTiles[4];

        $.ajax({
          url: 'https://api.limeade.com/api/admin/activity/' + tile5.ChallengeId,
          type: 'PUT',
          dataType: 'json',
          headers: {
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IlNTZ2w4Zzg1ZDNELUlVaFY3dXB5bkQzMEVYTSIsImtpZCI6IlNTZ2w4Zzg1ZDNELUlVaFY3dXB5bkQzMEVYTSJ9.eyJjbGllbnRfaWQiOiJpbnRlcm5hbGNsaWVudCIsInNjb3BlIjpbImFwaWFjY2VzcyIsIm9wZW5pZCIsInBpaWlkZW50aXR5Il0sInN1YiI6IjU3NDU4NDAiLCJhbXIiOiJwYXNzd29yZCIsImF1dGhfdGltZSI6MTU1NDM2NDA1MiwiaWRwIjoiaWRzcnYiLCJuYW1lIjoiTGltZWFkZWRlbW9yYkFkbWluIiwibGltZWFkZV9hY2NvdW50X2lkIjoiNTc0NTg0MCIsImVtcGxveWVyaWQiOiIxMDY2ODciLCJlbXBsb3llcl9pZCI6IjEwNjY4NyIsInJvbGUiOlsiQWRtaW4iLCJQcm9ncmFtQWRtaW4iXSwiZW1wbG95ZXJuYW1lIjoiTGltZWFkZWRlbW9yYiIsImdpdmVuX25hbWUiOiJMaW1lYWRlZGVtb3JiIiwiZmFtaWx5X25hbWUiOiJBZG1pbiIsImVtYWlsIjoiTGltZWFkZWRlbW9yYkFkbWluQGFkdXJvbGlmZS5jb20iLCJpc3MiOiJ3d3cubGltZWFkZS5jb20iLCJhdWQiOiJ3d3cubGltZWFkZS5jb20vcmVzb3VyY2VzIiwiZXhwIjoxNTg1OTAwMDUyLCJuYmYiOjE1NTQzNjQwNTJ9.lBxDcJISpOztmrO89W1rSFyNBjWHYBXbvSd1rQCQ8MzWVK-4XYghZ5_Cvm2we0c8PaAOHd0tZMVKc00R_s0-88adaXv0KkxA4VVjKoSQOXopFccuHyzPPxktFqNidVfJMr3_GL38eozqA0p336LHIEH6vWTqtXoptNagcxUw-vipyXKGfx7OAoqwu27T7XmPTjTR_yZqYEkFF1wUg4T0Z5mXgflzACW-XXihFH9_8E5_UzdD3_qoAq6ZABcjFfs3wEXwHHZTvC0S0EeoSPPkwxxVYMOqe4btwGY5HWz1a7hJBu2tFxPcg6xm_TZS2kFJlHywS9UIuQ-jgLyiwvSX-Q'
          },
          contentType: 'application/json; charset=utf-8',
          data: JSON.stringify({
            'AboutChallenge': tile5.AboutChallenge.replace('Copyright', 'CopyLEFT')
          }),
          success: function (result) {
            console.log(result);
          }
        });

      }
    });
  }

  getActivities() {
    $.ajax({
      url: 'https://api.limeade.com/api/activities/?types=5&status=1&attributes=1&contents=32319',
      type: 'GET',
      dataType: 'json',
      headers: {
        Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IlNTZ2w4Zzg1ZDNELUlVaFY3dXB5bkQzMEVYTSIsImtpZCI6IlNTZ2w4Zzg1ZDNELUlVaFY3dXB5bkQzMEVYTSJ9.eyJjbGllbnRfaWQiOiJpbnRlcm5hbGNsaWVudCIsInNjb3BlIjpbImFwaWFjY2VzcyIsIm9wZW5pZCIsInBpaWlkZW50aXR5Il0sInN1YiI6IjU3NDU4NDAiLCJhbXIiOiJwYXNzd29yZCIsImF1dGhfdGltZSI6MTU1NDM2NDA1MiwiaWRwIjoiaWRzcnYiLCJuYW1lIjoiTGltZWFkZWRlbW9yYkFkbWluIiwibGltZWFkZV9hY2NvdW50X2lkIjoiNTc0NTg0MCIsImVtcGxveWVyaWQiOiIxMDY2ODciLCJlbXBsb3llcl9pZCI6IjEwNjY4NyIsInJvbGUiOlsiQWRtaW4iLCJQcm9ncmFtQWRtaW4iXSwiZW1wbG95ZXJuYW1lIjoiTGltZWFkZWRlbW9yYiIsImdpdmVuX25hbWUiOiJMaW1lYWRlZGVtb3JiIiwiZmFtaWx5X25hbWUiOiJBZG1pbiIsImVtYWlsIjoiTGltZWFkZWRlbW9yYkFkbWluQGFkdXJvbGlmZS5jb20iLCJpc3MiOiJ3d3cubGltZWFkZS5jb20iLCJhdWQiOiJ3d3cubGltZWFkZS5jb20vcmVzb3VyY2VzIiwiZXhwIjoxNTg1OTAwMDUyLCJuYmYiOjE1NTQzNjQwNTJ9.lBxDcJISpOztmrO89W1rSFyNBjWHYBXbvSd1rQCQ8MzWVK-4XYghZ5_Cvm2we0c8PaAOHd0tZMVKc00R_s0-88adaXv0KkxA4VVjKoSQOXopFccuHyzPPxktFqNidVfJMr3_GL38eozqA0p336LHIEH6vWTqtXoptNagcxUw-vipyXKGfx7OAoqwu27T7XmPTjTR_yZqYEkFF1wUg4T0Z5mXgflzACW-XXihFH9_8E5_UzdD3_qoAq6ZABcjFfs3wEXwHHZTvC0S0EeoSPPkwxxVYMOqe4btwGY5HWz1a7hJBu2tFxPcg6xm_TZS2kFJlHywS9UIuQ-jgLyiwvSX-Q'
      },
      contentType: 'application/json; charset=utf-8',
      success: function (result) {
        const tiles = result.Data;
        console.log(tiles);

        function isItAnHpTile(tile) {
          return tile.Title.includes('Health &') ||
                 tile.Title.includes('Growth &') ||
                 tile.Title.includes('Money &') ||
                 tile.Title.includes('Contribution &');
        }

        const filteredTiles = tiles.filter(isItAnHpTile);

        console.log(filteredTiles);

        let footerHtml = '';
        filteredTiles.map(tile => {
          footerHtml += '<p>' + tile.Title + '</p>';
        });
        $('#footer').html(footerHtml);

      },
      error: function (error) {
        // Error handling
      }
    });
  }

  render() {
    return (
      <div id="app">
        <Header />

        <button type="button" className="btn btn-primary" onClick={this.getActivities}>Activities API</button>
        <p>(what's visible in the platform)</p>

        <button type="button" className="btn btn-primary" onClick={this.getActivityLifecycle}>ActivityLifecycle API</button>
        <p>(pulls everything - past, present, and future - Even CIEs)</p>

        <Footer />
        <UploadModal />
      </div>
    );
  }
}

export default App;
