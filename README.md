SlugNote Server
===

### README.md Contents
#### [Description](#description-1)

#### [Requirements](#requirements-1)

#### [Installation](#installation-1)

#### [Running the Server](#running-the-server-1)

#### [Documentation](#documentation-1)
* [Usage](#usage)
    * [With curl](#with-curl)
* [Unauthenticated Calls](#unauthenticated-calls)
    * [getTokenTTL](#gettokenttl)
* [Authenticated Calls](#authenticated-calls)
    * [createNote](#createnote)
    * [getNoteInfo](#getnoteinfo)
    * [getNote](#getnote)
    * [createUser](#createuser)
    * [getUserInfo](#getuserinfo)
    * [createUniversity](#createuniversity)
    * [getUniversityList](#getuniversitylist)
* [Return Codes](#return-codes)


# Description
Node server for SlugNote

# Requirements
- node.js
- mongoDB
- redis

# Installation
- Run `git clone https://*USER*@github.com/slugnote/slugnote.git`
- Run `npm install` in the 'slugnote' directory

# Running the Server
    node server

# Documentation
## Usage
Send an HTTP POST method to the server at the URI of the desired command
with the body of the request being a valid JSON object (Like examples)

### With `curl`
    curl -k -H "content-type: application/json" -d "JSON OBJECT" https://slugnote.com:8080/URI
* -k 
    * Ignore the fact that we have a self-signed certificate (We should probably get a proper cert)
* -H "content-type: application/json"
    * This cannot change. Basically just sets an HTTP header telling the server this is JSON
* -d "JSON OBJECT"
    * Sets the body of the HTTP request. JSON OBJECT must be valid JSON and must be the JSON that corresponds with the correct request
* https://slugnote.com:8080/URI
    * URI should be the URI of the request you're making. For example, `/user/create`

## Unauthenticated calls

### getTokenTTL
#### URI
`token/getttl`

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
     curl -H "content-type: application/json" -d "{\"authToken\":\"uxoDiXpwq5TlGxt88fcPW4S+h4U9eDcCLQTaHY4vh/UT69LuYploxHI6TUOE+PrTquhQIagC5TKJjY6O+3gEGg==\"}" https://169.233.236.39/post/user/gettokenttl -k

## Authenticated calls

### createNote
#### URI
`note/create`

#### Request
    {
        "authToken" : "Gk1nJqj2X+IppQ7K0710EzUBcZKsq1+l3bXdfIMxP8w1L3b+rG2Uf4SIO+42UTGhF2G8XZNuJUyh/ipx1HTG4w==",
        "noteUser" : "username",
        "noteTime" : "2014-03-29:10:10",
        "noteFormat" : "String, PDF, JPEG",
        "noteData" : [ "Array" ],
        "noteInfo" : {
            "name" : "Example Note",
            "description" : "This note is an example.",
            "class" : {
                "id" : 1234567,
                "name" : "Class Name"
            },
            "term" : {
                "id" : 012345,
                "name" : "{Season} Semester"
            },
            "teacher" : {
                "id" : 012345,
                "name" : "First Last"
            }
        }
    }

#### Response
    {
        "status" : 200,
        "call" : "createNote",
        "data" : {
            "noteId" : "533700001bd3b21d0eba3498"
    }

### getNoteInfo
#### URI
`note/info`

#### Request
    {
        "authToken" : "Gk1nJqj2X+IppQ7K0710EzUBcZKsq1+l3bXdfIMxP8w1L3b+rG2Uf4SIO+42UTGhF2G8XZNuJUyh/ipx1HTG4w==",
        "noteId" : "533700001bd3b21d0eba3498"
    }

#### Response
    {
        "status" : 200,
        "call" : "getNoteInfo",
        "data" : {
            "noteUser" : "username",
            "noteTime" : "2014-03-29:10:10",
            "noteFormat" : "String, PDF, JPEG",
            "noteInfo" : {
                "name" : "Example Note",
                "description" : "This note is an example.",
                "class" : {
                    "id" : 1234567,
                    "name" : "Class Name"
                },
                "term" : {
                    "id" : 012345,
                    "name" : "{Season} Semester"
                },
                "teacher" : {
                    "id" : 012345,
                    "name" : "First Last"
                }
            }
        }
    }

### getNote
#### URI
`note/get`

#### Request
    {
        "authToken" : "Gk1nJqj2X+IppQ7K0710EzUBcZKsq1+l3bXdfIMxP8w1L3b+rG2Uf4SIO+42UTGhF2G8XZNuJUyh/ipx1HTG4w==",
        "noteId" : "533700001bd3b21d0eba3498"
    }

#### Response
    {
        "status" : 200,
        "call" : "getNote",
        "data" : {
            "noteUser" : "username",
            "noteTime" : "2014-03-29:10:10",
            "noteFormat" : "String, PDF, JPEG",
            "noteData" : [ "Array" ],
            "noteInfo" : {
                "name" : "Example Note",
                "description" : "This note is an example.",
                "class" : {
                    "id" : 1234567,
                    "name" : "Class Name"
                },
                "term" : {
                    "id" : 012345,
                    "name" : "{Season} Semester"
                },
                "teacher" : {
                    "id" : 012345,
                    "name" : "First Last"
                }
            }
        }
    }


### createUser
#### URI
`user/create`

#### Request
    {
        "userName" : "First Last",
        "userEmail" : "abc@def.com",
        "userPassword" : "password"
    }

#### Response
    {
        "status" : 200,
        "call" : "createUser",
        "data" : {
            "authToken" : "Gk1nJqj2X+IppQ7K0710EzUBcZKsq1+l3bXdfIMxP8w1L3b+rG2Uf4SIO+42UTGhF2G8XZNuJUyh/ipx1HTG4w=="
            "userId" : "533700001bd3b21d0eba3498"
        }
    }


### getUserInfo
#### URI
`user/get`

#### Request
    {
        "authToken" : "Gk1nJqj2X+IppQ7K0710EzUBcZKsq1+l3bXdfIMxP8w1L3b+rG2Uf4SIO+42UTGhF2G8XZNuJUyh/ipx1HTG4w==",
        "userId" : "533700001bd3b21d0eba3498"
    }

#### Response
    {
        "status" : 200,
        "call" : "getUserInfo",
        "data" : {
            "userId" : "533700001bd3b21d0eba3498",
            "userEmail" : "abc@def.com",
            "userName" : "First Last"
        }
    }
    

### createUniversity
#### URI
`university/create`

#### Request
    {
        "authToken" : "Gk1nJqj2X+IppQ7K0710EzUBcZKsq1+l3bXdfIMxP8w1L3b+rG2Uf4SIO+42UTGhF2G8XZNuJUyh/ipx1HTG4w==",
        "universityName" : "UC Santa Cruz"
    }

#### Response
    {
        "status" : 200,
        "call" : "createUniversity",
        "data" : {
            "universityId" : "533700001bd3b21d0eba3498",
            "universityName" : "UC Santa Cruz"
        }
    }


### getUniversityList
#### URI
`university/list`

#### Request
    {
        "authToken" : "Gk1nJqj2X+IppQ7K0710EzUBcZKsq1+l3bXdfIMxP8w1L3b+rG2Uf4SIO+42UTGhF2G8XZNuJUyh/ipx1HTG4w==",
        "universityId" : "533700001bd3b21d0eba3498"
    }

#### Response
    {
        "status" : 200,
        "call" : "getUniversityList",
        "data" : {
            "universityId" : "533700001bd3b21d0eba3498"
            "array" : { [
                "courseId" : "123958201bd3b21d0eba4521"
                "courseName" : "CMPS 12B"
            ] }
        }
    }

## Return Codes

### Summary
* Successful return codes will be returned as code '200'
* Unsuccessful return codes will be returned in a range from '1001-1100', as specified below

#### 1001
    Authentication Error, authToken invalid.

#### 1002
    Lookup Error, objectId invalid.

#### 1003
    Password creation failed, password invalid.

#### 1004
    User lookup failed.

#### 1005
    Note creation failed, unable to be saved.

#### 1006
    Note lookup failed, objectId invalid.

#### 1007
    Course lookup failed, objectId associated with Note returned invalid.

#### 1008
    Term lookup failed, objectId associated with Note returned invalid.

#### 1009
    Teacher lookup failed, objectId associated with Note returned invalid.

#### 1010
    University creation failed, unable to be saved.

#### 1011
    University lookup failed, objectId invalid.

#### 1012
    Course list lookup failed.
