/* 
 * SCAVECGRAPH WEB UI
 * README GOSPEL : https://stackoverflow.com/questions/1595611/how-to-properly-create-a-custom-object-in-javascript
 * Provides an API to interface with the Channel directly through javascript or trigger certain interaction 
 * like viewing a specific context by on click executions on an html element like <a onclick="scavecgraph-webui.viewContextById("context id");">context name</a>
 * scavecgraphWebui.viewContextById("context id"); 
 * scavecgraphWebui.bowseAloneContextById("context id"); 
 * scavecgraphWebui.searchContextByName("context id"); 
 * SPLASH PAGE EMBEDS A CHANNEL AND POSITIONS OTHER CONTENT REFERING TO IT
 */

function Shape(x, y) {
    this.x= x;
    this.y= y;
}

Shape.prototype.toString= function() {
    return 'Shape at '+this.x+', '+this.y;
};

function Circle(x, y, r) {
    Shape.call(this, x, y); // invoke the base class's constructor function to take co-ords
    this.r= r;
}
Circle.prototype= new Shape();

function SplashPage(channel){
    
}

function Channel(){
    
}