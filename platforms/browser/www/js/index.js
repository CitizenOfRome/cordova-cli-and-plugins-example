/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        this.getGeoLocation();
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

    getGeoLocation: function() {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                document.getElementById('currentLocationText').innerHTML = position.coords.latitude + ', '+ position.coords.longitude;
            });
        } else {
            console.error('geolocation is not available on your device');
        }
    },

    takePicture: function() {
        // 1. Take a picture
        navigator.camera.getPicture(function(picture) {
            // Success
            // 2. Display it in an img tag
            document.getElementById('cameraPreviewImage').src = picture;
            document.getElementById('cameraUploadPictureButton')classList.remove('hide');
        }, function() {
            // Failure
            console.error('Failed to get picture', arguments);
            alert('Failed to get picture, please try again');
        }, {
            destinationType: Camera.DestinationType.FILE_URI,
            saveToPhotoAlbum: true
        });
    },

    uploadPicture: function() {
        // 3. Submit the picture via the FileTransfer plugin
        var ft = new FileTransfer(),
            fileURL = document.getElementById('cameraPreviewImage').src,
            options = new FileUploadOptions();
        options.fileKey = "file"; // $_FILES['file']
        options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
        options.mimeType = "img/jpg";
        if(fileURL === 'about:blank') {
            alert('Kindly take a picture first');
            return false;
        }
        ft.upload(
            fileURL, 
            encodeURI("http://some.server.com/upload.php"), 
            function(r) {
                // Upload success
                console.log("Code = " + r.responseCode);
                console.log("Response = " + r.response);
                console.log("Sent = " + r.bytesSent);
                alert('Uploaded Successfully');
            }, 
            function(error) {
                // Upload failed
                alert("An error has occurred: Code = " + error.code);
                console.log("upload error source " + error.source);
                console.log("upload error target " + error.target);
            }, 
            options
        );
    }
};

app.initialize();