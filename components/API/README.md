#Server-Side API
It will be a single php webpage that the mobile application or any web browser can use to access our service.

##Database structure
The data base contains the following two lists of data:

###Users JSON data
```JSON
{
  "id" : USER ID,
  "name" : USER NAME,
  "password" : USER PASSWORD,
  "dateAdded" : DATE,
  "devices" : [{"deviceId" : DEVICE ID, "dateAdded" : TIMESTAMP}, {"deviceId" : DEVICE ID, "dateAdded" : TIMESTAMP} ...]
}
```

###Devices common JSON data
```JSON
{
  "id" : DEVICE ID,
  "password" : DEVICE PASSWORD,
  "dateAdded" : DATE,
  "type" : SOIL SENSOR/IRRIGATION CONTROLLER/...
  PER_TYPE_DATA
}
```

Where all upper case words will be replaced by equivalent values. And **PER_TYPE_DATA** in Devices data will be replaced by one of the following.

####Soil Sensor data
```JSON
{
  "updateFrequency" : "10 mins",
  "history" : [{"time" : TIMESTAMP, "location" : LOCATION, "humidity" : HUMIDITY}, {"time" : TIMESTAMP, "location" : LOCATION, "humidity" : HUMIDITY}, ...]
}
```
####Irrigation Controller data
```JSON
{
  "state" : ON/OFF,
  "history" : [{"time" : TIMESTAMP, "location" : LOCATION, "operation" : SWITCHED ON/OFF}, {"time" : TIMESTAMP, "location" : LOCATION, "operation" : SWITCHED ON/OFF}]
  "settings" : {
    "switchingSystems" : {"periodically" : ENABLED/DISABLED, "byReference" : ENABLED/DISABLED, "auto" : ENABLED/DISABLED},
    "referenceHumidity" : "60%",
    "irrigationStartTime" : "06:00:00AM",
    "irrigationEndTime" : "06:04:30"
  }
}
```

---
---

##Operation rules
- Once a device is created and ready for sale, it's saved to the database.
- Any anonymous person can create a user account just by email verification.
- Any user can add any device to their account as long as they provide its id and password.
- The first device owner can update its password; If two users owns the same device and the newer user requeted password change for the device, The original user will be notified about the date, location, and time of the request and the newer user will be asked for more credentials.
- The first device owner of an irrigation controler can edit its settings.


##mobile JSON API
When any web browser requests the domain name, the server responds by the HTML version of the application; When the mobile application requests the domain name, the server responds by a JSON.

The mobile application sends the parameter ```command``` with each request, it can be any of the following values:
- **query**
  The application uses this command to read data of a deviece owned by the requesting user.
    This command requires the additional parameters: **deviceId**, **devicePassword**, and **query**.
    Where **query** is one or more comma separated keys of the data being requested.
- **edit**
  The application uses this command to edit some attributes/settings of a device owned by the requesting user.
    This command requires the additional parameters: **deviceId** and **userName**, **userPassword**, and the data being updated.
- **add**
  The application uses this command to register a device to the requesting user.
    This command requires the additional parameters: **deviceId**, **devicePassword**, **userName**, and **userPassword**.
- **remove**
