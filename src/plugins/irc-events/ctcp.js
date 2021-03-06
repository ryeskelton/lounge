"use strict";

var Msg = require("../../models/msg");

module.exports = function(irc, network) {
	var client = this;

	irc.on("ctcp response", function(data) {
		var chan = network.getChannel(data.nick);
		if (typeof chan === "undefined") {
			chan = network.channels[0];
		}

		var msg = new Msg({
			type: Msg.Type.CTCP,
			time: data.time,
			from: data.nick,
			ctcpType: data.type,
			ctcpMessage: data.message
		});
		chan.pushMessage(client, msg);
	});

	irc.on("ctcp request", function(data) {
		switch (data.type) {
		case "PING":
			var split = data.message.split(" ");
			if (split.length === 2) {
				irc.ctcpResponse(data.nick, "PING", split[1]);
			}
			break;
		}
	});
};
