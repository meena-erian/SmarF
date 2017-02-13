#Server-Side API

It will be a single php webpage that the mobile application or any web browser can use to access our service.
I'm working on an [HTML mirror for this documentation](https://meena-erian.github.io/SmarF/components/API/)

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
  "type" : SOIL SENSOR/IRRIGATION CONTROLLER/...,
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
  "history" : [{"time" : TIMESTAMP, "location" : LOCATION, "operation" : SWITCHED ON/OFF}, {"time" : TIMESTAMP, "location" : LOCATION, "operation" : SWITCHED ON/OFF}],
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

##Operation Rules
- Once a device is created and ready for sale, it's saved to the database.
- Only the device and the server shares the device password for secure communication between them.
- The device owner can connect to the device directly using wifi to set:
  - The default ssid and password of the local access point to connect the device to the internet.
  - The unique id of the device owner to associate the device with on the server-side.
  - An admin password for accessing the device setting. (not set by default)
- Once the device is associated with a user on the server database, this user can access the devices settings and data.
- ~~Each customer receives id and password for each device. They can either enter it manually to the application or scan it as a QR code.~~
- ~~Any anonymous person can create a user account just by email verification.~~
- ~~Any user can add any device to their account as long as they provide its id and password.~~
- ~~The first device owner can update its password; If two users owns the same device and the newer user requeted password change for the device, The original user will be notified about the date, location, and time of the request and the newer user will be asked for more credentials.~~
- ~~The first device owner of an irrigation controler can edit its settings.~~


##Mobile JSON API
When any web browser requests the domain name, the server responds by the HTML version of the application; When the mobile application requests the domain name, the server responds by a JSON.

The mobile application sends the parameter ```command``` with each request, it can be any of the following values:
- ```query```
  The application uses this command to read data of a deviece owned by the requesting user.
    This command requires the additional parameters: ```userName```, ```userPassword```, ```deviceId```, and ```query```.
    Where ```query``` is one or more comma separated keys of the data being requested.
    ```query=updateFrequency``` returns the sample taking frequency of the soil sensor
    ```query=history``` returns the whole history array.
    ```query=history.length``` returns the number of samples saved on the server for this device.
    ```query=history[INDEX]``` returns the sample pointed to in the array by the integer value INDEX.
    ```query=history[FROM:TO]``` returns the sub-array list of samples starting from index FROM till index TO (inclusively).
- ```edit```
  The application uses this command to edit some attributes/settings of a device owned by the requesting user.
    This command requires the additional parameters: ```deviceId``` and ```userName```, ```userPassword```, and the data being updated.
- ```add```
  The application uses this command to register a device to the requesting user.
    This command requires the additional parameters: ```deviceId```, ```devicePassword```, ```userName```, and ```userPassword```.
- ```remove```
Note that all commands are case-sensitive!
