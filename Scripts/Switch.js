class Switch
{
	constructor( x,y,tilemap,partHand )
	{
		this.tilemap = tilemap
		this.x = x * tilemap.tileSize
		this.y = y * tilemap.tileSize
		
		this.partHand = partHand
		
		this.activated = false
		this.alreadyUsed = false
		
		this.interactRadius = 8
	}
	
	Update( player,lasers )
	{
		// activate on player or spike touch
		if( !this.alreadyUsed )
		{
			let overlap = false
			
			if( this.CheckColl( player ) ) overlap = true
			// else
			// {
			// 	for( let spike of spikes ) if( this.CheckColl( spike ) ) overlap = true
			// }
			
			if( overlap )
			{
				Switch.pressSound.Play()
				
				this.activated = !Lever.activated
				this.alreadyUsed = true
				Lever.activated = this.activated
				
				if( this.activated )
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
				else Lever.ReplaceTiles( this.tilemap )
				
				for( let laser of lasers ) laser.UpdateDirs()
				
				// spawn particles on self and on broken untetherable blocks
				this.partHand.CreateParticle( { x: this.x + 4,y: this.y + 4 },
					2,15 )
			}
		}
	}
	
	Draw( gfx )
	{
		gfx.DrawSprite( this.x,this.y,
			this.alreadyUsed ? Switch.sprs[1] : Switch.sprs[0] )
	}
	
	CheckColl( obj )
	{
		const xDiff = obj.x - this.x
		const yDiff = obj.y - this.y
		return( xDiff * xDiff + yDiff * yDiff < Math.pow( this.interactRadius,2 ) )
	}
}

Switch.sprs =
[
	new Sprite( "Images/Switch0" ),
	new Sprite( "Images/Switch1" )
]
Switch.pressSound = new Sound( "Audio/SwitchPress" )