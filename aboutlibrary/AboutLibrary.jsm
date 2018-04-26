ChromeUtils.defineModuleGetter(this, "RemotePages",
  "resource://gre/modules/RemotePageManager.jsm");
ChromeUtils.defineModuleGetter(this, "NewTabUtils",
  "resource://gre/modules/NewTabUtils.jsm");
const {shortURL} = ChromeUtils.import("resource://activity-stream/lib/ShortURL.jsm", {});

this.AboutLibrary = class AboutLibrary {
  constructor() {
    this.pageListener = new RemotePages("about:library");
    this.pageListener.addMessageListener("AboutLibrary:GetTopSites", this.getTopSites.bind(this));
    this.pageListener.addMessageListener("AboutLibrary:GetHighlights", this.getHighlights.bind(this));
  }

  async getTopSites() {
    let topSites = await NewTabUtils.activityStreamLinks.getTopSites({});
    topSites = topSites.map(site => Object.assign(site, {hostname: shortURL(site)}));
    this.pageListener.sendAsyncMessage("AboutLibrary:SendTopSites", topSites);
  }

  async getHighlights() {
    const highlights = await NewTabUtils.activityStreamLinks.getHighlights({});
    this.pageListener.sendAsyncMessage("AboutLibrary:SendHighlights", highlights);
  }
};

const EXPORTED_SYMBOLS = ["AboutLibrary"];
