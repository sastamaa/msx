function ResolveHandler() {
  var info = null;
  var readyService = new TVXBusyService();

  this.ready = function() {
    readyService.start();
    TVXInteractionPlugin.requestData("info:base", function(data) {
      info = data && data.info ? data.info : null;
      readyService.stop();
    });
  };

  this.handleRequest = function(dataId, data, callback) {
    readyService.onReady(function() {
      var debug = {
        dataId: dataId || null,
        platform: info && info.platform ? info.platform : "unknown",
        player: info && info.player ? info.player : "unknown",
        userAgent: info && info.userAgent ? info.userAgent : "unknown"
      };

      callback({
        error:
          "MSX DEBUG | " +
          "dataId=" + debug.dataId +
          " | platform=" + debug.platform +
          " | player=" + debug.player +
          " | userAgent=" + debug.userAgent
      });
    });
  };
}

TVXPluginTools.onReady(function() {
  TVXInteractionPlugin.setupHandler(new ResolveHandler());
  TVXInteractionPlugin.init();
});
