imDown Server
===

# Description
Node server for imDown

# Requirements
- node.js
- mongoDB
- redis

# Installation
- Run `git clone https://*USER*@bitbucket.org/imdown/imdown-server.git`
- Run `npm install` in the 'imdown-server' directory

# Running the app
    node server

# Documentation
## Usage
Send an HTTP POST method to the server at the URI of the desired command
with the body of the request being a valid JSON object (Like examples)

### With `curl`
    curl -k -H "content-type: application/json" -d "JSON OBJECT" https://api.imdownapp.com/URI
* -k 
    * Ignore the fact that we have a self-signed certificate (We should probably get a proper cert)
* -H "content-type: application/json"
    * This cannot change. Basically just sets an HTTP header telling the server this is JSON
* -d "JSON OBJECT"
    * Sets the body of the HTTP request. JSON OBJECT must be valid JSON and must be the JSON that corresponds with the correct request
* https://api.imdown.co/URI
    * The URL to post to. If you're testing, change api.imdownapp.com to the ip address of the server. URI should be the URI of the request you're making. For example, `post/auth/loginemail`

## Authentication

### loginEmail:
#### URI
`post/auth/loginemail`

#### Request
    {
    	"userEmail" : "johndoe@example.com", 
    	"userPassword": "Password"
    }

#### Response
    {
        "status" : 200,
		"call" : "login",
        "data" : {
            "authToken" : "3S6Z6ZX/RN3dk7D1pTILKvBIHLu+tbRr3pRnxfWu9XgRVOZ1OG9VYsmvBwuV5zqda3lSqyemb0nVDNvvTqcHhA==",
            "authTokenTTL" : 604800,
            "userId": "5331afff5785af6a0dc646ec"
        }
    }

#### Example curl command:
    curl -H "content-type: application/json" -d "{\"userEmail\":\"johndoe@example.com\",\"userPassword\":\"Password\"}" https://api.imdown.co/post/auth/loginemail -k

### logout:
#### URI
`post/auth/logout`

#### Request
    { 
    	"authToken" : "7Eb/urrHmJutcq5VVBXkd82TW6aZ63CJUr5liFy60MVb+6l+gxW2oCjldwhD3UCBM0txjuXExf0qSDm9gG7uVg=="
    }

#### Response
    {
        "status" : 200,
        "call": "logout"
    }

#### Example curl command:
    curl -H "content-type: application/json" -d "{\"authToken\":\"7Eb/urrHmJutcq5VVBXkd82TW6aZ63CJUr5liFy60MVb+6l+gxW2oCjldwhD3UCBM0txjuXExf0qSDm9gG7uVg==\"}" https://api.imdown.co/post/auth/logout -k

## Unauthenticated calls
### createUserEmail
#### URI
`post/user/createuseremail`

#### Request
    {
    	"userEmail" : "johndoe@example.com",
		"userName" : "John Doe",
		"userDOB" : "2014-03-23",
		"zipcode" : 91324,
		"userPassword" : "Password"
    }

#### Response
    {
        "status" : 200,
        "call" :  "createUserEmail",
        "data" : {
            "userId" : "5331cc9b98147c3915736469",
            "authToken": "uxoDiXpwq5TlGxt88fcPW4S+h4U9eDcCLQTaHY4vh/UT69LuYploxHI6TUOE+PrTquhQIagC5TKJjY6O+3gEGg=="
        }
    }

#### Example curl command:
     curl -H "content-type: application/json" -d "{\"userEmail\":\"johndoe@example.com\",\"userName\":\"John Doe\",\"userDOB\":\"1990-03-23\",\"zipcode\":91324,\"userPassword\":\"Password\"}" https://api.imdown.co/post/user/createuseremail -k

### getTokenTTL
#### URI
`post/user/gettokenttl`

#### Request
    {
		"authToken" : "uxoDiXpwq5TlGxt88fcPW4S+h4U9eDcCLQTaHY4vh/UT69LuYploxHI6TUOE+PrTquhQIagC5TKJjY6O+3gEGg=="
    }

#### Response
    {
        "status" : 200,
        "call" :  "getTokenTTL",
        "data" : {
            "ttl": 53020
        }
    }

#### Example curl command:
     curl -H "content-type: application/json" -d "{\"authToken\":\"uxoDiXpwq5TlGxt88fcPW4S+h4U9eDcCLQTaHY4vh/UT69LuYploxHI6TUOE+PrTquhQIagC5TKJjY6O+3gEGg==\"}" https://api.imdown.co/post/user/gettokenttl -k

## Authenticated calls
### getUserInfo
#### URI
`post/user/getuserinfo`

#### Request
    {
        "authToken" : "Gk1nJqj2X+IppQ7K0710EzUBcZKsq1+l3bXdfIMxP8w1L3b+rG2Uf4SIO+42UTGhF2G8XZNuJUyh/ipx1HTG4w==",
        "userId" : "532f5b4c947eb5d923a25985"
    }

#### Response
    {
        "status" : 200,
        "call" : "getUserInfo",
        "data" : {
            "userId" : "532f5b4c947eb5d923a25985",
            "userName" : "John Doe",
            "followers" : 42,
            "following" : 24
        }
    }

#### Example curl command:
    curl -H "content-type: application/json" -d "{\"authToken\":\"Gk1nJqj2X+IppQ7K0710EzUBcZKsq1+l3bXdfIMxP8w1L3b+rG2Uf4SIO+42UTGhF2G8XZNuJUyh/ipx1HTG4w==\",\"userId\":\"532f5b4c947eb5d923a25985\"}" https://api.imdown.co/post/user/getuserinfo -k

### editUserName
#### URI
`post/user/editusername`

#### Request
    {
        "authToken" : "Gk1nJqj2X+IppQ7K0710EzUBcZKsq1+l3bXdfIMxP8w1L3b+rG2Uf4SIO+42UTGhF2G8XZNuJUyh/ipx1HTG4w==",
        "userId" : "532f5b4c947eb5d923a25985",
		"editName" : "John Doe"
    }

#### Response
    {
        "status" : 200,
        "call" : "editUserName",
        "data" : {
            "userId" : "532f5b4c947eb5d923a25985",
            "userName" : "John Doe"
        }
    }

#### Example curl command:
    curl -H "content-type: application/json" -d "{\"authToken\":\"Gk1nJqj2X+IppQ7K0710EzUBcZKsq1+l3bXdfIMxP8w1L3b+rG2Uf4SIO+42UTGhF2G8XZNuJUyh/ipx1HTG4w==\",\"userId\":\"532f5b4c947eb5d923a25985\",\"editName\":\"John Doe\"}" https://api.imdown.co/post/user/editusername -k

### editUserBio
#### URI
`post/user/edituserbio`

#### Request
    {
        "authToken" : "Gk1nJqj2X+IppQ7K0710EzUBcZKsq1+l3bXdfIMxP8w1L3b+rG2Uf4SIO+42UTGhF2G8XZNuJUyh/ipx1HTG4w==",
        "userId" : "532f5b4c947eb5d923a25985"
		"bio": "I like cats, my name is John Doe"
    }

#### Response
    {
        "status" : 200,
        "call" : "editUserBio",
        "data" : {
            "userId" : "532f5b4c947eb5d923a25985",
			"bio" : "I like cats, my name is John Doe"
        }
    }

#### Example curl command:
    curl -H "content-type: application/json" -d "{\"authToken\":\"Gk1nJqj2X+IppQ7K0710EzUBcZKsq1+l3bXdfIMxP8w1L3b+rG2Uf4SIO+42UTGhF2G8XZNuJUyh/ipx1HTG4w==\",\"userId\":\"532f5b4c947eb5d923a25985\",\"bio\":\"I like cats, my name is John Doe\"}" https://api.imdown.co/post/user/edituserbio -k

	
### createEvent
#### URI
`post/event/createevent`

#### Request
    {
        "authToken" : "Gk1nJqj2X+IppQ7K0710EzUBcZKsq1+l3bXdfIMxP8w1L3b+rG2Uf4SIO+42UTGhF2G8XZNuJUyh/ipx1HTG4w==",
        "eventName" : "Example Event",
        "eventDescription" : "This event is an example from which all other events can derive themselves",
        "eventTime" : "2014-03-29:10:10",
        "eventCategory" : "Test Party",
        "eventLocation" : {
            "name" : "Example Location",
            "zipcode" : 90210,
            "geo" : {
                "latitude" : 100,
                "longitude" : 100
            }
        }
    }

#### Response
    {
        "status" : 200,
        "call" : "createEvent",
        "data" : {
            "eventId" : "533700001bd3b21d0eba3498"
    }

#### Example curl command:
    curl -H "content-type: application/json" -d "{\"authToken\":\"CiVhGXuCtIJrgOObYTQEdlu7IKy5BdjF1/jTwB0oOy/63ZQDmD5iI55Wcb84kak5wiUTzTNwf1kNSl7sam/yNQ==\",\"eventName\":\"Example Event\",\"eventDescription\":\"Example\",\"eventTime\":\"6969-06-09:6:09\",\"eventCategory\":\"Examples\",\"eventLocation\":{\"name\":\"I like trains\",\"zipcode\":90210,\"geo\":{\"latitude\":100,\"longitude\":100}}}" https://api.imdown.co/post/event/createevent -k

### getEventInfo
#### URI
`post/event/geteventinfo`

#### Request
    {
        "authToken" : "Gk1nJqj2X+IppQ7K0710EzUBcZKsq1+l3bXdfIMxP8w1L3b+rG2Uf4SIO+42UTGhF2G8XZNuJUyh/ipx1HTG4w==",
        "eventId" : "533700001bd3b21d0eba3498"
    }

#### Response
    {
        "status" : 200,
        "call" : "getEventInfo",
        "data" : {
            "name" : "Example Event",
            "description" : "This event is an example from which all other events can derive themselves",
            "time" : "6969-06-09T13:09:00.000Z",
            "category" : "Test Party",
            "location" : {
                "name" : "Example Location",
                "zipcode" : 90210,
                "geo" : {
                    "latitude" : 100,
                    "longitude" : 100
                }
            }
        }
    }

#### Example curl command:
    curl -H "content-type: application/json" -d "{\"authToken\":\"CiVhGXuCtIJrgOObYTQEdlu7IKy5BdjF1/jTwB0oOy/63ZQDmD5iI55Wcb84kak5wiUTzTNwf1kNSl7sam/yNQ==\",\"eventId\":\"53370427fc292bdf0e4618db\"}" https://api.imdown.co/post/event/geteventinfo -k

## Other notes
While writing code on this repo, you must listen to `Crystal Castles` and/or `The Glitch Mob`
