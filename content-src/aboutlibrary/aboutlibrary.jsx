import {addLocaleData, FormattedMessage, IntlProvider} from "react-intl";
import {LIBRARY_CATEGORIES} from "./categories.js";
import React from "react";
import ReactDOM from "react-dom";
import {ThinCard} from "./components/ThinCard/ThinCard";
import {TopSite} from "./components/TopSite/TopSite";

class TopSites extends React.PureComponent {
  constructor(props) {
    super(props);
    this.listener = this.listener.bind(this);
    this.state = {topsites: []};
  }

  componentWillMount() {
    global.addMessageListener("AboutLibrary:SendTopSites", this.listener);
    global.sendAsyncMessage("AboutLibrary:GetTopSites");
  }

  componentWillUnmount() {
    global.removeMessageListener("AboutLibrary:SendTopSites", this.listener);
  }

  listener(msg) {
    this.setState({topsites: msg.data});
  }

  render() {
    return (
      <div>
        <h2><FormattedMessage id="header_top_sites" /></h2>
        <div className="top-sites-grid"> {this.state.topsites.map(site => <TopSite key={site.url} link={site} />)} </div>
      </div>
    );
  }
}
class Highlights extends React.PureComponent {
  constructor(props) {
    super(props);
    this.listener = this.listener.bind(this);
    this.state = {highlights: []};
  }

  componentWillMount() {
    global.addMessageListener("AboutLibrary:SendHighlights", this.listener);
    global.sendAsyncMessage("AboutLibrary:GetHighlights");
  }

  componentWillUnmount() {
    global.removeMessageListener("AboutLibrary:SendHighlights", this.listener);
  }

  listener(msg) {
    this.setState({highlights: msg.data});
  }

  render() {
    return (
      <div>
        <h2><FormattedMessage id="header_highlights" /></h2>
         <div> {this.state.highlights.map(site => <ThinCard link={site} key={site.url} />)} </div>
      </div>
    );
  }
}

class LibraryComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.changeRoute = this.changeRoute.bind(this);
  }

  changeRoute() {
    window.location.hash = `#${this.props.category.name}`;
  }

  render() {
    const {category} = this.props;
    return (
      <li tabIndex="1" onClick={this.changeRoute} >
        <span className={`icon icon-spacer icon-${category.icon}`} />
        <FormattedMessage id={category.intlID} />
      </li>
    );
  }
}

class LibraryRouter extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {route: null};
    this.setRoute = this.setRoute.bind(this);
  }

  setRoute() {
    this.setState({route: window.location.hash.slice(1)});
  }

  componentWillUnmount() {
    window.removeEventListener("hashchange", this.setRoute);
  }

  componentWillMount() {
    addLocaleData([{locale: "en-US", parentLocale: "en"}]);
    this.setRoute();
    window.addEventListener("hashchange", this.setRoute);
  }

  renderComponent(param) {
    let component = null;
    switch (param) {
      case "topsites":
        component = <TopSites />;
        break;
      case "highlights":
        component = <Highlights />;
        break;
    }
    return component;
  }

  renderCategories() {
    return LIBRARY_CATEGORIES.map(category => <LibraryComponent key={category.name} category={category} />);
  }

  render() {
    const {route} = this.state;
    return (
      <IntlProvider locale="en-US" messages={{"header_highlights": "Highlights", "header_top_sites": "Top Sites"}}>
        <div className="library-wrapper">
          <div className="library-sidebar">
            <ul>{this.renderCategories()}</ul>
          </div>
          <div className="library-content">{this.renderComponent(route)}</div>
        </div>
      </IntlProvider>
    );
  }
}

ReactDOM.render(<LibraryRouter />, document.body);
