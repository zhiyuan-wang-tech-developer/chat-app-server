const Express = require("express")
const Http = require("http")
const Socket = require("socket.io")
const Meetup = require("meetup")

const app = Express()
const server = Http.Server(app)
const io = Socket(server)
const mup = new Meetup()


// outside of our stream we set up an empty object.
let topicsCounter = {}

function receiveStream() {
    mup.stream("/2/rsvps", function (stream) {
        stream
            .on("data", dataItem => {
                console.log("Get data item:")
                // console.log(dataItem)
                // inside of our stream event handler we retrieve the group topics
                const topicNames = dataItem.group.group_topics.map(topicObj => topicObj.topic_name)
                // console.log("Topic Names:")
                // console.log(topicNames)
                if (topicNames.includes("Software Development")) {
                    topicNames.forEach(name => {
                        if (topicsCounter[name]) {
                            topicsCounter[name]++
                        } else {
                            topicsCounter[name] = 1
                        }
                    });
                }
                // console.log("Topics Counter:")
                // console.log(topicsCounter)
                const topicsArray = Object.keys(topicsCounter)
                topicsArray.sort((topicA, topicB) => {
                    if (topicsCounter[topicA] > topicsCounter[topicB]) {
                        // Put topicB before topicA
                        return -1
                    }
                    else if (topicsCounter[topicA] < topicsCounter[topicB]) {
                        // topicA and topicB remain unchanged in order
                        return 1
                    }
                    else {
                        return 0
                    }
                })
                // console.log("Sorted Topics:")
                // console.log(topicsArray)
                const top10Topics = topicsArray.slice(0, 10)
                const top10TopicsCounter = top10Topics.map(topicName => {
                    return {
                        topic: topicName,
                        count: topicsCounter[topicName]
                    }
                })
                // console.log("Top 10 Topics:")
                // console.log(top10TopicsCounter)
            })
            .on("error", error => {
                console.log("Error! ", error)
            })
    })
}

io.on("connection", (socket) => {
    console.log("Get connection!")
    // receiveStream()
    socket.on("action", 199)
})

server.listen(3002)