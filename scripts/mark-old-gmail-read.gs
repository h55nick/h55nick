/**
 * Mark all unread Gmail messages older than 90 days as read.
 * Paste into script.google.com > New Project, authorize Gmail,
 * then run markOldAsRead(). Check execution log for progress.
 *
 * No tokens, passwords, or secrets in this file.
 */
function markOldAsRead() {
  var query = 'is:unread older_than:90d';
  var batchSize = 500; // GmailApp.getMessagesForThreads handles up to 500 threads
  var total = 0;

  while (true) {
    var threads = GmailApp.search(query, 0, batchSize);
    if (threads.length === 0) break;

    var messages = GmailApp.getMessagesForThreads(threads);
    for (var i = 0; i < messages.length; i++) {
      for (var j = 0; j < messages[i].length; j++) {
        messages[i][j].markRead();
      }
    }
    total += messages.length;
    Logger.log('Marked ' + messages.length + ' messages (running total: ' + total + '));

    // Safety: if a run processes fewer than a full batch, we're done
    if (threads.length < batchSize) break;

    // Avoid hammering quotas; pause briefly between batches
    Utilities.sleep(2000);
  }
  Logger.log('Done. Total messages marked read: ' + total);
}

/**
 * Optional: run in smaller chunks if you hit execution-time limits.
 * Each run handles up to maxThreads threads.
 */
function markOldAsReadChunked(maxThreads) {
  maxThreads = maxThreads || 200;
  var threads = GmailApp.search('is:unread older_than:90d', 0, maxThreads);
  if (threads.length === 0) {
    Logger.log('No matching unread messages found.');
    return;
  }
  var messages = GmailApp.getMessagesForThreads(threads);
  var count = 0;
  for (var i = 0; i < messages.length; i++) {
    for (var j = 0; j < messages[i].length; j++) {
      messages[i][j].markRead();
      count++;
    }
  }
  Logger.log('Marked ' + count + ' messages across ' + threads.length + ' threads in this run.');
}