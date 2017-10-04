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
              makeSupplementCard(JSON.parse(resp));
          }).fail(err =>{
            $("#headerMessage").text("UnAuthorized Access!");
            $("#supPreloader").hide();
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
    makeSupplementCard(JSON.parse(resp));

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











function makeSupplementCard(supplement){
  let card = $("<div>", {"class": "card"});
  let cardContent = $("<div>", {"class": "card-content","id":"textContent"});
  card.append(cardContent);
  let cardTitle = $("<span>", {"class": "card-title"});
  cardContent.append(cardTitle);

  let accordionList = $("<ul>",{"class":"collapsible","data-collapsible":"accordion"});
  for (var name in supplement) {
    accordionList.append(displaySupAttribute(name,supplement[name]));
  }
  cardContent.append(accordionList);

  let cardContentSvg = $("div",{"id":"svgContent","display":"none","background":"white","width":"16em"});
  card.append(cardContentSvg);

  let cardAction = $("<div>", {"class": "card-action"});
  let actionContent = $("<div>", {"class": "row card-content"});
  cardAction.append(actionContent);

  let downloadWrapper = $("<div>", {"class": "col s3 m3 l3"});
  actionContent.append(downloadWrapper);
  let download = $("<a>", {"class": "btn-floating btn-medium waves-effect waves-light blue darken-3","href":"/supplement/rest/download/"+supplement.Id});
  let downloadIcon = $("<i>",{"class":"material-icons"});
  downloadIcon.text("file_download");
  download.append(downloadIcon);
  downloadWrapper.append(download);








  card.append(cardAction);

  $("#supPreloader").hide();
  $("#validationForm").hide();
  $("#supplementView").append(card);


  $('.collapsible').collapsible();
}









function displaySupAttribute(name, value,node="<p>", properties={}){
  let entryCSS = {
        "display": "block",
        "cursor": "pointer",
        "min-height": "3rem",
        "line-height": "3rem",
        "padding": "0 1rem",
        "background-color": "#fff",
        "border-bottom": "1px solid #ddd"
  }

  let headerCSS = {
    "background-color": "aliceblue"
  }

  if(name !== "Signature" && name !== "Authorized"  && value !== "" && value){
    if(typeof(value) === "string"){
        let result = $(node,properties);
        result.text(name+": " + value);
        if(node =="<p>"){
          result.css(entryCSS);
        }
        return result;
    }else{
      let result = $(node);
      // result.text(name+": ");
     //class="collapsible" data-collapsible="accordion"
      // let list = $("<ul>",{"class":"collapsible","data-collapsible":"accordion"});
      // result.append(list);
      let listItem = $("<li>");
      //let header = $("<li>",{"class":"collection-header","style":"font-weight: bold;"});
      let header = $("<div>",{"class":"collapsible-header"});
      header.text(name);
      header.css(headerCSS);
      listItem.append(header);
      for (var name in value) {
        listItem.append(displaySupAttribute(name,value[name],"<div>",
                            {"class":"collapsible-body"}));
      }

      // accordionList.append(listItem);
      return listItem;
    }
 }
}
