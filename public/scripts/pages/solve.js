let player = null;
let maze = null;

function setup() {
    let name = $('#maze-container').data('name');
    $.ajax({
        url: "/fetch/" + name,
        success: function(response) {
            loadImage("/web/images/" + response.maze.image, (img) => {
                response.maze.image = img;

                let dna = new DNAStrain([
                    new p5.Vector( 0, -1),  // Move up
                    new p5.Vector( 1,  0),  // Move right
                    new p5.Vector( 0,  1),  // Move down
                    new p5.Vector(-1,  0)   // Move left
                ]);

                maze = new Maze(response.maze);
                player = new GeneticPlayer(dna, {
                    position: maze.getStart(),
                    distance: maze.getNodeSize(),
                    target: maze.getStart(),
                });

                canvas = createCanvas(maze.getWidth(), maze.getHeight());
                canvas.parent('#maze-container');
            });
        }
    });
}

function draw() {
    if (maze && player) {
        maze.render();

        if (player.isMoving()) {
            let finish = maze.getFinish();
            let position = player.getPosition();

            // When the player hits a wall, we want them to re-spawn
            // at the beginning of the maze.
            if (maze.isWall(position)) {
                player.mutate();
                player.respawn( maze.getStart() );
            }

            // When the player reaches the finish line, then we want
            // to stop them from moving until they reset the game.
            if (player.isAtPosition(finish)) {
                noLoop();
            }
        }

        player.update();
        player.render();
    }
}
