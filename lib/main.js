Push.debug = true; // Add verbosity

Push.allow({
    send: function(userId, notification) {
        return true; // Allow all users to send
    }
});
