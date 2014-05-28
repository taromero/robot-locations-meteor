## How to run the app

1. `mongo`
2. `use robot-path-meteor`
3. Create maps: `db.maps.save({ "imagePath" : "/images/aloft-lobby.png", "name" : "aloft-lobby" })` and `db.maps.save({ "imagePath" : "/images/swhq-1.png", "name" : "swhq-1" })`
4. Start the app using the defined DB: `MONGO_URL=mongodb://localhost:27017/robot-path-meteor meteor`

In order to create maps:
  - Navigate to specific map.
  - Click on "create".
  - Click once to stablish one corner of the rectangle and again to finish it (rectangle will render after second click). Then click once more to create the arrow. Repeat.

Delete maps:
  - Navigate to specific map.
  - Click on "delete".
  - select a location.
  - Click "remove" from location detail.