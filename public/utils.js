module.exports = {
  /* Poll some function in numSeconds intervals
   * @param  {Function} onPoll     Function to execute at each interval
   *                               (should have a completion callback)
   * @param  {Number}   numSeconds The number of seconds between calls
   */
  poll: function poll(onPoll, numSeconds) {
    setTimeout(function() {
      onPoll(function() {
        poll(onPoll, numSeconds);
      });
    }, numSeconds * 1000);
  },
  emailRegex: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
};
