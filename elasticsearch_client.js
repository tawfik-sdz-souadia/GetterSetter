
const {connection} = require('./autobahnGetter.js');
const {client} = require('./elasticsearch');
const elasticsearch_config = require('./elastic_config.json');
const moment = require('moment');


const time = process.env.TIME;
const rtime = process.env.RTIME;

function getTimeBeforeXSeconds(x){
  return new moment(moment() + 36*10e4 - x*1000).toISOString(true).slice(0,-6)+'Z'
}

var data;

async function run () {
  const { body } = await client.search({
    index: 'map',
    body: {
      query: {
        range : {
            time : {
               gte:  getTimeBeforeXSeconds(time),
               lte:  getTimeBeforeXSeconds(0) 
            }
          }
        },
        size : 10000,
         "sort": [
            {
               "time": {
                  "order": "desc"
               }
            }
          ]
      } 
  })
  data = body.hits.hits;
} 

connection.open();

connection.onopen = function (session) {
  console.log("ok");
  setInterval(function () {
    run().then(function(){
        session.publish('getdata.elasticsearch',[data]);
      },function(err){
        console.error(err);
      });
   },rtime); 
};


