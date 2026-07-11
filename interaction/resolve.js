function ResolveHandler() {
  var info = null;
  var readyService = new TVXBusyService();

  var catalog = {
    "blofa": {
      label: "Η Μπλόφα",
      android: "https://coverapi.store/embed/tt14181714/",
      fallback: "https://coverapi.store/embed/tt14181714/"
    },
    "the-furious": {
      label: "The Furious",
      android: "https://streamtape.com/v/V840kYar2MSKRee/The_Furious_2026.mp4",
      fallback: "https://streamtape.com/v/V840kYar2MSKRee/The_Furious_2026.mp4"
    },
    "zootopia-2": {
      label: "Zootopia 2",
      android: "https://streamtape.com/e/AqRYO6YwyLSb1v/Zootopia.mp4",
      fallback: "https://streamtape.com/e/AqRYO6YwyLSb1v/Zootopia.mp4"
    }
  };

  function pickUrl(entry) {
    if (!entry) return null;

    if (info && info.platform === "android" && entry.android) {
      return entry.android;
    }

    return entry.fallback || null;
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
      var entry = catalog[dataId];

      if (!entry) {
        callback({ error: "Video not found." });
        return;
      }

      var url = pickUrl(entry);

      if (!url) {
        callback({ error: "No suitable URL found." });
        return;
      }

      callback({
        url: url,
        label: entry.label,
        properties: {
          "user-agent-note": info && info.userAgent ? info.userAgent : "unknown"
        }
      });
    });
  };
}

TVXPluginTools.onReady(function() {
  TVXInteractionPlugin.setupHandler(new ResolveHandler());
  TVXInteractionPlugin.init();
});
