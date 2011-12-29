
var $EI = new Object();
$EI.agent = navigator.userAgent.toLowerCase();
$EI.mac = ($EI.agent.indexOf("mac") != -1);
$EI.XOffsetHack = ($EI.mac) ? 8 : 0; // a discrepancy i need to find a better solution for
$EI.YOffsetHack = ($EI.mac) ? 13 : 0; // "
$EI.ZCeil = 20000; // set < ghost z
$EI.ZFloor = 1001; 
$EI.ZT = new Array();

$EI.ACTIVE = $EI.MODE = $EI.ACTIVE_TARGET = $EI.NXOFF = $EI.NYOFF = null;
$EI.lastEPBG = 'none';
$EI.lastEPREF = new Object();
$EI.EPInterval = null;

function initWindows()
  {
	var DA = document.all;
	for(i=0; i < DA.length; i++)
	  {
	    if(DA[i].className == 'DRAG_OBJECT') { assignHandlers(DA[i]); }
	  }
	 document.body.insertAdjacentHTML("beforeEnd",'<DIV ID="GHOST" STYLE="position:absolute; width:10; height:10; left:0; top:0; border:1px white dashed; visibility:hidden; z-index:21000;"></DIV><DIV ID="DRAGSCREEN" STYLE="position:absolute; top:0; left:0; width:100%; height:100%; visibility:hidden; z-index:500;"><img src="images/dummy.gif" width=100% height=100%></DIV>');
    $EI.EPInterval = setInterval("checkViewer()",500);	
    return;
  }
  
function assignHandlers(ob)
  {
    ob.onmousedown = function()
	  {
		$EI.ACTIVE = this.id;
		$EI.SHOWGHOST = (this.NOGHOST) ? false : true;
		$EI.LIMITED = (this.LIMITED) ? true : false; 
		$EI.ZINDEXED = (this.NOZ) ? false : true;
		updateZ();
		$EI.ACTIVE = null;
	  }
	return;
  }

function mouseMove()
  {
    var e = window.event;
    if(!$EI.MOVER)
      {
        $EI.SE = e.srcElement;
		$EI.SSTY = e.srcElement.style;
		$EI.PSTY = e.srcElement.parentElement.style;
        $EI.PE = e.srcElement.parentElement;
        $EI.SID = e.srcElement.id;
        $EI.PID = e.srcElement.parentElement.id;
        $EI.X = e.clientX;
        $EI.Y = e.clientY;
        $EI.SCLASS = e.srcElement.className;
        $EI.PCLASS = e.srcElement.parentElement.className;
        $EI.SXOFFSET = e.srcElement.offsetLeft;
        $EI.PXOFFSET = e.srcElement.parentElement.offsetLeft;
        $EI.SYOFFSET = e.srcElement.offsetTop;
        $EI.PYOFFSET = e.srcElement.parentElement.offsetTop;
      }
    else 
      {
	    var nL = e.clientX - $EI.X + $EI.NXOFF + $EI.XOffsetHack;
		var nT = e.clientY - $EI.Y + $EI.NYOFF + $EI.YOffsetHack;
		var nR = nL + $EI.MOVER.pixelWidth;
		var nB = nT + $EI.MOVER.pixelHeight;
		
		$EI.MOVER.left = ($EI.LIMITED) 
		? ((nL>=0)&&(nR<=($EI.mapW+document.body.scrollLeft))) && (nL) : nL;
        $EI.MOVER.top = ($EI.LIMITED) 
        ? ((nT>=0)&&(nB<=($EI.mapH+document.body.scrollTop))) && (nT) : nT;
		
		if(!$EI.SHOWGHOST) { moveCrosshairs($EI.MOVER.pixelLeft,$EI.MOVER.pixelTop); }
      }
	window.event.cancelBubble = true;
	window.event.returnValue = false;
    return; 
  }

function mouseDown()
  { 
	switch($EI.SCLASS)
      {
		case 'ICON':
	      document.all['BLAH2'].style.visibility = 'visible';
		  document.all['DTITLE'].style.visibility = 'visible';
		  document.all['DBODY'].style.visibility = 'visible';
		  var idd = $EI.PID.split('-');
		  var sng = eval('$' + idd[0] + '.song[' + idd[1] + ']');
		  for(u=0; u<sng.links.length; u++)
		    {
			  QLINKS.innerHTML = '';
			  QLINKS.innerHTML += '- <A href="#">' + sng.links[u] + '</a><br>';
			}
	      DTITLE.innerHTML = sng.artist.toUpperCase() + ':' + sng.title + '<IMG CLASS="CLOSEICON" ID="CLOSEBLAH2" src="images/windows/close.gif" STYLE="position:absolute; top:1; left:423; width:16; height:16;"><IMG CLASS="MINIMIZEICON" ID="MINIMIZEBLAH2" src="images/windows/minimize.gif" STYLE="position:absolute; top:1; left:405; width:16; height:16;">';
          QDESC.innerHTML = sng.desc;
		  QIMAGE.src = "images/defaults/" + idd[0].toLowerCase() + ".gif";
		  var qi = '';
		  qi += 'Artist: ' + sng.artist + '<br>';
		  qi += 'Title: ' + sng.title + '<br>';
		  qi += 'Released: ' + sng.rdate + '<br>';
		  QINFO.innerHTML = qi;
		break;
			
		case 'MINIMIZEICON':
		  if(document.all['DBODY'].style.visibility == 'visible')
		    {
			  document.all['DBODY'].style.visibility = 'hidden';
			  document.all['BLAH2'].style.height=26;
			  document.all['BLAH2'].style.border='1px black solid';
			}
		  else
		    {
			  document.all['DBODY'].style.visibility = 'visible';
			  document.all['BLAH2'].style.height=280;
			  document.all['BLAH2'].style.border='none';
			} 
		break;
			
		case 'CLOSEICON':
          closeWin();
		break;
			
		default:
          if(!bubbleUntil($EI.SE,'DRAG_BODY')) 
	        {
              var A = bubbleUntil($EI.SE,'DRAG_TITLE');
	          $EI.MODE = (A) ? 1 : null;
            }
          if($EI.MODE)
            {  
	          $EI.NXOFF = $EI.PXOFFSET;
	          $EI.NYOFF = $EI.PYOFFSET;
	          $EI.ACTIVE = $EI.PID;
              updateZ();
              showDragMode();         
            }
		break;
      }
    window.event.cancelBubble = true;
    window.event.returnValue = false;   
    return; 
  }
  
 function mouseUp()
  {
    if($EI.MODE)
	  {
        GHOST.style.visibility = 'hidden';
	    ($EI.MODE == 1) && (dropDRAG_OBJECT());
        document.onselectstart = null;
	  }
    $EI.ACTIVE = $EI.ACTIVE_TARGET = $EI.MODE = $EI.MOVER = $EI.NOGHOST = null;
    return; 
  }
  
function mouseClick()
  {
    return; 
  }

function showDragMode()
  {
    var EL = document.all[$EI.ACTIVE].style;
    with(GHOST.style)
      {
        width = EL.pixelWidth;
        height = EL.pixelHeight;
        top = EL.pixelTop;
        left = EL.pixelLeft;
        visibility = ($EI.SHOWGHOST) ? 'visible' : 'hidden';
      }
	$EI.MOVER = ($EI.SHOWGHOST) ? GHOST.style : $EI.MOVER = document.all[$EI.ACTIVE].style;
    toggleDragScreen(1);
    document.onselectstart = function() { return false; }
    return;
  }

function dropDRAG_OBJECT()
  {
    if($EI.SHOWGHOST)
	  {
        with(document.all[$EI.ACTIVE].style)
          {
            pixelLeft = Math.min(GHOST.style.pixelLeft,$EI.mapW+document.body.scrollLeft-10);
            pixelTop = Math.min(GHOST.style.pixelTop,$EI.mapH+document.body.scrollTop-10);
          }
	  }
	toggleDragScreen();
    return;  
  }

function updateZ()
  { 
    if($EI.ZINDEXED)
	  {
        var cur = $EI.ZT[$EI.ACTIVE] = document.all[$EI.ACTIVE].style;
        for(z in $EI.ZT)
          {
            $EI.ZT[z].zIndex = (cur == $EI.ZT[z]) ? $EI.ZCeil : Math.max($EI.ZT[z].zIndex-1,$EI.ZFloor);
          }
	  }
    return;
  }

function checkViewer()
  {
    var epx = VIEWER.style.pixelLeft-document.body.scrollLeft+310;
	var epy = VIEWER.style.pixelTop-document.body.scrollTop+20;
    var ep = document.elementFromPoint(epx,epy);
	$EI.lastEPREF.backgroundColor = $EI.lastEPBG;
	if(ep && ep.id && ep.id.charAt(0)=='X') 
	  {
	    var par = document.all[ep.id].parentElement.style;
		$EI.lastEPREF = par;
	  	$EI.lastEPBG = par.backgroundColor;
	    par.backgroundColor = '#ffffff'; 
	  }
	return;
  }  
  
function bubbleUntil(start,finish,attrib)
  { 
    var PP = start;
	var AA = attrib || 'className';
    do
      {
        if(eval("PP." + AA + "==finish")) { return(PP); }
        PP = PP.parentElement;
      } while(PP != null)
    return(false);
  }
  
function moveCrosshairs(obL,obT)
  {
    var mL = obL;
	var mT = obT;
    with(VTL.style)
	  {
        left = mL + 293;
	    top = mT + 4;
	  }
    with(VTR.style)
	  {
        left = mL + 316;
	    top = mT + 4;
	  }
    with(VBL.style)
	  {
        left = mL + 293;
	    top = mT + 28;
	  }
    with(VBR.style)
	  {
        left = mL + 316;
	    top = mT + 28;
	  }  
	return;
  }

function toggleDragScreen(on)
  {
    DRAGSCREEN.style.visibility = (on) ? 'visible' : 'hidden';
    return;
  }
  
function closeWin()
  {
 		  document.all['DBODY'].style.visibility = 'visible';
		  document.all['BLAH2'].style.height=280;
	      document.all['BLAH2'].style.border='none';
	      document.all['BLAH2'].style.visibility = 'hidden';
		  document.all['DTITLE'].style.visibility = 'hidden';
		  document.all['DBODY'].style.visibility = 'hidden';
		  return; 
  }
