/**
 *	Developed by: Ademilson Santana da Silva
 * ademilsonssilva1@gmail.com
 *	 _____ _   _   ___   _   __ _____   _____   ___  ___  ___ _____ 
 *	/  ___| \ | | / _ \ | | / /|  ___| |  __ \ / _ \ |  \/  ||  ___|
 *	\ `--.|  \| |/ /_\ \| |/ / | |__   | |  \// /_\ \| .  . || |__  
 *	 `--. \ . ` ||  _  ||    \ |  __|  | | __ |  _  || |\/| ||  __| 
 *	/\__/ / |\  || | | || |\  \| |___  | |_\ \| | | || |  | || |___ 
 *	\____/\_| \_/\_| |_/\_| \_/\____/   \____/\_| |_/\_|  |_/\____/
 *
 *	Snake Game on Javascript
 */
 
var _direction = 'RIGHT';
var _lastDirection = 'LEFT';

var _snakeSize = 2;
var _movementId = 2;
var _tableSize = 0;
var _milliseconds = 0;
var _sizeBonus = 1;
var _difficultyBonus = 1;
var _intervalID = '';

var _alreadyChanged = false;
var _gameOver = false;

var _game = {score:0, fruits: 0};

leaderboard();


$('#begin').click(function () {
	$('#newGame').hide();
	setGameConfigs();
	startGame();
});

$('#newGame').click(function () {
	newGame();
});

function startGame()
{		
	createTable();
	startSnake();
	generateRandomFruit();
	
	_gameOver = false;
	
	usedKeys = [37, 38, 39, 40];
	$('#body').bind('keydown', function (event) {
		if (usedKeys.indexOf(event.which) != -1) {
			switch (event.which){
				case 37:
					direction = 'LEFT';
					break;
				case 38:
					direction = 'UP';
					break;
				case 39: 
					direction = 'RIGHT';
					break;
				case 40: 
					direction = 'DOWN';
					break;
			}
			
			//Impede que a cobrinha volte por dentro dela (pela direçao q ela veio)
			if (
				!(_lastDirection == 'LEFT' && direction == 'RIGHT') &&
				!(_lastDirection == 'RIGHT' && direction == 'LEFT') &&
				!(_lastDirection == 'DOWN' && direction == 'UP') &&
				!(_lastDirection == 'UP' && direction == 'DOWN') 
			)	{
				if (!_alreadyChanged) { //already changed serve para resolver bug de direçao com o setInterval
					_lastDirection = direction;
					_direction = direction;
					_alreadyChanged = true;
				}
			}
		}
	});
	
	
	_intervalID = setInterval(function () {
		if (!_gameOver) {		
			moveHead();
			_movementId++;
		}
	}, _milliseconds);
	
}


function createTable ( size = _tableSize)
{
	var table = $("<table border='1' class='gametable' id='table' tabindex='1'></table>");
	
	for (i = 1; i <= size; i++) {
		tr = $("<tr id='tr"+i+"'> </tr>");
		
		for (j = 1; j <= size; j++) {
			
			td = $("<td id='" + i + "-" + j + "' > </td>");
			tr.append(td);
			
		}
		
		table.append(tr);
	}
	$('#body').append(table);
	$('#body').show();
	$('#body').focus();
}

function startSnake () 
{
	$('#1-1').addClass('hasSnake snakeHead').prop('movement_id', 1);
}

function moveHead()
{
	head = $('.snakeHead');
	coord = getCoordinates(head);
	
	switch (_direction) {
		case 'LEFT':
			next_id = String(coord[0]) + "-" + String(parseInt(coord[1]) - 1);
			break;
		case 'UP': 
			next_id = String(parseInt(coord[0] - 1)) + "-" + String(coord[1]);
			break;
		case 'RIGHT':
			next_id = String(coord[0]) + "-" + String(parseInt(coord[1]) + 1);
			break;
		case 'DOWN':
			next_id = String(parseInt(coord[0]) + 1) + "-" + String(coord[1]);
			break;
	}
	
	if (head.hasClass('hasFruit')){
		eatFruit();
	}
	
	//se sair do cenario termina o game
	if ( next_id.split('-')[0] > _tableSize || next_id.split('-')[1] > _tableSize || next_id.split('-')[0] < 1 || next_id.split('-')[1] < 1 ) { 	
		return gameOver();
	}
	
	//se bater no rabo termina o game
	if ($('#' + next_id).hasClass('hasSnake')){
		return gameOver();
	}
	
	$('#' + next_id).addClass('hasSnake snakeHead').prop('movement_id', _movementId);
	head.removeClass('snakeHead');
	
	$('.hasSnake').each(function () {
		if ((_movementId - _snakeSize > parseInt($(this).prop('movement_id'))) ) {
			$(this).prop('movement_id', '');
			$(this).removeClass('hasSnake');
			$(this).removeClass('hadFruit');
		}
	});
	
	_alreadyChanged = false;
}

function getCoordinates(local)
{
	id = local.prop('id');
	coordinates = id.split('-');
	return coordinates;
}

function generateRandomFruit () 
{
	while (true) {
		x = Math.floor((Math.random()*_tableSize) + 1);
		y = Math.floor((Math.random()*_tableSize) + 1);
		
		if (!$('#'+String(x) + '-' + String(y)).hasClass('hasSnake')) {
			$('#'+String(x) + '-' + String(y)).addClass('hasFruit');
			return true;
		}
	}
	
}

function eatFruit() 
{
	_game.score += 1 + _sizeBonus + _difficultyBonus;
	_game.fruits++;
	_snakeSize++;
	
	$('#score').html(_game.score);
	$('#fruits').html(_game.fruits);
	
	$('.hasFruit').addClass('hadFruit');
	$('.hasFruit').removeClass('hasFruit');
	generateRandomFruit();
}

function setGameConfigs()
{
	switch ($('#difficulty').val()){
		case 'easy':
			_milliseconds = 250;
			_difficultyBonus = 1;
			break;
		case 'medium': 
			_milliseconds = 175;
			_difficultyBonus = 3;
			break;
		case 'hard':
			_milliseconds = 100;
			_difficultyBonus = 6;
			break;
	}
	
	switch($('#tableSize').val()){
		case 'small':
			_tableSize = 12;
			_sizeBonus = 8;
			break;
		case 'medium':
			_tableSize = 18;
			_sizeBonus = 4;
			break;
		case 'big':
			_tableSize = 24;
			_sizeBonus = 1;
			break;
	}
	
	_game.difficulty = $('#difficulty').val();
	_game.tableSize = $('#tableSize').val();
	
	$('#gameConfig').hide();
	showGameConfigs();
	
}

function showGameConfigs () 
{
	$('#leaderboard').hide();
	$('#score').html('0');
	$('#fruits').html('0');
	$('#span_difficulty').html(_game.difficulty == 'easy' ? 'FÁCIL' : _game.difficulty == 'medium' ? 'MÉDIO' : 'DIFÍCIL');
	$('#span_size').html(_game.tableSize == 'small' ? 'PEQUENO' : _game.tableSize == 'medium' ? 'MÉDIO' : 'GRANDE');
	$('#gameScore').show();
}

function gameOver() 
{
	_gameOver = true;
	clearInterval(_intervalID);
	if (localStorage.getItem('snakeGame_bestScore') == null) {
		localStorage.setItem('snakeGame_bestScore', JSON.stringify(_game));
	}
	else {
		if (JSON.parse(localStorage.getItem('snakeGame_bestScore')).score < _game.score) {
			$('#score').append("<span style='color: red;'>  #Novo recorde </span>");
			localStorage.setItem('snakeGame_bestScore', JSON.stringify(_game));
		}
	}
	alert('Fim de jogo')
	$('#newGame').show();
	$('#newGame').focus();
}

function newGame()
{
	_snakeSize = 2;
	_movementId = 2;
	_game.score = 0;
	_game.fruits = 0;
	
	_direction = 'RIGHT';
	_lastDirection = 'LEFT';
	
	_alreadyChanged = false;
	
	$('#body').html('');
	$('#body').hide();
	$('#gameConfig').show();
	$('#begin').focus();
	$('#gameScore').hide();
	leaderboard();
}

function leaderboard()
{
	if(localStorage.getItem('snakeGame_bestScore') != null) {
		leader = JSON.parse(localStorage.getItem('snakeGame_bestScore'));
		$('#leader_score').html(leader.score);
		$('#leader_fruits').html(leader.fruits);
		$('#leader_difficulty').html(leader.difficulty == 'easy' ? 'FÁCIL' : leader.difficulty == 'medium' ? 'MÉDIO' : 'DIFÍCIL');
		$('#leader_size').html(leader.tableSize == 'small' ? 'PEQUENO' : leader.tableSize == 'medium' ? 'MÉDIO' : 'GRANDE');
		$('#leaderboard').show();
	}
	else {
		$('#leaderboard').hide();
	}
	
}