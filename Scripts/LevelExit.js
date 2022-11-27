class LevelExit
{
	constructor( tilemap,particleHand )
	{
		this.x = tilemap.exitLoc.x * tilemap.tileSize + tilemap.tileSize / 2
		this.y = tilemap.exitLoc.y * tilemap.tileSize + tilemap.tileSize / 2
		
		this.particleSpawnChance = 0.9
		
		this.tilemap = tilemap
		this.particleHand = particleHand
	}
	
	Update()
	{
		if( Math.random() < this.particleSpawnChance )
		{
			this.particleHand.CreateParticle( this,0,1 )
		}
	}
	
	Reset()
	{
		this.x = this.tilemap.exitLoc.x * this.tilemap.tileSize + this.tilemap.tileSize / 2
		this.y = this.tilemap.exitLoc.y * this.tilemap.tileSize + this.tilemap.tileSize / 2
	}
}

LevelExit.winSound = new Sound( "Audio/LevelWin" )