import React from "react";

export class _TopSite extends React.PureComponent {
  render() {
    return (
      <div className="top-site-outer" >
        <a className="top-site" href={this.props.link.url}>
        <img src={this.props.link.favicon} height="100%" width="100%" />
        <div className="top-site-title"> {this.props.link.hostname} </div>
        </a>
      </div>
    );
  }
}
export const TopSite = _TopSite;
