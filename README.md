# drcode

==========================================================================
Sep.20 Note by Elliot:

To initiate server, run main.js


Flow:
main.js  -> logic_interface/drcode.js  -> NLC -> R&R -> logic_interface/drcode.js -> output.html


Main.js:
1. It log-in to NLC service and chooses primary classifie. As well for R&R later...
2. It reads index.html and runs the server

Drcode.js
1. It creates NLC object. R&R obj: coming soon.
2. It outputs NLC output on terminal window.

NLCService.js
1. NLC Class - currently based on dog-identifying classifier

==========================================================================
