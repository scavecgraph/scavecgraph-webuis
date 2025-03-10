function getUrlParameter(url, name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(url);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

var getUrlPar = function getUrlPar(sParam) {
    var sPageURL = window.location.search.substring(1), sURLVariables = sPageURL.split('&'), sParameterName, i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};

var falsy = /^(?:f(?:alse)?|no?|0+)$/i;
Boolean.parse = function(val) {
    return !falsy.test(val) && !!val;
};

function getTableScroll(thumbHexColor, trackHexColor){
    return ".scrollable{scrollbar-width:thin;scrollbar-height:thin;scrollbar-color: #" + thumbHexColor + " #" + trackHexColor + ";}";
}

function getColSearchPerspec(height){
    return ".colSearchPerspec{height:" + height + "px;}";
}

function resizeForDevice(){
    $("#divwidth").val($(window).width());
    var width = $(window).width() - 20;
    $("#searchDiv").css("width", width + "px");
    $("#rootPerspectivesDiv").css("width", width + "px");
    $("#rootPerspectivesTbl").css("width", width + "px");
    $("#pathPerspectivesDiv").css("width", width + "px");
    $("#browsePerspectivesDiv").css("width", width + "px");
    $("#browsePerspectivesTbl").css("width", width + "px");
    $("#searchPerspectivesDiv").css("width", width + "px");
    $("#searchPerspectivesTbl").css("width", width + "px");
    $("#perspectivesDiv").css("width", width + "px");
    $("#perspectiveDiv").css("width", width + "px");
    var colWidth = width - 160;
    // TABLE COLUMN WIDTHS : 20 120 340
    $("#blurbColR").css("width", colWidth+"px");
    $("#blurbColR").css("min-width", colWidth+"px");
    $("#blurbColB").css("width", colWidth+"px");
    $("#blurbColB").css("min-width", colWidth+"px");
}

function toggleNavigation(viewNav){
    if(viewNav.checked){
        $('#perspecPath').show();
        $('#perspecChildren').show();
        $('#perspecTitle').show();
        $('#perspecBlurb').show();
    }else{
        $('#perspecPath').hide();
        $('#perspecChildren').hide();
        $('#perspecTitle').hide();
        $('#perspecBlurb').hide();
    }
    setPerspectivesHeight();
    var inv = !viewNav.checked;
    window.parent.postMessageToChannelNavigator(inv);
}

function setPerspectivesHeight(){
    let aH = $("#searchDiv").css("display") === "block" ? Math.floor($("#searchDiv").height()) : 0;
    let rpH = $("#rootPerspectivesDiv").css("display") === "block" ? Math.floor($("#rootPerspectivesDiv").height()) : 0;
    let pH = $("#pathPerspectivesDiv").css("display") === "block" ? Math.floor($("#pathPerspectivesDiv").height()) : 0;                
    let bpH = $("#browsePerspectivesDiv").css("display") === "block" ? Math.floor($("#browsePerspectivesDiv").height()) : 0;
    let spH = $("#searchPerspectivesDiv").css("display") === "block" ? Math.floor($("#searchPerspectivesDiv").height()) : 0;
    let perH = $("#perspectiveDiv").css("display") === "block" ? Math.floor($("#perspectiveDiv").height()) : 0;
    let fH = $("#perspecTitle").css("display") === "block" ? Math.floor($("#perspecTitle").height()) : 0;
    let gH = $("#perspecBlurb").css("display") === "block" ? Math.floor($("#perspecBlurb").height()) : 0;
    let hH = $("#perspecPath").css("display") === "block" ? Math.floor($("#perspecPath").height()) : 0;
    let iH = $("#perspecChildren").css("display") === "block" ? Math.floor($("#perspecChildren").height()) : 0;
    if(perH > 0){
        let total = aH + aH + fH + gH + hH + iH;
        if($("#perspecTitle").css("display") === "none"){
            total = total - 20;
        }
        let height = $(window).height() - total;
        $("#perspecArticle").css("height", height + "px");
    }else if(rpH > 0 && pH > 0 && bpH > 0){
        let total = aH + pH + 10;
        let rem = $(window).height() - total;
        let half = rem / 2;
        $("#rootPerspectivesDiv").css("height",half + "px");
        $("#browsePerspectivesDiv").css("height",half + "px");
    }else if(spH > 0){
        let total = aH;
    }
}

function fetchRootPerspectives(){
    URL = window.parent.getPortalRestUrl() + "repo/" + repoId + "/rootPerspectiveAbrevs/";
    $.ajax({
        url: URL
    }).then(function (data) {
        rootPerspectives = data;
        $('#searchPerspectivesDiv').hide();
        $('#perspectiveDiv').hide();
        $("#contentRoot").find("tr").remove().end();
        let rootHeight = $("#contentRoot").height();
        let rowHeights = 0;
        for (var i = 0; i < data.length; i++) {
            $("#contentRoot").append("<tr class=\"perspecRow\"><td onclick=\"viewPerspective(" + data[i].id + ");viewContext('" + data[i].contextId + "');\" title=\"View Perspective\" class=\"icon\"><i class=\"ui-icon ui-icon-image\" style=\"cursor:pointer;\"></i></td><td style=\"cursor:pointer;\" onclick=\"getPerspective(" + i + ");getPath(" + data[i].id + ");\">" + data[i].title + "</td><td>" + data[i].blurb + "</td></tr>");
            rowHeights += 22;
        }
        let rem = Math.floor(rootHeight - rowHeights);
        $("#contentRoot").append("<tr id=\"contentRootRemainder\" style=\"height:" + rem + "px;\"><td></td><td></td><td></td></tr>");
    });
    return false;
}

function doBrowsingPers(persId){
    URL = window.parent.getPortalRestUrl() + "repo/" + repoId + "/perspectiveAbrevs/" + persId + "/";
    if(DEBUG){
        console.log("browsing URL : " + URL);                    
    }                
    $.ajax({
        url: URL
    }).then(function (data) {
        searchedPerspecs = data;
        $('#rootPerspectivesDiv').show();
        $('#pathPerspectivesDiv').show();
        $('#perspectivesDiv').hide();
        $('#searchPerspectivesDiv').hide();
        $('#perspectiveDiv').hide();
        $('#browsePerspectivesDiv').show();                    
        $("#contentBrowse").find("tr").remove().end();
        let browseHeight = $("#contentBrowse").height();
        let rowHeights = 0;                    
        for (var i = 0; i < data.length; i++) {
            $("#contentBrowse").append("<tr class=\"perspecRow\"><td onclick=\"viewPerspective(" + data[i].id + ");viewContext('" + data[i].contextId + "');\" title=\"View Perspective\" class=\"icon\"><i class=\"ui-icon ui-icon-image\" style=\"cursor:pointer;\"></i></td><td title=\"Navigate Perspective\" style=\"cursor:pointer;\" onclick=\"doBrowsingPers(" + data[i].id + ");getPath(" + data[i].id + ");\">" + data[i].title + "</td><td>" + data[i].blurb + "</td></tr>");
            rowHeights += 22;
        }
        let rem = Math.floor(browseHeight - rowHeights);
        $("#contentBrowse").append("<tr id=\"contentRootRemainder\" style=\"height:" + rem + "px;\"><td></td><td></td><td></td></tr>");                    
    });
}

function searchPerspectivesByTitle() {
    var URL = window.parent.getPortalRestUrl() + "repo/" + repoId + "/searchPerspecPaths/?title=";
    if(DEBUG){
        console.log("search Title URL : " + URL);                    
    }                
    var titleSearch = document.getElementById("titleSearch").value;
    var encodeTxt = encodeURIComponent(titleSearch);
    $.ajax({
        url: URL + encodeTxt
    }).then(function (data) {
        $('#rootPerspectivesDiv').hide();
        $('#pathPerspectivesDiv').hide();
        $('#browsePerspectivesDiv').hide();
        $('#perspectivesDiv').hide();
        $('#perspectiveDiv').hide();
        $('#perspectivesTreeDiv').hide();
        $('#contextsTreeDiv').hide();
        $('#searchPerspectivesDiv').show();
        $("#contentSearch").find("tr").remove().end();
        for (var i = 0; i < data.length; i++) {
            var path = data[i].path.substring(0, data[i].path.length - 1);
            $("#contentSearch").append("<tr><td style=\"padding:2px;font-size:8px;cursor:pointer;\" class=\"searchLinks colSearchPerspec\" title=\"" + data[i].title + "\">" + path + "</td></tr>");
        }
        var results = $('.colSearchPerspec');
        if(results.length){
            for(var i=0; i<results.length; i++){
                var link = $(results[i]).children().last();
                link.attr("href", "javascript:viewContext('" + link.attr("data-contextId") + "');viewPerspective(" + link.attr("data-perspecId") + ");getPath(" + link.attr("data-perspecId") + ");");
                link.css("font-weight","bold");
                link.css("font-size","10px");                            
            }
        }
    });
}

function searchPerspectivesByContext() {
    var URL = window.parent.getPortalRestUrl() + "repo/" + repoId + "/searchPerspecPathsByContextId?contextId=";
    if(DEBUG){
        console.log("search Context URL : " + URL);                    
    }                
    var contextId = window.parent.getCurrentContext();
    $.ajax({
        url: URL + contextId
    }).then(function (data) {
        $('#rootPerspectivesDiv').hide();
        $('#pathPerspectivesDiv').hide();
        $('#browsePerspectivesDiv').hide();
        $('#perspectivesDiv').hide();
        $('#perspectiveDiv').hide();
        $('#perspectivesTreeDiv').hide();
        $('#searchPerspectivesDiv').show();
        $('#contextsTreeDiv').hide();
        $("#contentSearch").find("tr").remove().end();
        for (var i = 0; i < data.length; i++) {
            var path = data[i].path.substring(0, data[i].path.length - 1);
            $("#contentSearch").append("<tr><td style=\"padding:2px;font-size:8px;cursor:pointer;\" class=\"searchLinks colSearchPerspec\" title=\"" + data[i].title + "\">" + path + "</td></tr>");
        }
        var results = $('.colSearchPerspec');
        if(results.length){
            for(var i=0; i<results.length; i++){
                var link = $(results[i]).children().last();
                link.attr("href", "javascript:viewContext('" + link.attr("data-contextId") + "');viewPerspective(" + link.attr("data-perspecId") + ");getPath(" + link.attr("data-perspecId") + ");");
                link.css("font-weight","bold");
                link.css("font-size","10px");
            }
        }
    });
}

function getPath(persId){
    URL = window.parent.getPortalRestUrl() + "perspecPath/" + persId + "/";
    if(DEBUG){
        console.log("path URL : " + URL);                    
    }                
    $.ajax({
        url: URL
    }).then(function (data) {
        path = data;
        let str = "";
        if(DEBUG){
            str = genTestLinks(10);
        }
        $('#pathPerspectivesDiv').css("width","502px !important;");
        $('#pathPerspectivesDiv').css("height","20px !important;");
        $('#pathPerspectivesDiv').show();
        $("#pathPerspectivesDiv").empty();
        $("#pathPerspectivesDiv").html(str + path);
        var ownPerspec = $('#pathPerspectivesDiv').children().last();
        ownPerspec.css("font-weight", "bold");
        ownPerspec.css("font-size", "12px");
        //ownPerspec.attr("href", "javascript:viewContext(\"" + ownPerspec.attr("data-contextId") + "\");viewPerspective(\"" + ownPerspec.attr("data-perspecId") + "\");");
        ownPerspec.attr("title", "This Perspective");
        var div = $("#pathLinksViewLast");
        div.css("display","none");
        ownPerspec.hover(
            function (event) {
                var div = $("#pathLinksViewLast");
                div.css("display","block");
                div.css({position:"absolute", top:event.pageY, left: event.pageX + 20});
                var link = $("#previewLink");
                link.attr("data-contextId",$(this).attr("data-contextId"));
                link.attr("data-perspecId",$(this).attr("data-perspecId"));
                link.first().text($(this).text());
                link.attr("onclick","viewContext($(this).attr('data-contextId'));viewPerspective($(this).attr('data-perspecId'));");
                div.hover(function(event){},function(event) {$(this).css("display","none");});
            }, 
            function (event) {}
        );
    });
}

function viewPerspective(persId){
    URL = window.parent.getPortalRestUrl() + "perspectiveHTML/" + persId + "/true/true/true/true/ffffff/";
    if(DEBUG){
        console.log("perspective URL : " + URL);                    
    }                
    $.ajax({
        url: URL
    }).then(function (data) {
        window.parent.setCurrentPerspective(persId);
        html = data;
        var hexColor = "#0178af";
        $('#rootPerspectivesDiv').hide();
        $('#pathPerspectivesDiv').hide();
        $('#browsePerspectivesDiv').hide();
        $('#perspectivesTreeDiv').hide();
        $('#searchPerspectivesDiv').hide();
        $('#perspectivesTreeDiv').hide();
        $('#perspectivesDiv').hide();
        $('#perspectiveDiv').html(html);
        $("#perspectiveDiv").css("width", "100%");
        $('#perspectiveDiv').show();
        $("#perspecTitle").css("width", "100%"); 
        $('#perspecTitle').css("color",hexColor);
        $("#perspecBlurb").css("width", "100%"); 
        $('#perspecBlurb').css("color",hexColor);
        $("#perspecArticle").addClass("ui-corner-all");
        $('#perspecArticle').css("padding", "5");
        $("#perspecArticle").css("width", "100%");
        $('#perspecArticle').css("color",hexColor);
        $("#perspecArticle").css("overflow-y", "scroll");
        //SET SO SET ARTICLES CAN DETECT DISPLAY
        $('#perspecTitle').css("display", "block");
        $('#perspecBlurb').css("display", "block");
        $('#perspecPath').css("display", "block");
        $('#perspecChildren').css("display", "block");
        $("#perspecChildren").css("padding-bottom", "5px");
        var perspective = new Perspective(persId, $('#perspecTitle').text(), $('#perspecBlurb').text(), $('#perspecArticle').text());
        window.parent.parent.setPerspective(perspective);
        setPerspectivesHeight();
        if (window.matchMedia("(pointer: coarse)").matches) {
            // touchscreen
            $("#perspecArticle").css("width", "99%");
        }
    });
}

function viewPerspectivesTree(){
    if (window.matchMedia("(pointer: coarse)").matches) {
        $("#perspectivesTreeDiv").jstree({
            "core": {
                "themes": {
                    "name": "perspective",
                    "responsive": true
                },
                "check_callback": true,
                'data': {
                    'url': function(node) {
                        let id = 2;
                        if(node.id != "#"){
                            id = node.id;
                        }
                        let jsTreeURL = window.parent.getPortalDomainUrl() + 'rest/portal/repo/1/jsTreePerspective/' + id + '/';
                        if(DEBUG){
                            console.log("PortalDomainUrl : " + window.parent.getPortalDomainUrl());
                            console.log("url node : " + node.id + " - " + node.text);
                            console.log("jsTreeURL : " + jsTreeURL);
                        }
                        return jsTreeURL;
                    },
                    'data': function(node) {
                        return {
                            'parent': node.id
                        };
                    }
                }
            }
        });
    }else{
        $("#perspectivesTreeDiv").jstree({
            "core": {
                "themes": {
                    "name": "perspective",
                    "responsive": false
                },
                "check_callback": true,
                'data': {
                    'url': function(node) {
                        console.log("URL *** " + node.id + " - " + node.text);
                        let id = 2;
                        if(node.id != "#"){
                            id = node.id;
                        }
                        let jsTreeURL = window.parent.getPortalDomainUrl() + 'rest/portal/repo/1/jsTreePerspective/' + id + '/';
                        if(DEBUG){
                            console.log("PortalDomainUrl : " + window.parent.getPortalDomainUrl());
                            console.log("url node : " + node.id + " - " + node.text);
                            console.log("jsTreeURL : " + jsTreeURL);
                        }
                        return jsTreeURL;
                    },
                    'data': function(node) {
                        if(DEBUG){
                            console.log("DATA *** " + node.id + " - " + node.text);
                            var childrens = $("#perspectivesTreeDiv").jstree("get_children_dom",node);
                            console.log("CHILDREN : " + childrens.length);
                            for(var a=0;a<childrens.length;a++){
                                console.log("child : " + childrens[a].innerText);
                            }
                            for(var i in node){
                                console.log(i + " : " + node[i]);
                            }
                            for(var j in node.li_attr){
                                console.log("li - " + j + " : " + node.li_attr[i]);
                            }
                            for(var k in node.a_attr){
                                console.log("a - " + k + " : " + node.a_attr[k]);
                            }
                            for(var l in node.original){
                                console.log("orig - " + l + " : " + node.original[l]);
                            }
                        }
                        return {
                            'parent': node.id
                        };
                    }
                }
            }
        });
    }
    $('#perspectivesTreeDiv')
        .on("changed.jstree", function (event, data) {
            if(DEBUG){
                console.log("TITLE SELECTED");
            }
            if (data.selected.length) {
                let node = data.instance.get_node(data.selected[0]);
                if(DEBUG){
                    console.log('Node : ' + node.id + " - " + node.text);
                    //$('#tree').jstree(true).get_node("some_node_id").data
                    for(var i in node){
                        console.log("node - " + i + " : " + node[i]);
                    }
                    for(var j in node.li_attr){
                        console.log("li - " + j + " : " + node.li_attr[i]);
                    }
                    for(var k in node.a_attr){
                        console.log("a - " + k + " : " + node.a_attr[k]);
                    }
                    for(var l in node.original){
                        console.log("orig - " + l + " : " + node.original[l]);
                    }
                }
                viewPerspective(node.id);
                viewContext(node.original.contextId);
            }
    });
    if (!window.matchMedia("(pointer: coarse)").matches) {
        $('#perspectivesTreeDiv')
        .on('hover_node.jstree',function(e,data){
            //a_attr : { 'title' : 'tooltip text' } ?
            $("#"+data.node.id).prop('title', data.node.original.blurb);
        });
    }
}

function viewContextsTree(){
    if (window.matchMedia("(pointer: coarse)").matches) {
        $("#contextsTreeDiv").jstree({
            "core": {
                "themes": {
                    "name": "context",
                    "responsive": true
                },
                "check_callback": true,
                'data': {
                    'url': function(node) {
                        let id = psContextId;
                        if(node.id != "#"){
                            id = node.id;
                        }
                        let jsTreeURL = window.parent.getCurrentRepo().repoRestRootUrl + 'rest/jquery/jsTreeContext/' + id + '/';
                        if(DEBUG){
                            console.log("RestRootUrl : " + window.parent.getCurrentRepo().repoRestRootUrl);
                            console.log("url node : " + node.id + " - " + node.text);
                            console.log("jsTreeURL : " + jsTreeURL);
                        }
                        return jsTreeURL;
                    },
                    'data': function(node) {
                        return {
                            'parent': node.id
                        };
                    }
                }
            }
        });
    }else{
        $("#contextsTreeDiv").jstree({
            "core": {
                "themes": {
                    "name": "context",
                    "responsive": false
                },
                "check_callback": true,
                'data': {
                    'url': function(node) {
                        let id = psContextId;
                        if(node.id != "#"){
                            id = node.id;
                        }
                        let jsTreeURL = window.parent.getCurrentRepo().repoRestRootUrl + 'rest/jquery/jsTreeContext/' + id + '/';
                        if(DEBUG){
                            console.log("URL *** " + node.id + " - " + node.text);                                        
                            console.log("RestRootUrl : " + window.parent.getCurrentRepo().repoRestRootUrl);
                            console.log("url node : " + node.id + " - " + node.text);
                            console.log("jsTreeURL : " + jsTreeURL);
                        }
                        return jsTreeURL;
                    },
                    'data': function(node) {
                        if(DEBUG){
                            console.log("DATA *** " + node.id + " - " + node.text);
                            var childrens = $("#perspectivesTreeDiv").jstree("get_children_dom",node);
                            console.log("CHILDREN : " + childrens.length);
                            for(var a=0;a<childrens.length;a++){
                                console.log("child : " + childrens[a].innerText);
                            }
                            for(var i in node){
                                console.log(i + " : " + node[i]);
                            }
                            for(var j in node.li_attr){
                                console.log("li - " + j + " : " + node.li_attr[i]);
                            }
                            for(var k in node.a_attr){
                                console.log("a - " + k + " : " + node.a_attr[k]);
                            }
                            for(var l in node.original){
                                console.log("orig - " + l + " : " + node.original[l]);
                            }
                        }
                        return {
                            'parent': node.id
                        };
                    }
                }
            }
        });
    }
    $('#contextsTreeDiv')
        .on("changed.jstree", function (event, data) {
            if(DEBUG){
                console.log("TITLE SELECTED");
            }
            if (data.selected.length) {
                let node = data.instance.get_node(data.selected[0]);
                if(DEBUG){
                    console.log('Node : ' + node.id + " - " + node.text);
                    //$('#tree').jstree(true).get_node("some_node_id").data
                    for(var i in node){
                        console.log("node - " + i + " : " + node[i]);
                    }
                    for(var j in node.li_attr){
                        console.log("li - " + j + " : " + node.li_attr[i]);
                    }
                    for(var k in node.a_attr){
                        console.log("a - " + k + " : " + node.a_attr[k]);
                    }
                    for(var l in node.original){
                        console.log("orig - " + l + " : " + node.original[l]);
                    }
                }
                viewContext(node.original.toContextId);
            }
    });
    if (!window.matchMedia("(pointer: coarse)").matches) {
//                    $('#contextsTreeDiv')
//                        .on("after_open.jstree", function (event, data) {
//                        var childrens = $("#contextsTreeDiv").jstree("get_children_dom",data.node);
//                        for(var a=0;a<childrens.length;a++){
//                            let node = data.instance.get_node(childrens[a].id);
//                            childrens[a].setAttribute('title',node.original.blurb);
//                            node.a_attr['title'] = node.original.blurb;
//                        }
//                    });
        $('#contextsTreeDiv')
        .on('hover_node.jstree',function(e,data){
            //a_attr : { 'title' : 'tooltip text' } ?
            $("#"+data.node.id).prop('title', data.node.original.toContextId);
        });
    }
}

function openPerspective(){
    $('#rootPerspectivesDiv').hide();
    $('#pathPerspectivesDiv').hide();
    $('#browsePerspectivesDiv').hide();
    $('#searchPerspectivesDiv').hide();
    $('#perspectivesDiv').hide();
    $('#perspectiveDiv').show();
    $('#perspectivesTreeDiv').hide();
    $('#contextsTreeDiv').hide();
}

function resetPerspective(){
    $('#rootPerspectivesDiv').show();
    $('#pathPerspectivesDiv').show();
    $('#browsePerspectivesDiv').show();
    $('#searchPerspectivesDiv').hide();
    $('#perspectivesDiv').hide();
    $('#perspectiveDiv').hide();
    $('#perspectivesTreeDiv').hide();
    $('#contextsTreeDiv').hide();
}

function openPerspectivesTree(){
    $('#rootPerspectivesDiv').hide();
    $('#pathPerspectivesDiv').hide();
    $('#browsePerspectivesDiv').hide();
    $('#searchPerspectivesDiv').hide();
    $('#perspectivesDiv').hide();
    $('#perspectiveDiv').hide();
    $('#perspectivesTreeDiv').show();
    $('#contextsTreeDiv').hide();
}

function openContextsTree(){
    $('#rootPerspectivesDiv').hide();
    $('#pathPerspectivesDiv').hide();
    $('#browsePerspectivesDiv').hide();
    $('#searchPerspectivesDiv').hide();
    $('#perspectivesDiv').hide();
    $('#perspectiveDiv').hide();
    $('#perspectivesTreeDiv').hide();
    $('#contextsTreeDiv').show();
}

function Perspective(id, headline, blurb, article){
    this.id = id;
    this.headline = headline;
    this.blurb = blurb;
    this.article = article;
}

const injectCSS = css => {
    let el = document.createElement('style');
    el.type = 'text/css';
    el.innerText = css;
    document.head.appendChild(el);
    return el;
};

function navPerspective(persId, element){
    doBrowsingPers(persId);
}

function getPerspective(index){
    doBrowsingPers(rootPerspectives[index].id);
}

function viewContext(contextId){
    window.parent.viewContext(contextId);
}

function openAnimatedContext(){
    var contextId = window.parent.getCurrentContext();
    window.parent.openAnimatedContext(contextId);
}

function viewPerspectiveAndContext(persId, contextId){
    viewPerspective(persId);
    viewContext(contextId);
}

function genTestLinks(max){
    let links = ""
    for (let i=65; i<=90; i++) {
        let txt = "";
        for(let j=0; j<=max; j++){
            txt += String.fromCharCode(i);
        }
        links += " <a href=\"javascript:alert('" + txt + "');\" title=\"" + txt + "\">" + txt + "</a> \\ ";
    }
    return links;
}


