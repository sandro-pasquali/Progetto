function XMLhandlers(id,dpath,xpath)
  {
    if(!id) { return false; }

    this.xmlid = id;
    this.dtdPath = dpath || 'DTD/';
    this.xmlPath = xpath || 'XML/';
    with(document.body)
      {
        insertAdjacentHTML('beforeEnd','<XML ID="' + this.xmlid + 'ISLAND"></XML>');
        insertAdjacentHTML('beforeEnd','<XML ID="' + this.xmlid + 'BUFFER"></XML>');
      }
    this.xRef = eval(this.xmlid + 'ISLAND');
    this.bRef = eval(this.xmlid + 'BUFFER');
    return;
  }

XMLhandlers.prototype.date = new Date();

XMLhandlers.prototype.load = function(xName,dName,t)
  {
    var validXML = this.validate(this.xmlPath + xName, this.dtdPath + dName, t);
    if(validXML == 1) 
      {
        switch(dName)
          {
            case 'scene':
              return(this.processAsScene());
            break;

            default:
              return(this.xRef.documentElement);
            break;
          }
      }
    alert('error:\n\n' + validXML);
    return false;
  }

XMLhandlers.prototype.validate = function(xml,dtd,tRoot)
  {
    if(xml && dtd && tRoot)
      {
        var ob = this.xRef.XMLDocument;
        /*
         * any nodes which are not valid are simply extracted; 
         * bad nodes do not terminate parsing.
         */
        ob.async=false;
        var lFlag = ob.load(xml + '.xml');
        if(lFlag)
          {
            var iList = ob.documentElement.childNodes;
            for (var i=0;i<iList.length;i++)
              {
                xmlString = ('<!DOCTYPE ' + tRoot + ' SYSTEM "' + dtd + '.dtd">' + iList.item(i).xml);
                this.bRef.loadXML(xmlString);
                if(this.bRef.parseError.reason != "")
                  {
                    ob.documentElement.removeChild(iList.item(i));
                  }
              }
            return(1); // ok
          }
        else { return(10); } // error: load of specified xml document failed 
      } 
    return(20); // error: bad arguments
  }

XMLhandlers.prototype.processAsScene = function()
  {
    var sRoot = new Array();
    var compAtts = new Array('MODE','OWNER_ID','PACK_ID','ROOT');
    // reading the namespace created on instantiation;
    // this means we are reading whatever the MOST CURRENT load() put there.
    var aL = this.xRef.documentElement.childNodes;
    // COMPONENT list
    for(a=0; a < aL.length; a++)
      { 
        var bL = aL.item(a).childNodes;
        sRoot[a] = new Object();
        sRoot[a].ownerId = aL.item(a).getAttributeNode('OWNER_ID').value;
        sRoot[a].componentId = aL.item(a).getAttributeNode('COMPONENT_ID').value;
        sRoot[a].pack = new Array();
        // packages
        // transform package xml -> an internal representation
        for(b=0; b < bL.length; b++)
          {
            sRoot[a].pack[b] = new Object();
            sRoot[a].pack[b].attributes = new Array();
            sRoot[a].pack[b].header = new Array();
            sRoot[a].pack[b].items = new Array();
            // validate the pack attributes; return false on any empty value
            var x = bL.item(b);
            for(z=0; z < compAtts.length; z++)
              {
                var aNode = x.getAttributeNode(compAtts[z]).value;
                if(aNode) { sRoot[a].pack[b].attributes[compAtts[z]] = aNode; }
                else { return false; }
              }
            // ok; read in scene and store it.
            // parse the header
            var header = x.getElementsByTagName('PACK_HEADER');
            var headerP = header.item(0).childNodes;
            for(h=0; h < headerP.length; h++)
              {
                sRoot[a].pack[b].header[headerP[h].nodeName] = headerP[h].text;
              }
            // parse the items
            var itemList = x.getElementsByTagName('ITEM');
            for(i=0; i < itemList.length; i++)
              {
                sRoot[a].pack[b].items[i] = new Array();
                var itemP = itemList.item(i).childNodes;
                for(n=0; n < itemP.length; n++)
                  {
                    sRoot[a].pack[b].items[i][itemP[n].nodeName] = itemP[n].text;
                  }
              }
          }
      }
    SCENES.store(sRoot);
    return true;
  }

/*

XMLhandlers.prototype.processAsScene = function()
  {
    var pRoot = new Array();
    var compAtts = new Array('MODE','OWNER_ID','PACK_ID','ROOT');
    // reading the namespace created on instantiation;
    // this means we are reading whatever the MOST CURRENT load() put there.
    var aL = this.xRef.documentElement.childNodes;
   
    // COMPONENT list
    for(a=0; a < aL.length; a++)
      { 
        var bL = aL.item(a).childNodes;
        var owner = aL.item(a).getAttributeNode('OWNER_ID').value;
        var component = aL.item(a).getAttributeNode('COMPONENT_ID').value;
        // packages
        // transform package xml -> an internal representation
        for(b=0; b < bL.length; b++)
          {
            pRoot[b] = new Object();
            pRoot[b].attributes = new Array();
            pRoot[b].header = new Array();
            pRoot[b].items = new Array();
            // validate the pack attributes; return false on any empty value
            var x = bL.item(b);
            for(z=0; z < compAtts.length; z++)
              {
                var a = x.getAttributeNode(compAtts[z]).value;
                if(a) { pRoot[b].attributes[compAtts[z]] = a; }
                else { return false; }
              }
            // ok; read in scene and store it.
            // parse the header
            var header = x.getElementsByTagName('PACK_HEADER');
            var headerP = header.item(0).childNodes;
            for(h=0; h < headerP.length; h++)
              {
                pRoot[b].header[headerP[h].nodeName] = headerP[h].text;
              }
            // parse the items
            var itemList = x.getElementsByTagName('ITEM');
            for(i=0; i < itemList.length; i++)
              {
                pRoot[b].items[i] = new Array();
                var itemP = itemList.item(i).childNodes;
                for(n=0; n < itemP.length; n++)
                  {
                    pRoot[b].items[i][itemP[n].nodeName] = itemP[n].text;
                  }
              }
          }
      }
    SCENES.store(pRoot);
    return true;
  }
*/