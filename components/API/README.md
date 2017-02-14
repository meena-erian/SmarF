#Server-Side API

~~It will be a single php webpage that the mobile application or any web browser can use to access our service.
I'm working on an [HTML mirror for this documentation](https://meena-erian.github.io/SmarF/components/API/)~~

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
  "type" : SOIL_SENSOR/IRRIGATION_CONTROLLER/...,
  PER_TYPE_DATA
}
```

Where all upper case words will be replaced by equivalent values. And **PER_TYPE_DATA** in Devices data will be replaced by one of the following.

####Soil Sensor data
```JSON
{
  "updateFrequency" : "10",
  "history" : [{"time" : TIMESTAMP, "location" : LOCATION, "humidity" : HUMIDITY}, {"time" : TIMESTAMP, "location" : LOCATION, "humidity" : HUMIDITY}, ...]
}
```
####Irrigation Controller data
```JSON
{
  "irrigation" : ON/OFF,
  "history" : [{"time" : TIMESTAMP, "location" : LOCATION, "operation" : SWITCHED ON/OFF}, {"time" : TIMESTAMP, "location" : LOCATION, "operation" : SWITCHED ON/OFF}],
  "switchingSystems" : PERIODICALLY/BYREFERENCE/AUTO,
  "referenceHumidity" : "60",
  "irrigationStartTime" : "06:00:00",
  "irrigationEndTime" : "06:04:30"
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

- ```query``` The application uses this command to read data. It requires the query parameters ```userId```, ```userPassword``` and ```query``` for reading user data; Reading data of user devices require the additional parameter ```deviceId``` in addition to the previouse parameters.
    Where ```query``` can be set as in the following examples.
    
    - Examples for user data:
    
     - ```query=devices``` returns an JSON array of the devices associated with the given user.
     
    - Examples for any device:
    
     - ```query=type``` returns the type of the device (SOIL_SENSOR or IRRIGATION_CONTROLLER).
     
     - ```query=dateAdded``` returns the manufacturing date of the device.
    
    - Examples for soil sensor devices:
    
     - ```query=updateFrequency``` returns the sample taking frequency of the soil sensor.
     
     - ```query=history``` returns the whole history array.
     
     - ```query=history.length``` returns the number of samples saved on the server for this device.
     
     - ```query=history[INDEX]``` returns the sample pointed to in the array by the integer value INDEX.
     
     - ```query=history[OFFSET:LENGTH]``` returns the sub-array list of samples of size LENGTH starting from index OFFSET.
     
     - ```query=history.last(N)``` returns the last N samples. eg ```query=history.last(5)``` returns the last 5 samples.
     
    - Examples for irrigation controller:
    
     - ```query=irrigation``` returns either ON or OFF.
     
     - ```query=history``` Might be useless.
     
     - ```query=switchingSystems``` returns something like:
     
     ```JSON
     {"responseType":"data","content":"BYREFERENCE"}
     ```
     
     - ```query=referenceHumidity``` returns something like:
     
     ```JSON
     {"responseType":"data","content":45}
     ```
     
     - ```query=irrigationStartTime``` returns the irrigation start time in the formate HH:MM:SS. Used only when switchingSystems is set to PERIODICALLY.
     
     - ```query=irrigationEndTime``` returns the irrigation end time.
     
- ```edit``` The application uses this command to edit some attributes/settings of a device owned by the requesting user.
    This command requires the additional parameters: ```userId```, ```userPassword```, ```deviceId```, and the data being updated.
    
    - Examples for soil sensor:
    
     - ```updateFrequency=MINUTS``` sets the sample taking frequency of the soil sensor in MINUTES.
    
    - Examples irrigation controller:
    
     - ```irrigation=ON``` Forcefully turns irrigation on.
    
     - ```switchingSystems=PERIODICALLY&irrigationStartTime=20:30:00&irrigationEndTime=20:37:45``` Sets a periodic irrigation system and specifies the time period of the day when irrigation is on.
    
     - ```referenceHumidity=70``` sets the reference humidity (the percentage value is parsed as integer and the character '%' should not be appended)
    
- ~~```add``` The application uses this command to register a device to the requesting user. This command requires the additional parameters: ```deviceId```, ```devicePassword```, ```userName```, and ```userPassword```.~~
- ~~```remove```~~~~


Note that all commands are case-sensitive!
