// Code your JavaScript / jQuery solution here
const WINNING_COMBOS = [[0,1,2], [3,4,5], [6,7,8], [0,3,6],
                        [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
let turn = 0;
let currentGame = 0;

function player () {
  if (turn % 2 === 0) {
    return 'X'
  } else {
    return 'O'
  }
}

function updateState(element) {
  $(element).text(player())
}

function setMessage(message) {
  $('#message').text(message)
}

function checkWinner() {
  var board = {};
  var winner = false;

  $('td').text((index, square) => board[index] = square);

  WINNING_COMBOS.some(function(combo) {
    if (board[combo[0]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
      setMessage(`Player ${board[combo[0]]} Won!`);
      return winner = true;
    }
  });

  return winner;
}

function doTurn(element) {
  updateState(element)
  turn++
  if (checkWinner()){
    saveGame()
    turn = 0
    $('td').empty()
  } else if (turn === 9) {
    setMessage("Tie game.")
    saveGame()
    turn = 0
    $('td').empty()
  }
}

function saveGame(){
  const url = '/games'
  const board = []
  let postData
  board.push($('td[data-x=0][data-y=0]').text())
  board.push($('td[data-x=1][data-y=0]').text())
  board.push($('td[data-x=2][data-y=0]').text())
  board.push($('td[data-x=0][data-y=1]').text())
  board.push($('td[data-x=1][data-y=1]').text())
  board.push($('td[data-x=2][data-y=1]').text())
  board.push($('td[data-x=0][data-y=2]').text())
  board.push($('td[data-x=1][data-y=2]').text())
  board.push($('td[data-x=2][data-y=2]').text())
  postData = {state: board}

  if (currentGame != 0) {

    $.ajax({
      method: "PATCH",
      url: url + '/' + currentGame,
      data: postData
    }).done(console.log('patched requested'))
  } else {
    $.post(url,postData,function(data) {
    })
  }
}

function getGames(){
  const url = '/games'
  $.get(url,function(data){
    /*for (var i = 0; i < games.length; i++) {
      ('td[data-x=0][data-y=0]').text(games[i]["attributes"]["state"][0])
      ('td[data-x=1][data-y=0]').text(games[i]["attributes"]["state"][1])
      ('td[data-x=2][data-y=0]').text(games[i]["attributes"]["state"][2])
      ('td[data-x=0][data-y=1]').text(games[i]["attributes"]["state"][3])
      ('td[data-x=1][data-y=1]').text(games[i]["attributes"]["state"][4])
      ('td[data-x=2][data-y=1]').text(games[i]["attributes"]["state"][5])
      ('td[data-x=0][data-y=2]').text(games[i]["attributes"]["state"][6])
      ('td[data-x=1][data-y=2]').text(games[i]["attributes"]["state"][7])
      ('td[data-x=2][data-y=2]').text(games[i]["attributes"]["state"][8])
    }*/
  }).done(function(data){
    const games = data['data']
    let html = '<ul>'
    for (var i = 0; i < games.length; i++) {
    html += `<li> <button id=${games[i]['id']} onclick="getGame(${games[i]['id']})"> ${games[i]['id']} </button> </li>`
    }
    html += '</ul>'
    $('#games').html(html)
  })
}

function getGame(ispo) {
  currentGame = ispo
  const id = ispo
  const url = '/games/' + id
  $.get(url,function(data){
  }).done(function(data){
    const board = data['data']['attributes']["state"]
    for (var i = 0; i < board.length; i++) {
      $('td[data-x=0][data-y=0]').text(board[0])
      $('td[data-x=1][data-y=0]').text(board[1])
      $('td[data-x=2][data-y=0]').text(board[2])
      $('td[data-x=0][data-y=1]').text(board[3])
      $('td[data-x=1][data-y=1]').text(board[4])
      $('td[data-x=2][data-y=1]').text(board[5])
      $('td[data-x=0][data-y=2]').text(board[6])
      $('td[data-x=1][data-y=2]').text(board[7])
      $('td[data-x=2][data-y=2]').text(board[8])
    }
  })
}

function attachListeners () {
  $('td').click(function() {
    doTurn(this)
  })
  $('#save').click(saveGame)
  $('#clear').click(function() {
    $('td').empty()
  })
  $('#previous').click(getGames)
}

$(document).ready(attachListeners)
