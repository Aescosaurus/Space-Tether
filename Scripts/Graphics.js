class Graphics
{
	constructor()
	{
		this.canv = document.getElementById( "canv" )
		this.ctx = this.canv.getContext( "2d" )
		
		this.ctx.imageSmoothingEnabled = false
		this.ctx.mozImageSmoothingEnabled = false
		
		const scale = 7.5
		this.scale = scale
		
		this.ctx.scale( scale,scale )
		
		this.scrWidth = this.canv.width / scale
		this.scrHeight = this.canv.height / scale
		
		Graphics.screenHeight = this.scrHeight
	}
	
	DrawRect( x,y,width,height,color )
	{
		this.ctx.fillStyle = color
		this.ctx.fillRect( x,y,width,height )
	}
	
	DrawRectDim( x1,y1,x2,y2,color )
	{
		// if( x2 > x1 )
		// {
		// 	const temp = x2
		// 	x2 = x1
		// 	x1 = temp
		// }
		// if( y2 > y1 )
		// {
		// 	const temp = y2
		// 	y2 = y1
		// 	y1 = temp
		// }
		
		const width = x2 - x1
		const height = y2 - y1
		this.DrawRect( x1,y1,width,height,color )
	}
	
	DrawCircle( x,y,radius,color )
	{
		this.ctx.strokeStyle = color
		this.ctx.beginPath()
		this.ctx.arc( x,y,radius,0,2 * Math.PI )
		this.ctx.stroke()
	}
	
	DrawSprite( x,y,sprite )
	{
		this.ctx.drawImage( sprite.img,Math.round( x ),Math.round( y ) )
	}
	
	DrawSpriteScaled( x,y,width,height,sprite )
	{
		this.ctx.drawImage( sprite.img,Math.round( x ),Math.round( y ),
			Math.round( width ),Math.round( height ) )
	}
}