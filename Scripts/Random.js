class Random
{
	
}

Random.Range = function( min,max )
{
	return( ( Math.random() * ( max - min ) ) + min )
}

Random.RangeI = function( min,max )
{
	return( Math.floor( Math.random() * ( 1 + max - min ) ) + min )
}