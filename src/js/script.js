var cryptoCurrency, availableTags = [];

$( document ).ready( function() {
	var hasStorage = typeof( Storage ) !== 'undefined';
	
	jQuery( '#localStorageNo' ).toggle( !hasStorage );
	jQuery( '#localStorageYes' ).toggle( hasStorage );
	
	if( hasStorage ) {
		var buildPortfolio = function() {
			var i, str = '', key, value;
			for( i = 0, l = localStorage.length; i < l; i += 1 ) {

				key = localStorage.key(i);
				value = localStorage[key];
				str += '<div>' + key + ' => ' + value + '</div>';

			}
			
			$( '#portfolioContainer' ).empty().html( str );
		};
		
		$.ajax( {
			url: 'https://api.coinmarketcap.com/v1/ticker/',
			dataType: 'json',
			success: function( results ) {
				var i, l;
				
				cryptoCurrency = results;
				
				for( i = 0, l = results.length; i < l; i += 1 ) {
					availableTags.push( results[ i ].id );
				}
			}
		} );
		
		$( '#addCoin' ).autocomplete( {
		  source: availableTags
		} );
		
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
		
		$( '#addAmount' ).on( 'keydown keyup keypress', function() {
			var find = findCryptoCurrency( $( '#addCoin' ).val() ),
				val, buildReview, str;
				
			if( find !== false ) {
				val = parseFloat( $( this ).val() );
				
				buildReview = $( '#buildReview' ).empty();
				
				if( val > 0 ) {
					str = 'Add Value: $' + ( val * parseFloat( find.price_usd ) ).toFixed( 2 );
					str += '<br />Cost Basis: x'
					str += '<br />Gain/Loss: y'
					buildReview.html( str );
				}
			}
		} );
		
		$( '#addToPortfolioBtn' ).click( function() {
			var coin = $( '#addCoin' ).val(),
				amount = parseFloat( $( '#addAmount' ).val() ),
				costBasis = parseFloat( $( '#addCostBasis' ).val() );
				
			if( coin && amount && costBasis ) {
				localStorage.setItem( coin, amount );
				localStorage.setItem( coin + '-costBasis', costBasis );
				$( '#addCoin, #addAmount, #addCostBasis' ).val( '' );
			} else {
				alert( 'Coin, amount, and cost basis required.' )
			}
			
			buildPortfolio();
		} );
		
		$( '#clearPortfolioBtn' ).click( function() {
			if( confirm( 'Reset portfolio?' ) ) {
				localStorage.clear();
				$( '#buildReview' ).empty();
				buildPortfolio();
			}
		} );
		
		buildPortfolio();
	}
} );