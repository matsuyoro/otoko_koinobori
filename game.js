enchant();
window.onload = function () {
    var game = new Game(320, 320);
    game.preload('otoko.gif','koinobori2.gif','karasu.gif','kazaguruma.gif','poll.gif','senpuki.gif');
    game.onload = function () {

		// 初期設定
		var score = 0;
	
		//haikei	
		var poll = new Sprite(4,270);
		poll.image = game.assets['poll.gif'];
		poll.x = 100;
		poll.y = 50;
		game.rootScene.addChild(poll);

        var kurukuru = new Sprite(32,32);
        kurukuru.image = game.assets['kazaguruma.gif'];
        kurukuru.x = 84;
        kurukuru.y = 50;
        game.rootScene.addChild(kurukuru);

	  	var senpuki = new Sprite(64,80);
        senpuki.image = game.assets['senpuki.gif'];
        senpuki.x = 250;
        senpuki.y = 200;
        game.rootScene.addChild(senpuki);

		var otoko = new Sprite(32,32);
		otoko.image = game.assets['otoko.gif'];
		otoko.x = otoko.y = 0;
		otoko.opacity = 0.7;
		otoko.aliveMax = 10;
		

		// player
		var player = new Sprite(72,32);
		player.image = game.assets['koinobori2.gif'];
		player.x = 32;
		player.y = 100;
		player.vy = 0;
		player.frmspd = 4;
		player.addEventListener('enterframe', function() {

			this.y += this.vy;
			if(this.y < 70){
				this.y = 70;
				this.vy = 0;
			}else if(this.y > (game.height -32))
			{
				this.y = game.height -32;
				this.vy = 0;
			}
				
			if(touched)
			{
				this.frmspd = 1;
				this.vy -= 0.1;
			}else
			{
				this.frmspd = 4;
				this.vy += 0.1;	
			}

			//anime
			if (game.frame % this.frmspd == 0){
            	this.frame++;
                kurukuru.frame++;
                senpuki.frame++;
            }

			if (otoko.alive > 0)
			{
				otoko.x = this.x + 96 + ((10 - otoko.alive) * 4);
				otoko.y = this.y - ((10 - otoko.alive) * 4);
				if(otoko.scaleX < 5)
				{
					otoko.scaleX += 0.1;
					otoko.scaleY += 0.1;
				}
				game.rootScene.addChild(otoko);
				otoko.alive--;
				if(otoko.alive == 0)
				{
					game.rootScene.removeChild(otoko);
					otoko.scaleX = 1;
					otoko.scaleY = 1;
				}
			}
			if (game.frame % 3 == 0){
				otoko.frame++;
			}
		});

    	var touched = false;
    	game.rootScene.addEventListener('touchstart', function() {
        	touched = true;
    	});
    	game.rootScene.addEventListener('touchend', function() {
        	touched = false;
    	});

       	game.rootScene.addChild(player);
		        
		// acotr
		var actorNum = 1;
        var actor = Array(actorNum);
        var actormaxNum = 2;
        var actormax = 20; //actor最大数
        var actornow = 1;
        
		// 文字表示:
        var txtmenu = new Label();
        txtmenu.x = 5;
		txtmenu.y = 5;
        txtmenu.font = "10px 'Arial'";
        txtmenu.text = "" + score + "点";	

        function actoradd(add) {
            actor[add] = new Sprite(32, 32);
            actor[add].image = game.assets['karasu.gif'];
            actor[add].x = game.width;
            actor[add].y = Math.floor(Math.random() * (game.height - 32)) + 16;
            actor[add].speed = 1 + (Math.random() * 1.5);
            actor[add].ydir = (Math.random() * 1.5) - 1;
			actor[add].scaleX = 1;
			actor[add].scaleY = 1;

            actor[add].addEventListener('enterframe', function () {
                this.x -= this.speed;
                this.y += this.speed * this.ydir;

                if ((this.y > game.height - 30) || (this.y <= 18)) this.ydir *= -1;
				if (this.x < (-this.width))
				{
					game.rootScene.removeChild(this);
					actorNum--;
					score+= 5;
		            if (actormax > actornow)
					{
                        for (var i = 0; i < 2; i++)
						{
                            actoradd(i);
                            actornow++;
                        }
                    } else {
                        actoradd(1);
                    }
                    return;
					
				}


				//-----判定
				if(this.within(player,20))
				{
					game.end(score, score + '点でした★');
				}
				if(this.intersect(player))
				{
					score ++;
					otoko.alive = 10;
				}
			


                //アニメーション
                if (game.frame % 3 == 0) this.frame++;
            });
            game.rootScene.addChild(actor[add]);
        }

        txtmenu.addEventListener('enterframe', function () {
            if (game.frame % game.fps == 0) {
                txtmenu.text = "" + score + "点";
            }
        });
        
		for (var i = 0; i < actorNum; i++) 
		{
            actoradd(i);
        }
       	game.rootScene.addChild(txtmenu);
        game.rootScene.backgroundColor = 'rgb(230, 230, 230)';
    };
    game.start();
};
