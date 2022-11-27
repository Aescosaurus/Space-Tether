class Tether
{
	constructor( player,tilemap,particleHand )
	{
		this.x = 0
		this.y = 0
		this.size = 4
		this.player = player
		this.tilemap = tilemap
		
		this.held = true
		
		this.aiming = false
		this.aimXInit = 2.0
		this.aimYInit = -3.0
		this.aimX = this.aimXInit
		this.aimY = this.aimYInit
		this.aimSpd = 0.07
		this.aimGrav = player.gravAcc
		this.targetX = -1
		this.targetY = -1
		
		this.canPress = false
		this.canTether = true
		
		this.oxygenRadius = 38
		this.ouchTimer = 0
		this.ouchDuration = 12
		this.radiusLeniency = 3
		
		this.maxAimDist = 10.0
		
		this.circleSpr = new Sprite( "Images/Circle" )
		this.tetherSpr = new Sprite( "Images/Tether" )
		this.previewSpr = new Sprite( "Images/Preview" )
		this.iconSpr = new Sprite( "Images/TetherIcon" )
		this.noIconSpr = new Sprite( "Images/TetherGoneIcon" )
		
		this.tetherCount = levels[tilemap.curLevel].tethers
		this.curTethers = this.tetherCount
		this.useTethers = true
		
		this.particleHand = particleHand
	}
	
	Update( kbd )
	{
		if( this.player.ouch ) return
		
		if( !kbd.KeyDown( ' ' ) ) this.canPress = true
		
		if( this.aiming && !kbd.KeyDown( ' ' ) )
		{
			this.aiming = false
			if( this.canTether )
			{
				this.held = false
				this.x = this.targetX
				this.y = this.targetY
				
				if( this.useTethers ) --this.curTethers
				
				this.particleHand.CreateParticle( this,1,15 )
				this.particleHand.CreateParticle( { x: 0 + this.curTethers * this.iconSpr.width,y: 4 },1,25 )
				
				Tether.placeSound.Play()
			}
			else Tether.blockedSound.Play()
		}
		
		this.player.frozen = this.aiming || this.held
		
		if( this.aiming )
		{
			this.FollowPlayerPos()
			
			if( kbd.KeyDown( 'W' ) ) this.aimY -= this.aimSpd
			if( kbd.KeyDown( 'S' ) ) this.aimY += this.aimSpd
			if( kbd.KeyDown( 'A' ) ) this.aimX -= this.aimSpd
			if( kbd.KeyDown( 'D' ) ) this.aimX += this.aimSpd
			
			const aimDistSq = this.aimX * this.aimX + this.aimY * this.aimY
			if( aimDistSq > this.maxAimDist * this.maxAimDist )
			{
				const aimLen = Math.sqrt( aimDistSq )
				this.aimX = this.aimX / aimLen * this.maxAimDist
				this.aimY = this.aimY / aimLen * this.maxAimDist
			}
		}
		else if( this.held )
		{
			this.FollowPlayerPos()
			
			if( this.curTethers > 0 )
			{
				if( this.canPress )
				{
					if( !this.aiming && kbd.KeyDown( ' ' ) && this.player.yVel <= 0.0 ) Tether.aimSound.Play()
					
					this.aiming = kbd.KeyDown( ' ' )
					if( !this.player.tetherOverride &&
						( this.player.xVel != 0.0 || this.player.yVel != 0.0 ) )
					{
						this.aiming = false
					}
					
					if( this.aiming && this.aimX == this.aimXInit )
					{
						this.aimX = this.aimXInit * this.player.dir
					}
				}
			}
			else
			{
				this.player.Ouch()
			}
		}
		else
		{
			if( kbd.KeyDown( ' ' ) )
			{
				this.held = true
				this.canPress = false
				this.aimX = this.aimXInit
				this.aimY = this.aimYInit
				
				this.particleHand.CreateParticle( this,2,15 )
				
				Tether.pickupSound.Play()
			}
		}
		
		const xDiff = this.player.x - this.x
		const yDiff = this.player.y - this.y
		const rad = this.oxygenRadius + this.radiusLeniency
		if( xDiff * xDiff + yDiff * yDiff > rad * rad )
		{
			if( ++this.ouchTimer > this.ouchDuration ) this.player.Ouch()
		}
		else this.ouchTimer = 0
		
		this.player.tetherOverride = false
	}
	
	Draw( gfx )
	{
		// gfx.DrawRect( this.x - this.size / 2,
		// 	this.y - this.size / 2,
		// 	this.size,this.size,
		// 	"blue" )
		gfx.DrawSprite( this.x - this.tetherSpr.width / 2,
			this.y - this.tetherSpr.height / 2,
			this.tetherSpr )
		
		if( this.aiming )
		{
			let drawX = this.x
			let drawY = this.y
			let drawGrav = 0.0
			let curTile = 0
			while( curTile < 1 || curTile == 2 )
			{
				drawX += this.aimX
				drawY += this.aimY
				drawY += drawGrav
				drawGrav += this.aimGrav
				
				// gfx.DrawRect( drawX,drawY,1,1,"blue" )
				gfx.DrawSprite( drawX,drawY,this.previewSpr )
				curTile = this.tilemap.GetTileWorld( drawX,drawY )
				
				if( drawX < -gfx.scrWidth || drawX > gfx.scrWidth * 2 ||
					drawY < -gfx.scrHeight * 3 || drawY > gfx.scrHeight * 2 )
				{
					break
				}
			}
			
			if( curTile != 3 && curTile != -1 )
			{
				// gfx.DrawCircle( drawX,drawY,this.oxygenRadius,"blue" )
				gfx.DrawSprite( drawX - this.circleSpr.width / 2,
					drawY - this.circleSpr.height / 2,
					this.circleSpr )
				this.targetX = drawX
				this.targetY = drawY
				this.canTether = true
			}
			else
			{
				this.targetX = this.x
				this.targetY = this.y
				this.canTether = false
			}
		}
		else if( !this.held )
		{
			// gfx.DrawCircle( this.x,this.y,this.oxygenRadius,"blue" )
			gfx.DrawSprite( this.x - this.circleSpr.width / 2,
				this.y - this.circleSpr.height / 2,
				this.circleSpr )
		}
		
		for( let i = 0; i < this.tetherCount; ++i )
		{
			gfx.DrawSprite( 0 + i * this.iconSpr.width,0,
				i < this.curTethers ? this.iconSpr : this.noIconSpr )
		}
	}
	
	FollowPlayerPos()
	{
		this.x = this.player.x + this.player.dir * 4
		this.y = this.player.y + 1
	}
	
	Reset()
	{
		this.aimX = this.aimXInit
		this.aimY = this.aimYInit
		
		this.tetherCount = levels[this.tilemap.curLevel].tethers
		this.curTethers = this.tetherCount
		
		this.held = true
		this.aiming = false
	}
}

Tether.aimSound = new Sound( "Audio/TetherAim" )
Tether.placeSound = new Sound( "Audio/TetherPlace" )
Tether.pickupSound = new Sound( "Audio/TetherPickup" )
Tether.blockedSound = new Sound( "Audio/TetherBlocked" )