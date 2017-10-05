
$( document ).ready(function() {
//Error: Endpoint read failed
    let getSupplements = function(){
      $.get("rest/view")
        .then(resp =>{
          console.log(resp);
          if(typeof(resp) === "string"
              && (resp.indexOf("Timeout") >= 0 || resp.indexOf("Error: Endpoint read failed") >= 0 )){
              getSupplements();
          }else{
            JSON.parse(resp).forEach(sup =>{
                  makeSupplementCard(sup);
            });
          }

          $("#supPreloader").hide();
          let onModalHide = function() {
            $(".sendEmail").show();
            $(".modalMessage").show();
            $(".preloader").hide();
            $(".qrCode").hide();
          };
          $('.modal').modal({
              complete : onModalHide
          });
         });
      }

      getSupplements();

});





function makeSupplementCard(supplement){



  let card = $("<div>", {"class": "card"});
  let cardContent = $("<div>", {"class": "card-content","id":"textContent"});
  card.append(cardContent);
  let cardTitle = $("<span>", {"class": "card-title"});
  cardContent.append(cardTitle);
  // let alumni = $("<p>");
  // alumni.text("Alumni:" + supplement.Name);
  // let eID = $("<p>");
  // eID.text("eID: " + supplement.Owner);
  // let univ = $("<p>");
  // univ.text("University: "+supplement.University);
  // let id = $("<p>");
  // id.text("SupplementID: " + supplement.Id);
  let accordionList = $("<ul>",{"class":"collapsible","data-collapsible":"accordion"});
  for (var name in supplement) {
    accordionList.append(displaySupAttribute(name,supplement[name]));
  }
  cardContent.append(accordionList);

  // cardContent.append(alumni);
  // cardContent.append(eID);
  // cardContent.append(univ);
  // cardContent.append(id);

  let cardContentSvg = $("div",{"id":"svgContent","display":"none","background":"white","width":"16em"});
  card.append(cardContentSvg);

  let cardAction = $("<div>", {"class": "card-action"});
  let actionContent = $("<div>", {"class": "row card-content"});
  cardAction.append(actionContent);

  let downloadWrapper = $("<div>", {"class": "col s3 m3 l3"});
  actionContent.append(downloadWrapper);
  let download = $("<a>", {"class": "btn-floating btn-medium waves-effect waves-light blue darken-3","href":"rest/download/"+supplement.Id});
  let downloadIcon = $("<i>",{"class":"material-icons"});
  downloadIcon.text("file_download");
  download.append(downloadIcon);
  downloadWrapper.append(download);

  let editWrapper = $("<div>",{"class":"col s3 m3 l3"});
  actionContent.append(editWrapper);
  let edit = $("<a>", {"class": "btn-floating btn-medium waves-effect waves-light yellow darken-3","href":"edit/"+supplement.Id});
  let editIcon = $("<i>",{"class":"material-icons"});
  editIcon.text("edit");
  edit.append(editIcon);
  editWrapper.append(edit);

  let shareWrapper = $("<div>",{"class":"col s6 m6 l3"});
  actionContent.append(shareWrapper);
  let share = $("<div>", {"class": "fixed-action-btn horizontal click-to-toggle","style":"position: absolute; right: 24px;bottom:4em;"});
  let shareBtn = $("<a>",{"class":"btn-floating btn-medium red"})
  share.append(shareBtn);
  let shareIcon = $("<i>",{"class":"material-icons"});
  shareIcon.text("share");
  shareBtn.append(shareIcon);
  shareWrapper.append(share);

  let shareList = $("<ul>");
  let shareListItMail = $("<li>");
  let shareMail = $("<a>",{"class":"btn-floating yellow darken-1 modal-trigger","style":"transform: scaleY(0.4) scaleX(0.4) translateY(0px) translateX(40px); opacity: 0;", "href":"#modal" + supplement.Id})
  let mailIcon = $("<i>",{"class":"material-icons"});
  mailIcon.text("mail");

  shareList.append(shareListItMail);
  shareListItMail.append(shareMail);
  shareMail.append(mailIcon);

  let shareListItQR = $("<li>");
  let shareQR = $("<a>",{"class":"btn-floating blue darken-1 modal-trigger","style":"transform: scaleY(0.4) scaleX(0.4) translateY(0px) translateX(40px); opacity: 0;", "href":"#modalQR" + supplement.Id})
  let qrIcon = $("<i>",{"class":"material-icons"});
  qrIcon.text("dashboard");

  shareList.append(shareListItQR);
  shareListItQR.append(shareQR);
  shareQR.append(qrIcon);


  share.append(shareList);


  let modalMailWrapper = $("<div>",{"class":"modal","id":"modal"+supplement.Id});
  let modalContent = $("<div>",{"class":"modal-content"});
  modalMailWrapper.append(modalContent);
  let modalHeader = $("<h4>");
  modalHeader.text("Share DiplomaSupplement " + supplement.Id);
  modalContent.append(modalHeader);
  let modalMessage = $("<p>",{"class":"modalMessage"});
  modalContent.append(modalMessage);
  modalMessage.text("Send a sharable link via email");
  let preloaderString = '<div style="display:none;" class="progress preloader"> <div class="indeterminate"></div> </div>';
  let preloader = $(preloaderString);
  modalContent.append(preloader);
  let modalForm = $("<form>",{"action":"#"});
  modalContent.append(modalForm);
  let modalFormGroupMail = $("<div>",{"class":"form-group"});
  let modalLabel = $("<label>",{"for":"email"});
  modalLabel.text("Receipient Email:");
  modalFormGroupMail.append(modalLabel);
  let mailInput = $("<input>",{"class":"form-control","id":"email"+supplement.Id,"type":"email"});
  let supIdInput = $("<input>",{"class":"form-control","type":"hidden","id":"supId"+supplement.Id,"name":"supId","value":supplement.Id});
  let sendMail = $("<a>",{"class":"waves-effect waves-green btn-flat","onclick":'sendEmail("email'+supplement.Id+'",'+'"supId'+supplement.Id+'","'+supplement.Id+'")'});
  sendMail.text("Send");
  modalFormGroupMail.append(mailInput);
  modalFormGroupMail.append(supIdInput);
  modalFormGroupMail.append(sendMail);
  modalForm.append(modalFormGroupMail);



  let modalQrWrapper = $("<div>",{"class":"modal","id":"modalQR"+supplement.Id});
  let modalQrContent = $("<div>",{"class":"modal-content"});
  modalQrWrapper.append(modalQrContent);
  let modalQrHeader = $("<h4>");
  modalQrHeader.text("Share DiplomaSupplement " + supplement.Id);
  modalQrContent.append(modalQrHeader);
  let modalQrMessage = $("<p>",{"class":"modalMessage"});
  modalQrContent.append(modalQrMessage);
  modalQrMessage.text("Generate a QR code you can insert in your CV tha only the email owner can view!");
  let qrPreloaderString = '<div style="display:none;" class="progress preloader"> <div class="indeterminate"></div> </div>';
  let qrPreloader = $(qrPreloaderString);
  modalQrContent.append(qrPreloader);
  let modalQrForm = $("<form>",{"action":"#","class":"qrForm"});
  modalQrContent.append(modalQrForm);
  let modalQrFormGroupMail = $("<div>",{"class":"form-group"});
  let modalQrLabel = $("<label>",{"for":"email"});
  modalQrLabel.text("Receipient Email:");
  modalQrFormGroupMail.append(modalLabel);
  let qrMailInput = $("<input>",{"class":"form-control","id":"qrEmail"+supplement.Id,"type":"email"});
  let qrSupIdInput = $("<input>",{"class":"form-control","type":"hidden","id":"qrSupId"+supplement.Id,"name":"qrSupId","value":supplement.Id});
  let makeQR = $("<a>",{"class":"waves-effect waves-green btn-flat","onclick":'makeQRcode("qrEmail'+supplement.Id+'",'+'"qrSupId'+supplement.Id+'","'+supplement.Id+'")'});
  makeQR.text("Generate QR");
  modalQrFormGroupMail.append(qrMailInput);
  modalQrFormGroupMail.append(qrSupIdInput);
  modalQrFormGroupMail.append(makeQR);
  modalQrForm.append(modalQrFormGroupMail);

  let qrContainer = $("<div>",{"class":"qrCode container","style":"display:none"});
  let qrContainerRow = $("<div>",{"class":"row"});
  qrContainer.append(qrContainerRow) ;
  let qrColLeft = $("<div>",{"class":"col m6 s12"});
  qrContainerRow.append(qrColLeft);
  let canvas = $("<canvas>",{"id":"canvas"+supplement.Id,"style":"display:none"});
  qrColLeft.append(canvas);
  let imgContainer = $("<div>",{"id":"imgContainer"+supplement.Id,"style":"margin: 0 auto; display: block;"});
  qrColLeft.append(imgContainer);
  modalContent.append(qrContainer);
  let rightContainer = $("<div>",{"class":"col m6 s12 qrMessage"});
  let rightMessage = $("<span>");
  rightMessage.text("Qr code Generated! Save this image and add it to your CV. Only the owner of the email address will be able to view the DS");
  rightContainer.append(rightMessage);
  qrContainerRow.append(rightContainer);

  modalQrContent.append(qrContainer);


  card.append(modalMailWrapper); //modalQrWrapper
  card.append(modalQrWrapper);
  card.append(cardAction);

  $("#supplements").append(card);


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
