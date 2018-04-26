import React from "react";

export class _ThinCard extends React.PureComponent {
  render() {
    return (
      <div className="thin-card-outer" >
        <a className="thin-card" href={this.props.link.url} >
          <div className="thin-card-details" >
            <span className="thin-card-details-hostname"> {this.props.link.hostname} </span>
            <h4 className="thin-card-details-title"> {this.props.link.title} </h4>
            <p className="thin-card-details-description"> {this.props.link.description} </p>
            <div className="thin-card-details-context">
              <div className="thin-card-details-context-icon" />
              <div className="thin-card-details-context-label" />
            </div>
          </div>
          <div className="thin-card-icon" />
        </a>
      </div>
    );
  }
}
export const ThinCard = _ThinCard;
