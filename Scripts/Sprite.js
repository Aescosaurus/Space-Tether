class Sprite
{
	constructor( path )
	{
		this.img = new Image()
		this.img.src = path + ".png"
		this.width = -1
		this.height = -1
		
		const self = this
		
		this.img.onload = function()
		{
			self.width = self.img.width
			self.height = self.img.height
		}
	}
	
	Contains( x,y,sx,sy )
	{
		return( x <= sx + this.width && x >= sx &&
			y <= sy + this.height && y >= sy )
	}
}