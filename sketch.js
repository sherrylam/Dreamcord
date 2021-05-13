/***********************************************************************************
  Dreamcord
  by Sherry Lam

  Uses the p5.2DAdventure.js class 
  
------------------------------------------------------------------------------------
	To use:
	Add this line to the index.html

  <script src="p5.2DAdventure.js"></script>
***********************************************************************************/

// adventure manager global  
var adventureManager;

// p5.play
var playerSprite;
var playerAnimation;

// Clickables: the manager class
var clickablesManager;    // the manager class
var clickables;           // an array of clickable objects


// indexes into the clickable array (constants) 
const cl_startScenario = 0;
const cl_Start_A = 1;
const cl_Start_B = 2;
const cl_DreamCorps_A = 3;
const cl_DreamCorps_B = 4;
const cl_Government_A = 5;
const cl_Government_B = 6;
/*const cl_DreamCorps_IgnoreThem = 7;
const cl_Government_CutTheArts = 8;
const cl_Government_CutTransportation = 9;
const cl_Government_CutCityWages = 10;
const cl_Government_CutParks = 11;*/


// anger emojis
var angerImage;   // anger emoji
var maxAnger = 5;

var logoImage;

// character arrays
var characterImages = [];   // array of character images, keep global for future expansion
var characters = [];        // array of charactes

// characters
const poor = 0;
const rich = 1;
const dreamcorps = 2;
const government = 3;
const naturalist = 4;

// room indices - look at adventureManager
const startScreen = 3;
const dreamCorpsScreen = 4;
const governmentScreen = 5;
const screen4 = 6;
const screen5 = 7;
const screen6 = 8;
const screen7 = 9;
const screen8 = 10;
const screen9 = 11;
const screen10 = 12;
const screen11 = 13;
const perfectending = 14;
const anarchyending = 15;
const asleepending = 16;
const nodreamsending = 17;
const govcontrolending = 18;

let headlineFont;
let bodyFont;


// Allocate Adventure Manager with states table and interaction tables
function preload() {

  headlineFont = loadFont('fonts/FogCityGothic-Wide.otf');
  bodyFont = loadFont('fonts/FogCityGothic-Regular.otf');

  // load all images
  angerImage = loadImage("assets/anger_emoji.png");
  logoImage = loadImage("assets/logo.png");
  
  allocateCharacters();

  clickablesManager = new ClickableManager('data/clickableLayout.csv');
  adventureManager = new AdventureManager('data/adventureStates.csv', 'data/interactionTable.csv', 'data/clickableLayout.csv');
}

// Setup the adventure manager
function setup() {
  createCanvas(1000, 800);

  // setup the clickables = this will allocate the array
  clickables = clickablesManager.setup();

  // this is optional but will manage turning visibility of buttons on/off
  // based on the state name in the clickableLayout
  adventureManager.setClickableManager(clickablesManager);

  // This will load the images, go through state and interation tables, etc
  adventureManager.setup();

  // load all text screens
  loadAllText();

  // call OUR function to setup additional information about the p5.clickables
  // that are not in the array 
  setupClickables(); 

  fs = fullscreen();
}

// Adventure manager handles it all!
function draw() {
  // draws background rooms and handles movement from one to another
  adventureManager.draw();

 // drawCharacters();

  // don't draw them on first few screens
  if( adventureManager.getStateName() === "Splash" ||
      adventureManager.getStateName() === "Instructions" ||
      adventureManager.getStateName() === "Characters" ) {
    ;
  }
  else {
    drawCharacters();
  }
  
  // draw the p5.clickables, in front of the mazes but behind the sprites 
  clickablesManager.draw();
}

// pass to adventure manager, this do the draw / undraw events
function keyPressed() {
  // toggle fullscreen mode
  if( key === 'f') {
    fs = fullscreen();
    fullscreen(!fs);
    return;
  }

  // dispatch all keys to adventure manager
  adventureManager.keyPressed(key); 
}

function mouseReleased() {
  // dispatch all mouse events to adventure manager
  adventureManager.mouseReleased();
}

function drawCharacters() {
  for( let i = 0; i < characters.length; i++ ) {
    characters[i].draw();
  }
}

//-------------- CLICKABLE CODE  ---------------//

function setupClickables() {
  // All clickables to have same effects
  for( let i = 0; i < clickables.length; i++ ) {
    clickables[i].onHover = clickableButtonHover;
    clickables[i].onOutside = clickableButtonOnOutside;    
  }

  // we do specific callbacks for each clickable
  clickables[0].onPress = clickableButtonPressed;
  clickables[1].onPress = clStart_A;
  clickables[2].onPress = clStart_B;
  clickables[3].onPress = clDreamCorps_A;
  clickables[4].onPress = clDreamCorps_A;
  clickables[5].onPress = clGovernment_A;
  clickables[6].onPress = clGovernment_A;
  /*clickables[7].onPress = clIgnoreThem;
  clickables[8].onPress = clCutArts;
  clickables[9].onPress = clCutTransportation;
  clickables[10].onPress = clCutCityWages;
  clickables[11].onPress = clCutParks;*/
}

// tint when mouse is over
clickableButtonHover = function () {
  this.color = "#FFFFFF40";
  this.noTint = false;
  //this.tint = "#FF0000";
  this.strokeWeight = 0;
  this.textColor = "#FFFFFF";
}

// color a light gray if off
clickableButtonOnOutside = function () {
  // backto our gray color
  this.color = "#FFFFFFBF";
  this.strokeWeight = 0;
  this.textFont = "Roboto Slab";
  this.textSize = 30;
  this.textColor = "#000000";
}

clickableButtonPressed = function() {
  adventureManager.clickablePressed(this.name);
} 

//-- specific button callbacks: these will add or subtrack anger, then
//-- pass the clickable pressed to the adventure manager, which changes the
//-- state. A more elegant solution would be to use a table for all of these values
clStart_A = function() {
    characters[poor].addAnger(2);
    characters[government].subAnger(1);
    characters[dreamcorps].addAnger(1);
    adventureManager.clickablePressed(this.name);
}

clStart_B = function() {
  characters[rich].addAnger(1);
  characters[government].subAnger(1);
  characters[poor].subAnger(2);
  adventureManager.clickablePressed(this.name);
}

clDreamCorps_A = function() {
  characters[government].addAnger(1);
  characters[naturalist].addAnger(1);
  characters[poor].subAnger(1);
  adventureManager.clickablePressed(this.name);
}

clGovernment_A = function() {
  characters[government].addAnger(2);
  characters[poor].addAnger(1);
  characters[dreamcorps].addAnger(1);
  adventureManager.clickablePressed(this.name);
}

clIgnoreThem = function() {
  characters[government].addAnger(1);
  characters[naturalist].addAnger(1);
  characters[dreamcorps].addAnger(1);
  adventureManager.clickablePressed(this.name);
}

clCutArts = function() {
  characters[naturalist].addAnger(2);
  characters[rich].addAnger(1);
  adventureManager.clickablePressed(this.name);
}

clCutTransportation = function() {
  characters[naturalist].addAnger(3);
  characters[rich].addAnger(1);
  adventureManager.clickablePressed(this.name);
}

clCutCityWages = function() {
  characters[rich].addAnger(2);
  characters[dreamcorps].addAnger(2);
  adventureManager.clickablePressed(this.name);
}

clCutParks = function() {
  characters[rich].addAnger(1);
  characters[naturalist].addAnger(2);
  adventureManager.clickablePressed(this.name);
}





//-------------- CHARACTERS -------------//
function allocateCharacters() {
  // load the images first
  characterImages[poor] = loadImage("assets/poor.png");
  characterImages[rich] = loadImage("assets/rich.png");
  characterImages[dreamcorps] = loadImage("assets/dreamcorps.png");
  characterImages[government] = loadImage("assets/government.png");
  characterImages[naturalist] = loadImage("assets/naturalist.png");

  for( let i = 0; i < characterImages.length; i++ ) {
    characters[i] = new Character();
    //characters[i].setup( characterImages[i], 50 + (400 * parseInt(i/2)), 120 + (i%2 * 120));
    characters[i].setup( characterImages[i], 50, 225 + (100 * i));
  }

  // default anger is zero, set up some anger values
  //characters[dreamcorps].addAnger(1);
  //characters[government].addAnger(2);
  //characters[naturalist].addAnger(1);
}

class Character {
  constructor() {
    this.image = null;
    this.x = width/2;
    this.y = width/2;
  }

  setup(img, x, y) {
    this.image = img;
    this.x = x;
    this.y = y;
    this.anger = 0;
  }

  draw() {
    if( this.image ) {
      push();
      // draw the character icon
      //imageMode(CENTER);
      this.image.resize(0, 60);
      image( this.image, this.x, this.y );

      // draw anger emojis
      /*for( let i = 0; i < this.anger; i++ ) {
        image(angerImage, this.x + 70 + (i*40), this.y +10 );
      }*/

      pop();
    }
  }

  getAnger() {
    return this.anger;
  }

  // add, check for max overflow
  addAnger(amt) {
    this.anger += amt;
    if( this.anger > maxAnger ) {
      this.anger = maxAnger;
    }

  }

  // sub, check for below zero
  subAnger(amt) {
    this.anger -= amt;
    if( this.anger < 0 ) {
      this.anger = 0;
    }
  }
}

//-------------- ROOMS --------------//

// hard-coded text for all the rooms
// the elegant way would be to load from an array
function loadAllText() {
  // go through all states and setup text
  // ONLY call if these are ScenarioRoom
  
// copy the array reference from adventure manager so that code is cleajer
  scenarioRooms = adventureManager.states;

  scenarioRooms[startScreen].setText("Who gets ownership?", "Scientists need the help of companies so that Dreamcord can successfully be advertised and distributed to the consumers. Should they... \n\nA. Sell to the Private Dream corps. They will develop the technology often. \nB. Sell to the Government. They want to take advantage of this new technology.");
  scenarioRooms[dreamCorpsScreen].setText("Equal Dream Quality?", "The poor oneiroophiles are complaining that they don’t have high quality dreams like the richer oneirophiles. Should the Corps...\n\nA. Make dreams have high quality regardless of economic status\nB. Nah, reject equal dream quality.");
  scenarioRooms[governmentScreen].setText("Government Control?", "The government now has complete control. Should they…\n\nA. Force the Private Dream corps to sell all their user data\nB. Pass laws to force everyone to record dreams");
  scenarioRooms[screen4].setText("New Device?", "The Dream Corps came out with a new device, Dreampod, so that you can record dreams that include anybody in your DreamPod. Do you...\n\nA. Allow the distribution\nB. Nah, recording your own dream is enough");
  scenarioRooms[screen5].setText("Angry...", "Anger is rising in the poor oneirophiles. They are ready to revolt anytime now. Naturalists already have been lobbying against Dreamcord. Do you...\n\nA. Continue to reject whatever the poor oneirophiles wants.\nB. Finally listen to what the Naturalists want.");
  scenarioRooms[screen6].setText("Data Access", "Since the Government now has access to everyone's data, they want to do multiple things. Should they...\n\nA. Use the data to predict any potential thoughts and control the population\nB. Force everyone to record all dreams");
  scenarioRooms[screen7].setText("What do?", "Everybody is concerned on the privacy of their recorded dreams. The Government reassures that they will not do anything with these dreams. Will the...\n\nA. Oneirophiles start a market on drugs that will induce sleep or stay awake\nB. Government start to regulate dreams.");
  scenarioRooms[screen8].setText("Dreamcord together", "Oneirophiles love the addition . They are able to record dreams together!\n\nA. They love it so much that they became addicted to sleeping pills.\nB. They use it in a healthy way.");
  scenarioRooms[screen9].setText("Concerned Naturalists","Naturalists are protesting against Dreamcord because they think it is unnatural to record something that naturally goes away. Do you...\n\nA. Follow what they want\nB. Nah Naturalists talk wack. Continue recording dreams");
  scenarioRooms[screen10].setText("Protection?","Rich Oneirophiles want to use their abundant amount of money to protect themselves. Should they...\n\nA. Give money to Government to protect their privacy.\nB. Start a market of sleeping drugs to make everyone else addicted to dreaming.");
  scenarioRooms[screen11].setText("Drugs?","With the help of big money from the Rich Oneirophiles, the government lost control of the abundant use of drugs. Will people get addicted to...\n\nA. Sleep. Dreaming is the best.\nB. Staying Awake. Everybody is paranoid that the Government will use their dreams against them.");
  scenarioRooms[perfectending].setText("No dreaming problems","We have found ways to equally give quality dreams. Everyone is happy and can actually use these dreams to fuel their creativity.");
  scenarioRooms[anarchyending].setText("Anarchy","Lower class oneirophile are revolting because it is unfair to charge people for high quality dreams. The government wants to stop the protests and attacks. The high class oneirophiles want to preserve elitism of being the ones that can afford high quality dreams.");
  scenarioRooms[asleepending].setText("Everyone is asleep","Everyone is asleep in their dreamworld and in the dreampods that the Private Dream Corps made. They clearly got huge earnings.");
  scenarioRooms[nodreamsending].setText("Dreamcord is Eradicated","Naturalists are super happy that dreams are not recorded and there is privacy in the consciousness.");
  scenarioRooms[govcontrolending].setText("Total Government Control","The government decided to use the data of everyone’s recorded dreams to figure out the potential positive or negative impacts of people’s consciousness. ");

}

//-------------- SUBCLASSES / YOUR DRAW CODE CAN GO HERE ---------------//

// Instructions screen has a backgrounnd image, loaded from the adventureStates table
// It is sublcassed from PNGRoom, which means all the loading, unloading and drawing of that
// class can be used. We call super() to call the super class's function as needed
class ScenarioRoom extends PNGRoom {
  // Constructor gets calle with the new keyword, when upon constructor for the adventure manager in preload()
  constructor() {
    super();    // call super-class constructor to initialize variables in PNGRoom

    this.titleText = "";
    this.bodyText = "";
  }

  // should be called for each room, after adventureManager allocates
  setText( titleText, bodyText ) {
    this.titleText = titleText;
    this.bodyText = bodyText;
    this.drawY = 225;
    this.drawX = 225;
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
    draw() {
      // this calls PNGRoom.draw()
      super.draw();
      
      push();

      // title box
      fill(0,0,0,64);
      noStroke();
      rect(200, 50, 750, 100, 10);

      // title text
      fill(255);
      textAlign(CENTER);
      textFont('Roboto Slab');
      textSize(60);

      text(this.titleText, 575 , 125);
    
      // body box
      fill(0,0,0,64);
      noStroke();
      rect(200, 200, 750, 550, 10);

      // body text
      fill(255);
      textAlign(LEFT);
      textFont('Roboto Slab');
      textSize(30);
      textLeading(40);

      // Draw text in a box
      text(this.bodyText, this.drawX , this.drawY, 700, 400 );

      //logo
      image(logoImage, 45, 45);
      logoImage.resize(105,0);
      
      pop();
    }
}

class InstructionRoom extends PNGRoom {
  // Constructor gets calle with the new keyword, when upon constructor for the adventure manager in preload()
  constructor() {
    super();    // call super-class constructor to initialize variables in PNGRoom
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
    draw() {
      // this calls PNGRoom.draw()
      super.draw();
      
      push();

      // title box
      fill(0,0,0,64);
      noStroke();
      rect(50, 50, 900, 100, 10);

      // title text
      fill(255);
      textAlign(CENTER);
      textFont('Roboto Slab');
      textSize(60);

      text("Instructions", 500 , 125);
    
      // body box
      fill(0,0,0,64);
      noStroke();
      rect(50, 200, 900, 550, 10);

      // body text
      fill(255);
      textAlign(LEFT);
      textFont('Roboto Slab');
      textSize(30);
      textLeading(40);

      // Draw text in a box
      text("The year is 20XX. Scientists have discovered a way to record your own dreams! The device is a head band and should be put on before you go to sleep. Your recorded dreams are then automatically uploaded to the cloud where you will be able to access the recordings anywhere on your personal device.\nYou get to control the development of this technology based on your choices. Be careful to not anger certain groups too much!", 75 , 225, 850, 400 );
      
      pop();
    }
}

class CharactersRoom extends PNGRoom {
  // Constructor gets calle with the new keyword, when upon constructor for the adventure manager in preload()
  constructor() {
    super();    // call super-class constructor to initialize variables in PNGRoom
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
    draw() {
      // this calls PNGRoom.draw()
      super.draw();
      
      push();

      // title box
      fill(0,0,0,64);
      noStroke();
      rect(50, 50, 900, 100, 10);

      // title text
      fill(255);
      textAlign(CENTER);
      textFont('Roboto Slab');
      textSize(60);

      text("Characters", 500 , 125);
    
      // body box
      fill(0,0,0,64);
      noStroke();
      for (var i = 0; i < 2; i++) {
        rect(212 + (325*i), 200, 250, 250, 10);
      }
      for (var i = 0; i < 3; i++) {
        rect(50 + (325*i), 500, 250, 250, 10);
      }

      // body text
      fill(255);
      textAlign(LEFT);
      textFont('Roboto Slab');
      textSize(20);
      textLeading(26);

      // Draw text in a box
      text("Lower Class Oneirophile:\nPoor dream lovers. They make do best on what they have to enjoy their recorded dreams.", 225 , 300, 250, 190 );
      text("Higher Class Oneirophile:\nRich dream lovers. They have the money to do whatever they want for their dreams.", 550 , 300, 250, 190 );
      text("Private Dream Corps:\nThese corporations can make a lot of money on this amazing tech even if there are angry people.", 62 , 600, 250, 190 );
      text("Government:\nThey love this new technology and want to find ways to *totally* make a positive change for everyone.", 387 , 600, 250, 190 );
      text("Naturalist:\nThey want to go back to the way dreams were dreamt. Natural and often forgotten.", 712 , 600, 250, 190 );

      //character 1
      imageMode(CENTER);
      characterImages[poor].resize(75,0);
      image(characterImages[poor], 337, 250);
      characterImages[rich].resize(75,0);
      image(characterImages[rich], 663, 250);
      characterImages[dreamcorps].resize(75,0);
      image(characterImages[dreamcorps], 175, 550);
      characterImages[government].resize(75,0);
      image(characterImages[government], 500, 550);
      characterImages[naturalist].resize(75,0);
      image(characterImages[naturalist], 825, 550);

      pop();
    }
}