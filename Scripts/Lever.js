class Lever
{
	constructor( x,y,tilemap,partHand )
	{
		this.tilemap = tilemap
		this.x = x * tilemap.tileSize
		this.y = y * tilemap.tileSize
		
		this.partHand = partHand
		
		this.canActivate = false
		this.overlapTimer = 0
		this.overlapReset = 30
		
		this.interactRadius = 7
		this.exitTestRadius = 10
		
		if( !Lever.finishFillReactivate )
		{
			for( let y = 0; y < this.tilemap.height; ++y )
			{
				for( let x = 0; x < this.tilemap.width; ++x )
				{
					if( this.tilemap.GetTile( x,y ) == 3 )
					{
						Lever.reactivateSpots.push( { x: x,y: y } )
					}
				}
			}
			
			Lever.finishFillReactivate = true
		}
	}
	
	Update( player,lasers )
	{
		// activate on player or spike touch
		// if( !this.activated )
		{
			let overlap = false
			
			if( this.CheckColl( player,this.interactRadius ) )
			{
				overlap = true
				// if( this.canActivate ) overlap = true
				// 
				// this.canActivate =  false
			}
			// else if( !this.CheckColl( player,this.exitTestRadius ) ) this.canActivate = true
			// else
			// {
			// 	for( let spike of spikes ) if( this.CheckColl( spike ) ) overlap = true
			// }
			
			if( overlap && this.canActivate )
			{
				this.canActivate = false
				
				Lever.activated = !Lever.activated
				if( Lever.activated )
				{
					for( let y = 0; y < this.tilemap.height; ++y )
					{
						for( let x = 0; x < this.tilemap.width; ++x )
						{
							if( this.tilemap.GetTile( x,y ) == 3 )
							{
								this.tilemap.SetTile( x,y,0 )
							}
						}
					}
				}
				else
				{
					Lever.ReplaceTiles( this.tilemap )
				}
				
				for( let laser of lasers ) laser.UpdateDirs()
				
				// spawn particles on self and on broken untetherable blocks
				this.partHand.CreateParticle( { x: this.x + 4,y: this.y + 4 },
					2,15 )
				
				Lever.flipSound.Play()
			}
			
			if( overlap )
			{
				this.canActivate = false
				this.overlapTimer = 0
			}
			else
			{
				if( ++this.overlapTimer > this.overlapReset )
				{
					this.canActivate = true
					this.overlapTimer = 0
				}
			}
			
			return( overlap )
		}
	}
	
	Draw( gfx )
	{
		gfx.DrawSprite( this.x,this.y,
			Lever.activated ? Lever.sprs[1] : Lever.sprs[0] )
	}
	
	CheckColl( obj,dist )
	{
		const xDiff = obj.x - this.x
		const yDiff = obj.y - this.y
		return( xDiff * xDiff + yDiff * yDiff < Math.pow( dist,2 ) )
	}
}

Lever.sprs =
[
	new Sprite( "Images/Lever0" ),
	new Sprite( "Images/Lever1" )
]

Lever.activated = false
Lever.reactivateSpots = []
Lever.finishFillReactivate = false

Lever.Reset = function()
{
	Lever.activated = false
	Lever.reactivateSpots = []
	Lever.finishFillReactivate = false
}

Lever.ReplaceTiles = function( tilemap )
{
	for( let spot of Lever.reactivateSpots )
	{
		tilemap.SetTile( spot.x,spot.y,3 )
	}
}

Lever.flipSound = new Sound( "Audio/LeverFlip" )