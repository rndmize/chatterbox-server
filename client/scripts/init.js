/* global $, app */

$(document).ready(function() {
  app.init();

  app.$postBtn = $('.postBtn');
  app.$postTxt = $('.postTxt');
  app.$roomBtn = $('.roomBtn');
  app.$roomTxt = $('.roomTxt');
  app.$roomSelect = $('.roomSelect');

  // Event listeners
  app.$postBtn.click(function() {

    //need a Default room in case person doesn't select a chat room
    //when the app starts
    var roomname = app.$postTxt.data('roomname') || 'Default';
    var chatMessage = app.$postTxt.val();
    app.$postTxt.val('');

    //roomname will now be stored on the parse server
    //and rendered in the selection menu through the
    //renderRooms function, so we can delete that roomname
    //from the newRooms array

    var newRoomIndex = app.newRooms.indexOf(roomname);
    console.log(newRoomIndex);
    if(newRoomIndex !== -1){
      delete app.newRooms[newRoomIndex];
    }

    console.log('newRooms ' + app.newRooms);
    var message = {
      'username': new RegExp('[^=]*$').exec(window.location.href)[0],
      'text': chatMessage,
      'roomname': roomname
    };
    app.sendMessage(message);
  });

  //create new room
  app.$roomBtn.click(function() {
    var room = app.$roomTxt.val();
    console.log('room '+ room);
    app.newRooms.push(room);
    app.$roomTxt.val('');

    //set data attribute of post element
    app.$postTxt.data('roomname', room);

    clearTimeout(app.currentTimeout);
    // todo why is getMessages(undefined) different than getMessages('')

    //show all rooms or specific room selected
    if (!room || room === 'Show All Rooms') {
      $('.roomname').text('Showing all rooms');
      room = undefined;
    } else {
      $('.roomname').text('Current Room: ' + room);
    }
    app.getMessages(room);
  });

  //change rooms
  app.$roomSelect.change(function() {
    var room = $('.roomSelectorOpt:selected').val();
    clearTimeout(app.currentTimeout);

    //set data attribute of post element
    app.$postTxt.data('roomname', room);

    // todo why is getMessages(undefined) different than getMessages('')
    if (!room || room === 'Show All Rooms') {
      $('.roomname').text('Showing all rooms');
      room = undefined;
    } else {
      $('.roomname').text('Current Room: ' + room);
    }
    app.getMessages(room);
  });

  //add new friend
  //must bind event handler to document because username
  //elements are added dynamically

  //TODO - why does document.click('.username', function())
  //not bind to '.username'?
  $(document).on('click', '.username', function() {
    var friend = $(this).text();

    //update friends
    app.friends.push(friend);
    console.log('friend push ' + friend);
  });
});
