var Card = function(number, suit) {
    var cardSuit = suit,
        cardNumber = number;
    
    this.getSuit = function() {
        return cardSuit;
    };

    this.getNumber = function() {
        return cardNumber;
    };

    this.getCard = function() {
        return [cardNumber, cardSuit];
    };
};

var Deck = function() {
    var deck = [],
        currentCard, currentSuit, i;

    for (i = 0; i < 4; i++) {
        for (j = 0; j < 13; j++) {
            currentCard = new Card(j, i);
            deck.push(currentCard.getCard());
        }
    }

    this.shuffle = function() {
        var deckLength = deck.length,
            i = deckLength,
            p, t;

        while (i--) {
            p = parseInt(Math.random() * deckLength, 10);
            t = deck[i];
            deck[i] = deck[p];
            deck[p] = t;
        }
    };

    this.dealCard = function() {
        return deck.pop();
    };

    this.getDeck = function() {
        return deck;
    };
};

var Hand = function(handDeck) {
    var deck = handDeck,
        hand = [],
        i, j;

    for (i = 0; i < 13; i++) {
        hand.push(deck.dealCard());
    }

    var Comparator = function(a, b) {
        if (a[0] < b[0]) {
            return -1;
        }
        if (a[0] > b[0]) { 
            return 1;
        }
        return 0;
    };

    hand.sort(Comparator);

    this.getStraights = function() {
        var straightCounter = 0,
            straights = [],
            straightArray = [],
            straightIncrement;

        for (i = 0; i < 13; i++) {
            straightIncrement = 1;
            straights = [hand[i]];
            for (j = 0; j < 13; j++) {
                if (hand[j][0] === hand[i][0] + straightIncrement) {
                    straights.push(hand[j]);
                    straightIncrement++;
                }
            }
            if (straights.length >= 5) {
                straightArray.push(straights);
                i = i + straights.length - 1;
            }
        }
        return straightArray;
    };

    this.getFlushes = function() {
        var flushCounter = 0,
            flushes = [],
            flushArray = [];

        for (i = 0; i < 4; i++) {
            flushes = [];
            for (j = 0; j < 13; j++) {
                if (hand[j][1] === i) {
                    flushes.push(hand[j]);
                }
            }
            if (flushes.length >= 5) {
                flushArray.push(flushes);
            }
        }
        return flushArray;
    };

    this.getPairs = function() {
        var pairCounter = 0,
            pairs = [],
            pairArray = [];
        for (i = 0; i < 13; i++) {
            pairs = [];
            for (j = 0; j < 13; j++) {
                if (hand[j][0] === i) {
                    pairs.push(hand[j]);
                }
            }
            if (pairs.length >= 2) {
                pairArray.push(pairs);
            }
        }
        return pairArray;
    };

    this.getHand = function() {
        return hand;
    };
};

// 74 x 99, 950 x 392
var DHTMLSprite = function(params) {
    var width = params.width;
        height = params.height;
        imagesWidth = params.imagesWidth,
        $element = params.$drawTarget.append('<div/>').find(':last'),
        elemStyle = $element[0].style,
        mathFloor = Math.floor;
        
    $element.css({
        position: 'absolute',
        width: width,
        height: height,
        backgroundImage: 'url(' + params.images + ')'
    });

    var that = {
        draw: function(x, y) {
            elemStyle.left = x + 'px';
            elemStyle.top = y + 'px';
        },
        changeImage: function (index) {
            index *= width;
            var vOffset = - mathFloor(index / imagesWidth) * height;
            var hOffset = - index % imagesWidth;
            elemStyle.backgroundPosition = hOffset + 'px ' + vOffset + 'px';
        },
        show: function() {
            elemStyle.display = 'block';
        },
        hide: function() {
            elemStyle.display = 'none';
        },
        destroy: function() {
            $element.remove();
        }
    };

    return that;
};

var reRun = function() {
    document.getElementById("hand").innerHTML = "";
    document.getElementById("straights").innerHTML = "";
    document.getElementById("flushes").innerHTML = "";
    document.getElementById("pairs").innerHTML = "";
    
    run();
}
    
var run = function() {    
    var deck = new Deck();
    deck.shuffle();
    var hand = new Hand(deck),
        i,
        divhand = document.getElementById("hand"),
        divstraights = document.getElementById("straights"),
        divflushes = document.getElementById("flushes"),
        divpairs = document.getElementById("pairs");
        
    
    var params = {
        images: 'img/deck_sprites.png',
        imagesWidth: 936,
        width: 72,
        height: 96
    };

    var sprites = [];
    var currentDiv,
        currentElement,
        straightSprites = [];

    for (i = 1; i <= 13; i++) {

        currentElement = document.createElement('div');
        currentElement.setAttribute("id", "draw-target" + i);
        currentElement.setAttribute("class", "draw-target-hand");
        divhand.appendChild(currentElement);

        params.$drawTarget = $('#draw-target' + i);
        sprites.push(DHTMLSprite(params));
        sprites[i-1].changeImage(hand.getHand()[i-1][0] + hand.getHand()[i-1][1] * 13);
        sprites[i-1].draw(0, 0);
    }
    
    var straights = hand.getStraights();

    if (straights.length > 0) {
        for (var j = 0; j < straights.length; j++) {
            for (i = 1; i <= straights[j].length; i++) {
                currentElement = document.createElement('div');
                currentElement.setAttribute("class", "draw-target-straights " + "draw-target-straights" + j + "-" + i);
                divstraights.appendChild(currentElement);

                params.$drawTarget = $('.draw-target-straights' + j + "-" + i);
                straightSprites.push(DHTMLSprite(params));
                straightSprites[i-1].changeImage(straights[j][i-1][0] + straights[j][i-1][1] * 13);
                straightSprites[i-1].draw(0, 0);

                if (i === 1) {
                    var classnamesearch = ".draw-target-straights" + j + "-" + i;
                    $(classnamesearch).addClass("clear-left");
                }
            }
        }
    }

    var flushes = hand.getFlushes(),
        flushSprites = [];

    if (flushes.length > 0) {
        for (var j = 0; j < flushes.length; j++) {
            for (i = 1; i <= flushes[j].length; i++) {
                currentElement = document.createElement('div');
                currentElement.setAttribute("class", "draw-target-flushes " + "draw-target-flushes" + j + "-" + i);
                divflushes.appendChild(currentElement);

                params.$drawTarget = $('.draw-target-flushes' + j + "-" + i);
                flushSprites.push(DHTMLSprite(params));
                flushSprites[i-1].changeImage(flushes[j][i-1][0] + flushes[j][i-1][1] * 13);
                flushSprites[i-1].draw(0, 0);

                if (i === 1) {
                    var classnamesearch = ".draw-target-flushes" + j + "-" + i;
                    $(classnamesearch).addClass("clear-left");
                }
            }
        }
    }


    var pairs = hand.getPairs(),
        pairSprites = [];

    if (pairs.length > 0) {
        for (var j = 0; j < pairs.length; j++) {
            for (i = 1; i <= pairs[j].length; i++) {
                currentElement = document.createElement('div');
                currentElement.setAttribute("class", "draw-target-pairs " + "draw-target-pairs" + j + "-" + i);
                divpairs.appendChild(currentElement);

                params.$drawTarget = $('.draw-target-pairs' + j + "-" + i);
                pairSprites.push(DHTMLSprite(params));
                pairSprites[i-1].changeImage(pairs[j][i-1][0] + pairs[j][i-1][1] * 13);
                pairSprites[i-1].draw(0, 0);

                if (i === 1) {
                    var classnamesearch = ".draw-target-pairs" + j + "-" + i;
                    $(classnamesearch).addClass("clear-left");
                }
            }
        }
    }
        /*
    for (i = 0; i < pairs.length; i++) {
        divpairs.appendChild(document.createTextNode(pairs[i]));
    }
    */

};

run();
