/// <reference path="Preloaders/PxLoader.js" />
/// <reference path="Preloaders/PxLoaderImage.js" />
// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    //canvas and context
    var canvas;
    var ctx;

    //Screen size
    var SCREEN_WIDTH = 1366;
    var SCREEN_HEIGHT = 768;
    var FULLSCREEN_WIDTH = 1366;
    var MAX_X;
    var MAX_Y;

    //Game Mode
    var menuEnabled = true;

    //Menu    
    //var MENUBG = "/images/MenuBG.png";
    var MENUNUM = 0;

    //ViewState
    var SNAPPED_VIEW = 320;

    //Share Text
    var SHARE_TITLE = "Check out Beanstalk!"

    function initialize() {
        
        //Init Canvas
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");

        //Set up Coordinates for Screen Size
        FULLSCREEN_WIDTH = window.innerWidth;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        SCREEN_HEIGHT = canvas.height;
        SCREEN_WIDTH = canvas.width;

        //Handle View Layout Changes
        window.addEventListener("resize", onViewStateChanged);

        //Share Contract
        var dataTransferManager = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();
        dataTransferManager.addEventListener("datarequested", shareBeanstalk);

        //Menu Commands
        document.getElementById("btnStart").addEventListener("MSPointerUp", startGround, false);

        //Menu
        showMenu();

    }

    //Set Up Menu Screen UI Elements
    function showMenu(event) {
        menuEnabled = true;

        //txtScore.style.visibility = "hidden";

        //Detect View State
        if (event === 'snapped') {
            canvas.width = SNAPPED_VIEW;
        }
        else if (event === 'filled') {
            canvas.width = FULLSCREEN_WIDTH - SNAPPED_VIEW;
        }
        else {
            canvas.width = FULLSCREEN_WIDTH;
        }
        //Readjust canvas for Snapped/Filled modes
        canvas.height = window.innerHeight;
        SCREEN_HEIGHT = canvas.height;
        SCREEN_WIDTH = canvas.width;

        //Center Title and Start Button
        var menuX, btnX, btnY;
        menuX = (SCREEN_WIDTH - imgMenu.width) / 2;
        btnX = (SCREEN_WIDTH - btnStart.clientWidth) / 2;
        btnY = (SCREEN_HEIGHT - btnStart.clientHeight) / 2;
        imgMenu.style.posLeft = menuX;
        btnStart.style.posLeft = btnX;
        btnStart.style.posTop = btnY;

        //clear screen and set default background
        ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
        //document.body.background = MENUBG;

    }

    //Set up ground screen UI Elements
    function startGround(event) {

        imgMenu.style.visibility = "hidden";
        btnStart.style.visibility = "hidden";

        //txtPlayerName.style.visibility = "visible";

        //clear screen
        ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

        menuEnabled = false;

        var img = new Image();

        img.src = "/images/StartAnimation/Start.png";
        img.onload = function () {
            var fps = 15,
                currentFrame = 0,
                totalFrames = 93, //93
                canvas = document.getElementById("canvas"),
                ctx = canvas.getContext("2d"),
                currentTime = rightNow();

        (function animloop(time) {
                var delta = (time - currentTime) / 1000;

                currentFrame += (delta * fps);

                var frameNum = Math.floor(currentFrame);

                if (frameNum >= totalFrames) {
                    //currentFrame = frameNum = 0;
                    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
                    showGround();
                    return;
                    
                }

                requestAnimationFrame(animloop);

                //drawFrame(ctx, img, 529, 298, frameNum);
                drawFrame(ctx, img, SCREEN_WIDTH, SCREEN_HEIGHT, frameNum);
                currentTime = time;
        })(currentTime);
        };
        
    }

    function showGround(event) {

        var context = document.getElementById('canvas').getContext('2d'); context.fillStyle = 'cornflowerblue'; context.strokeStyle = 'yellow'; context.shadowColor = 'rgba(50, 50, 50, 1.0)'; context.shadowOffsetX = 2; context.shadowOffsetY = 2; context.shadowBlur = 4; context.lineWidth = 20; context.lineCap = 'round'; context.beginPath(); context.moveTo(120.5, 130); context.quadraticCurveTo(150.8, 130, 160.6, 150.5); context.quadraticCurveTo(190, 250.0, 210.5, 160.5); context.quadraticCurveTo(240, 100.5, 290, 70.5); context.stroke();

    }

    //Share Contract for High Score
    function shareBeanstalk(e) {
        var request = e.request;

        request.data.properties.title = SHARE_TITLE;
        request.data.setText('Check out this awesome app on the Windows Store today!');

    }

    function onViewStateChanged(eventArgs) {
        var viewStates = Windows.UI.ViewManagement.ApplicationViewState, msg;
        var newViewState = Windows.UI.ViewManagement.ApplicationView.value;
        if (newViewState === viewStates.snapped) {
            showMenu('snapped');
        } else if (newViewState === viewStates.filled) {
            showMenu('filled');
        } else if (newViewState === viewStates.fullScreenLandscape) {
            showMenu('landscape');
        } else if (newViewState === viewStates.fullScreenPortrait) {
            //Currently not supported
        }

    }

    document.addEventListener("DOMContentLoaded", initialize, false);

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }
            args.setPromise(WinJS.UI.processAll());
        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

    app.start();
})();
