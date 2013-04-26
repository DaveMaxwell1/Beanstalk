// Define general feature detect for HTML5 Canvas capabilities
if(typeof($FeatureDetectCanvas) == 'undefined')
{
    self.$FeatureDetectCanvas = {

		test : function() 
		{
			var canvas = document.createElement('canvas');
			
			if (!canvas.getContext) {
			    $FeatureDetect.fail("Your browser doesn't support the HTML5 CANVAS tag so you cannot view this site, redirecting to a modern browser download site");
			}
		}
	}

};

// Define Feature Detect logic for displaying failure message
if (typeof ($FeatureDetect) == 'undefined') {
    self.$FeatureDetect = {

        fail: function (message, upgradeChoices) {

            var choices = "";

            if (upgradeChoices) {
                choices = "&choices=" + encodeURI(upgradeChoices);
            }

            if ($QueryStringHelper.parse("o") == "1") {
                return;
            }

            //window.location.replace("index.html?message=" + encodeURI(message) + "&url=" + window.location + choices);
			//alert(message);
			
		//window.location.replace("http://windows.microsoft.com/en-IE/internet-explorer/download-ie");

        }
    }
}

// Do feature detection
$FeatureDetectCanvas.test();