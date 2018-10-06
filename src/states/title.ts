import * as Assets from '../assets';
import { PhaserTextStyle } from 'phaser-ce';

export default class Title extends Phaser.State {
    private backgroundTemplateSprite: Phaser.Sprite = null;
    private googleFontText: Phaser.Text = null;
    private localFontText: Phaser.Text = null;
    private pixelateShader: Phaser.Filter = null;
    private bitmapFontText: Phaser.BitmapText = null;
    private blurXFilter: Phaser.Filter.BlurX = null;
    private blurYFilter: Phaser.Filter.BlurY = null;
    private sfxAudiosprite: Phaser.AudioSprite = null;
    private mummySpritesheet: Phaser.Sprite = null;
    private sfxLaserSounds: Assets.Audiosprites.AudiospritesSfx.Sprites[] = null;
    private platforms: Phaser.Group = null;
    private player: Phaser.Sprite = null;
    private cursors: Phaser.CursorKeys = null;
    private stars: Phaser.Group = null;
    private score: number = null;
    private scoreText: Phaser.Text = null;

    public create(): void {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.add.sprite(0, 0, Assets.Images.Sky.getName());

        this.platforms = this.game.add.group();

        //  We will enable physics for any object that is created in this group
        this.platforms.enableBody = true;

        // Here we create the ground.
        let ground = this.platforms.create(0, this.game.world.height - 64, Assets.Images.Platform.getName());

        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        ground.scale.setTo(2, 2);

        //  This stops it from falling away when you jump on it
        ground.body.immovable = true;

        //  Now let's create two ledges
        let ledge = this.platforms.create(400, 400, Assets.Images.Platform.getName());

        ledge.body.immovable = true;

        ledge = this.platforms.create(-150, 250, Assets.Images.Platform.getName());

        ledge.body.immovable = true;
        // The player and its settings
        this.player = this.game.add.sprite(32, this.game.world.height - 150, Assets.Spritesheets.SpritesheetsDude32481.getName());

        //  We need to enable physics on the player
        this.game.physics.arcade.enable(this.player);

        //  Player physics properties. Give the little guy a slight bounce.
        this.player.body.bounce.y = 0.2;
        this.player.body.gravity.y = 300;
        this.player.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.stars = this.game.add.group();

        this.stars.enableBody = true;

        //  Here we'll create 12 of them evenly spaced apart
        for (let i = 0; i < 12; i++) {
            //  Create a star inside of the 'stars' group
            let star = this.stars.create(i * 70, 0, Assets.Images.Star.getName());

            //  Let gravity do its thing
            star.body.gravity.y = 6;

            //  This just gives each star a slightly random bounce value
            star.body.bounce.y = 0.7 + Math.random() * 0.2;
        }

        this.score = 0;
        const style: PhaserTextStyle = {
            fontSize: 32,
            fill: '#000'
        };

        this.scoreText = this.game.add.text(16, 16, 'score: 0', style);
        this.game.camera.flash(0x000000, 1000);
    }

    /**
     * update
     */
    public update() {
        let hitPlatform = this.game.physics.arcade.collide(this.player, this.platforms);
        //  Reset the players velocity (movement)
        this.player.body.velocity.x = 0;

        if (this.cursors.left.isDown) {
            //  Move to the left
            this.player.body.velocity.x = -150;

            this.player.animations.play('left');
        }
        else if (this.cursors.right.isDown) {
            //  Move to the right
            this.player.body.velocity.x = 150;

            this.player.animations.play('right');
        }
        else {
            //  Stand still
            this.player.animations.stop();

            this.player.frame = 4;
        }

        //  Allow the player to jump if they are touching the ground.
        if (this.cursors.up.isDown && this.player.body.touching.down && hitPlatform) {
            this.player.body.velocity.y = -350;
        }
        this.game.physics.arcade.collide(this.stars, this.platforms);
        this.game.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);
    }

    private collectStar(player: Phaser.Sprite, star: Phaser.Sprite) {
        // Removes the star from the screen
        star.kill();

        this.score += 10;
        this.scoreText.text = 'Score: ' + this.score;
    }
}
