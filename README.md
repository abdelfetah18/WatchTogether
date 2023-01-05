## Watch-Together

`Watch-Together` is a small web app that let you watch videos with your friends at the same time, and chat with them. currently it support `Youtube` only.


## How it works ?

the User Interface build with `NextJS(ReactJS)` and `TaillwindCss`.
and for realTime data transmission i am using `WebSocket` technology. and i am using `Sanity.io` as a database.

### !! Important !!

since it is `NextJS`, you may wondering how i am implementing the `WebSocket` server, basically what i did is use a [custom server](https://nextjs.org/docs/advanced-features/custom-server) advanced feature from nextjs. which also let me handle middlewares in more easy way since NextJS using the EDGE envirment for middlewares.
in my custom server i combined `expressJS` with `WebSocketServer` and `NextJS` handle.


## Database

in my database i have four schemas:

    - user.
    - room.
    - messages.
    - member.


```json
{
    "name":"user",
    "title":"user",
    "type":"document",
    "fields":[
        {
            "name":"profile_image",
            "title":"profile_image",
            "type":"image"
        },
        {
            "name":"username",
            "title":"username",
            "type":"string"
        },
        {
            "name":"email",
            "title":"email",
            "type":"string"
        },
        {
            "name":"password",
            "title":"password",
            "type":"string"
        }
    ]
}
```

```json
{
    "name":"room",
    "title":"room",
    "type":"document",
    "fields":[
        {
            "name":"profile_image",
            "title":"profile_image",
            "type":"image"
        },
        {
            "name":"name",
            "title":"name",
            "type":"string"
        },
        {
            "name":"description",
            "title":"description",
            "type":"string"
        },
        {
            "name":"creator",
            "title":"creator",
            "type":"reference",
            "to":{ "type":"user" }
        },
        {
            "name":"admin",
            "title":"admin",
            "type":"reference",
            "to":{ "type":"user" }
        },
        {
            "name":"members",
            "title":"members",
            "type":"array",
            "of": [{ "type":"reference", "to": { "type":"member" } }]
        },
        {
            "name":"privacy",
            "title":"privacy",
            "type":"string",
            "options": {
                "list": [
                    { "title": "public", "value": "public" },
                    { "title": "private", "value": "private" }
                ]
            }
        },
        {
            "name":"password",
            "title":"password",
            "type":"string"
        }
    ]
}
```

```json
{
    "name":"member",
    "title":"member",
    "type":"document",
    "fields":[
        {
            "name":"user",
            "title":"user",
            "type":"reference",
            "to":{ "type":"user" }
        },
        {
            "name":"permissions",
            "title":"permissions",
            "type":"array",
            "of":[{
                "type":"string",
                "options": {
                    "list": [
                        { "title": "control_video_player", "value": "control_video_player" },
                        { "title": "remove_members plan", "value": "remove_members" },
                        { "title": "edit_room_info", "value": "edit_room_info" },
                    ]
                }
            }]
        },
    ]
}
```

```json
{
    "name":"messages",
    "title":"messages",
    "type":"document",
    "fields":[
        {
            "name":"room",
            "title":"room",
            "type":"reference",
            "to":{ "type":"room" }
        },
        {
            "name":"user",
            "title":"user",
            "type":"reference",
            "to":{ "type":"user" }
        },
        {
            "name":"message",
            "title":"message",
            "type":"string"
        },
        {
            "name":"image",
            "title":"image",
            "type":"image"
        },
        {
            "name":"type",
            "title":"type",
            "type":"string",
            "options": {
                "list": [
                    { "title": "text", "value": "text" },
                    { "title": "image", "value": "image" },
                ]
            }
        }
    ]
}
```

## Images from the app:

![1](https://raw.githubusercontent.com/abdelfetah18/WatchTogether/main/public/1.png)
![2](https://raw.githubusercontent.com/abdelfetah18/WatchTogether/main/public/2.png)
![3](https://raw.githubusercontent.com/abdelfetah18/WatchTogether/main/public/3.png)
![4](https://raw.githubusercontent.com/abdelfetah18/WatchTogether/main/public/4.png)
![5](https://raw.githubusercontent.com/abdelfetah18/WatchTogether/main/public/5.png)
![6](https://raw.githubusercontent.com/abdelfetah18/WatchTogether/main/public/6.png)
![7](https://raw.githubusercontent.com/abdelfetah18/WatchTogether/main/public/7.png)
![8](https://raw.githubusercontent.com/abdelfetah18/WatchTogether/main/public/8.png)
Thanks for reading and see you in my next project.
