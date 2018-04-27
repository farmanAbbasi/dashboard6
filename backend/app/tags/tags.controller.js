var mongoose = require('mongoose');
var tags = require('./tags.model');
var parse = require('parse-bearer-token');
var atob = require('atob');
var common = require('../common/functions.js');

exports.search = function (req, res) {
  var toSearch = req.params.firstletter;
  tags.find(
    { 'tagsArray.startsWith': toSearch },
    { 'tagsArray.$': 1 },
    function (err, obj) {
      if (err) {
        res.status(403).send({ msg: 'Error', tags: [] });
      } else {
        if (obj) {
          if (obj.length != 0) res.send({ tags: obj[0].tagsArray[0].tags });
          else {
            res.status(206).send({ msg: 'Error', tags: [] });
          }
        } else res.status(403).send({ msg: 'Error', tags: [] });
      }
    }
  );
};

exports.tagsCreate = function (req, res) {
  var tagsArray = req.body.tags;
  for (var i = 0; i < tagsArray.length; i++) {
    var currentVal = tagsArray[i][0].toLowerCase().trim().charAt(0);
    createTagwithArray(currentVal, i, tagsArray[i], (tagsArray.length - 1), res);
  }
};


function createTagwithArray(currentVal, i, tagsPushArray, tagArrayLength, res) {
  tags.find(
    {
      'tagsArray.startsWith': currentVal
    },
    function (err, obj) {
      if (err) {
      } else {
        if (obj) {
          var updateObject;
          if (obj.length != 0) {
            tags.update(
              {
                'tagsArray.startsWith': currentVal
              },
              { $addToSet: { 'tagsArray.$.tags': { $each: tagsPushArray } } },
              function (err, tank) {
                if (i === tagArrayLength)
                  res.status(200).send({ msg: true });
              }
            );
          } else {
            newTagObject = {};
            newTagObject.startsWith = currentVal
            newTagObject.tags = tagsPushArray;
            tags.update(
              {},
              { $push: { tagsArray: newTagObject } },
              function (err, obj) {
                if (i === tagArrayLength)
                  res.status(200).send({ msg: true });
              }
            );
          }
        }
      }
    }
  );
}
