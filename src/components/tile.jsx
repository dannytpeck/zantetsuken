import React from 'react';

const Tile = (props) => {
  const tile = props.tile;
  return (
    <div className="tile">
      <img className="tile-image" src={tile.SmallImageSrc} alt="" />
      <div className="tile-title">
        <h3>{tile.Title}</h3>
      </div>
      <div className="n-item-details">
        <div className="reward link-color">
          <div className="reward-points-outer">
            <span className="reward-points-num">{tile.Reward.Value}</span>
            <small>
              <abbr> pts</abbr>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tile;
