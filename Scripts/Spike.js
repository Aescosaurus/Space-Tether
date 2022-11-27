class Spike
{
	constructor( x,y,tilemap,partHand )
	{
		this.tilemap = tilemap
		this.x = x * tilemap.tileSize
		this.y = y * tilemap.tileSize
		
		this.size = tilemap.tileSize
		
		this.partHand = partHand
		this.partSpawnChance = 0.1
		this.partSpawnLocs =
		[
			{ x: 0,y: 1 },
			{ x: 1,y: 6 },
			{ x: 4,y: 5 },
			{ x: 6,y: 4 }
		]
		
		this.falling = false
		this.fallSpd = 0.9
		this.ouch = false
	}
	
	Update()
	{
		if( Math.random() < this.partSpawnChance )
		{
			const spawnLoc = this.partSpawnLocs[Random.RangeI( 0,this.partSpawnLocs.length - 1 )]
			this.partHand.CreateParticle( { x: this.x + spawnLoc.x,y: this.y + spawnLoc.y },3,1 )
		}
		
		if( this.falling && this.y < this.tilemap.height * this.tilemap.tileSize )
		{
			this.y += this.fallSpd
		}
	}
	
	Draw( gfx )
	{
		gfx.DrawSprite( this.x,this.y,Spike.spr )
	}
	
	TryFall( obj )
	{
		if( obj.x > this.x && obj.x < this.x + this.size &&
			obj.y > this.y )
		{
			if( !this.falling ) Spike.fallSound.Play()
			this.falling = true
		}
	}
}

Spike.spr = new Sprite( "Images/Spike" )
Spike.fallSound = new Sound( "Audio/SpikeFall" )