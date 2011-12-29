
function Group(grpID,cL,cT)
  {
	this.gId = grpID;
	this.icon = grpID.toLowerCase();
	this.containerT = cT || 0;
	this.containerL = cL || 0;
	this.curRow = 0;
	//this.DOMInsert(document.body,'<DIV STYLE="position:absolute; left:' + this.containerL + '; top:' + this.containerT + '; width:' + this.containerW  + '; height:' + this.containerH + '; border:1px black solid;"></DIV>');
    return;
  }

// preload icon images
Group.prototype.icons = new Array();
Group.prototype.iconList = $ICONLIST;
for(i=0; i<Group.prototype.iconList.length; i++)
  {
    im = Group.prototype.iconList[i];
    Group.prototype.icons[im] = new Image();
	Group.prototype.icons[im].src = 'images/icons/' + im + '.gif';
  }

Group.prototype.NS = (navigator.appName.indexOf('Netscape')!=-1);
Group.prototype.IE = (!Group.prototype.NS);
Group.prototype.iconWidth = 12;
Group.prototype.iconHeight = 24;
Group.prototype.iconPadding = 19;// horiz space between icons
Group.prototype.XOffset = 22; // +x slope
Group.prototype.YOffset = 12; // -y slope. NOTE: should account for vote numerals' height
Group.prototype.groups = new Array();

Group.prototype.Draw = function()
  {
    this.XMLLoad();
	this.itemCount = this.song.length;
	
	
	//alert(	this.song[0].bday + '--' + this.song[0].score + '--' + this.song[0].votes + '--' + this.song[0].artist + '--' + this.song[0].title + '--' + this.song[0].desc + '--' + this.song[0].rdate + '--' + this.song[0].links);
	
	var tmpSq = parseInt(Math.sqrt(this.itemCount)); // find square
	var sqDiff = parseInt((this.itemCount-(tmpSq*tmpSq))/tmpSq); // check 4 row > square
	this.rowBreak = tmpSq + ((sqDiff)?1:0); // add column if necessary
	this.trailers = (this.itemCount%this.rowBreak) || 0; // remainders
	this.special = ((this.itemCount-(tmpSq*tmpSq))==tmpSq)?1:0; 
    this.containerW = ((this.iconWidth+this.iconPadding)*this.rowBreak)
                      +(this.XOffset*(this.rowBreak-1));
	this.containerH = ((this.rowBreak+1)*this.iconHeight)+(this.rowBreak*this.YOffset);
    this.WY = this.curRowY = (this.rowBreak-1)*this.YOffset + this.containerT; 
	this.WX = this.containerL;
	this.EX = this.containerL+this.containerW-this.iconWidth-this.iconPadding;
	this.EY = this.containerT+((this.rowBreak-1)*this.iconHeight);
	this.NX = this.containerL
                     +((this.rowBreak-1)*(this.iconWidth+this.iconPadding))
	this.NY = this.containerT;
	
	var adjustedX = adjustedY = votesX = votesY = iter = iTrack = nC = 0;
	var gOut = '';

    while(iter < this.itemCount)
      {	
	    iTrack = iter%this.rowBreak;
		if((iTrack == 0) && (iter > 0)) 
		  {
		    ++this.curRow; 
			gOut += '<br>'; 
			this.curRowY += this.iconHeight;
		  }
        adjustedY = this.curRowY-(iTrack*this.YOffset);
	    adjustedX = iTrack*(this.iconWidth+this.iconPadding)
                    +(this.curRow*this.XOffset)+this.containerL;
	    votesX = adjustedX;
	    votesY = adjustedY+this.iconHeight;
		
		var scre = this.song[iter].score;
		if(scre < 50) { nC = 'rgb(' + (255-(scre*4)) + ',0,0)'; }
		else { nC = 'rgb(0,' + (scre*2.5) + ',0)'; }
	    gOut += ('<DIV CLASS="CONTAINER" ID="' + this.gId.toUpperCase() + '-' + iter + '" STYLE="top:' + adjustedY + '; left:' + adjustedX + '; background-color:' + nC + ';"><img CLASS="ICON" ID="X' + adjustedX + 'X' + adjustedY +'" src="' + this.icons[this.icon].src + '" alt="' + this.song[iter].artist + '\n' + this.song[iter].title + '"></DIV><DIV CLASS="VOTES"  STYLE="top:' + votesY + '; left:' + votesX + ';">' + this.song[iter].votes + '</DIV>');
		++iter;
	  }
	  
	this.LX = adjustedX; // last-x
    this.LY = adjustedY; // last-y 
	// do this last, since we need to account for % remainder
	this.SX = this.WX+(this.curRow*this.XOffset);
	this.SY = this.WY+(this.curRow*this.iconHeight);
	
	this.DOMInsert(SCRLAYER,gOut);
	//this.DOMInsert(document.body,'<DIV CLASS="CONTAINER" STYLE="top:' + this.SY + '; left:' + this.SX + '; background-color:#ff0000;"></DIV>');
    return;
  }

Group.prototype.DOMInsert = function(ob,cont,loc)
  {
    var ob = ob;
	var c = cont || 'n/a';
    var l = loc || 'BeforeEnd';
	ob.insertAdjacentHTML(l,c);
    return;
  }

Group.prototype.XMLLoad = function()
  {
    this.DOMInsert(document.body,'<XML ID="' + this.gId + 'XMLISLAND"></XML>');
    var island = eval(this.gId + 'XMLISLAND');
    var doc = island.XMLDocument;
    doc.async=false;
    var lFlag = doc.load('xml/' + this.gId.toLowerCase() + '.xml');
    if(lFlag) 
	  { 
	    this.XMLroot = island.documentElement; 
		this.XMLProcess();
		return true;
	  } 
	else { return false; }
  }

Group.prototype.XMLProcess = function()
  {
    this.song = new Array();
    var aL = this.XMLroot.childNodes;
    for(a=0; a < aL.length; a++)
      { 
        var bL = aL.item(a).childNodes;
        this.song[a] = new Object();
		this.song[a].bday = aL.item(a).getAttributeNode('BDAY').value;
		this.song[a].score = aL.item(a).getAttributeNode('SCORE').value;
		this.song[a].votes = aL.item(a).getAttributeNode('VOTES').value;
		this.song[a].artist = bL.item(0).text;
		this.song[a].title = bL.item(1).text;
		this.song[a].desc = bL.item(2).text;
		this.song[a].rdate = bL.item(3).text;
		this.song[a].links = bL.item(4).text.split(' ');
      }
    return;
  }  
  
Group.prototype.MakeSongWindow = function(id)
  {
    return;
  }