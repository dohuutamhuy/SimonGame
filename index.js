// Color enum
class Color {
  static Green = new Color("green");
  static Red = new Color("red");
  static Yellow = new Color("yellow");
  static Blue = new Color("blue");

  constructor(name) {
    this.name = name;
  }

  static getColorWithID(id) {
    switch (id) {
      case 0:
        return Color.Green;
      case 1:
        return Color.Red;
      case 2:
        return Color.Yellow;
      case 3:
        return Color.Blue;
      default:
        break;
    }
  }

  static getColorWithName(name) {
    switch (name.toLowerCase()) {
      case "green":
        return Color.Green;
      case "red":
        return Color.Red;
      case "yellow":
        return Color.Yellow;
      case "blue":
        return Color.Blue;
      default:
        break;
    }
  }
}

class Button {
  constructor(jElement, color) {
    this.jElement = jElement;
    this.color = color;
    // Assign sound
    switch (color) {
      case Color.Red:
        this.sound = new Audio("sounds/red.mp3");
        break;
      case Color.Blue:
        this.sound = new Audio("sounds/blue.mp3");
        break;
      case Color.Green:
        this.sound = new Audio("sounds/green.mp3");
        break;
      case Color.Yellow:
        this.sound = new Audio("sounds/yellow.mp3");
        break;
      default:
        break;
    }
  }

  click() {
    var self = this;
    self.jElement.addClass("pressed");
    self.sound.cloneNode(false).play();
    setTimeout(function() {
      self.jElement.removeClass("pressed");
    }, 100);
  }
}

class Pattern {
  static pattern = [];
  // Generate an array of pattern has "num" as length
  static generatePattern(num) {
    Pattern.pattern = [];
    for (let i = 0; i < num; i++) {
      Pattern.pattern.push(Color.getColorWithID(Math.floor(Math.random() * 4)));
    }
  }

  static get() {
    return Pattern.pattern;
  }
}

class Answer {
  static answers = [];
  static clear() {
    Answer.answers = [];
  }
  // We only need to add so far
  static add(answer) {
    Answer.answers.push(answer);
  }

  // Return true or false
  static isWrong(pattern) {
    //case 1: answer.length < pattern.length
    if (Answer.answers.length < pattern.length) {
      for (let i = 0; i < Answer.answers.length; i++) {
        if (Answer.answers[i] != pattern[i]) {
          return true;
        }
      }
      return false;
    } else {
    //case 2: answer.length >= pattern.length
      for (let i = 0; i < pattern.length; i++) {
        if (Answer.answers[i] != pattern[i]) {
          return true;
        }
      }
      return false;
    }
  }
}

class GameController {
  constructor() {
    this.buttons = this.setupButton();
    this.level = 1;
    this.gameState = 0; // 0 for not started, 1 is running
  }

  setupButton() {
    let gameController = this;
    let resArray = [];
    $(".btn").each(function() {
        var eachBtn = $(this);
        let color =  Color.getColorWithName(eachBtn.attr("id"));
        let button = new Button(eachBtn, color);
        resArray.push(button);
        eachBtn.click(function() {
          if (gameController.gameState == 1) {
            button.click();
            //log the answer here
            Answer.add(button.color);
            gameController.checkAnswer(Pattern.get());
          }
        });
    });
    return resArray;
  }

  start() {
    if (this.gameState == 0 || this.gameState == 2) {
      this.gameState = 1;
      this.prepNewLevel();
    }
  }

  prepNewLevel() {
    // Show current level
    $("#level-title").text("Level " + this.level);
    // Generate pattern
    Pattern.generatePattern(this.level);
    // Clear answer
    Answer.clear();
    // Run Pattern
    this.runPattern(Pattern.get());
  }

  runPattern(pattern) {
    let red = null;
    let green = null;
    let blue = null;
    let yellow = null;
    for (let i = 0; i < this.buttons.length; i++) {
      switch(this.buttons[i].color) {
        case Color.Red:
          red = this.buttons[i];
          break;
        case Color.Green:
          green = this.buttons[i];
          break;
        case Color.Blue:
          blue = this.buttons[i];
          break;
        case Color.Yellow:
          yellow = this.buttons[i];
          break;
      }
    }
    let timeout = 500;
    for (let i = 0; i < pattern.length; i++) {
      switch(pattern[i]) {
        case Color.Red:
          setTimeout(function() {
            red.click();
          }, timeout);
          break;
        case Color.Green:
          setTimeout(function() {
            green.click();
          }, timeout);
          break;
        case Color.Blue:
          setTimeout(function() {
            blue.click();
          }, timeout);
          break;
        case Color.Yellow:
          setTimeout(function() {
            yellow.click();
          }, timeout);
          break;
        default:
          break;
      }
      timeout += 500;
    }
  }

  gameOver() {
    this.gameState = 2;
    this.level = 1;
    // Update text
    $("body").addClass("game-over");
    $("#level-title").text("Game Over, Press Any Key to Restart");
    setTimeout(function () {
      $("body").removeClass("game-over");
    }, 100);
  }

  nextLevel() {
    this.level++;
    this.prepNewLevel();
  }

  checkAnswer(pattern) {
    // If the answer is not wrong until end of pattern
    // Move to next level
    if (this.gameState == 1) {
      if (Answer.isWrong(pattern)) {
        // reset the game
        this.gameOver();
        return;
      }
      if (Answer.answers.length == pattern.length) {
        // move to next level;
        this.nextLevel();
      }
    }
  }
}


function main() {
  // Generate list of pattern to follow
  // let pattern = generatePattern(2);
  // for (let i = 0; i < pattern.length; i++) {
  //   console.log(Color.getColorWithID(pattern[i]).name);
  // }

  Pattern.generatePattern(5);
  let game = new GameController();
  $(document).keydown(function() {
    game.start();
  })
}

main()
