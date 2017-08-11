var cryptoCurrency, availableTags = [];

jQuery( document ).ready( function() {
	
	jQuery.ajax({
		url: 'https://api.coinmarketcap.com/v1/ticker/',
		dataType: 'json',
		success: function( results ) {
			var i, l;
			
			cryptoCurrency = results;
			
			for( i = 0, l = results.length; i < l; i += 1 ) {
				availableTags.push( results[ i ].id );
			}
		}
	});
	
	jQuery( '#addCoin' ).autocomplete({
      source: availableTags
    });
	
	var findCryptoCurrency = function( str ) {
		var i, l, ret = false;
		
		for( i = 0, l = cryptoCurrency.length; i < l; i += 1 ) {
			if( cryptoCurrency[ i ].id == str ) {
				ret = cryptoCurrency[ i ];
				break;
			}
		}
		
		return ret;
	};
	
	jQuery( '#addAmount' ).on( 'keydown keyup keypress', function() {
		var find = findCryptoCurrency( jQuery( '#addCoin' ).val() ),
			val, buildReview;
			
		if( find !== false ) {
			val = parseFloat( jQuery( this ).val() );
			
			buildReview = jQuery( '#buildReview' ).empty();
			
			if( val > 0 ) {
				buildReview.html("Add Value: $" + ( val * parseFloat( find.price_usd ) ).toFixed( 2 ) );
			}
		}
	} );
} );