// Variables
var trainName = "";
var trainDestination = "";
var trainTime = "";
var trainFrequency = "";
var nextArrival = "";
var minutesAway = "";

// Creating variable to the get the value entered by the user
var eTrain = $("#train-name");
var eTrainDestination = $("#train-destination");
// form validation for Time using jQuery Mask plugin
var eTrainTime = $("#train-time").mask("00:00");
var eTimeFreq = $("#time-freq").mask("00");


// Initialize Firebase
var config = {
    apiKey: config.MY_KEY, //storing my key in a file(config.js) which is in .gitignore.
    authDomain: "train-schedule-baee4.firebaseapp.com",
    databaseURL: "https://train-schedule-baee4.firebaseio.com",
    projectId: "train-schedule-baee4",
    storageBucket: "train-schedule-baee4.appspot.com",
    messagingSenderId: "233105958642"
  };
  firebase.initializeApp(config);

var database = firebase.database();

database.ref("/trains").on("child_added", function(snapshot) {

    //  create variables to store the data from firebase
    var trainDiff = 0;
    var trainRemainder = 0;
    var minutesTillArrival = "";
    var nextTrainTime = "";
    var frequency = snapshot.val().frequency;

  // find the difference in time between current time & when the first train
    trainDiff = moment().diff(moment.unix(snapshot.val().time), "minutes");

    // get the remainder of time with the frequency & time difference and store in a variable
    trainRemainder = trainDiff % frequency;

    // subtract the remainder from the frequency, store in variable
    minutesTillArrival = frequency - trainRemainder;

    // add minutesTillArrival to now, to find next train & convert to standard time format
    nextTrainTime = moment().add(minutesTillArrival, "m").format("hh:mm A");

    // append to table of trains, inside tbody, with a new row of the train data
    $("#table-data").append(
        "<tr><td>" + snapshot.val().name + "</td>" +
        "<td>" + snapshot.val().destination + "</td>" +
        "<td>" + frequency + "</td>" +
        "<td>" + minutesTillArrival + "</td>" +
        "<td>" + nextTrainTime + "  "  + "</td></tr>"
    );

});

// function to call the button event, and store the values in the input form
var storeInputs = function(event) {
    // prevent from from reseting
    event.preventDefault();

    // get & store input values
    trainName = eTrain.val().trim();
    trainDestination = eTrainDestination.val().trim();
    trainTime = moment(eTrainTime.val().trim(), "HH:mm").subtract(1, "years").format("X");
    trainFrequency = eTimeFreq.val().trim();

    // add the firebase db
    database.ref("trains").push({
        name: trainName,
        destination: trainDestination,
        time: trainTime,
        frequency: trainFrequency,
        nextArrival: nextArrival,
        minutesAway: minutesAway,
        date_added: firebase.database.ServerValue.TIMESTAMP
    });

    //  console log when a train is added
    console.log("Train successuflly added!");

    //  empty the form once submitted
    eTrain.val("");
    eTrainDestination.val("");
    eTrainTime.val("");
    eTimeFreq.val("");
};

// Call the storeInputs function when the user clicks on the submit button
$("#btn-add").on("click", function(event) {
    // form validation - if empty - alert
    if (eTrain.val().length === 0 || eTrainDestination.val().length === 0 || eTrainTime.val().length === 0 || eTimeFreq === 0) {
        alert("Please Fill All Required Fields");
    } else {
        // if form is filled out, run function
        storeInputs(event);
    }
});
