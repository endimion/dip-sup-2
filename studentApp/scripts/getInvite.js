"use strict";

$( document ).ready(function() {

    let invHash = $("#invHash").text();

    $.get("/supplement/rest/invite/"+invHash)
      .then(resp =>{
        let invite = JSON.parse(resp);
        // console.log(invite);
        $("#meassageDiv").text("Checking constraints...");
        if(invite.Recipient !== ""){
          $.get("/supplement/rest/view/"+invite.DSId).done(resp=>{
              paintSupplement(JSON.parse(resp));
          }).fail(err =>{
            $("#headerMessage").text("UnAuthorized Access!");
            console.log(err);
          });
        }else{
            $("#meassageDiv").text("Sending validation Code...");
            genValidationCode(invHash);
        }
       });
});


function genValidationCode(invHash){
  $.post("/supplement/rest/invite/"+invHash+"/sendMail")
  .done(resp =>{
      console.log(resp);
       generateValidationForm(invHash);
  }).fail(err =>{
      $("#headerMessage").text("validation failed");
      console.log(err);
  });
}


function generateValidationForm(invHash){
    $("#supPreloader").hide();
    let form  = $("<form>",{"action":"/supplement/invite/"+invHash+"/authorize"});
    let formGroup = $("<div>",{"class":"form-group"});
    let label = $("<label>",{"for":"validationCode"});
    label.text("Validation Code:");
    formGroup.append(label);
    let codeInput = $("<input>",{"class":"form-control","type":"text","name":"validationCode","id":"validationCode"});
    formGroup.append(codeInput);
    let hash = $("<input>",{"class":"form-control","type":"hidden","name":"hash","id":"hash","value":invHash});
    formGroup.append(hash);

    let validate = $("<a>",{"class":"waves-effect waves-green btn-flat","onclick":'validateDS()'});
    validate.text("Validate");
    formGroup.append(validate);

    form.append(formGroup);
    $("#validationForm").append(form);
}


function validateDS(){
  let code = $("#validationCode").val();
  let inviteHash = $("#hash").val();
  $("#supPreloader").show();
  $.post("/supplement/rest/invite/"+inviteHash+"/authorize",{inviteHash:inviteHash,validationCode:code}).then(resp =>{
    console.log(resp);
    console.log(resp.status);
    paintSupplement(JSON.parse(resp));

  }).fail(err =>{
      $("#headerMessage").text("validation failed");
      // console.log(err);
  });
}


function paintSupplement(supplement){

  let card = $("<div>", {"class": "card"});
  let cardContent = $("<div>", {"class": "card-content","id":"textContent"});
  card.append(cardContent);
  let cardTitle = $("<span>", {"class": "card-title"});
  cardContent.append(cardTitle);
  let alumni = $("<p>");
  alumni.text("Alumni:" + supplement.Name);
  let eID = $("<p>");
  eID.text("eID: " + supplement.Owner);
  let univ = $("<p>");
  univ.text("University: "+supplement.University);
  let id = $("<p>");
  id.text("SupplementID: " + supplement.Id);

  cardContent.append(alumni);
  cardContent.append(eID);
  cardContent.append(univ);
  cardContent.append(id);


  let cardAction = $("<div>", {"class": "card-action"});
  let actionContent = $("<div>", {"class": "row card-content"});
  cardAction.append(actionContent);
  cardContent.append(cardAction);

  let downloadWrapper = $("<div>", {"class": "col s3 m3 l3"});
  actionContent.append(downloadWrapper);
  let download = $("<a>", {"class": "btn-floating btn-medium waves-effect waves-light blue darken-3","href":"download/"+supplement.Id});
  let downloadIcon = $("<i>",{"class":"material-icons"});
  downloadIcon.text("file_download");
  download.append(downloadIcon);
  downloadWrapper.append(download);
  actionContent.append(downloadWrapper);

  $("#supPreloader").hide();
  $("#validationForm").hide();
  $("#supplementView").append(card);

}
