class Menu
{
	constructor()
	{
		this.startButton = new Button( 128 / 2,25,new Sprite( "Images/StartButton2" ),new Sprite( "Images/StartButton1" ) )
		// this.levelEditButton = new Button( 128 / 2,45,new Sprite( "Images/LevelEditButton2" ),new Sprite( "Images/LevelEditButton1" ) )
		this.controlsButton = new Button( 128 / 2,36,new Sprite( "Images/ControlsButton2" ),new Sprite( "Images/ControlsButton1" ) )
		this.optionsButton = new Button( 128 / 2,47,new Sprite( "Images/OptionsButton2" ),new Sprite( "Images/OptionsButton1" ) )
		this.backButton = new Button( 25,18,new Sprite( "Images/BackButton2" ),new Sprite( "Images/BackButton1" ) )
		
		this.controlsImg = new Sprite( "Images/ControlsScreen" )
		this.controlsXY = { x: 42,y: 8 }
		this.optionsImg = new Sprite( "Images/OptionsScreen" )
		this.optionsXY = { x: 51,y: 8 }
		this.musicSlider = new SliderBar( 42,31,48,4,0.3,new Sprite( "Images/MusicText" ) )
		this.soundSlider = new SliderBar( 42,47,48,4,0.5,new Sprite( "Images/SoundText" ) )
		
		this.open = true
		
		this.bgImg = new Sprite( "Images/MenuBG" )
		this.winImg = new Sprite( "Images/Player0" )
		this.winImgLeft = new Sprite( "Images/PlayerLeft1" )
		this.winImgFlipCounter = 0
		this.winImgFlipInterval = 20
		this.winImgDrawDir = 1
		this.winnerText = new Sprite( "Images/WinnerText" )
		
		this.titleImg = new Sprite( "Images/TitleText" )
		this.titleFlare = new Sprite( "Images/MenuFlare" )
		this.titleFlare2 = new Sprite( "Images/MenuFlare2" )
		
		this.flareY = 0
		this.flare2Y = 0
		this.flareCounter = 0
		
		// 0 = menu 1 = controls 2 = options 3 = win screen
		this.menuScr = 0
		
		this.menuMusic = new Sound( "Audio/MusicIntro",0.07,true )
		this.menuMusic.Loop()
		this.interacted = false
		this.canInteract = true
		
		this.canInteractSlider = false
		this.updatedSoundVol = false
		
		this.gameMusic = new Sound( "Audio/MusicMain",0.07,true )
	}
	
	Update( mouse,kbd )
	{
		if( mouse.down ) this.interacted = true
		
		if( this.menuScr == 0 )
		{
			if( this.startButton.Update( mouse ) )
			{
				this.menuMusic.Stop()
				this.canInteract = false
				this.gameMusic.Loop()
			}
			// this.levelEditButton.Update( mouse )
			if( this.controlsButton.Update( mouse ) ) this.menuScr = 1
			else if( this.optionsButton.Update( mouse ) ) this.menuScr = 2
		}
		else
		{
			if( this.menuScr == 3 )
			{
				if( ++this.winImgFlipCounter > this.winImgFlipInterval )
				{
					this.winImgFlipCounter = 0
					this.winImgDrawDir *= -1
				}
			}
			else if( this.backButton.Update( mouse ) ) this.menuScr = 0
		}
		
		// options menu
		if( this.menuScr == 2 )
		{
			if( !mouse.down )
			{
				this.canInteractSlider = true
				if( this.updatedSoundVol )
				{
					this.updatedSoundVol = false
					Button.clickSound.Play()
				}
			}
			
			if( this.canInteractSlider )
			{
				if( this.musicSlider.Update( mouse ) )
				{
					Sound.SetMusicVol( this.musicSlider.GetPercent() )
				}
				if( this.soundSlider.Update( mouse ) )
				{
					Sound.soundVol = this.soundSlider.GetPercent()
					this.updatedSoundVol = true
				}
			}
		}
		else this.canInteractSlider = false
		
		++this.flareCounter
		this.flareY = Math.sin( this.flareCounter / 10 )
		this.flare2Y = Math.cos( this.flareCounter / 10 + 2.7 )
		
		if( !this.menuMusic.Playing() && this.interacted && this.canInteract ) this.menuMusic.Loop()
	}
	
	Draw( gfx )
	{
		gfx.DrawSprite( 0,0,this.bgImg )
		
		if( this.menuScr == 0 )
		{
			gfx.DrawSprite( 10,10,this.titleImg )
			this.startButton.Draw( gfx )
			// this.levelEditButton.Draw( gfx )
			this.controlsButton.Draw( gfx )
			this.optionsButton.Draw( gfx )
		}
		else if( this.menuScr != 3 ) this.backButton.Draw( gfx )
		
		if( this.menuScr == 1 )
		{
			gfx.DrawSprite( this.controlsXY.x,this.controlsXY.y,this.controlsImg )
		}
		else if( this.menuScr == 2 )
		{
			gfx.DrawSprite( this.optionsXY.x,this.optionsXY.y,this.optionsImg )
			
			this.musicSlider.Draw( gfx )
			this.soundSlider.Draw( gfx )
		}
		else if( this.menuScr == 3 )
		{
			gfx.DrawSpriteScaled( 50,25,32,32,this.winImgDrawDir > 0 ? this.winImg : this.winImgLeft )
			gfx.DrawSpriteScaled( 40,10,this.winnerText.width * 2,this.winnerText.height * 2,this.winnerText )
			
			// todo: flip sprite based on draw dir
			// this.winImgDrawDir
		}
		
		gfx.DrawSprite( 15,29 + this.flareY,this.titleFlare )
		gfx.DrawSprite( 95,30 + this.flare2Y,this.titleFlare2 )
	}
	
	WinGame()
	{
		this.open = true
		this.menuScr = 3
	}
	
	StartPressed()
	{
		return( this.startButton.pressed )
	}
	
	// LevelEditPressed()
	// {
	// 	return( this.levelEditButton.pressed )
	// }
}