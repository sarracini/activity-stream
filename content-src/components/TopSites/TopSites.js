const React = require("react");
const {connect} = require("react-redux");
const {justDispatch} = require("common/selectors/selectors");
const {actions} = require("common/action-manager");
const classNames = require("classnames");
const LinkMenu = require("components/LinkMenu/LinkMenu");
const LinkMenuButton = require("components/LinkMenuButton/LinkMenuButton");
const {PlaceholderSiteIcon, SiteIcon} = require("components/SiteIcon/SiteIcon");
const {selectSiteProperties} = require("common/selectors/siteMetadataSelectors");

const DEFAULT_LENGTH = 6;

const TopSitesItem = React.createClass({
  getInitialState() {
    return {
      showContextMenu: false,
      activeTile: null
    };
  },
  getDefaultProps() {
    return {onClick() {}};
  },
  _faviconSize(site, topSitesExperimentIsOn, screenshot) {
    let faviconSize = 32;
    if (topSitesExperimentIsOn && !screenshot) {
      if (!site.favicon_width) {
        // default to 64 if not specified
        faviconSize = 64;
      } else {
        faviconSize = site.favicon_width;
      }

      // We want the favicon to be at least 32x32 and at most 64x64 for now because
      // I noticed a bunch of issues when letting the icons fill the tile (96x96).
      // And we don't want them to be smaller than 32, our previous fixed size.
      if (faviconSize > 64) {
        faviconSize = 64;
      } else if (faviconSize < 32) {
        faviconSize = 32;
      }
    }
    return faviconSize;
  },
  render() {
    const site = this.props;
    const index = site.index;
    const isActive = this.state.showContextMenu && this.state.activeTile === index;

    const topSitesExperimentIsOn = this.props.showNewStyle;
    const screenshot = topSitesExperimentIsOn && site.screenshot;
    const faviconSize = this._faviconSize(site, topSitesExperimentIsOn, screenshot);

    // The top-corner class puts the site icon in the top corner, overlayed over the screenshot.
    const siteIconClasses = classNames("tile-img-container", {"top-corner": screenshot});

    const {label} = selectSiteProperties(site);

    return (<div className={classNames("tile-outer", {active: isActive})} key={site.guid || site.cache_key || index}>
      <a onClick={() => this.props.onClick(index)} className="tile" href={site.url} ref="topSiteLink">
        {screenshot && <div className="inner-border" />}
        {screenshot && <div ref="screenshot" className="screenshot" style={{backgroundImage: `url(${screenshot})`}} />}
        <SiteIcon
          ref="icon"
          className={siteIconClasses}
          site={site} faviconSize={faviconSize}
          showTitle={!screenshot}
          showNewStyle={topSitesExperimentIsOn} />

        {screenshot && <div ref="title" className="site-title">{label}</div>}
      </a>
      <LinkMenuButton onClick={() => this.setState({showContextMenu: true, activeTile: index})} />
      <LinkMenu
        visible={isActive}
        onUpdate={val => this.setState({showContextMenu: val})}
        site={site}
        page={this.props.page}
        source="TOP_SITES"
        index={index} />
  </div>);
  }
});

TopSitesItem.propTypes = {
  page: React.PropTypes.string,
  index: React.PropTypes.number,
  url: React.PropTypes.string.isRequired,
  favicon_url: React.PropTypes.string,
  onClick: React.PropTypes.func,
  showNewStyle: React.PropTypes.bool
};

const PlaceholderTopSitesItem = React.createClass({
  render() {
    return (
      <div className="tile-outer placeholder">
        <a className="tile">
          <PlaceholderSiteIcon />
        </a>
      </div>
    );
  }
});

const TopSites = React.createClass({
  getDefaultProps() {
    return {
      length: DEFAULT_LENGTH,
      // This is for event reporting
      page: "NEW_TAB"
    };
  },
  onClickFactory(index, site) {
    return () => {
      let payload = {
        event: "CLICK",
        page: this.props.page,
        source: "TOP_SITES",
        action_position: index,
        metadata_source: site.metadata_source
      };
      this.props.dispatch(actions.NotifyEvent(payload));
    };
  },
  render() {
    const sites = this.props.sites.slice(0, this.props.length);
    return (<section className="top-sites">
      <h3 className="section-title">Top Sites</h3>
      <div className="tiles-wrapper">
        {sites.map((site, i) => {
          // if this is a placeholder, we want all the widgets to render empty
          if (this.props.placeholder) {
            return (
              <PlaceholderTopSitesItem key={site.guid || site.cache_key || i} />
            );
          }

          return (<TopSitesItem
            index={i}
            key={site.guid || site.cache_key || i}
            page={this.props.page}
            onClick={this.onClickFactory(i, site)}
            showNewStyle={this.props.showNewStyle}
            {...site} />
          );
        })}
      </div>
    </section>);
  }
});

TopSites.propTypes = {
  length: React.PropTypes.number,
  page: React.PropTypes.string.isRequired,
  sites: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      url: React.PropTypes.string.isRequired,
      title: React.PropTypes.string,
      provider_name: React.PropTypes.string,
      parsedUrl: React.PropTypes.object
    })
  ).isRequired,

  /**
   * Only display a placeholder version (ie just outlines/shapes), for use
   * before sufficient data is available to display.
   */
  placeholder: React.PropTypes.bool,

  showNewStyle: React.PropTypes.bool
};

module.exports = connect(justDispatch)(TopSites);
module.exports.TopSites = TopSites;
module.exports.TopSitesItem = TopSitesItem;
module.exports.PlaceholderTopSitesItem = PlaceholderTopSitesItem;
