var wavesurfer = WaveSurfer.create({
  container: "#waveform",
  waveColor: "violet",
  barWidth: 2,
  barHeight:100,
  cursorWidth:2,
  height:200,
  hideScrollbar:true,
  progressColor: "purple"
});
wavesurfer.on('ready', function () {
  var timeline = Object.create(WaveSurfer.Timeline);
  timeline.init({
    wavesurfer: wavesurfer,
    container: '#waveform-timeline'
  });
});
wavesurfer.load("assets/1.mp3");
var slider = document.querySelector("#slider");
slider.oninput = function() {
  var zoomLevel = Number(slider.value);
  wavesurfer.zoom(zoomLevel);
};
// Equalizer
wavesurfer.on("ready", function() {
  var EQ = [
    {
      f: 32,
      type: "lowshelf"
    },
    {
      f: 64,
      type: "peaking"
    },
    {
      f: 125,
      type: "peaking"
    },
    {
      f: 250,
      type: "peaking"
    },
    {
      f: 500,
      type: "peaking"
    },
    {
      f: 1000,
      type: "peaking"
    },
    {
      f: 2000,
      type: "peaking"
    },
    {
      f: 4000,
      type: "peaking"
    },
    {
      f: 8000,
      type: "peaking"
    },
    {
      f: 16000,
      type: "highshelf"
    }
  ];
  // Create filters
  var filters = EQ.map(function(band) {
    var filter = wavesurfer.backend.ac.createBiquadFilter();
    filter.type = band.type;
    filter.gain.value = 0;
    filter.Q.value = 1;
    filter.frequency.value = band.f;
    return filter;
  });
  // Connect filters to wavesurfer
  wavesurfer.backend.setFilters(filters);
  // Bind filters to vertical range sliders
  var container = document.querySelector("#equalizer");
  filters.forEach(function(filter) {
    var input = document.createElement("input");
    wavesurfer.util.extend(input, {
      type: "range",
      min: -40,
      max: 40,
      value: 0,
      title: filter.frequency.value
    });
    input.style.display = "inline-block";
    input.setAttribute("orient", "vertical");
    wavesurfer.drawer.style(input, {
      webkitAppearance: "slider-vertical",
      width: "50px",
      height: "150px"
    });
    container.appendChild(input);
    var onChange = function(e) {
      filter.gain.value = ~~e.target.value;
    };
    input.addEventListener("input", onChange);
    input.addEventListener("change", onChange);
  });
  // For debugging
  wavesurfer.filters = filters;
});
/*var myVar = setInterval(myTimer, 1000);
var timeGet = 0;
function myTimer() {
  if (wavesurfer.isPlaying()) {
    // console.log('song paly start');
    //  console.log(wavesurfer.getCurrentTime());
    //timeGet =  wavesurfer.getCurrentTime();
  }
  // console.log(wavesurfer.isPlaying());
}*/
var key = [];
function addKeyToarray(t, r) {
    var subKey = {};
    subKey["time"] = t;
    subKey["type"] = r;
  key.push(subKey);
}
//addKeyToarray(0, 0);
$(document).on("keydown", function(event) {
  //$( "#log" ).html( event.type + ": " +  event.which );
  // console.log(event.which);
  if (wavesurfer.isPlaying()) {
    var  sonKeyTime = Math.trunc(wavesurfer.getCurrentTime()*1000);
    var red = '<div class=" box"></div>';
    var blue = '<div class="  box"></div>';
    var blueandRed = "";
    if (event.which == 191) {
      red = '<div class="  bg-danger box"></div>';
      addKeyToarray(sonKeyTime,1);
    }
    if (event.which == 32) {
      blueandRed =
        '<div class=" bg-danger box"></div><div class=" bg-primary box"></div>';
      addKeyToarray(sonKeyTime, 1);
      addKeyToarray(sonKeyTime, 0);
    }
    if (event.which == 90) {
      blue = '<div class=" bg-primary box"></div>';
      addKeyToarray(sonKeyTime, 0);
      //console.log(wavesurfer.getCurrentTime());
    }
    if (event.which == 90 || event.which == 32 || event.which == 191) {
      $("#boxArray").scrollTop($("#boxArray")[0].scrollHeight);
      $("#boxArray").append(
        '<div class="row boxRow"><div class="col col-sm-4">' +
           sonKeyTime+
          "</div>" +
          blueandRed +
          red +
          blue
      );
    }
  }
});
function getJson() {
  var myJsonString = JSON.stringify(key);
  $("#jsonOut").val(myJsonString);
  $("#jsonOut").show();
  //console.log(myJsonString);
}