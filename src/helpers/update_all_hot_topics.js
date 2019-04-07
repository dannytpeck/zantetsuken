import { RateLimiter } from 'limiter';

// Allow 6 requests per second
const limiter = new RateLimiter(6, 'second');

/* globals $ */
const updateAllHotTopics = (client, tiles) => {

  // is it a Hot Topic and from 2019 and not Jan, Feb, March since
  // there's no point in updating anything but Apr - Dec
  function isItA2019HotTopic(tile) {
    return tile.Name.includes('Hot Topics') &&
           tile.StartDate.includes('2019') &&
           !tile.StartDate.includes('01-') &&
           !tile.StartDate.includes('02-') &&
           !tile.StartDate.includes('03-');
  }

  const filteredTiles = tiles.filter(isItA2019HotTopic);

  if (filteredTiles.length > 0) {
    let updatedTiles = filteredTiles.slice(0);
    const regex = /%26em%3D%5Bemail%5D%26emid%3D%5Bemployeeid%5D%26fname%3D%5Bfirst%5D%26lname%3D%5Blast%5D/g;
    updatedTiles.map(tile => {
      if (tile.AboutChallenge.match(regex)) {

        // Throttle requests
        limiter.removeTokens(1, function() {
          $.ajax({
            url: 'https://api.limeade.com/api/admin/activity/' + tile.ChallengeId,
            type: 'PUT',
            dataType: 'json',
            headers: {
              'Authorization': 'Bearer ' + client.fields['LimeadeAccessToken']
            },
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
              'AboutChallenge': tile.AboutChallenge.replace(regex, '%26participantCode%3D%5Bparticipantcode%5D%26eventType%3DHot%20Topics')
            })
          }).done(result => {
            console.log(`${client.fields['Account Name']} - Tile updated - ${tile.Name}`);
          }).fail((xhr, textStatus, error) => {
            console.error(`${client.fields['Account Name']} - Tile update failed - ${tile.Name}`);
          });
        });

      } else {
        console.log(`${client.fields['Account Name']} - Update not needed`);
      }
    });
  } else {
    console.log(`${client.fields['Account Name']} does not have 2019 Hot Topics`);
  }
};

export default updateAllHotTopics;
