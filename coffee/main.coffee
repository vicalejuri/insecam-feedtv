
window.Game = {}

create = ->
  Game.game.physics.startSystem(Phaser.Physics.ARCADE)

update = ->

preload = ->
  images = []
  for key in images
    Game.game.load.image(key, 'assets/' + key + '.png')

Game.game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { create: create, update: update, preload: preload })
