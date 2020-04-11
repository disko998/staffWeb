import React from "react";
import { compose, withStateHandlers } from "recompose";
import {
  InfoWindow,
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker
} from "react-google-maps";

const Map = compose(
  withScriptjs,
  withGoogleMap
)(props => {
  console.log("props is", props);
  return (
    <GoogleMap
      zoom={12}
      center={props.markerPosition || { lat: -34.397, lng: 70.644 }}
    >
      {!!props.isMarkerShown && <Marker position={props.markerPosition} />}
    </GoogleMap>
  );
});

export class Maps extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{ height: "100%" }}>
        <Map
          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAUCT-d0ZZUHm3orGKJHggqzgxJeFX-zcE"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          isMarkerShown={this.props.isMarkerShown}
          markerPosition={this.props.markerPosition}
        />
      </div>
    );
  }
}
