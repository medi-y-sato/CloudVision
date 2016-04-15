angular.module('starter.controllers', [])

.controller('CameraCtrl', ['$scope', '$http', 'apiConst', '$q', function($scope, $http, apiConst, $q) {

  $scope.callCamera = function(sourceType) {

    $scope.loading = 'call camera ....'

    $scope.results = null

    if (typeof Camera === 'undefined'){
      $scope.loading = 'no Camera'
    }else{
      var options = {
        destinationType: Camera.DestinationType.DATA_URL,
        encodingType: Camera.EncodingType.PNG,
        correctOrientation: true,
        quality: 50
      }
      if (sourceType === 'photo'){
        options.sourceType = Camera.PictureSourceType.CAMERA
      }else{
        options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY
      }

      $scope.loading = 'kick navigator.camera'
      navigator.camera.getPicture(function(imageData) {
        $scope.loading = 'call API ....'

        $scope.imageSource = 'data:image/png;base64,' + imageData

        callApi(imageData).then(function(result){
          $scope.results = result
          $scope.loading = null
        },function(error){
          console.err(error)
          $scope.loading = error
        })

      }, function(error) {
        $scope.loading = 'found error : ' + error
      }, options)

    }

  }

  var callApi = function(imageData){
    var q = $q.defer()

    var postData = {
      "requests": [{
        "image": {
          "content": imageData
        },
        "features": [{
          "type": "FACE_DETECTION",
          "maxResults": 5
        }, {
          "type": "LABEL_DETECTION",
          "maxResults": 5
        }, {
          "type": "TEXT_DETECTION",
          "maxResults": 5
        }, {
          "type": "LANDMARK_DETECTION",
          "maxResults": 5
        }, {
          "type": "LOGO_DETECTION",
          "maxResults": 5
        }, {
          "type": "SAFE_SEARCH_DETECTION",
          "maxResults": 5
        }]
      }]
    }

    $http({
        method: 'POST',
        url: 'https://vision.googleapis.com/v1/images:annotate?key=' + apiConst.api_key,
        data: postData
      })
      .success(function(data, status, headers, config) {

        var response = {}

        result = data.responses[0]
        $scope.results = JSON.stringify(result)

        if (result.labelAnnotations){
          response.labelAnnotations = result.labelAnnotations
        }
        if (result.textAnnotations){
          response.textAnnotations = result.textAnnotations[0]
        }
        if (result.safeSearchAnnotation){
          response.safeSearchAnnotation = result.safeSearchAnnotation
        }
        if (result.faceAnnotations){
          var faceDetection = {}
          faceDetection.joyLikelihood = result.faceAnnotations[0].joyLikelihood
          faceDetection.sorrowLikelihood = result.faceAnnotations[0].sorrowLikelihood
          faceDetection.angerLikelihood = result.faceAnnotations[0].angerLikelihood
          faceDetection.surpriseLikelihood = result.faceAnnotations[0].surpriseLikelihood
          faceDetection.underExposedLikelihood = result.faceAnnotations[0].underExposedLikelihood
          faceDetection.blurredLikelihood = result.faceAnnotations[0].blurredLikelihood
          faceDetection.headwearLikelihood = result.faceAnnotations[0].headwearLikelihood

          response.faceAnnotations = faceDetection
        }
        if (result.landmarkAnnotations){
          response.landmarkAnnotations = result.landmarkAnnotations
        }
        q.resolve(response)
      })
      .error(function(err) {
        q.reject(err.error.message)
      })
      return q.promise
  }

  $scope.loading = null

}])
