import React from "react";

function WaitRoom() {
  return (
    <div className="wait-room">
      <div className="wait-message">
        <p>Waiting for another user to join...</p>
      </div>
      {/* You can add additional waiting indicators here, such as a loading spinner */}
    </div>
  );
}

export default WaitRoom;
