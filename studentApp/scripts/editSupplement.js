    var mailstoRemove = [];

    function removeUser(email,key){
      mailstoRemove.push(email);
      $("#"+key).hide();
    }


    function saveShareChanges(event, supplementId){
      event.preventDefault();
      let data = {};
      data.supId = supplementId;
      data.emails = mailstoRemove;

      mailstoRemove.forEach( (elt,ind) =>{
        console.log(elt);
      });
      //ajax call to save changes to hl
      $("#preloader").show();
      $.post("/supplement/rest/removeInvites",data)
      .done(res =>{
        console.log(res);
        $("#preloader").hide();
        $("#meassageDiv").text("changes saved!");
      })
      .fail(err =>{
        $("#preloader").hide();
        $("#meassageDiv").text("Something went wrong!");
        console.log(err);
      });

    }
