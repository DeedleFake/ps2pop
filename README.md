ps2pop
======

ps2pop is a PlanetSide 2 population tracker. Unlike other trackers, however, this one does *not* track number of players currently online. Instead, it tracks number of unique characters that have logged in within a specific timeframe, say, the last 30 days.

Structure
---------

ps2pop is split into two components. One is a simple command line tool that updates an PostgreSQL database. This can be found under `cmd/ps2popupdate`. This pulls the latest data from the Census API and inserts it into a table in the database.

The other component is under `cmd/ps2pop`. This provides both an HTTP endpoint for accessing the data inserted into the database by `ps2popupdate`, as well as a web interface for viewing that data.
