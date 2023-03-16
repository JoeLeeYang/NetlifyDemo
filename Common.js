function EJSTemplate(Template,Target,Mode='html',Url=null){

    $.ajax({

        type: 'Get',

        url: Url === null ? `./${Template}` : Url,

        async: false,

        success: function(Content){
            let Data = {};

            let HtmlContent = ejs.render(Content,Data);

            if(Mode === 'html') $(Target).html(HtmlContent);
            
            else if(Mode === 'append') $(Target).append(Content);
        },
        error: function(){
            throw('EJS:檔案路徑錯誤');
        }
    });
} //end EJSTemplate(Data,Page,Template,Target,Mode='html',Url=null)