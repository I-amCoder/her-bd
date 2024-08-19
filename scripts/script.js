//-----------Var Inits--------------
canvas = document.getElementById("canvas");
ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
cx = ctx.canvas.width / 2;
cy = ctx.canvas.height / 2;

const RENDER_STATES = Object.freeze({
  counting: 0,
  counted: 1,
  wished: 2,
  message1_shown: 3,
  message2_shown: 4,
});
var CURRENT_STATE = RENDER_STATES.counting;

const audio = new Audio("/her-bd/media/countdown_wish.weba");
const audio2 = new Audio("/her-bd/media/hbd_sound.weba");

let confetti = [];
const confettiCount = 300;
const gravity = 0.5;
const terminalVelocity = 5;
const drag = 0.075;
const colors = [
  { front: "red", back: "darkred" },
  { front: "green", back: "darkgreen" },
  { front: "blue", back: "darkblue" },
  { front: "yellow", back: "darkyellow" },
  { front: "orange", back: "darkorange" },
  { front: "pink", back: "darkpink" },
  { front: "purple", back: "darkpurple" },
  { front: "turquoise", back: "darkturquoise" },
];

//-----------Functions--------------
resizeCanvas = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  cx = ctx.canvas.width / 2;
  cy = ctx.canvas.height / 2;
};

randomRange = (min, max) => Math.random() * (max - min) + min;

initConfetti = () => {
  for (let i = 0; i < confettiCount; i++) {
    confetti.push({
      color: colors[Math.floor(randomRange(0, colors.length))],
      dimensions: {
        x: randomRange(10, 20),
        y: randomRange(10, 30),
      },

      position: {
        x: randomRange(0, canvas.width),
        y: canvas.height - 1,
      },

      rotation: randomRange(0, 2 * Math.PI),
      scale: {
        x: 1,
        y: 1,
      },

      velocity: {
        x: randomRange(-25, 25),
        y: randomRange(0, -50),
      },
    });
  }
};

//---------Render-----------
render = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confetti.forEach((confetto, index) => {
    let width = confetto.dimensions.x * confetto.scale.x;
    let height = confetto.dimensions.y * confetto.scale.y;

    // Move canvas to position and rotate
    ctx.translate(confetto.position.x, confetto.position.y);
    ctx.rotate(confetto.rotation);

    // Apply forces to velocity
    confetto.velocity.x -= confetto.velocity.x * drag;
    confetto.velocity.y = Math.min(
      confetto.velocity.y + gravity,
      terminalVelocity
    );
    confetto.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

    // Set position
    confetto.position.x += confetto.velocity.x;
    confetto.position.y += confetto.velocity.y;

    // Delete confetti when out of frame
    if (confetto.position.y >= canvas.height) confetti.splice(index, 1);

    // Loop confetto x position
    if (confetto.position.x > canvas.width) confetto.position.x = 0;
    if (confetto.position.x < 0) confetto.position.x = canvas.width;

    // Spin confetto by scaling y
    confetto.scale.y = Math.cos(confetto.position.y * 0.1);
    ctx.fillStyle =
      confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;

    // Draw confetti
    ctx.fillRect(-width / 2, -height / 2, width, height);

    // Reset transform matrix
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  });

  window.requestAnimationFrame(render);
};

//----------Resize----------
window.addEventListener("resize", function () {
  resizeCanvas();
});

//------------Click------------
window.addEventListener("click", function () {
  initConfetti();
});

function countdown() {
  // Set the date we're counting down to
  const targetDate = new Date("Aug 18, 2024 19:11:00").getTime();
  const initialTimeLeftSeconds = targetDate - new Date().getTime();
  const currentNow = new Date();
  const alternativeDate = new Date(currentNow.getTime() + 11 * 1000);
  var audioPlayed = false;

  // Update the countdown every second
  const interval = setInterval(function () {
    // Get the current date and time
    const now = new Date().getTime();

    // Calculate the time difference
    var timeLeft = targetDate - now;
    if (initialTimeLeftSeconds <= 10 * 1000) {
      audio.play();
      audioPlayed = true;
      timeLeft = alternativeDate - now;
    }

    // Time calculations for days, hours, minutes, and seconds
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    // Display the result in an element with id="countdown"
    document.getElementById("message").innerHTML =
      days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

    // If the countdown is over, display some text
    if (Math.floor(timeLeft / 1000) === 10 && !audioPlayed) {
      audio.play();
    }

    if (timeLeft < 0) {
      clearInterval(interval);
      renderNextState(RENDER_STATES.counted);
    }
  }, 1000);
}

document
  .getElementById("permission-button")
  .addEventListener("click", function () {
    process();
  });

function process() {
  document.getElementById("permission").remove();
  document.getElementById("main").style.display = "block";
  const element = document.documentElement;

  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    // Firefox
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    // Chrome, Safari, and Opera
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    // IE/Edge
    element.msRequestFullscreen();
  }
  countdown();
}

function renderNextState(state) {
  console.log(state);

  CURRENT_STATE = state;
  switch (CURRENT_STATE) {
    case RENDER_STATES.counted:
      showHappyBirthDay();
      break;
    case RENDER_STATES.wished:
      showMessage1();
      break;
    case RENDER_STATES.message1_shown:
      showMessage2();
      break;
    default:
      break;
  }
}

function showHappyBirthDay() {
  document.getElementById("message").innerHTML = "Happy Birthday";
  audio2.play();
  var count = 0;
  const interval1 = setInterval(() => {
    count++;
    if (count < 10) initConfetti();
    else clearInterval(interval1);
  }, 200);

  const interval2 = setInterval(() => {
    initConfetti();
  }, 2000);

  setTimeout(() => {
    clearInterval(interval2);
    renderNextState(RENDER_STATES.wished);
  }, 10000);

  render();
}

function showMessage1() {
  const main = document.getElementById("main");
  const messageElement = document.getElementById("message1section");
  main.style.display = "none";
  messageElement.style.display = "flex";
  document.body.classList.add("bg-body");
  setTimeout(() => {
    requestAnimationFrame(() => {
      messageElement.classList.add("show");
    });
  }, 1000);

  const messages = [
    // "i wish you happiness on this wonderful day! happy birthday 🎉🎉",
    // "may god bless you and being more happiness and success in your life 🔥🥰",
    "Happy Birthday! May all your wishes come true!",
  ];

  const typewriter = new Typewriter("#message1", {
    loop: false,
    delay: 75,
    cursor: "_",
    deleteSpeed: 50,
  });

  audio2.loop = true;
  messages.forEach((message, index) => {
    typewriter.typeString(message).pauseFor(2000).deleteAll().pauseFor(500);
  });

  setTimeout(() => {
    audio2.loop = false;
    audio2.pause();
  }, 20000);

  typewriter.callFunction(() => {
    renderNextState(RENDER_STATES.message1_shown);
  });
  typewriter.start();
}

function showMessage2() {
  console.log("here");
}
