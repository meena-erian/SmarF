# Server-Side API

~~It will be a single php webpage that the mobile application or any web browser can use to access our service.
I'm working on an [HTML mirror for this documentation](https://meena-erian.github.io/SmarF/components/API/)~~

## Database structure
The data base contains the following two lists of data:

### Users JSON data
```JSON
{
  "id" : STRING,
  "name" : STRING,
  "password" : STRING,
  "dateAdded" : TIMESTAMP,
  "devices" : [
    {
        "deviceId" : STRING,
        "dateAdded" : TIMESTAMP
    }, 
    {
        "deviceId" : STRING,
        "dateAdded" : TIMESTAMP
    } ...
  ]
}
```

### Devices common JSON data
```JSON
{
  "id" : STRING,
  "name" : STRING,
  "password" : STRING,
  "dateAdded" : TIMESTAMP,
  "network" : [
      {
        "ssid" : STRING,
        "password" : STRING
      }, 
      {
        "ssid" : STRING, 
        "password" : STRING
      }...
  ]
  "type" : SOIL_SENSOR/IRRIGATION_CONTROLLER/...,
  PER_TYPE_DATA
}
```

Where all upper case words will be replaced by equivalent values. And **PER_TYPE_DATA** in Devices data will be replaced by one of the following.

#### Soil Sensor data
```JSON
{
  "updateFrequency" : "10",
  "history" : [
      {
        "time" : TIMESTAMP,
        "location" : LOCATION,
        "humidity" : INTIGER
      }, 
      {
        "time" : TIMESTAMP,
        "location" : LOCATION,
        "humidity" : INTIGER
      }, ...
  ]
}
```
#### Irrigation Controller data
```JSON
{
  "irrigation" : STRING, //ON/OFF
  "sensors" : [{"id" : STRING},{"id" : STRING},...],
  "history" : [{"time" : TIMESTAMP, "location" : LOCATION, "operation" : SWITCHED ON/OFF}, {"time" : TIMESTAMP, "location" : LOCATION, "operation" : SWITCHED ON/OFF}],
  "switchingSystem" : PERIODICALLY/BYREFERENCE/AUTO,
  "referenceHumidity" : "60",
  "irrigationStartTime" : "06:00:00",
  "irrigationEndTime" : "06:04:30"
}
```

---
---

## Operation Rules
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


## Mobile JSON API
When any web browser requests the domain name, the server responds by the HTML version of the application; When the mobile application requests the domain name, the server responds by a JSON.

The mobile application sends the parameter ```command``` with each request, it can be any of the following values:

- ```query``` The application uses this command to read data. It requires the query parameters ```userId```, ```userPassword``` and ```query``` for reading user data; Reading data of user devices require the additional parameter ```deviceId``` in addition to the previouse parameters.
    Where ```query``` can be set as in the following examples.
    
    - Examples for user data:
    
     - ```query=devices``` returns an array of the devices associated with the given user.
     
     - ```query=devices.byType(STRING type)``` same as devices except that it filters devices by type.
     
     - ```query=name``` returns a string of the user name.
     
     - ```query=dateAdded``` returns a UNIX timestamp of the registration date of the requesting user.
     
    - Examples for any device:
    
     - ```query=type``` returns a string value of the type of the device either SOIL_SENSOR or IRRIGATION_CONTROLLER.
     
     - ```query=dateAdded``` returns an integer value of the UNIX timestamp of the manufacturing date of the device.
     
     - ```query=name``` returns a string of the name of the specified device.
     
     - ```query=network``` returns an array of the networks saved in the device.
     
    
    - Examples for soil sensor devices:
    
     - ```query=updateFrequency``` returns an integer value of the sample taking frequency of the soil sensor in minuts.
     
     - ```query=history``` returns the whole history array of the given device.
     
     - ```query=history.length``` returns an integer value of the number of samples saved on the server for this device.
     
     - ```query=history[INDEX]``` returns the sample pointed to in the array by the integer value INDEX.
     
     - ```query=history[OFFSET:LENGTH]``` returns the sub-array list of samples of size LENGTH starting from index OFFSET.
     
     - ```query=history.last(N)``` returns an array of the last N samples. eg ```query=history.last(5)``` returns the last 5 samples. Note that query=history.last(1) returns an array too.
     
    - Examples for irrigation controller:
    
     - ```query=irrigation``` returns a string, ON or OFF.
     
     - ```query=sensors``` returns an array of the soil sensors linkd to the specified irrigation controller.
     
     - ```query=history``` Might be useless. (same as above but for irrigation controller history)
     
     - ```query=switchingSystem``` returns something like:
     
     ```JSON
     {"responseType":"Data","content":"BYREFERENCE"}
     ```
     
     - ```query=referenceHumidity``` returns something like:
     
     ```JSON
     {"responseType":"Data","content":45}
     ```
     
     - ```query=irrigationStartTime``` returns a string in the formate HH:MM:SS for the irrigation start time where HH for hours, MM for minutes and SS for seconds.
     Used only when switchingSystem is set to PERIODICALLY.
     
     - ```query=irrigationEndTime``` returns a string in the formate HH:MM:SS for the irrigation end time where HH for hours, MM for minutes and SS for seconds.
     Used only when switchingSystem is set to PERIODICALLY.
     
- ```edit``` The application uses this command to edit some attributes/settings of a device owned by the requesting user.
    This command requires the additional parameters: ```userId```, ```userPassword```, ```deviceId```, and the data being updated.
    
    - Examples for soil sensor:
    
     - ```updateFrequency=30``` Adjusts the soil sensor to send one sample to the server each 30 minutes.
    
    - Examples for irrigation controller:
    
     - ```irrigation=ON``` Forcefully turns irrigation on.
    
     - ```switchingSystem=PERIODICALLY&irrigationStartTime=20:30:00&irrigationEndTime=20:37:45``` Sets the specified irrigation controller to turn irrigation on from 08:30:00 PM to 08:37:45 PM daily.
    
     - ```referenceHumidity=70``` sets the reference humidity (the percentage value is parsed as integer and the character '%' should not be appended)
    
- ~~```add``` The application uses this command to register a device to the requesting user. This command requires the additional parameters: ```deviceId```, ```devicePassword```, ```userName```, and ```userPassword```.~~
- ~~```remove```~~~~

### Example request query strings
---
**List devices associated with the given user**
```C++
?command=query&userId=mina&userPassword=mina123mina&query=devices
```
**result**
```JSON
{
	"responseType":"Data",
	"content":[
		{
			"deviceId":"ss1",
			"dateAdded":1487006069
		},
		{
			"deviceId":"ic1",
			"dateAdded":1487006069
		}
	]
}
```
---
**List devices of the given type associated with the given user**
```C++
?command=query&userId=mina&userPassword=mina123mina&query=devices.byType(SOIL_SENSOR)
```
**result**
```JSON
{
	"responseType":"Data",
	"content":[
		{
			"deviceId":"ss1",
			"dateAdded":1487006069
		}
	]
}
```
---
**Getting device type by id**
```C++
?command=query&userId=mina&userPassword=mina123mina&deviceId=ss1&query=type
```
**result**
```JSON
{
  "responseType":"Data",
  "content":"SOIL_SENSOR"
}
```
---
**Getting last sample[s] read by soil sensor**
```C++
?command=query&userId=mina&userPassword=mina123mina&deviceId=ss1&query=history.last(3)
```
**result**
```JSON
{
  "responseType":"Data",
  "content":[
    {"time":1487009825,"location":null,"humidity":"64"},
    {"time":1487009831,"location":null,"humidity":"65"},
    {"time":1487009836,"location":null,"humidity":"64"}
  ]
}
```
---
**Getting sample update interval in milliseconds for soil sensor**
```C++
?command=query&userId=mina&userPassword=mina123mina&deviceId=ss1&query=updateFrequency
```
**result**
```JSON
{
  "responseType":"Data",
  "content":"35"
}
```
---
**Setting reference humidity of irrigation controller**
```C++
?command=edit&userId=mina&userPassword=mina123mina&deviceId=ic1&referenceHumidity=58
```
**result**
```JSON
{
  "responseType":"Info",
  "content":"Data updated successfully"
}
```
---
**Getting reference humidity of irrigation controller**
```C++
?command=query&userId=mina&userPassword=mina123mina&deviceId=ic1&referenceHumidity=58
```
**result**
```JSON
{
  "responseType":"Data",
  "content":"Data updated successfully"
}
```
---

```C++
?command=edit&userId=mina&userPassword=mina123mina&deviceId=ic1&referenceHumidity=58
```
**result**
```JSON
{
  "responseType":"Data",
  "content":"Data updated successfully"
}
```

## Remarks
 - The **deviceId** can also be used to identify its type- all devices prefixed by "**ss**" are soil sensors and all devices prefixed by **ic** are irrication controllers.
 - All parameters and values are case-sensitive.
 - All **edit** commands returns ```{"responseType":"Info","content":"Data updated successfully"}``` on success.

