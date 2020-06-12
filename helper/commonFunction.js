const config = require('../config/config');
var nodemailer = require('nodemailer');
const twilio = require('twilio');
const accountSid = 'AC596ef7dbd338dc52c4c1e41bd0fc477d';
const authToken = '5dcb0753a292c6d907ba7f17d7e8f80d';
const client = require('twilio')(accountSid, authToken);
var cloudinary = require('cloudinary');
//const async= require('async');

cloudinary.config({
  cloud_name: global.gConfig.cloudinary.cloud_name,
  api_key: global.gConfig.cloudinary.api_key,
  api_secret: global.gConfig.cloudinary.api_secret
});
    

module.exports = {


  getOTP() {
    var otp = Math.floor(1000 + Math.random() * 9000);
    return otp;
  },

  sendMail: (email, text, callback) => {
    let html = `<html lang="en"><head>
                  <meta charset="utf-8">
                  <meta http-equiv="X-UA-Compatible" content="IE=edge">
                  <meta name="viewport" content="width=device-width, initial-scale=1">
                  <meta name="description" content="">
                  <meta name="author" content="">
                
                  <title></title> 
              </head>
              <body style="margin: 0px; padding: 0px;">
                <div style="min-width:600px;margin:0px;background:#fff;font-family:'Open Sans',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300;color:#777;line-height:30px">
              
                      <table style="width:600px;margin:0px auto;background:#F3251E;padding:0px;border: 4px solid black;    border-radius: 6px;" cellpadding="0" cellspacing="0" >
                          <tbody>
                      <tr>
                        <td style='font-size: 16px;text-align:center;' >
                          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-weight:600;">
                          <tbody>
                          <tr style="background-color:#FBF707; text-align:left;">
                            <td style="font-size:16px;text-align:left;">  
                              <span style="display:inline-block;height: 100px;text-align:left;border-bottom: 4px solid black!important;border-right: 4px solid black!important;">
                                <img src="https://res.cloudinary.com/dl2d0v5hy/image/upload/v1588426120/ydt1tzv0fcvhbu8lyi9q.png" style="padding: 0px;margin: 0px; width="100" height="100"">
                              </span>
                            </td>                                   
                          </tr>               
                        </tbody>
                          </table>
                          
                                      <table width="100%" border="0" cellpadding="0" cellspacing="0" style="font-weight:600;margin-bottom:50px;padding:0px 15px; ">
                            <tbody>
                              <tr>
                                       <td  style="text-align: center;     padding: 16px 0px;">
                                                    <div style="color:#FFFAFA;font-size:25px;margin-bottom:5px;">WELCOME TO YNOT-OFFERS</div>
                                </td> 
                                  </tr>
                                  <tr>
                                       <td  style="text-align: center; padding: 10px 0px;">
                                                    <div style="color:#F9F4F4;font-size:20px;margin-bottom:5px;font-weight: 200;">${text}</div>
                                </td> 
                                  </tr>
                                  <tr>
                                       <td  style="text-align: center;">
                                                    <div style="color:#fff;font-size:25px;margin-bottom:5px;font-weight: 200;"></div>
                                </td> 
                                  </tr>
                                  <tr>
                                       <td  style="text-align: center;    padding: 20px 0px;">
                                                    
                                </td> 
                                  </tr>                 
                            </tbody>
                          </table>
              
                        </table>
                      </div>
                  
                </body>
                </html>`

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        "user": global.gConfig.nodemailer.user,
        "pass": global.gConfig.nodemailer.pass

      }
    });
    var mailOptions = {
      from: "<do_not_reply@gmail.com>",
      to: email,
      subject: 'YNOT-Offers',
      //text: text,
      html: html
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        callback(error, null)
      } else {
        callback(null, info.response)
      }
    });
  },
  videoUpload(base64, callback) {
    cloudinary.v2.uploader.upload(base64,
      {
        resource_type: "video",
      },
      function (error, result) {
        if (error) {
          callback(error, null)
        }
        else {
          callback(null, result.secure_url)
        }
      });
  },
  uploadImage: (img, callback) => {
    cloudinary.v2.uploader.upload(img, (error, result) => {
      if (error) {
        callback(error, null)
      }
      else {
        callback(null, result.secure_url)
      }
    })
  },

  uploadMultipleImage: (imageB64, callback) => {
    let imageArr = []
    async.eachSeries(imageB64, (items, callbackNextiteration) => {
      module.exports.uploadImage(items, (err, url) => {
        if (err)
          console.log("error is in line 119", err)
        else {
          imageArr.push(url);
          callbackNextiteration();
        }
      })
    }, (err) => {
      console.log("imageArr", imageArr)

      callback(null, imageArr);

    }

    )
  },

  sendSMS: (mobileNumber, body, callback) => {
    client.messages.create({
      'body': body,
      'to': '+91' + mobileNumber,
      "from": "+13367906768"
    }, (twilioErr, twilioResult) => {
      if (twilioErr) {
        callback(twilioErr, null);
      }
      else {
        callback(null, twilioResult);
      }
    })
  },


}   