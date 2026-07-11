function ResolveHandler() {
  var info = null;
  var readyService = new TVXBusyService();

  var catalog = {
    "blofa": {
      label: "Η Μπλόφα",
      standard: "https://coverapi.store/embed/tt14181714/"
    },
    "the-furious": {
      label: "The Furious",
      standard: "https://streamtape.com/v/V840kYar2MSKRee/The_Furious_2026.mp4"
    },
    "zootopia-2": {
      label: "Zootopia 2",
      standard: "https://streamtape.com/e/AqRYO6YwyLSb1v/Zootopia.mp4"
    }
  };

  function getEntry(dataId) {
    return catalog[dataId] || null;
  }

  function getSuitableUrl(entry) {
    if (!entry) return null;

    if (info && info.player && info.player.indexOf("plugin") >= 0 && entry.plugin) {
      return entry.plugin;
    }

    if (entry.standard) {
      return entry.standard;
    }

    return null;
  }

  this.ready = function() {
    readyService.start();
    TVXInteractionPlugin.requestData("info:base", function(data) {
      info = data && data.info ? data.info : null;
      readyService.stop();
    });
  };

  this.handleRequest = function(dataId, data, callback) {
    readyService.onReady(function() {
      var entry = getEntry(dataId);

      if (!entry) {
        callback({
          error: "Video not found."
        });
        return;
      }

      var url = getSuitableUrl(entry);

      if (!url) {
        callback({
          error: "No suitable URL found for the current platform/player."
        });
        return;
      }

      callback({
        url: url,
        label: entry.label
      });
    });
  };
}

TVXPluginTools.onReady(function() {
  TVXInteractionPlugin.setupHandler(new ResolveHandler());
  TVXInteractionPlugin.init();
});
