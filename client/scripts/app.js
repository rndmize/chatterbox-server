 // global $, _, moment
 // exported app

//convention to explicitly say that you're creating a global variable
var app = window.app;

/*
functions needed:
- init
send
fetch
clearMessages
addMessage
addRoom
addFriend
handleSubmit

#chats
#roomSelect
#message
#send
 */

//Views
//-room
//-message
//-app
//
//Models
//-room
//-message
//-app
//
//Collections
//-messages
//-rooms

app = {

  newRooms: [], //strings

  friends: [], //strings

  //start up - init
  //start getting messages and rooms

  //interaction with server
  // -send
  // -fetch

  //messages
  // addMessage - sendMessage
  //  handleSubmit
  // clearMessages

  //rooms
  //  addRoom

  //addFriend

  init: function(){
    app.getMessages();
    app.getRooms();
  },

  getRooms: function(){
    // must preserve context of app for asynchronous callbacks
    var that = app;
    $.ajax({
      url: 'http://127.0.0.1:3000/',
      contentType: 'application/json',
      type: 'GET',
      data: {
        // TODO - possible to select these fields only?
        // keys: 'roomname',
        order: '-createdAt'
      },
      success: function(data) {
        that.renderRooms(data);
        console.log('get room success');
      },
      error: function() {
        console.log('get room error');
      }
    });
    setTimeout(function() {
      that.getRooms();
    }, 5000);
    console.log('getRooms setTimeout called');
  },
  setRoomEl: _.template(
    "<option class='roomSelectorOpt'><%- room %></option>"
  ),

  renderRooms: function(data) {
    //populate room menu with current rooms of past 100 messages
    var rooms =  _.chain(data.results)
      .map(function(result){
        return result.roomname;
      })
      .uniq()
      // .slice(0, 10)
      .value()
      .concat(app.newRooms);

      //TODO - filter <script> tags in room names, below code doesn't filter
    // rooms = _.reject(rooms, function(roomname) {
    //     return _.contains(roomname, "4chan")
    //   });

    $('.roomSelectorOpt').remove();
    app.$roomSelect.append(app.setRoomEl({ room: 'Show All Rooms' }));

    _.each(rooms, function(room){
      app.$roomSelect.append(app.setRoomEl({ room: room }));
    }, app);
  },

  sendMessage: function(data) {
    $.ajax({
      url: 'http://127.0.0.1:3000/classes/messages/send',
      contentType: 'application/json',
      type: 'POST',
      data: JSON.stringify(data),
      success: function() {
        console.log('send success');
      },
      error: function() {
        console.log('send error');
      }
    });
  },

  getMessages: function(room){
    // must preserve context of app for asynchronous callbacks
    var that = app;
    $.ajax({
      url: 'http://127.0.0.1:3000/',
      contentType: 'application/json',
      type: 'GET',
      data: {
        order: '-createdAt',
        where: {"roomname": room }
      },
      success: function(data) {
        that.renderMessages(data);
      },
      error: function() {
        console.log('get error');
      }
    });
    app.currentTimeout = setTimeout(function() {
      that.getMessages(room);
    }, 5000);
    console.log('setTimeout called');
  },

  setMessageEl: _.template(
    "<div class='message'>" +
      "<span class='username <%- friend %>'><%- username %></span>" + " " +
      "<span class='date'><%- date %></span>" +
      "<br><br>" +
      "<div class='text'><%- text %></div>" +
      "<span class='room'>from <%- room %></span>" +
      "<br><br><hr>" +
    "</div>"
  ),


  renderMessages: function(data) {
    $('#main > .message').remove();

    // sort results with recent posts first
    var results = data.results.sort(function(item1, item2) {
      return new Date(item2.createdAt) - new Date(item1.createdAt);
    });

    _.each(results, function(result) {
      $('#main').append(app.setMessageEl({
        username: result.username,
        date: moment(result.createdAt).fromNow(),
        text: result.text,
        room: result.roomname,
        friend: _.contains(app.friends, result.username) ? 'friend' : ''
      }));
    }, app);
  },


};
